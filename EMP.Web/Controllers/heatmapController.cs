using EMP.Dto;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EMP.Web.Controllers
{
    public class HeatmapController : Controller
    {
        private readonly IHostingEnvironment env;
        public HeatmapController(IHostingEnvironment _env)
        {
            this.env = _env;
        }
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> GetData(DateTime start, DateTime end)
        {
            var response = GetData();
            var result = response.Where(x => x.Date >= start && x.Date <= end).Select(s => new HeatmapResponseDto()
            {
                Date = GetUnixTimestamp(s.Date),
                Value = (int)s.DailyPnL
            }).ToList();
            return Json(result);
        }

       

        private List<GroupChartDto> GetData()
        {
            var webRoot = env.WebRootPath;
            string filePath = $"{webRoot}/js/Group_Chart.json";
            using (var sr = new StreamReader(filePath))
            {
                return JsonConvert.DeserializeObject<List<GroupChartDto>>(sr.ReadToEnd()).OrderBy(x=>x.Date).ToList();
            }

        }

        private int GetUnixTimestamp(DateTime date)
        {
            int unixTimestamp = (int)(date.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            return unixTimestamp;
        }
    }
}
