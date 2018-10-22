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
    [Route("api/order")]
    public class OrderApiController : Controller
    {
        ApplicationContext _db;

        public OrderApiController(ApplicationContext context)
        {
            _db = context;
        }

        [HttpGet]
        public IActionResult Grid(long? customerId, [ModelBinder(typeof(DataSourceLoadOptionsBinder))]DataSourceLoadOptions loadOptions)
        {
            IQueryable<Order> query = _db.Order
                .Include(x => x.Items);

            if (customerId.HasValue)
                query = query.Where(x => x.CustomerId == customerId);

            var listQuery = query.Select(x => new OrderVm
            {
                Id = x.Id,
                Number = x.Number,
                Date = x.Date,
                State = x.State,
                ParentId = x.CustomerId,
                ItemsCount = x.Items.Count(),
                Total = x.Items.Sum(y => y.Price * y.Count)
            });

            var result = DataSourceLoader.Load(listQuery, loadOptions);

            return Json(result);
        }

        [HttpGet("{id}")]
        public IActionResult Get(long id)
        {
            var item = _db.Order
                .Select(x => new OrderVm
                {
                    Id = x.Id,
                    Number = x.Number,
                    Date = x.Date,
                    State = x.State,
                    ParentId = x.CustomerId
                }).FirstOrDefault(x => x.Id == id);

            return Json(item);
        }

        [HttpPost]
        public IActionResult Post([FromBody]OrderDto model)
        {
            if (!TryValidateModel(model))
                return BadRequest(ModelState);

            Order order;

            if (model.Id.HasValue)
            {
                order = _db.Order.FirstOrDefault(x => x.Id == model.Id);
            }
            else
            {
                order = new Order()
                {
                    CustomerId = model.CustomerId
                };
                _db.Add(order);
            }

            order.Number = model.Number;
            order.State = model.State;

            DateTimeOffset date;

            if (DateTimeOffset.TryParse(model.Date, out date))
            {
                order.Date = date;
            }

            _db.SaveChanges();

            return Ok();
        }

        [HttpPut]
        public IActionResult Put(long key, string values)
        {
            var order = _db.Order.FirstOrDefault(x => x.Id == key);
            JsonConvert.PopulateObject(values, order);

            if (!TryValidateModel(order))
                return BadRequest();

            _db.SaveChanges();

            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Remove(long id)
        {
            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    var order = _db.Order
                        .Include(x => x.Items)
                        .FirstOrDefault(x => x.Id == id);

                    foreach (var item in order.Items)
                    {
                        _db.Remove(item);
                    }
                    _db.SaveChanges();

                    _db.Remove(order);

                    _db.SaveChanges();
                    transaction.Commit();

                    return Ok();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();

                    throw new Exception("Error");
                }
            }
        }

        [HttpGet("getTotal")]
        public IActionResult GetTotal(long id)
        {
            var items = _db.OrderItem
                .Where(x => x.OrderId == id)
                .ToArray();

            decimal total = 0;

            foreach (var item in items)
            {
                total += item.Count * item.Price;
            }

            return Json(total);
        }
    }
}