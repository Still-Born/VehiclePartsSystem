namespace backend_api.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string ServiceType { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}