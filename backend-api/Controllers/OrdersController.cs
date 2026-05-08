using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend_api.Data;
using backend_api.Models;
using backend_api.Services;

namespace backend_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public OrdersController(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomer(int customerId) =>
            Ok(await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.CustomerId == customerId)
                .ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Order order)
        {
            decimal total = 0;
            foreach (var item in order.OrderItems)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null) return BadRequest($"Product {item.ProductId} not found");
                if (product.Stock < item.Quantity) return BadRequest($"Not enough stock for {product.Name}");

                item.UnitPrice = product.Price;
                item.TotalPrice = product.Price * item.Quantity;
                total += item.TotalPrice;

                product.Stock -= item.Quantity;
            }

            order.TotalAmount = total;

            if (total > 5000)
            {
                order.DiscountAmount = total * 0.10m;
                order.FinalAmount = total - order.DiscountAmount;
            }
            else
            {
                order.DiscountAmount = 0;
                order.FinalAmount = total;
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return Ok(order);
        }

        [HttpPut("{id}/pay-credit")]
        public async Task<IActionResult> PayCredit(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();
            order.IsCreditPaid = true;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Credit marked as paid" });
        }

        [HttpGet("pending-credits")]
        public async Task<IActionResult> PendingCredits()
        {
            var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Where(o => o.IsCreditSale && !o.IsCreditPaid && o.CreatedAt < oneMonthAgo)
                .ToListAsync();
            return Ok(orders);
        }

        [HttpPost("{id}/send-invoice")]
        public async Task<IActionResult> SendInvoice(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();
            if (string.IsNullOrEmpty(order.Customer?.Email))
                return BadRequest(new { message = "Customer email not found" });

            var itemsHtml = string.Join("", order.OrderItems.Select(item =>
                $"<tr><td>{item.Product?.Name}</td><td>{item.Quantity}</td><td>Rs. {item.UnitPrice}</td><td>Rs. {item.TotalPrice}</td></tr>"
            ));

            var body = $@"
            <html>
            <body style='font-family:Arial;color:#333;'>
                <h2 style='color:#e63946;'>Vehicle Parts System</h2>
                <h3>Invoice for Order #{order.Id}</h3>
                <p>Dear {order.Customer?.FullName},</p>
                <p>Thank you for your purchase! Here is your invoice:</p>
                <table border='1' cellpadding='8' cellspacing='0' style='border-collapse:collapse;width:100%;'>
                    <thead style='background:#e63946;color:white;'>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsHtml}
                    </tbody>
                </table>
                <br/>
                <p><strong>Subtotal:</strong> Rs. {order.TotalAmount}</p>
                <p style='color:green;'><strong>Discount:</strong> Rs. {order.DiscountAmount}</p>
                <h3 style='color:#e63946;'>Final Amount: Rs. {order.FinalAmount}</h3>
                <p>Payment Type: {(order.IsCreditSale ? "Credit Sale" : "Cash")}</p>
                <br/>
                <p>Thank you for choosing us!</p>
                <p style='color:#e63946;'>Vehicle Parts System</p>
            </body>
            </html>";

            await _emailService.SendEmailAsync(
                order.Customer!.Email,
                $"Invoice for Order #{order.Id} - Vehicle Parts System",
                body
            );

            return Ok(new { message = "Invoice sent successfully!" });
        }
    }
}