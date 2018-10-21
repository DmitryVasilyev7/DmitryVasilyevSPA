namespace DmitryVasilyevSPA.ViewModels
{
    public class OrderItemVm
    {
        public long Id { get; set; }

        public int Count { get; set; }
        public string Product { get; set; }
        public decimal Price { get; set; }

        public long ParentId { get; set; }
}
}