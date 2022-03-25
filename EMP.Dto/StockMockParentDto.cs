using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Dto
{
    public class StockMockParentDto
    {
        public StockMockParentDto()
        {
            this.SelectedPosition = new List<StockMockPositionDto>();
            Id = Guid.NewGuid();
            this.SelectedTrb = new EntryTime();
            this.SelectedEntryTime = new EntryTime();
            this.SelectedExitTime = new EntryTime();
        }
        public Guid Id { get; set; }
        public string SquareOff { get; set; }

        public List<StockMockPositionDto> SelectedPosition { get; set; }
        public EntryTime SelectedEntryTime { get; set; }
        public EntryTime SelectedExitTime { get; set; }
        // 
        public EntryTime SelectedTrb { get; set; }
        public bool IsTRB { get; set; }
        public bool IsReEntry { get; set; }
        public bool IsWaitAndTrade { get; set; }
        public bool IsCTC { get; set; }
        public bool IsAddTargetProfit { get; set; }
        public string TargetProfitMTMType { get; set; }
        public int TargetProfitMTMPrice { get; set; }
        public bool IsAddStopLoss { get; set; }
        public string StopLossMTMType { get; set; }
        public int StopLossMTMPrice { get; set; }
        public bool IsAddTrailingTargetProfit { get; set; }
        public int SelectedTrailProfitTypeIndex { get; set; }
        public int TrailTriggerPrice { get; set; }
        public int TrailFirstFixedProfit { get; set; }
        public int TrailMTMX { get; set; }
        public int TrailMTMY { get; set; }
        public int EntryDay { get; set; }
        public int ExitDay { get; set; }
        public string SelectedStrategy { get; set; }


    }

    public class EntryTime
    {
        public int H { get; set; }
        public int M { get; set; }
    }

    public class TargetProfit
    {
        public bool Status { get; set; }
        public string Type { get; set; }
        public int Value { get; set; }
    }

    public class TrailingStopLoss
    {
        public bool Status { get; set; }
        public string Type { get; set; }
        public int XValue { get; set; }
        public int YValue { get; set; }
    }

    public class StockMockPositionDto
    {
        public StockMockPositionDto()
        {
            Id = Guid.NewGuid();
        }
        public Guid Id { get; set; }
        public bool IsChecked { get; set; }
        public string Stock { get; set; }
        public string EntryType { get; set; }
        public string Segment { get; set; }
        public string OptionType { get; set; }
        public string ActionType { get; set; }
        public int StrikePrice { get; set; }
        public int ClosestPremium { get; set; }
        public int TotalLot { get; set; }
        public string ExpiryType { get; set; }
        public bool IsWaitAndTrade { get; set; }
        public TargetProfit TargetProfit { get; set; }
        public TargetProfit StopLoss { get; set; }
        public TrailingStopLoss TrailingStopLoss { get; set; }
        public TargetProfit EntryWait { get; set; }
        public EntryTime Trb { get; set; }
        public TargetProfit ReEntry { get; set; }
        public int TrailMTMY { get; set; }
        public int EntryDay { get; set; }
        public int ExitDay { get; set; }


    }


}
