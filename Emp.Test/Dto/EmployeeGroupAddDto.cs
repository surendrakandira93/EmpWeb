using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Emp.Test.Dto
{
    public class EmployeeGroupAddDto
    {
        public EmployeeGroupAddDto()
        {
            this.EmployeeIds = new List<Guid>();
        }
        public Guid AdminId { get; set; }
        public string Name { get; set; }
        public string IconImg { get; set; }
        public string Description { get; set; }
        public Guid? Id { get; set; }
        public bool IsActive { get; set; }
        public List<Guid> EmployeeIds { get; set; }
    }
}
