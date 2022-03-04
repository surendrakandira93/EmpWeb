using Emp.Test.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Emp.Test.Service
{
    public class SchemeProfitLossService:BaseService
    {
        private readonly string baseUrl;

        public SchemeProfitLossService()
        {
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

        public async Task<T> GetChartAsync<T>(Guid groupId, int typeId, DateTime? fromDate, DateTime? toDate)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}Chart?typeId={typeId}&groupId={groupId}&fromDate={(fromDate.HasValue ? fromDate.Value.ToString("yyyy-MM-dd") : string.Empty)}&toDate={(toDate.HasValue ? toDate.Value.ToString("yyyy-MM-dd") : string.Empty)}"
            });
        }

        public async Task<T> GetProfitLossChartAsync<T>(Guid groupId, int typeId, DateTime? fromDate, DateTime? toDate)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}ProfitLossChart?typeId={typeId}&groupId={groupId}&fromDate={(fromDate.HasValue ? fromDate.Value.ToString("yyyy-MM-dd") : string.Empty)}&toDate={(toDate.HasValue ? toDate.Value.ToString("yyyy-MM-dd") : string.Empty)}"
            });
        }

        public async Task<T> GetMonthlyBreaupAsync<T>(Guid groupId, DateTime? fromDate, DateTime? toDate)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}MonthlyBreaup?groupId={groupId}&fromDate={(fromDate.HasValue ? fromDate.Value.ToString("yyyy-MM-dd") : string.Empty)}&toDate={(toDate.HasValue ? toDate.Value.ToString("yyyy-MM-dd") : string.Empty)}"
            });
        }

        public async Task<T> GetCal_HeatmapDataAsync<T>(Guid groupId, DateTime fromDate, DateTime toDate)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}Cal_Heatmap?groupId={groupId}&fromDate={fromDate.ToString("yyyy-MM-dd")}&toDate={toDate.ToString("yyyy-MM-dd")}"
            });
        }

        public async Task<T> GetPLSummaryAsync<T>(Guid groupId, DateTime? fromDate, DateTime? toDate)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}PLSummary?groupId={groupId}&fromDate={(fromDate.HasValue ? fromDate.Value.ToString("yyyy-MM-dd") : string.Empty)}&toDate={(toDate.HasValue ? toDate.Value.ToString("yyyy-MM-dd") : string.Empty)}"
            });
        }
    }
}
