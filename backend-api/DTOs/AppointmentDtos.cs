namespace backend_api.DTOs
{
    public class AppointmentCreateDto
    {
        public int CustomerId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string ServiceType { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }

    public class AppointmentResponseDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string ServiceType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}