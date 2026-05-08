namespace backend_api.DTOs
{
    public class OrderItemCreateDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class OrderCreateDto
    {
        public int CustomerId { get; set; }
        public bool IsCreditSale { get; set; } = false;
        public List<OrderItemCreateDto> OrderItems { get; set; } = new();
    }

    public class OrderResponseDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal FinalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool IsCreditSale { get; set; }
        public bool IsCreditPaid { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItemResponseDto> OrderItems { get; set; } = new();
    }

    public class OrderItemResponseDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}