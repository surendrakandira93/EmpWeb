using EMP.Common;
using EMP.Dto;
using EMP.Service;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EMP.Web.Controllers
{
    public class SchemeProfitLossController : BaseController
    {
        private readonly ISchemeProfitLossService service;
        private readonly IHostingEnvironment env;
        public SchemeProfitLossController(ISchemeProfitLossService _service, IHostingEnvironment _env)
        {
            this.service = _service;
            this.env = _env;
        }
        public async Task<IActionResult> Index(Guid groupId)
        {
            var response = await service.GetAllAsync<ResponseDto<List<SchemeProfitLossDto>>>(groupId);
            ViewBag.id = groupId;
            return View(response.Result);
        }
        public async Task<IActionResult> Create(Guid? id, Guid groupId, bool isRefresh)
        {
            var model = new SchemeProfitLossDto() { GroupId = groupId };
            if (id.HasValue)
            {
                var response = await service.GetByIdAsync<ResponseDto<SchemeProfitLossDto>>(id.Value);
                model = response.Result;

            }

            var keywordResponse = await service.GetKeywordsAsync<ResponseDto<List<string>>>();
            model.KeywordList = keywordResponse.Result.Select(x => new SelectedListItemMvcDto()
            {
                Text = x,
                Value = x
            }).ToList();
            model.IsRefresh = isRefresh;
            return PartialView("_AddEdit", model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(SchemeProfitLossDto model)
        {
            if (ModelState.IsValid)
            {
                var resultIsExist = await service.IsExist<ResponseDto<bool>>(model.Id,model.GroupId,model.Date.Value);
                if (!resultIsExist.Result)
                {
                    var response = model.Id.HasValue ? await service.UpdateAsync<ResponseDto<string>>(model) : await service.CreateAsync<ResponseDto<string>>(model);
                    if (response != null && response.IsSuccess)
                    {
                        if(!model.IsRefresh)
                        ShowSuccessMessage("Success", model.Id.HasValue ? "Scheme Profit & Loss updated" : "Scheme Profit & Loss added", false);
                        return NewtonSoftJsonResult(new RequestOutcome<dynamic>
                        {
                            Message = model.Id.HasValue ? "Scheme Profit & Loss updated" : "Scheme Profit & Loss added",
                            IsSuccess = true,
                            Data = model.IsRefresh,
                            RedirectUrl = $"/SchemeProfitLoss/index?groupId={model.GroupId}"
                        });
                    }
                }
                else
                {
                    ModelState.AddModelError("", $"Alreday added for {model.Date.Value.ToString("dd/MM/yyyy")}");
                    return CreateModelStateErrors();
                }
                
            }

            ModelState.AddModelError("", "Validation failed");
            return CreateModelStateErrors();
        }

        public async Task<IActionResult> DeleteById(Guid id, Guid groupId)
        {
            var response = await service.DeleteAsync<ResponseDto<string>>(id);
            ShowSuccessMessage("Success", "Scheme Profit & Loss deleted", false);
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = "Scheme Profit & Loss delete successfully", IsSuccess = true, RedirectUrl = $"/SchemeProfitLoss/index?groupId={groupId}" });
        }

        public async Task<IActionResult> RestoreDefault(Guid groupId)
        {
            var webRoot = env.WebRootPath;
            string filePath = $"{webRoot}/js/Group_Chart.json";
            List<SchemeProfitLossDto> dataResponse = new List<SchemeProfitLossDto>();
            using (var sr = new StreamReader(filePath))
            {
                dataResponse = JsonConvert.DeserializeObject<List<GroupChartDto>>(sr.ReadToEnd()).OrderBy(o => o.Date).Select(x => new SchemeProfitLossDto()
                {
                    Date = x.Date,
                    Expense = x.AggregateSum,
                    ProfitLoss = x.DailyPnL,
                    GroupId = groupId
                }).ToList();
            }

            await service.AddRangeAsync<ResponseDto<string>>(dataResponse);


            return RedirectToAction("Index", new { groupId = groupId });

        }
    }
}
