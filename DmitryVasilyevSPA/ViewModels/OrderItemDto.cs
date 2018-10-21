namespace DmitryVasilyevSPA.ViewModels
{
    public class OrderItemDto
    {
        public long? Id { get; set; }

        public int Count { get; set; }
        public string Product { get; set; }
        public decimal Price { get; set; }

        public long OrderId { get; set; }
    }
}