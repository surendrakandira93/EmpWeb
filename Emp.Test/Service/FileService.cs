using Emp.Test.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Emp.Test.Service
{
    public class FileService:BaseService
    {
        private readonly string baseUrl;

        public FileService()
        {
            this.baseUrl = $"{SiteKeys.APIBase}api/File/";
        }
        public async Task<T> CreateFreshDBFileAsync<T>()
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}CreateFreshDBFile"
            });
        }


        public async Task<T> CreateUpdateAsync<T>(FileDto fileDto)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.POST,
                Data = fileDto,
                Url = $"{baseUrl}AddUpdate"
            });
        }
            

        public async Task<T> DeleteAsync<T>(string id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.DELETE,
                Url = $"{baseUrl}RemoveByKey/{id}"
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
    }
}
