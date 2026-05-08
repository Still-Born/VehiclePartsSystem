namespace backend_api.DTOs
{
    public class CustomerCreateDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string VehicleNumber { get; set; } = string.Empty;
        public string VehicleModel { get; set; } = string.Empty;
    }

    public class CustomerResponseDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string VehicleNumber { get; set; } = string.Empty;
        public string VehicleModel { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}