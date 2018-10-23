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
    [Route("api/customer")]
    public class CustomerApiController : Controller
    {
        ApplicationContext _db;

        public CustomerApiController(ApplicationContext context)
        {
            _db = context;
        }

        [HttpGet]
        public IActionResult Grid([ModelBinder(typeof(DataSourceLoadOptionsBinder))]DataSourceLoadOptions loadOptions)
        {
            var query = _db.Customer
                .Include(x => x.Orders)
                .Select(x => new CustomerVm
                {
                    Id = x.Id,
                    Name = x.Name,
                    OrdersCount = x.Orders.Count()
                });

            var result = DataSourceLoader.Load(query, loadOptions);

            return Json(result);
        }

        [HttpGet("{id}")]
        public IActionResult Get(long id)
        {
            var item = _db.Customer
                .Select(x => new CustomerVm
                {
                    Id = x.Id,
                    Name = x.Name
                }).FirstOrDefault(x => x.Id == id);

            return Json(item);
        }

        [HttpPost]
        public IActionResult Post([FromBody]CustomerDto model)
        {
            if (!TryValidateModel(model))
                return BadRequest(ModelState);

            Customer customer;

            if (model.Id.HasValue)
            {
                customer = _db.Customer.FirstOrDefault(x => x.Id == model.Id);
            }
            else
            {
                customer = new Customer();
                _db.Add(customer);
            }

            customer.Name = model.Name;

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
                    var customer = _db.Customer
                        .FirstOrDefault(x => x.Id == id);

                    var orders = _db.Order
                       .Include(x => x.Items)
                       .Where(x => x.CustomerId == customer.Id)
                       .ToArray();

                    foreach (var order in orders)
                    {
                        foreach (var orderItem in order.Items)
                        {
                            _db.Remove(order);
                        }

                        _db.Remove(order);
                    }

                    _db.Remove(customer);
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
    }
}