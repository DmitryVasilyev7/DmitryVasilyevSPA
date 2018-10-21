using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace DmitryVasilyevSPA.Models
{
    public enum OrderState
    {
        Draft,
        Paid,
        Completed,
        Canceled
    }

    public class Order: EntityBase
    {
        public int Number { get; set; }
        public DateTimeOffset Date { get; set; }
        public OrderState State { get; set; }

        public long CustomerId { get; set; }
        public Customer Customer { get; set; }

        public IList<OrderItem> Items { get; set; } = new List<OrderItem>();
}
}