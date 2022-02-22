using EMP.Common;
using EMP.Dto;
using EMP.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMP.Web.Controllers
{
    public class ShipmentController : BaseController
    {
        private readonly IShipmentService service;

        public ShipmentController(IShipmentService _service)
        {
            this.service = _service;
        }
        public async Task<IActionResult> Index()
        {
            var response = await service.GetAllAsync<ResponseDto<List<ShipmentDto>>>();
            return View(response.Result);
        }
        public async Task<IActionResult> Create(Guid? id)
        {
            ViewBag.brokersList = Enum.GetValues(typeof(Brokers)).Cast<Brokers>().Select(x => new SelectListItem()
            {
                Text = x.GetDisplayName(),
                Value = ((int)x).ToString()
            }).ToList();
            if (id.HasValue)
            {
                var response = await service.GetByIdAsync<ResponseDto<ShipmentAddDto>>(id.Value);
                return View(response.Result);
            }

            return View(new ShipmentAddDto());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ShipmentAddDto model)
        {
            if (ModelState.IsValid)
            {
                model.EmpId = CurrentUser.UserId;
                var response = model.Id.HasValue ? await service.UpdateAsync<ResponseDto<string>>(model) : await service.CreateAsync<ResponseDto<string>>(model);
                if (response != null && response.IsSuccess)
                {
                    ShowSuccessMessage("Success",model.Id.HasValue? "Shipment updated" : "Shipment added", false);
                    return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = $"Shipmen {(model.Id.HasValue ? "update" : "save")} successfully", IsSuccess = true, RedirectUrl = "/Shipment/index" });
                }
            }
            ModelState.AddModelError("", "Validation failed");
            return CreateModelStateErrors();
        }

        public async Task<IActionResult> DeleteById(Guid id)
        {
            var response = await service.DeleteAsync<ResponseDto<string>>(id);
            ShowSuccessMessage("Success", "Shipment deleted", false);
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = "Shipment delete successfully", IsSuccess = true, RedirectUrl = "/Shipment/index" });
        }

        public async Task<IActionResult> UPDateToLive(Guid id)
        {
            var response = await service.UPDateToLiveAsync<ResponseDto<string>>(id);
            ShowSuccessMessage("Success", "Shipment updated to Live", false);
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = "Shipment delete successfully", IsSuccess = true, RedirectUrl = "/Shipment/index" });
        }

        public async Task<IActionResult> UPDateToNonLive(Guid id)
        {
            var response = await service.UPDateToNonLiveAsync<ResponseDto<string>>(id);
            ShowSuccessMessage("Success", "Shipment update to Non Live", false);
            return NewtonSoftJsonResult(new RequestOutcome<dynamic> { Message = "Shipment delete successfully", IsSuccess = true, RedirectUrl = "/Shipment/index" });
        }
    }
}
