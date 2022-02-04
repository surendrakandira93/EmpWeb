using EMP.Common;
using EMP.Dto;
using EMP.Web.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Web.Controllers
{
    [Authorize()]
    public class BaseController : Controller
    {
        public CustomPrincipal CurrentUser => new CustomPrincipal(HttpContext.User);
        public ClaimsPrincipal LoggedinUser => HttpContext.User;

        public async Task CreateAuthenticationTicket(EmployeeDto user, bool isPersistent)
        {

            if (user != null)
            {
                var claims = new List<Claim>{
                        new Claim(ClaimTypes.Email, user.Email??""),
                        new Claim(ClaimTypes.Name,user.Name??""),
                        new Claim(ClaimTypes.PrimarySid,Convert.ToString(user.Id))
                };
                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = isPersistent
                };

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    authProperties);
            }


        }
        public async Task RemoveAuthentication()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
        protected void ShowSuccessMessage(string title, string message, bool isCurrentView = true)
        {
            ShowMessages(title, message, MessageType.Success, isCurrentView);
        }

        protected void ShowErrorMessage(string title, string message, bool isCurrentView = true)
        {
            ShowMessages(title, message, MessageType.Danger, isCurrentView);
        }

        private void ShowMessages(string title, string message, MessageType messageType, bool isCurrentView)
        {
            Notification model = new Notification
            {
                Heading = title,
                Message = message,
                Type = messageType
            };

            if (isCurrentView)
                this.ViewData.AddOrReplace("NotificationModel", model);
            else
            {
                this.TempData["NotificationModel"] = JsonConvert.SerializeObject(model);
                TempData.Keep("NotificationModel");
            }
        }

        public ContentResult CreateModelStateErrors()
        {
            StringBuilder sb = new StringBuilder();
            if (ModelState.Values.Any() && ModelState.Values.Any(a => a.Errors.Any()))
            {
                sb.Append($"<div class='validation-summary-errors' data-valmsg-summary='true'>  <ul>");
                foreach (var item in ModelState.Values.SelectMany(x => x.Errors))
                {
                    sb.Append($"<li>{item.ErrorMessage}</li>");
                }
                sb.Append($"</div></ul>");
            }
            return Content(sb.ToString());
        }
        public IActionResult NewtonSoftJsonResult(object data)
        {
            return Json(data);
        }
        protected async Task<string> UploadFiles(IHostingEnvironment env, IFormFile imageFile, string existingFileName, string folderName, string fileName = "")
        {

            string myfile = "";
            string filePath = "";
            string ext = "";
            string webRoot = "";
            string Directirypath = "";
            string DeleteFilePath = "";


            try
            {
                webRoot = env.WebRootPath;
                if (!Directory.Exists($"{webRoot}/{folderName}/"))
                {
                    Directory.CreateDirectory($"{webRoot}/{folderName}/");
                }
                Directirypath = $"{webRoot}/{folderName}/";

                if (imageFile != null)
                {
                    ext = Path.GetExtension(imageFile.FileName).ToLower();
                    myfile = (string.IsNullOrEmpty(fileName) ? Guid.NewGuid().ToString() : fileName) + ext;
                    filePath = Path.Combine(Directirypath, myfile);
                    if (!string.IsNullOrEmpty(existingFileName))
                    {
                        DeleteFilePath = Path.Combine(Directirypath, existingFileName);
                        FileInfo file = new FileInfo(DeleteFilePath);
                        if (file.Exists)//check file exsit or not
                        {
                            file.Delete();
                        }
                    }
                    using (var streams = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(streams);

                    }

                }
            }
            catch
            {
                myfile = "";
            }


            return myfile;
        }

    }
}
