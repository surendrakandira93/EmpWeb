using EMP.Dto;
using System;
using System.Threading.Tasks;

namespace EMP.Service
{
    public interface IEmployeeService : IBaseService
    {
        Task<T> CreateEmployeeAsync<T>(EmployeeAddDto employeeDto);

        Task<T> DeleteEmployeeAsync<T>(Guid id);

        Task<T> GetAllEmployeeAsync<T>();

        Task<T> GetAllEmployeeAsync<T>(int pageNo, int pageSize);

        Task<T> GetEmployeeByIdAsync<T>(Guid id);

        Task<T> GetEmployeeGroupByIdAsync<T>(Guid id);

        Task<T> UpdateEmployeeAsync<T>(EmployeeAddDto productDto);

        Task<T> GetEmployeeByEmailAsync<T>(string email);

        Task<T> UpdateProfileImageAsync<T>(EmployeeProfileImageDto updateDto);

        Task<T> UpdateTechnologies<T>(EmployeeTechnologiesDto updateDto);

        Task<T> UpdateLinkUrlAsync<T>(EmployeeProfileImageDto updateDto);

        Task<T> GetEmployeeProfile<T>(Guid id);

        Task<T> ChangePasswordAsync<T>(Guid id, string password);

    }
}
