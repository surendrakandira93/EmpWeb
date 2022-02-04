using EMP.Dto;

namespace EMP.Service
{
    public interface IUserService
    {
        UserDto GetUserByName(string userName);
    }
}
