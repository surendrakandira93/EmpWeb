using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Emp.Test.Dto
{
    public class SchemeProfitLossDto
    {
       
        public Guid? Id { get; set; }
        public Guid GroupId { get; set; }
        public bool IsRefresh { get; set; }
        public DateTime? Date { get; set; }
        public string KeyWord { get; set; }
        public double ProfitLoss { get; set; }
        public double Expense { get; set; }
        public string Comments { get; set; }
        public bool IsNoTradeDay { get; set; }
        public bool IsHoliday { get; set; }
    }
}
