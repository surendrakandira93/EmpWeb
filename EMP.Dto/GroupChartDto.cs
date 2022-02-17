using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Dto
{
    public class GroupChartDto
    {
        public double DailyPnL { get; set; }
        public DateTime Date { get; set; }
        public string Day { get; set; }
        public double AggregateSum { get; set; }
    }
}
