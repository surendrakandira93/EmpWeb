using EMP.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Service
{
    public interface IFileService
    {
        Task<T> CreateUpdateAsync<T>(FileDto fileDto);
        Task<T> DeleteAsync<T>(string id);
        Task<T> GetAllAsync<T>();

        Task<T> GetByKeyAsync<T>(string id);
    }
}
