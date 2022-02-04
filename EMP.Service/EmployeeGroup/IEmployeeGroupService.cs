using EMP.Dto;
using System;
using System.Threading.Tasks;

namespace EMP.Service
{
    public interface IEmployeeGroupService: IBaseService
    {
        Task<T> GetPageEmployeeGroupAsync<T>(Guid id, int pageNo, int pageSize);

        Task<T> CreateEmployeeGroupAsync<T>(EmployeeGroupAddDto empGroupDto);

        Task<T> DeleteEmployeeGroupAsync<T>(Guid id);

        Task<T> GetAllEmployeeGroupAsync<T>();

        Task<T> GetEmployeeGroupByIdAsync<T>(Guid id);

        Task<T> UpdateEmployeeGroupAsync<T>(EmployeeGroupAddDto empGroupDto);

        Task<T> GetEmployeeListByGroupId<T>(Guid id);

        Task<T> UpdateEmployeeInviteType<T>(Guid groupId, Guid empId, int inviteType);

        Task<T> AddSubscribeEmployeeGroup<T>(Guid groupId, Guid empId);

        Task<T> GetAllGroupForSubscription<T>(Guid id);
        
        Task<T> UpdateSubscribeEmployeeGroup<T>(Guid groupId, Guid empId, int inviteType);

        Task<T> GetGroupForView<T>(Guid id);
    }
}
