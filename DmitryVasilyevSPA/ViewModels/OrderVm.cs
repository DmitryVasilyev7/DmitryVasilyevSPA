using DmitryVasilyevSPA.Models;
using System;

namespace DmitryVasilyevSPA.ViewModels
{
    public class OrderVm
    {
        public long Id { get; set; }
        public int Number { get; set; }
        public DateTimeOffset Date { get; set; }
        public OrderState State { get; set; }
        public int ItemsCount { get; set; }
        public decimal Total { get; set; }

        public long ParentId { get; set; }
    }
}