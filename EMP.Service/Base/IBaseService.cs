using EMP.Dto;
using System;
using System.Threading.Tasks;

namespace EMP.Service
{
    public interface IBaseService: IDisposable
    {
        Task<T> SendAsync<T>(ApiRequestDto apiRequest);
    }
}
