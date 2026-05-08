using backend_api.Data;
using Microsoft.EntityFrameworkCore;

namespace backend_api.Services
{
    public class StockNotificationService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<StockNotificationService> _logger;

        public StockNotificationService(
            IServiceProvider serviceProvider,
            ILogger<StockNotificationService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckLowStock();
                // Check every 24 hours
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }

        private async Task CheckLowStock()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

            var lowStockProducts = await context.Products
                .Where(p => p.Stock < 10)
                .ToListAsync();

            if (lowStockProducts.Any())
            {
                var adminUsers = await context.Users
                    .ToListAsync();

                var productList = string.Join("", lowStockProducts.Select(p =>
                    $"<li>{p.Name} — Only {p.Stock} units left</li>"
                ));

                var body = $@"
                <html>
                <body style='font-family:Arial;color:#333;'>
                    <h2 style='color:#e63946;'>⚠️ Low Stock Alert!</h2>
                    <p>The following products are running low on stock:</p>
                    <ul style='color:#e63946;'>
                        {productList}
                    </ul>
                    <p>Please restock these items as soon as possible.</p>
                    <p style='color:#e63946;'>Vehicle Parts System</p>
                </body>
                </html>";

                // Send to admin email from appsettings
                var adminEmail = "admin@gmail.com";
                await emailService.SendEmailAsync(
                    adminEmail,
                    "⚠️ Low Stock Alert - Vehicle Parts System",
                    body
                );

                _logger.LogInformation($"Low stock alert sent for {lowStockProducts.Count} products");
            }
        }
    }
}