using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Dto
{
    public class EmployeeGroupListDto
    {
        public EmployeeGroupListDto()
        {
            this.Employees = new List<EmployeeDto>();
        }
        public string Name { get; set; }
        public string IconImg { get; set; }
        public string Description { get; set; }
        public Guid? Id { get; set; }
        public bool IsActive { get; set; }
        public List<EmployeeDto> Employees { get; set; }
    }

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

    public class EmployeeGroupGridlDto
    {
        public EmployeeGroupGridlDto()
        {
            this.List = new List<EmployeeGroupListDto>();
        }

        public List<EmployeeGroupListDto> List { get; set; }

        public int TotalItems { get; set; }

        public List<PageIng> PageNos { get; set; }
    }

    public class PageIng
    {
        public int PageNo { get; set; }
        public bool IsCurrentPage { get; set; }
    }
}
