using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace DmitryVasilyevSPA.Models
{
    public class Customer: EntityBase
    {
        public string Name { get; set; }
        public IList<Order> Orders { get; set; } = new List<Order>();
    }
}