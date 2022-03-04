using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Emp.Test.Dto
{
    public class EmployeeAddDto
    {
        public EmployeeAddDto()
        {
            this.Technologies = new List<string>();
        }
        public Guid? Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string City { get; set; }
        public DateTime? DateOfBrith { get; set; }
        public string Gender { get; set; }
        public List<string> Technologies { get; set; }
        public string ImageURL { get; set; }
        public string LinkedinURL { get; set; }
        public string Technolog { get; set; }
    }

    public class EmployeeDto : EmployeeAddDto
    {

        public int Age { get; set; }
    }
    public class EmployeeProfileImageDto
    {
        public Guid Id { get; set; }
        public string ImageURL { get; set; }
    }

    public class EmployeeTechnologiesDto
    {
        public EmployeeTechnologiesDto()
        {
            this.Technologies = new List<string>();
        }
        public Guid Id { get; set; }
        public List<string> Technologies { get; set; }
    }

    
}
