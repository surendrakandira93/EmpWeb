using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Dto
{
    public class DashboardSchemeDto
    {
        public DashboardSchemeDto()
        {
            this.Result = new List<DashboardItemsSchemeDto>();
        }
        public string Name { get; set; }
        public string Header { get; set; }
        public List<DashboardItemsSchemeDto> Result { get; set; }

    }

    public class DashboardItemsSchemeDto
    {
        public DashboardItemsSchemeDto()
        {
            this.History = new List<DashboardSchemeHistoryDto>();
        }
        public string Instrumen { get; set; }
        public double LPT { get; set; }
        public double LT { get; set; }
        public double Chg { get; set; }
        public List<DashboardSchemeHistoryDto> History { get; set; }
    }

    public class DashboardSchemeHistoryDto
    {
        public string Date { get; set; }
        public double Price { get; set; }
        public double Open { get; set; }
        public double High { get; set; }
        public double Low { get; set; }
        public double Chg { get; set; }
    }


    public class DashboardItemsScheme2Dto
    {
        public DateTime EntryTime { get; set; }
        public DateTime ExitTime { get; set; }
        public string Instrument { get; set; }
        public int Qty { get; set; }
        public double EntryPrice { get; set; }
        public double ExitPrice { get; set; }
        public double LTP { get; set; }
        public double PL { get; set; }
        public double Chg { get; set; }
        public double SL { get; set; }
        public double Trgt { get; set; }
    }

    public class DashboardScheme2Dto
    {
        public DashboardScheme2Dto()
        {
            this.Result = new List<DashboardItemsScheme2Dto>();
        }
        public string Name { get; set; }
        public string Header { get; set; }
        public List<DashboardItemsScheme2Dto> Result { get; set; }
    }
}
