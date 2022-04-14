using EMP.Dto;
using EMP.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace EMP.Web.Controllers
{
    public class AccountController : BaseController
    {

        private readonly IEmployeeService service;
        public AccountController(IEmployeeService _service)
        {
            this.service = _service;

        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Index(string returnUrl = null)
        {
            if (this.User != null && this.User.Identity != null && this.User.Identity.IsAuthenticated)
            {
                return RedirectToAction("profile", "employee");
            }
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }


        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Index(LoginDto requestDto, string returnUrl = null)
        {
            if (!ModelState.IsValid)
            {
                return CreateModelStateErrors();
            }
                    



            var user = (await service.GetEmployeeByEmailAsync< ResponseDto<EmployeeDto>>(requestDto.UserName)).Result;
            if (user == null)
            {
                ModelState.AddModelError("", "User does not exist");
                return CreateModelStateErrors();
            }



            if (user.Password != requestDto.Password)
            {
                ModelState.AddModelError("", "Username or password invalid ");
                return CreateModelStateErrors();
            }

            await CreateAuthenticationTicket(user, requestDto.IsPersistent);

            return Json(new RequestOutcome<string> { RedirectUrl = string.IsNullOrEmpty(returnUrl) || returnUrl == "/" ? $"/employee/profile" : returnUrl, IsSuccess = true });

        }


        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Signup(SignupDto requestDto, string returnUrl = null)
        {
            if (!ModelState.IsValid)
            {
                return CreateModelStateErrors();
            }
            if (requestDto.Password != requestDto.ConfirmPassword)
            {
                ModelState.AddModelError("", "Confirm Password not matched with Password");
                return CreateModelStateErrors();
            }

            var user = await service.CreateEmployeeAsync<ResponseDto<EmployeeDto>>(new EmployeeAddDto()
            {
                Id = Guid.NewGuid(),
                DateOfBrith = requestDto.DateOfBrith,
                Name = requestDto.Name,
                Email = requestDto.Email,
                Password = requestDto.Password

            });
            if (user.IsSuccess)
            {
                ShowSuccessMessage("success", "You register successfully", false);
            }
            else
            {
                ModelState.AddModelError("", user.Message);
                return CreateModelStateErrors();
            }

            return Json(new RequestOutcome<string> { RedirectUrl = $"/Account/Index", IsSuccess = true });

        }

        public async Task<IActionResult> Logout()
        {

            await RemoveAuthentication();
            return RedirectToAction("index", "account");
        }
    }
}
