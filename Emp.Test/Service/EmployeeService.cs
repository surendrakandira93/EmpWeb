using Emp.Test.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Emp.Test.Service
{
   public class EmployeeService:BaseService
    {
        private readonly string baseUrl;

        public EmployeeService()
        {
            this.baseUrl = $"{SiteKeys.APIBase}api/Employee/";
        }
        public async Task<T> CreateEmployeeAsync<T>(EmployeeAddDto employeeDto)
        {
            employeeDto.Id = Guid.NewGuid();
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.POST,
                Data = employeeDto,
                Url = $"{baseUrl}Create"
            });
        }

        public async Task<T> DeleteEmployeeAsync<T>(Guid id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.DELETE,
                Url = $"{baseUrl}Delete/{id}"
            });
        }

        public async Task<T> GetAllEmployeeAsync<T>()
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetAll"
            });
        }

        public async Task<T> GetEmployeeByIdAsync<T>(Guid id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetById/{id}"
            });
        }

        public async Task<T> GetEmployeeProfile<T>(Guid id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetEmployeeProfile/{id}"
            });
        }

        public async Task<T> GetEmployeeGroupByIdAsync<T>(Guid id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetempGroupNamesById/{id}"
            });
        }

        public async Task<T> GetEmployeeByEmailAsync<T>(string email)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetByEmail/{email}"
            });
        }

        public async Task<T> UpdateEmployeeAsync<T>(EmployeeAddDto productDto)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.PUT,
                Data = productDto,
                Url = $"{baseUrl}Update"
            });
        }
        public async Task<T> UpdateTechnologies<T>(EmployeeTechnologiesDto updateDto)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.PUT,
                Data = updateDto,
                Url = $"{baseUrl}UpdateTechnologies"
            });
        }

        public async Task<T> ChangePasswordAsync<T>(Guid id, string password)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}ChangePassword/{id}?password={password}"
            });
        }
    }
}
