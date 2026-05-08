using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend_api.Data;
using backend_api.Models;

namespace backend_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AppointmentsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Appointments
                .Include(a => a.Customer)
                .ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Customer)
                .FirstOrDefaultAsync(a => a.Id == id);
            if (appointment == null) return NotFound();
            return Ok(appointment);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomer(int customerId) =>
            Ok(await _context.Appointments
                .Where(a => a.CustomerId == customerId)
                .ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Appointment appointment)
        {
            try
            {
                
                appointment.AppointmentDate = DateTime.SpecifyKind(
                    appointment.AppointmentDate, DateTimeKind.Utc);
                    
                appointment.CreatedAt = DateTime.UtcNow;

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();
                return Ok(appointment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Appointment updated)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();
            
            appointment.AppointmentDate = DateTime.SpecifyKind(
                updated.AppointmentDate, DateTimeKind.Utc);
            appointment.ServiceType = updated.ServiceType;
            appointment.Status = updated.Status;
            appointment.Notes = updated.Notes;
            await _context.SaveChangesAsync();
            return Ok(appointment);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();
            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully" });
        }
    }
}