using DmitryVasilyevSPA.Models;
using Microsoft.EntityFrameworkCore;
 
namespace DmitryVasilyevSPA.Models
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options) 
            : base(options)
        { }
 
        public virtual DbSet<Customer> Customer { get; set; }
        public virtual DbSet<Order> Order { get; set; }
        public virtual DbSet<OrderItem> OrderItem { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>().Property(x => x.Timestamp).IsConcurrencyToken().ValueGeneratedOnAddOrUpdate();

            modelBuilder.Entity<OrderItem>().Property(x => x.Price).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<OrderItem>().Property(x => x.Timestamp).IsConcurrencyToken().ValueGeneratedOnAddOrUpdate();
            
            modelBuilder.Entity<Order>().Property(x => x.Timestamp).IsConcurrencyToken().ValueGeneratedOnAddOrUpdate();

            base.OnModelCreating(modelBuilder);
        }
    }
}