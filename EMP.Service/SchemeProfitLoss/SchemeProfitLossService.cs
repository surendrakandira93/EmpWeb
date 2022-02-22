using EMP.Common;
using EMP.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Service
{
    public class SchemeProfitLossService : BaseService, ISchemeProfitLossService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string baseUrl;

        public SchemeProfitLossService(IHttpClientFactory clientFactory) : base(clientFactory)
        {
            _clientFactory = clientFactory;
            this.baseUrl = $"{SiteKeys.APIBase}api/SchemeProfitLoss/";
        }

        public async Task<T> CreateAsync<T>(SchemeProfitLossDto schemeProfit)
        {
            schemeProfit.Id = Guid.NewGuid();
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.POST,
                Data = schemeProfit,
                Url = $"{baseUrl}Create"
            });
        }

        public async Task<T> AddRangeAsync<T>(List<SchemeProfitLossDto> schemeProfit)
        {

            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.POST,
                Data = schemeProfit,
                Url = $"{baseUrl}AddRange"
            });
        }

        public async Task<T> UpdateAsync<T>(SchemeProfitLossDto schemeProfit)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.PUT,
                Data = schemeProfit,
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

        public async Task<T> GetAllAsync<T>(Guid groupId)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetAll?groupId={groupId}"
            });
        }

        public async Task<T> GetKeywordsAsync<T>()
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetKeywords"
            });
        }


        public async Task<T> IsExist<T>(Guid? id, Guid groupId, DateTime date)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}IsExist?id={id}&groupId={groupId}&date={date}"
            });
        }

        public async Task<T> GetChartAsync<T>(Guid groupId, int typeId)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}Chart?typeId={typeId}&groupId={groupId}"
            });
        }

        public async Task<T> GetProfitLossChartAsync<T>(Guid groupId, int typeId)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}ProfitLossChart?typeId={typeId}&groupId={groupId}"
            });
        }

        public async Task<T> GetMonthlyBreaupAsync<T>(Guid groupId)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}MonthlyBreaup?groupId={groupId}"
            });
        }

    }
}
