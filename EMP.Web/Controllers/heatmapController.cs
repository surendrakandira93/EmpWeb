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
    public class HeatmapController : BaseController
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
            end = end.AddDays(10);
            var response = GetData();
            List<HeatmapResponseDto> result = new List<HeatmapResponseDto>();
            DateTime d = start.Date;
            while (d <= end.Date)
            {
                if (response.Any(x => x.Date.Date == d))
                {
                    result.Add(response.Where(x => x.Date.Date == d).Select(s => new HeatmapResponseDto()
                    {
                        Date = GetUnixTimestamp(s.Date.Date),
                        Value = s.DailyPnL
                    }).FirstOrDefault());
                }
                else
                {
                    //result.Add(new HeatmapResponseDto()
                    //{
                    //    Date = GetUnixTimestamp(d),
                    //    Value = 0
                    //});

                }

                d = d.AddDays(1);
            }

            return Json(result);
        }



        private List<GroupChartDto> GetData()
        {
            var webRoot = env.WebRootPath;
            string filePath = $"{webRoot}/js/Group_Chart.json";
            using (var sr = new StreamReader(filePath))
            {
                return JsonConvert.DeserializeObject<List<GroupChartDto>>(sr.ReadToEnd()).OrderBy(x => x.Date).ToList();
            }

        }

        private int GetUnixTimestamp(DateTime date)
        {
            int unixTimestamp = (int)(date.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            return unixTimestamp;
        }
    }
}
