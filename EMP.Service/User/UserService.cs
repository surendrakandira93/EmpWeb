using EMP.Dto;
using System.Collections.Generic;
using System.Linq;

namespace EMP.Service
{
    public class UserService : IUserService
    {
        private readonly List<UserDto> user;
        public UserService()
        {
            this.user = new List<UserDto>() { new UserDto() { Id = 1, Name = "Surendra", Password = "123456", Email = "surendra@gmail.com",IsActive=true } };
        }

        public UserDto GetUserByName(string userName)
        {
            return this.user.FirstOrDefault(a=>a.Email.ToLower()==userName);
        }
    }
}
