using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace DmitryVasilyevSPA.Models
{
    public class EntityBase
    {
        [Timestamp]
        public Byte[] Timestamp { get; set; }
        public long Id { get; set; }
    }
}