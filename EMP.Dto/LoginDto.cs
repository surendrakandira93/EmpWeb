using System;

namespace EMP.Dto
{
    public class LoginDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool IsPersistent { get; set; }
    }

    public class SignupDto
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public DateTime? DateOfBrith { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
