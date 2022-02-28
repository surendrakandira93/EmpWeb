using EMP.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Service
{
    public interface ISchemeProfitLossService
    {
        Task<T> CreateAsync<T>(SchemeProfitLossDto schemeProfit);

        Task<T> AddRangeAsync<T>(List<SchemeProfitLossDto> schemeProfit);

        Task<T> UpdateAsync<T>(SchemeProfitLossDto schemeProfit);

        Task<T> DeleteAsync<T>(Guid id);

        Task<T> GetByIdAsync<T>(Guid id);

        Task<T> GetAllAsync<T>(Guid groupId);

        Task<T> GetKeywordsAsync<T>();

        Task<T> IsExist<T>(Guid? id, Guid groupId, DateTime date);

        Task<T> GetChartAsync<T>(Guid groupId, int typeId, DateTime? fromDate, DateTime? toDate);

        Task<T> GetProfitLossChartAsync<T>(Guid groupId, int typeId, DateTime? fromDate, DateTime? toDate);

        Task<T> GetMonthlyBreaupAsync<T>(Guid groupId, DateTime? fromDate, DateTime? toDate);

        Task<T> GetCal_HeatmapDataAsync<T>(Guid groupId, DateTime fromDate, DateTime toDate);

        Task<T> GetPLSummaryAsync<T>(Guid groupId, DateTime? fromDate, DateTime? toDate);

    }
}
