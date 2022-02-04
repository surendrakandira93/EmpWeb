using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Dto
{
    public class EmployeeProfileDto
    {
        public EmployeeProfileDto()
        {
            this.Technologies = new List<string>();
            this.Subscription = new List<EmployeeGroupProfileDto>();
            this.Pending = new List<EmployeeGroupProfileDto>();
            this.Invited = new List<EmployeeGroupProfileDto>();
            this.Accepted = new List<EmployeeGroupProfileDto>();
            this.Rejected = new List<EmployeeGroupProfileDto>();
            this.Self = new List<EmployeeGroupProfileDto>();
            this.ForApproval = new List<EmployeeGroupForApprovalListDto>();
        }
        public Guid Id { get; set; }
        public string Email { get; set; }

        public string Name { get; set; }
        public string City { get; set; }
        public DateTime? DateOfBrith { get; set; }
        public string Gender { get; set; }
        public List<string> Technologies { get; set; }
        public string ImageURL { get; set; }
        public string LinkedinURL { get; set; }
        public int Group { get; set; }
        public int Member { get; set; }
        public List<EmployeeGroupProfileDto> Subscription { get; set; }
        public List<EmployeeGroupProfileDto> Pending { get; set; }
        public List<EmployeeGroupProfileDto> Invited { get; set; }
        public List<EmployeeGroupProfileDto> Accepted { get; set; }
        public List<EmployeeGroupProfileDto> Rejected { get; set; }
        public List<EmployeeGroupProfileDto> Self { get; set; }
        public List<EmployeeGroupForApprovalListDto> ForApproval { get; set; }
    }

    public class EmployeeGroupProfileDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string IconImg { get; set; }
        public string Description { get; set; }
    }
    public class EmployeeGroupForApprovalListDto
    {
        public EmployeeGroupForApprovalListDto()
        {
            this.Employees = new List<EmployeeGroupForApprovalEmpListDto>();
        }
        public string Name { get; set; }
        public string IconImg { get; set; }
        public string Description { get; set; }
        public Guid Id { get; set; }
        public EmployeeGroupForApprovalEmpListDto Admin { get; set; }
        public List<EmployeeGroupForApprovalEmpListDto> Employees { get; set; }
    }

    public class EmployeeGroupForApprovalEmpListDto
    {
        public EmployeeGroupForApprovalEmpListDto()
        {
            this.Technologies = new List<string>();
        }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ImageURL { get; set; }
        public int InviteType { get; set; }
        public List<string> Technologies { get; set; }
    }
}
