using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMP.Web.Controllers
{
    public class StockMockController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Index1()
        {
            return View();
        }
    }
}
