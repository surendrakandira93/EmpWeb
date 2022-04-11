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
  public  class FileService: BaseService, IFileService
    {


        private readonly IHttpClientFactory _clientFactory;
        private readonly string baseUrl;

        public FileService(IHttpClientFactory clientFactory) : base(clientFactory)
        {
            _clientFactory = clientFactory;
            this.baseUrl = $"{SiteKeys.APIFileBase}api/File/";
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

        public async Task<T> GetByKeyAsync<T>(string id)
        {
            return await this.SendAsync<T>(new ApiRequestDto()
            {
                ApiType = SiteKeys.ApiType.GET,
                Url = $"{baseUrl}GetByKey/{id}"
            });
        }
    }
}
