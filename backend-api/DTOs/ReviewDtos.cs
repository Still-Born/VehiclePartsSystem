namespace backend_api.DTOs
{
    public class ReviewCreateDto
    {
        public int CustomerId { get; set; }
        public string Comment { get; set; } = string.Empty;
        public int Rating { get; set; }
    }

    public class ReviewResponseDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}