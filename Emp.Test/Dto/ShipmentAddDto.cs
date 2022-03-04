using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Emp.Test.Dto
{
    public class ShipmentAddDto
    {
        public Guid? Id { get; set; }
        public string LoginId { get; set; }
        public int Broker { get; set; }
        public string Platform { get; set; }
        public string Password { get; set; }
        public string Password2 { get; set; }
        public Guid? EmpId { get; set; }
        public string APIKey { get; set; }
    }

    public class ShipmentDto
    {
        public Guid Id { get; set; }
        public string LoginId { get; set; }
        public int Broker { get; set; }
        public string Platform { get; set; }
        public string Password { get; set; }
        public string Password2 { get; set; }
        public DateTime Expiry { get; set; }
        public string APIKey { get; set; }
        public bool IsLive { get; set; }
    }
}
