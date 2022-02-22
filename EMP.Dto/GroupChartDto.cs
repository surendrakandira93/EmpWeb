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

    public class GroupMontlyBreakupDto
    {
        public GroupMontlyBreakupDto()
        {
            Monthly = new List<GroupChartDto>();
        }
        public int Year { get; set; }
        public List<GroupChartDto> Monthly { get; set; }
        public double Total { get; set; }
    }
}
