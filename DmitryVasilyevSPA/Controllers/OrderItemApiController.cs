using DevExtreme.AspNet.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DmitryVasilyevSPA.Models;
using DmitryVasilyevSPA.Data;
using DmitryVasilyevSPA.ViewModels;
using DmitryVasilyevSPA.Context;

namespace DmitryVasilyevSPA.Controllers
{
    [Route("api/orderItem")]
    public class OrderItemApiController : Controller
    {
        ApplicationContext _db;

        public OrderItemApiController(ApplicationContext context)
        {
            _db = context;
        }

        [HttpGet]
        public IActionResult Grid(long? orderId, [ModelBinder(typeof(DataSourceLoadOptionsBinder))]DataSourceLoadOptions loadOptions)
        {
            IQueryable<OrderItem> query = _db.OrderItem;

            if (orderId.HasValue)
                query = query.Where(x => x.OrderId == orderId);

            var listQuery = query.Select(x => new OrderItemVm
            {
                Id = x.Id,
                Count = x.Count,
                ParentId = x.OrderId,
                Price = x.Price,
                Product = x.Product
            });

            var result = DataSourceLoader.Load(listQuery, loadOptions);

            return Json(result);
        }
        
        [HttpGet("{id}")]
        public IActionResult Get(long id)
        {
            var item = _db.OrderItem
                .Select(x => new OrderItemVm
                {
                    Id = x.Id,
                    Count = x.Count,
                    ParentId = x.OrderId,
                    Price = x.Price,
                    Product = x.Product
                }).FirstOrDefault(x => x.Id == id);

            return Json(item);
        }

        [HttpPost]
        public IActionResult Post([FromBody]OrderItemDto model)
        {
            if (!TryValidateModel(model))
                return BadRequest(ModelState);

            OrderItem item;

            if (model.Id.HasValue)
            {
                item = _db.OrderItem.FirstOrDefault(x => x.Id == model.Id);
            }
            else
            {
                item = new OrderItem
                {
                    OrderId = model.OrderId
                };
                _db.Add(item);
            }

            item.Count = model.Count;
            item.Price = model.Price;
            item.Product = model.Product;

            _db.SaveChanges();

            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Remove(long id)
        {
            var orderItem = _db.OrderItem.FirstOrDefault(x => x.Id == id);
            _db.Remove(orderItem);

            _db.SaveChanges();

            return Ok();
        }
    }
}