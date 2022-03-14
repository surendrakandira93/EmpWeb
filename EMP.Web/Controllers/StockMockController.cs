using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMP.Web.Controllers
{
    public class StockMockController : BaseController
    {
        public IActionResult Index()
        {
            string qry = "index";
            return View(qry);
        }

        public IActionResult Index1()
        {
            return View();
        }

        public IActionResult Share(string qry)
        {
            return View("index",qry);
        }
    }
}
