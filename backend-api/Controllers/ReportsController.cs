using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend_api.Data;

namespace backend_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ReportsController(AppDbContext context) => _context = context;

        [HttpGet("daily")]
        public async Task<IActionResult> DailyReport([FromQuery] string date)
        {
            try
            {
                // Parse string to int parts directly
                var parts = date.Split('-');
                int year = int.Parse(parts[0]);
                int month = int.Parse(parts[1]);
                int day = int.Parse(parts[2]);

                // ToList first — no UTC issue
                var allOrders = await _context.Orders.ToListAsync();

                var filtered = allOrders.Where(o =>
                    o.CreatedAt.Year == year &&
                    o.CreatedAt.Month == month &&
                    o.CreatedAt.Day == day
                ).ToList();

                return Ok(new
                {
                    Date = date,
                    TotalOrders = filtered.Count,
                    TotalRevenue = filtered.Sum(o => o.FinalAmount)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("monthly")]
        public async Task<IActionResult> MonthlyReport(
            [FromQuery] int year, 
            [FromQuery] int month)
        {
            try
            {
                var orders = await _context.Orders
                    .Where(o => o.CreatedAt.Year == year && 
                                o.CreatedAt.Month == month)
                    .ToListAsync();
                return Ok(new
                {
                    Year = year,
                    Month = month,
                    TotalOrders = orders.Count,
                    TotalRevenue = orders.Sum(o => o.FinalAmount)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("yearly")]
        public async Task<IActionResult> YearlyReport([FromQuery] int year)
        {
            try
            {
                var orders = await _context.Orders
                    .Where(o => o.CreatedAt.Year == year)
                    .ToListAsync();
                return Ok(new
                {
                    Year = year,
                    TotalOrders = orders.Count,
                    TotalRevenue = orders.Sum(o => o.FinalAmount)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("top-customers")]
        public async Task<IActionResult> TopCustomers()
        {
            try
            {
                var customers = await _context.Orders
                    .Include(o => o.Customer)
                    .GroupBy(o => new { o.CustomerId, o.Customer!.FullName })
                    .Select(g => new
                    {
                        CustomerId = g.Key.CustomerId,
                        CustomerName = g.Key.FullName,
                        TotalSpent = g.Sum(o => o.FinalAmount),
                        TotalOrders = g.Count()
                    })
                    .OrderByDescending(x => x.TotalSpent)
                    .Take(10)
                    .ToListAsync();
                return Ok(customers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("regular-customers")]
        public async Task<IActionResult> RegularCustomers()
        {
            try
            {
                var customers = await _context.Orders
                    .Include(o => o.Customer)
                    .GroupBy(o => new { o.CustomerId, o.Customer!.FullName })
                    .Select(g => new
                    {
                        CustomerId = g.Key.CustomerId,
                        CustomerName = g.Key.FullName,
                        TotalOrders = g.Count()
                    })
                    .Where(x => x.TotalOrders >= 3)
                    .OrderByDescending(x => x.TotalOrders)
                    .ToListAsync();
                return Ok(customers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("low-stock")]
        public async Task<IActionResult> LowStock()
        {
            try
            {
                var products = await _context.Products
                    .Where(p => p.Stock < 10)
                    .ToListAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("pending-credits")]
        public async Task<IActionResult> PendingCredits()
        {
            try
            {
                var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);
                var orders = await _context.Orders
                    .Include(o => o.Customer)
                    .Where(o => o.IsCreditSale && 
                                !o.IsCreditPaid && 
                                o.CreatedAt < oneMonthAgo)
                    .ToListAsync();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}