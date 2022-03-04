using Emp.Test.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Emp.Test.Service
{
    public class ShipmentService : BaseService
    {
        private readonly string baseUrl;

        public ShipmentService()
        {
            this.baseUrl = $"{SiteKeys.APIBase}api/Shipment/";
        }

        public async Task<T> CreateAsync<T>(ShipmentAddDto shipmentDto)
        {
            shipmentDto.Id = Guid.NewGuid();
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.POST,
                Data = shipmentDto,
                Url = $"{baseUrl}Create"
            });
        }

        public async Task<T> UpdateAsync<T>(ShipmentAddDto shipmentDto)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.PUT,
                Data = shipmentDto,
                Url = $"{baseUrl}Update"
            });
        }

        public async Task<T> DeleteAsync<T>(Guid id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.DELETE,
                Url = $"{baseUrl}Delete/{id}"
            });
        }

        public async Task<T> GetByIdAsync<T>(Guid id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetById/{id}"
            });
        }
        public async Task<T> GetAllAsync<T>()
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetAll"
            });
        }

        public async Task<T> UPDateToLiveAsync<T>(Guid id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}UPDateToLive/{id}"
            });
        }

        public async Task<T> UPDateToNonLiveAsync<T>(Guid id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}UPDateToNonLive/{id}"
            });
        }
    }
}
