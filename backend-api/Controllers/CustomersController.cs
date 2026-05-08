using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend_api.Data;
using backend_api.Models;

namespace backend_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CustomersController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Customers.ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var customer = await _context.Customers
                .Include(c => c.Orders)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (customer == null) return NotFound();
            return Ok(customer);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return Ok(customer);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Customer updated)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound();
            customer.FullName = updated.FullName;
            customer.Email = updated.Email;
            customer.Phone = updated.Phone;
            customer.Address = updated.Address;
            customer.VehicleNumber = updated.VehicleNumber;
            customer.VehicleModel = updated.VehicleModel;
            await _context.SaveChangesAsync();
            return Ok(customer);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound();
            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully" });
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            var customers = await _context.Customers
                .Where(c => c.FullName.Contains(query) ||
                            c.Phone.Contains(query) ||
                            c.VehicleNumber.Contains(query) ||
                            c.Email.Contains(query) ||
                            c.Id.ToString() == query)
                .ToListAsync();
            return Ok(customers);
        }

        [HttpGet("by-email/{email}")]
        public async Task<IActionResult> GetByEmail(string email)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == email);
            if (customer == null) return NotFound();
            return Ok(customer);
        }
        }
}