using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace DmitryVasilyevSPA.Models
{
    public class OrderItem: EntityBase
    {
        public int Count { get; set; }
        public string Product { get; set; }
        public decimal Price { get; set; }

        public long OrderId { get; set; }
        public Order Order { get; set; }
}
}