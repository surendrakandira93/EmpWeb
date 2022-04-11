using EMP.Dto;
using EMP.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMP.Web.Controllers
{
    public class SMKController : Controller
    {
        private readonly IFileService service;
        public SMKController(IFileService _service)
        {
            this.service = _service;
        }
        public IActionResult Index()
        {
            string qry = "index";
            return View(qry);
        }

        public IActionResult Index1()
        {
            return View();
        }

        public IActionResult Share(string qry)
        {
            return View("index", qry);
        }

        public IActionResult RunningC(QuryStringDto qry)
        {
            var response = new StockMockPositionFormDto();

            var et = qry.et;
            var _et = et.Split(",");
            var _entryTime = _et[0].Split(":");
            var _exitTime = _et[1].Split(":");

            response.SelectedEntryTime = new EntryTime() { H = int.Parse(_entryTime[0]), M = int.Parse(_entryTime[1]) };
            response.SelectedExitTime = new EntryTime() { H = int.Parse(_exitTime[0]), M = int.Parse(_exitTime[1]) };

            if (!string.IsNullOrEmpty(qry.tpm) || !string.IsNullOrEmpty(qry.tp))
            {

                response.IsAddTargetProfit = true;
                if (!string.IsNullOrEmpty(qry.tpm))
                {
                    response.TargetProfitMTMType = "premium";
                    response.TargetProfitMTMPrice = int.Parse(qry.tpm);
                }
                else
                {
                    response.TargetProfitMTMType = "amount";
                    response.TargetProfitMTMPrice = int.Parse(qry.tp);
                }
            }

            if (!string.IsNullOrEmpty(qry.slpm) || !string.IsNullOrEmpty(qry.sl))
            {

                response.IsAddStopLoss = true;
                if (!string.IsNullOrEmpty(qry.slpm))
                {
                    response.StopLossMTMType = "premium";
                    response.StopLossMTMPrice = int.Parse(qry.slpm);
                }
                else
                {
                    response.StopLossMTMType = "amount";
                    response.StopLossMTMPrice = int.Parse(qry.sl);
                }
                response.StopLossMTMPrice = response.StopLossMTMPrice < 0 ? response.StopLossMTMPrice * -1 : response.StopLossMTMPrice;
            }


            if (!string.IsNullOrEmpty(qry.ttp))
            {

                var ttpArr = qry.ttp.Split(',');
                response.IsAddTrailingTargetProfit = true;
                response.SelectedTrailProfitTypeIndex = int.Parse(ttpArr[0]);
                response.TrailTriggerPrice = int.Parse(ttpArr[1]);
                response.TrailFirstFixedProfit = int.Parse(ttpArr[2]);
                response.TrailMTMX = int.Parse(ttpArr[3]);
                response.TrailMTMY = int.Parse(ttpArr[4]);
            }

            response.SquareOff = qry.so;

            if (!string.IsNullOrEmpty(qry.s))
            {
                response.SelectedStrategy = qry.s.Split('_')[0];
            }

            if (!string.IsNullOrEmpty(qry.ed))
            {
                var edArr = qry.ed.Split(',');
                response.EntryDay = int.Parse(edArr[0]);
                response.ExitDay = int.Parse(edArr[1]);
            }
            var i = qry.p.Split(",");
            foreach (var e in i)
            {
                string s, seg, opt = "", act = "", ent, closestPremium, tagpr, stopl, trstopl, ext, waitAndTrade = "", reentry = "", rtbrow = "";
                int tl, sp = 0;
                dynamic d;

                var v = e.Split("::");

                s = v[0];
                ext = v[4];
                stopl = v[2];
                tagpr = v[3];
                trstopl = v[5];
                if (v.Length > 6)
                    waitAndTrade = v[6];
                if (v.Length > 8)
                    rtbrow = v[8];
                if (v.Length > 9)
                    reentry = v[9];
                s = "BN" == v[0] ? "banknifty" : "N" == s ? "nifty" : "finnifty";
                // (seg = "F" == v[2] ? "futures" : "options";
                ext = "CW" == ext ? "weekly" : "monthly";
                opt = "CE" == opt ? "call" : "sell";
                act = "S" == act ? "sell" : "buy";


                if (!string.IsNullOrEmpty(rtbrow) && rtbrow != "null")
                {

                    var _rtbrow = rtbrow.Split('_');
                    var _rtbrowTime = _rtbrow[1].Split(':');
                    response.SelectedTrb = new EntryTime() { H = int.Parse(_rtbrowTime[0]), M = int.Parse(_rtbrowTime[1]) };

                    response.IsTRB = true;
                }


                if ("F" == v[1].Split("_")[0])
                {

                    var w = v[1].Split("_");
                    act = "B" == w[1] ? "buy" : "sell";
                    tl = int.Parse(w[2]) / GetlotSize(s);
                    seg = "futures";
                    ent = "atm";
                    d = new
                    {
                        stock = s,
                        segment = "futures",
                        actionType = "B" == w[1] ? "buy" : "sell",
                        totalLot = tl
                    };
                }
                else
                {
                    ent = v[1].Split("_")[0].StartsWith("CP") ? "cp" : "atm";
                    seg = "options";
                    var S = v[1].Split("_");
                    sp = int.Parse(ent == "cp" ? S[0].Split("CP")[1] : S[0]);
                    act = "S" == S[1] ? "sell" : "buy";
                    opt = "CE" == S[2] ? "call" : "put";
                    tl = int.Parse(S[3]) / GetlotSize(s);
                }


                d = new
                {
                    stock = s,
                    segment = seg,
                    optionType = opt,
                    actionType = act,
                    strikePrice = sp,
                    totalLot = tl,
                    closestPremium = sp,
                };


                TargetProfit x = new TargetProfit { Status = false, Type = "slp", };
                if (!string.IsNullOrEmpty(tagpr) && tagpr != "null")
                {
                    var P = tagpr.Split("_");
                    string T = P[0], D = P[1];
                    if (P.Count() > 1)
                    {
                        x = new TargetProfit() { Status = true, Type = T.ToLower(), Value = int.Parse(D) };

                    }
                }

                TrailingStopLoss A = new TrailingStopLoss { Status = false, Type = "tslp" };
                if (!string.IsNullOrEmpty(trstopl) && trstopl != "null")
                {
                    var C = trstopl.Split("_");
                    string N = C[0], R = C[1], E = C[2];
                    if (C.Count() > 1)
                    {
                        response.IsCTC = true;
                        A = new TrailingStopLoss { Status = true, Type = N.ToLower(), XValue = int.Parse(R), YValue = int.Parse(E) };
                    }
                }

                TargetProfit M = new TargetProfit { Status = false, Type = "slp", };
                if (!string.IsNullOrEmpty(stopl) && stopl != "null")
                {
                    var I = stopl.Split("_");
                    string O = I[0], B = I[1];
                    if (I.Count() > 1)
                    {
                        M = new TargetProfit { Status = true, Type = O.ToLower(), Value = int.Parse(B) };
                    }
                }


                TargetProfit F = new TargetProfit { Status = false, Type = "wp_+", };
                if (!string.IsNullOrEmpty(waitAndTrade) && "null" != waitAndTrade.ToLower())
                {
                    response.IsWaitAndTrade = true;
                    var j = waitAndTrade.Split("_");
                    string q = j[0], W = j[1];
                    int val = int.Parse(W);
                    if (q.ToLower() == "wp")
                    {
                        q = val >= 0 ? "wp_+" : "wp_-";
                        val = val < 0 ? val * -1 : val;
                    }
                    else
                    {
                        q = val >= 0 ? "wpn_+" : "wpn_-";
                    }
                    F = new TargetProfit { Status = true, Type = q, Value = val };
                }


                TargetProfit U = new TargetProfit { Status = false, Value = 1 };
                if (!string.IsNullOrEmpty(reentry) && "null" != reentry.ToLower())
                {
                    U = new TargetProfit { Status = true, Value = int.Parse(reentry.Split('_')[1]) };
                    response.IsReEntry = true;
                }

                StockMockPositionDto newselectedPosition = new StockMockPositionDto()
                {
                    IsChecked = true,
                    EntryType = ent,
                    Stock = d.stock,
                    Segment = d.segment,
                    OptionType = d.optionType,
                    ActionType = d.actionType,
                    StrikePrice = d.strikePrice,
                    ClosestPremium = d.closestPremium,
                    TotalLot = d.totalLot,
                    ExpiryType = ext,
                    IsWaitAndTrade = false,
                    TargetProfit = x,
                    StopLoss = M,
                    TrailingStopLoss = A,
                    EntryWait = F,
                    Trb = new EntryTime(),
                    ReEntry = U,
                };

                response.SelectedPosition.Add(newselectedPosition);
            }

            return View(response);
        }

        public async Task<IActionResult> RunningById(string id)
        {
            StockMockPositionFormDto model = new StockMockPositionFormDto();
            var response = await service.GetByKeyAsync<ResponseDto<FileDto>>(id);
            if (response.IsSuccess && !string.IsNullOrEmpty(response.Result.Value))
            {
                model = JsonConvert.DeserializeObject<StockMockPositionFormDto>(response.Result.Value);
            }
            return View("RunningC", model);
        }

        [HttpPost]
        public async Task<IActionResult> RunningC(StockMockParentDto model, IFormCollection fc)
        {
            await service.CreateUpdateAsync<ResponseDto<string>>(new FileDto() { Key = model.Id.ToString(), Value = JsonConvert.SerializeObject(model) });
            return RedirectToAction("SavedSMK");
        }


        public async Task<IActionResult> SavedSMK()
        {
            var response = await service.GetAllAsync<ResponseDto<List<FileDto>>>();
            return View(response.Result);
        }
        private int GetlotSize(string stock)
        {
            switch (stock)
            {
                case "nifty":
                    return 75;
                case "banknifty":
                    return 20;
                case "finnifty":
                    return 40;
            }
            return 0;
        }
    }
}
