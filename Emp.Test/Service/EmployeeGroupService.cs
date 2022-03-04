using Emp.Test.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Emp.Test.Service
{
    public class EmployeeGroupService : BaseService
    {
        private readonly string baseUrl;
        public EmployeeGroupService()
        {
            this.baseUrl = $"{SiteKeys.APIBase}api/EmployeeGroup/";
        }

        public async Task<T> CreateEmployeeGroupAsync<T>(EmployeeGroupAddDto empGroupDto)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.POST,
                Data = empGroupDto,
                Url = $"{baseUrl}Create"
            });
        }

        public async Task<T> DeleteEmployeeGroupAsync<T>(Guid id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.DELETE,
                Url = $"{baseUrl}Delete/{id}"
            });
        }

        public async Task<T> GetAllEmployeeGroupAsync<T>()
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetAll"
            });
        }

        public async Task<T> GetPageEmployeeGroupAsync<T>(Guid id, int pageNo, int pageSize)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetPage/{id}?pageNo={pageNo}&pageSize={pageSize}"
            });
        }

        public async Task<T> GetEmployeeGroupByIdAsync<T>(Guid id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetById/{id}"
            });
        }

        public async Task<T> UpdateEmployeeGroupAsync<T>(EmployeeGroupAddDto empGroupDto)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.PUT,
                Data = empGroupDto,
                Url = $"{baseUrl}Update"
            });
        }

        public async Task<T> GetEmployeeListByGroupId<T>(Guid id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetEmployeeListByGroupId/{id}"
            });
        }

        public async Task<T> UpdateEmployeeInviteType<T>(Guid groupId, Guid empId, int inviteType)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}UpdateEmployeeInviteType?groupId={groupId}&empId={empId}&inviteType={inviteType}"
            });
        }

        public async Task<T> AddSubscribeEmployeeGroup<T>(Guid groupId, Guid empId)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}AddSubscribeEmployeeGroup?groupId={groupId}&empId={empId}"
            });
        }

        public async Task<T> UpdateSubscribeEmployeeGroup<T>(Guid groupId, Guid empId, int inviteType)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}UpdateSubscribeEmployeeGroup?groupId={groupId}&empId={empId}&inviteType={inviteType}"
            });
        }

        public async Task<T> GetAllGroupForSubscription<T>(Guid id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetAllGroupForSubscription/{id}"
            });
        }

        public async Task<T> GetGroupForView<T>(Guid id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetGroupForView/{id}"
            });
        }
    }
}
