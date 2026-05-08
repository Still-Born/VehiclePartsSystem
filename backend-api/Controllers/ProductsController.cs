using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend_api.Data;
using backend_api.Models;

namespace backend_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductFormDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                CategoryId = dto.CategoryId,
                SupplierId = dto.SupplierId,
            };

            // Handle image upload
            if (dto.Image != null)
            {
                var uploadsFolder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot", "uploads", "products");
                
                Directory.CreateDirectory(uploadsFolder);
                
                var fileName = Guid.NewGuid() + 
                    Path.GetExtension(dto.Image.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);
                
                using var stream = new FileStream(filePath, FileMode.Create);
                await dto.Image.CopyToAsync(stream);
                product.ImageUrl = $"/uploads/products/{fileName}";
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductFormDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.CategoryId = dto.CategoryId;
            product.SupplierId = dto.SupplierId;

            // Handle image upload
            if (dto.Image != null)
            {
                var uploadsFolder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot", "uploads", "products");
                
                Directory.CreateDirectory(uploadsFolder);
                
                var fileName = Guid.NewGuid() + 
                    Path.GetExtension(dto.Image.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);
                
                using var stream = new FileStream(filePath, FileMode.Create);
                await dto.Image.CopyToAsync(stream);
                product.ImageUrl = $"/uploads/products/{fileName}";
            }

            await _context.SaveChangesAsync();
            return Ok(product);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully" });
        }

        [HttpGet("low-stock")]
        public async Task<IActionResult> LowStock() =>
            Ok(await _context.Products.Where(p => p.Stock < 10).ToListAsync());
    }

    public class ProductFormDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public int SupplierId { get; set; }
        public IFormFile? Image { get; set; }
    }
}