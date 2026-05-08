namespace backend_api.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; } = 0;
        public decimal FinalAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public bool IsCreditSale { get; set; } = false;
        public bool IsCreditPaid { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}