using DmitryVasilyevSPA.Models;
using System;

namespace DmitryVasilyevSPA.Models
{
    public class OrderDto
    {
        public long? Id { get; set; }
        public int Number { get; set; }
        public string Date { get; set; }
        public OrderState State { get; set; }

        public long CustomerId { get; set; }
    }
}