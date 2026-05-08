namespace backend_api.Models
{
    public class PurchaseInvoice
    {
        public int Id { get; set; }
        public int SupplierId { get; set; }
        public Supplier? Supplier { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalAmount { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}