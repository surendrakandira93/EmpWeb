using EMP.Dto;
using EMP.Service;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EMP.Web.Controllers
{
    public class EmployeeController : BaseController
    {
        private readonly IEmployeeService service;
        private readonly IEmployeeGroupService employeeGroupService;
        private readonly IHostingEnvironment env;
        public EmployeeController(IEmployeeService _service, IEmployeeGroupService _employeeGroup, IHostingEnvironment _env)
        {
            this.service = _service;
            this.env = _env;
            this.employeeGroupService = _employeeGroup;
        }
        public async Task<IActionResult> Index()
        {
            return View();
        }

        public async Task<IActionResult> BindGrid(int pageNo = 1, int pageSize = 5)
        {

            var response = await service.GetAllEmployeeAsync<ResponseDto<EmployeeGridlDto>>(pageNo, pageSize);
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Data = response.Result, IsSuccess = true });
        }

        public async Task<IActionResult> Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(EmployeeAddDto model)
        {
            if (ModelState.IsValid)
            {
                if (!string.IsNullOrEmpty(model.Technolog))
                {
                    model.Technologies = (model.Technolog.Split(",")).ToList();
                }

                if (model.Technologies == null || !model.Technologies.Any())
                {
                    ModelState.AddModelError("", "Technologies required");
                    return CreateModelStateErrors();
                }

                var allFiles = this.Request.Form.Files;
                if (allFiles != null && allFiles.Any() && allFiles["ImageURLFile"] != null)
                {
                    var profileImage = allFiles["ImageURLFile"];
                    var profileExten = new[] { ".jpg", ".png", ".jpeg" };
                    var ext = Path.GetExtension(profileImage.FileName).ToLower();
                    if (!profileExten.Contains(ext))
                    {
                        ModelState.AddModelError("", $"Profile image not valid, Please choose jpg,png,jpeg format");
                        return CreateModelStateErrors();
                    }
                    else
                    {
                        model.ImageURL = await this.UploadFiles(env, profileImage, model.ImageURL, "UserImage");
                    }
                }


                var response = model.Id.HasValue ? await service.UpdateEmployeeAsync<ResponseDto<string>>(model) : await service.CreateEmployeeAsync<ResponseDto<string>>(model);
                if (response != null && response.IsSuccess)
                {
                    return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = $"Employee {(model.Id.HasValue ? "update" : "save")} successfully", IsSuccess = true, RedirectUrl = "/employeegroup/index" });
                }
            }
            ModelState.AddModelError("", "Validation failed");
            return CreateModelStateErrors();
        }

        public async Task<IActionResult> GetById(Guid id)
        {
            var response = await service.GetEmployeeByIdAsync<ResponseDto<EmployeeDto>>(id);
            var result = response.Result;
            result.Technolog = String.Join(",", result.Technologies);
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Data = result, IsSuccess = true });
        }

        public async Task<IActionResult> DeleteById(Guid id)
        {
            var response = await service.DeleteEmployeeAsync<ResponseDto<string>>(id);
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = "Employee delete successfully", IsSuccess = true });
        }

        public async Task<IActionResult> Profile()
        {
            var response = await service.GetEmployeeProfile<ResponseDto<EmployeeProfileDto>>(CurrentUser.UserId);
            var result = response.Result;
            return View(result);
        }

        [Route("UpdateProfileImage")]
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateProfileImage()
        {
            string imageURL = string.Empty;
            var allFiles = this.Request.Form.Files;
            if (allFiles != null && allFiles.Any() && allFiles["ImageURLFile"] != null)
            {
                var profileImage = allFiles["ImageURLFile"];
                var profileExten = new[] { ".jpg", ".png", ".jpeg" };
                var ext = Path.GetExtension(profileImage.FileName).ToLower();
                if (!profileExten.Contains(ext))
                {
                    ModelState.AddModelError("", $"Profile image not valid, Please choose jpg,png,jpeg format");
                    return CreateModelStateErrors();
                }
                else
                {
                    imageURL = await this.UploadFiles(env, profileImage, "", "UserImage");
                    var response = await service.UpdateProfileImageAsync<ResponseDto<string>>(new EmployeeProfileImageDto() { Id = CurrentUser.UserId, ImageURL = imageURL });
                    return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = $"Profile Image successfully", IsSuccess = true });
                }
            }

            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = $"Profile Image not upload", IsSuccess = false });



        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateTechnologies(List<string> technologies)
        {
            if (technologies == null || !technologies.Any())
            {
                ModelState.AddModelError("", "Technologies required");
                return CreateModelStateErrors();
            }
            var response = await service.UpdateTechnologies<ResponseDto<string>>(new EmployeeTechnologiesDto() { Id = CurrentUser.UserId, Technologies = technologies });
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = $"Technologies update successfully", IsSuccess = true });



        }

        public async Task<IActionResult> UpdateLinkUrl(string linkUrl)
        {
            var response = await service.UpdateLinkUrlAsync<ResponseDto<string>>(new EmployeeProfileImageDto() { Id = CurrentUser.UserId, ImageURL = linkUrl });
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = $"Update Link Url successfully", IsSuccess = true });
        }

        public async Task<IActionResult> AddGroup(Guid id)
        {
            var response = await employeeGroupService.AddSubscribeEmployeeGroup<ResponseDto<string>>(id, CurrentUser.UserId);
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = $"Update Link Url successfully", IsSuccess = true });
        }

        public async Task<IActionResult> UpdateSubscribeEmployeeGroup(Guid id, Guid empId, int typeId)
        {
            var response = await employeeGroupService.UpdateSubscribeEmployeeGroup<ResponseDto<string>>(id, empId, typeId);
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = $"Update Link Url successfully", IsSuccess = true });
        }

        [HttpGet]
        public async Task<IActionResult> ChangePassword()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto model)
        {
            if (ModelState.IsValid)
            {
                if (model.Password != model.ConfirmPassword)
                {
                    ModelState.AddModelError("", "New password and ConfirmPassword does not match ");
                    return CreateModelStateErrors();
                }

                var response = (await service.GetEmployeeByIdAsync<ResponseDto<EmployeeDto>>(CurrentUser.UserId)).Result;
                if (response.Password != model.CurrentPassword)
                {
                    ModelState.AddModelError("", "Current password does not match ");
                    return CreateModelStateErrors();
                }

                var response1 = await service.ChangePasswordAsync<ResponseDto<EmployeeDto>>(CurrentUser.UserId,model.Password);
                ShowSuccessMessage("Success","Password Change successfully",false);
            }
            else
            {
                //ModelState.AddModelError("", "Technologies required");
                return CreateModelStateErrors();

            }

            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = $"Password Changed successfully", IsSuccess = true,RedirectUrl= $"/employee/profile" });
        }


    }
}
