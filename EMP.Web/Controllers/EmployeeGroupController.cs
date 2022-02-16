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
    public class EmployeeGroupController : BaseController
    {
        private readonly IEmployeeGroupService service;
        private readonly IEmployeeService employeeService;
        private readonly IHostingEnvironment env;
        public EmployeeGroupController(IEmployeeGroupService _service, IEmployeeService _employeeService, IHostingEnvironment _env)
        {
            this.service = _service;
            this.employeeService = _employeeService;
            this.env = _env;
        }
        public async Task<IActionResult> Index()
        {
            var allEmpService = await employeeService.GetAllEmployeeAsync<ResponseDto<List<EmployeeDto>>>();
            var empList = allEmpService.Result.Where(x => x.Id != CurrentUser.UserId).Select(x => new SelectListItem() { Text = x.Name, Value = x.Id.ToString() }).ToList();
            ViewBag.empList = empList;
            return View();
        }

        public async Task<IActionResult> BindGrid(int pageNo = 1, int pageSize = 5)
        {

            var response = await service.GetPageEmployeeGroupAsync<ResponseDto<EmployeeGroupGridlDto>>(CurrentUser.UserId, pageNo, pageSize);
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Data = response.Result, IsSuccess = true });
        }

        public async Task<IActionResult> BindEmpDrop()
        {

            var allEmpService = await employeeService.GetAllEmployeeAsync<ResponseDto<List<EmployeeDto>>>();
            var empList = allEmpService.Result.Select(x => new SelectListItem() { Text = x.Name, Value = x.Id.ToString() }).ToList();
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Data = empList, IsSuccess = true });
        }

        public async Task<IActionResult> Create()
        {
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(EmployeeGroupAddDto model)
        {
            model.AdminId = CurrentUser.UserId;
            if (ModelState.IsValid)
            {

                var allFiles = this.Request.Form.Files;
                if (allFiles != null && allFiles.Any() && allFiles["ImageURLFile"] != null)
                {
                    var profileImage = allFiles["ImageURLFile"];
                    var profileExten = new[] { ".jpg", ".png", ".jpeg" };
                    var ext = Path.GetExtension(profileImage.FileName).ToLower();
                    if (!profileExten.Contains(ext))
                    {
                        ModelState.AddModelError("", $"Grpop image not valid, Please choose jpg,png,jpeg format");
                        return CreateModelStateErrors();
                    }
                    else
                    {
                        model.IconImg = await this.UploadFiles(env, profileImage, model.IconImg, "GroupImage");
                    }
                }
                else
                {
                    ModelState.AddModelError("", $"Grpop image is required");
                    return CreateModelStateErrors();
                }


                var response = model.Id.HasValue ? await service.UpdateEmployeeGroupAsync<ResponseDto<string>>(model) : await service.CreateEmployeeGroupAsync<ResponseDto<string>>(model);
                if (response != null && response.IsSuccess)
                {
                    return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = $"Employee group {(model.Id.HasValue ? "update" : "save")} successfully", IsSuccess = true, RedirectUrl = "/employeegroup/index" });
                }
            }
            ModelState.AddModelError("", "Validation failed");
            return CreateModelStateErrors();
        }

        public async Task<IActionResult> GetById(Guid id)
        {
            var response = await service.GetEmployeeGroupByIdAsync<ResponseDto<EmployeeGroupListDto>>(id);
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Data = response.Result, IsSuccess = true });
        }

        public async Task<IActionResult> DeleteById(Guid id)
        {
            var response = await service.DeleteEmployeeGroupAsync<ResponseDto<string>>(id);
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = "Employee group delete successfully", IsSuccess = true });
        }

        public async Task<IActionResult> GetAllGroupForSubscription(Guid id)
        {
            var response = await service.GetAllGroupForSubscription<ResponseDto<List<SelectedListItemDto>>>(id);
            return NewtonSoftJsonResult(new RequestOutcome<List<SelectedListItemDto>> { Data = response.Result, IsSuccess = true });
        }

        public async Task<IActionResult> View(Guid id)
        {
            var response = await service.GetGroupForView<ResponseDto<EmployeeGroupForApprovalListDto>>(id);
            ViewBag.dateList = GetTransctionList().Select(x => new SelectListItem() { Text = x.EntryDate.ToString("dd/MM/yyyy"), Value = x.EntryDate.ToString("MM/dd/yyyy") }).ToList();
            return View(response.Result);
        }

        public async Task<IActionResult> GetTransction(DateTime? from)
        {

            List<GroupTransactionDto> dataResponse = GetTransctionList();

            if (from.HasValue)
            {
                dataResponse = dataResponse.Where(x => x.EntryDate == from).ToList();
            }
            return NewtonSoftJsonResult(new RequestOutcome<List<GroupTransactionDto>> { Data = dataResponse, IsSuccess = true });
        }

        public List<GroupTransactionDto> GetTransctionList()
        {
            var webRoot = env.WebRootPath;
            string filePath = $"{webRoot}/js/GroupTransaction.json";
            List<GroupTransactionDto> dataResponse = new List<GroupTransactionDto>();
            using (var sr = new StreamReader(filePath))
            {
                return JsonConvert.DeserializeObject<List<GroupTransactionDto>>(sr.ReadToEnd()).OrderBy(o => o.EntryDate).ToList();
            }

        }

        public async Task<IActionResult> GetChartData()
        {
            var webRoot = env.WebRootPath;
            string filePath = $"{webRoot}/js/Group_Chart.json";
            List<GroupChartDto> dataResponse = new List<GroupChartDto>();
            using (var sr = new StreamReader(filePath))
            {
                dataResponse = JsonConvert.DeserializeObject<List<GroupChartDto>>(sr.ReadToEnd()).OrderBy(o => o.Date).Select(x=> new GroupChartDto() { Date=x.Date,Profit=x.Profit*10}).ToList();
            }
            return NewtonSoftJsonResult(new RequestOutcome<List<GroupChartDto>> { Data = dataResponse, IsSuccess = true });

        }


    }
}
