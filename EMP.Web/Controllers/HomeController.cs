using EMP.Dto;
using EMP.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EMP.Web.Controllers
{
    public class HomeController : BaseController
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHostingEnvironment env;

        public HomeController(ILogger<HomeController> logger, IHostingEnvironment _env)
        {
            _logger = logger;
            this.env = _env;
        }

        [AllowAnonymous]
        public IActionResult Index()
        {
            var response = GetData();
            return View(response);
        }

        public IActionResult Profile()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public List<DashboardScheme2Dto> GetData()
        {
            var webRoot = env.WebRootPath;
            string filePath = $"{webRoot}/js/Dashboard-Scheme2.json";
            List<DashboardScheme2Dto> dataResponse = new List<DashboardScheme2Dto>();
            using (var sr = new StreamReader(filePath))
            {
                return JsonConvert.DeserializeObject<List<DashboardScheme2Dto>>(sr.ReadToEnd()).ToList();
            }

        }
    }
}
