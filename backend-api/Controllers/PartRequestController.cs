using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend_api.Data;
using backend_api.Models;

namespace backend_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PartRequestsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PartRequestsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.PartRequests
                .Include(p => p.Customer)
                .ToListAsync());

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomer(int customerId) =>
            Ok(await _context.PartRequests
                .Where(p => p.CustomerId == customerId)
                .ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PartRequest request)
        {
            _context.PartRequests.Add(request);
            await _context.SaveChangesAsync();
            return Ok(request);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromQuery] string status)
        {
            var request = await _context.PartRequests.FindAsync(id);
            if (request == null) return NotFound();
            request.Status = status;
            await _context.SaveChangesAsync();
            return Ok(request);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var request = await _context.PartRequests.FindAsync(id);
            if (request == null) return NotFound();
            _context.PartRequests.Remove(request);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully" });
        }
    }
}