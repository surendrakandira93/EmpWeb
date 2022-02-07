using EMP.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Service
{
    public interface IShipmentService: IBaseService
    {
        Task<T> CreateAsync<T>(ShipmentAddDto shipmentDto);

        Task<T> UpdateAsync<T>(ShipmentAddDto shipmentDto);
        Task<T> DeleteAsync<T>(Guid id);

        Task<T> GetByIdAsync<T>(Guid id);

        Task<T> GetAllAsync<T>();

        Task<T> UPDateToLiveAsync<T>(Guid id);

        Task<T> UPDateToNonLiveAsync<T>(Guid id);

    }
}
