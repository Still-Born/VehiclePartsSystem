using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend_api.Data;
using backend_api.Models;

namespace backend_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseInvoicesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PurchaseInvoicesController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.PurchaseInvoices
                .Include(p => p.Supplier)
                .Include(p => p.Product)
                .ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PurchaseInvoice invoice)
        {
            try
            {
                // Calculate total
                invoice.TotalAmount = invoice.UnitPrice * invoice.Quantity;
                invoice.CreatedAt = DateTime.UtcNow;

                // Update product stock
                var product = await _context.Products.FindAsync(invoice.ProductId);
                if (product == null) 
                    return BadRequest(new { message = "Product not found" });

                // Increase stock
                product.Stock += invoice.Quantity;

                _context.PurchaseInvoices.Add(invoice);
                await _context.SaveChangesAsync();
                return Ok(invoice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var invoice = await _context.PurchaseInvoices.FindAsync(id);
            if (invoice == null) return NotFound();
            _context.PurchaseInvoices.Remove(invoice);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully" });
        }
    }
}