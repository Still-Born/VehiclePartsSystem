namespace backend_api.DTOs
{
    public class PartRequestCreateDto
    {
        public int CustomerId { get; set; }
        public string PartName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class PartRequestResponseDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string PartName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}