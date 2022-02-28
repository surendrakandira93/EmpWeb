var empGroupChart = null;
(function ($) {
    function EmpGroupView() {
        var $this = this;
        var cal, calStartdate = new Date(2022, 0, 1), range = 12;

        function initilizeForm() {
            BindGrid();

            BindMonthlyBreaupGrid();

            initCalendar();

            google.charts.load('current', { packages: ['corechart', 'bar'] });

            //google.load('visualization', '1.0', { 'packages': ['corechart'] });
            google.setOnLoadCallback(drawChart);

            $("#btn_glo_filter").on('click', function () {

                Global_Search();

            });

            $("#btn_filter").on('click', function () {

                BindGrid();

            });

            $(".btn_equity").on('click', function () {
                $(".btn_equity").removeClass('active');
                $(this).addClass('active');
                DrawChartEquityChart($(this).data('typeid'));
            })

            $(".btn_loss_profit").on('click', function () {
                $(".btn_loss_profit").removeClass('active');
                $(this).addClass('active');
                DrawChartLossProfitChart($(this).data('typeid'));
            })

            BindSummary();

        }

        function drawChart() {

            DrawChartLossProfitChart(1);

            DrawChartEquityChart(1);

        }

        function DrawChartEquityChart(typeId) {

            var from = $("#from_date").val();
            var to = $("#to_date").val();

            var typeStr = "Daily";
            if (typeId == "2") {
                typeStr = "Weekly";
            } else if (typeId == "3") {
                typeStr = "Monthly";
            }
            var groupId = $("#hid_groupid").val();
            arr = new Array()
            $.get(`/employeegroup/GetChartData?typeId=${typeId}&groupId=${groupId}&fromDate=${from}&toDate=${to}`, function (result) {

                if (result.isSuccess && result.data.length > 0) {

                    for (var i = 0; i < result.data.length; i++) {
                        var subArr = new Array();
                        subArr.push(new Date(result.data[i].date));
                        subArr.push(result.data[i].aggregateSum);
                        arr.push(subArr);
                    }
                }

                var data = new google.visualization.DataTable();
                data.addColumn('date', 'X');
                data.addColumn('number', 'Equity');
                data.addRows(arr);

                var options1 = {
                    title: `Equity Chart ${typeStr}`,
                    hAxis: {
                        title: 'Date'
                    },
                    vAxis: {
                        title: 'Equity'
                    }
                };

                var chart1 = new google.visualization.LineChart(document.getElementById('chart_div'));
                chart1.draw(data, options1);
            })
        }

        function DrawChartLossProfitChart(typeId) {
            var from = $("#from_date").val();
            var to = $("#to_date").val();
            var typeStr = "Daily";
            if (typeId == "2") {
                typeStr = "Weekly";
            } else if (typeId == "3") {
                typeStr = "Monthly";
            }
            var groupId = $("#hid_groupid").val();
            var arrData2 = new Array();
            arrData2.push(["Month", "Profit", { role: 'style' }]);
            $.get(`/employeegroup/GetProfitLossChartData?typeId=${typeId}&groupId=${groupId}&fromDate=${from}&toDate=${to}`, function (result) {

                if (result.isSuccess && result.data.length > 0) {
                    for (var i = 0; i < result.data.length; i++) {
                        var subArr2 = new Array();
                        subArr2.push(new Date(result.data[i].date));
                        subArr2.push(result.data[i].dailyPnL);
                        if (result.data[i].dailyPnL < 0) {
                            subArr2.push('color: #dc3912');
                        } else {
                            subArr2.push('color: #109618');
                        }
                        arrData2.push(subArr2);
                    }

                }

                var data = new google.visualization.arrayToDataTable(arrData2);

                var options = {
                    title: `Loss & Profit Chart (${typeStr})`,
                    chartArea: { width: '100%' },
                    vAxis: {
                        title: 'Profit'
                    },
                    hAxis: {
                        title: 'Month'
                    }
                };


                var chart = new google.visualization.ColumnChart(document.getElementById('chart_bar_div'));
                chart.draw(data, options);
            })
        }

        function initCalendar() {
            var groupId = $("#hid_groupid").val();
            var parser = function (data) {
                var stats = {};
                for (var d in data) {
                    stats[data[d].date] = data[d].value;
                }
                return stats;
            };
            cal = new CalHeatMap();
            cal.init({
                itemSelector: "#calendar",
                start: calStartdate,
                domain: "month",
                //subDomain: "x_day",                
                cellSize: 8,
                range: range,
                weekStartOnMonday: true,
                domainGutter: 10,
                data: `/EmployeeGroup/GetCal_HeatmapData?groupId=${groupId}&fromDate={{d:start}}&toDate={{d:end}}`,
                afterLoadData: parser,
                //  subDomainTextFormat: "%d",
                domainLabelFormat: "%b-%Y",
                legendHorizontalPosition: "left",
                legendCellSize: 20,
                legend: [-2000, -1500, -1000, -500, 0, 500, 1000, 1500, 2000],
                displayLegend: true,
                considerMissingDataAsZero: false,
                // legendColors: ["rgb(255,0,0)", "rgb(0,255,0)"],
                legendColors: {
                    //    min: "rgb(255,0,0)",
                    //    max: "rgb(0,255,0)",
                    empty: "rgb(237,237,237)",
                },
                tooltip: true,
                cellLabel: {
                    empty: "Aucune données pour le {date}",
                    filled: `{count} {name} at {date}`
                }
            });
        }

        function Global_Search() {

            var from = $("#from_date").val();
            var to = $("#to_date").val();

            if (from != "" && to != "") {
                var typeIdChart = $(".btn_equity.active").data('typeid');
                var typeIdProftLoss = $(".btn_loss_profit.active").data('typeid');
                cal = cal.destroy();
                DrawChartLossProfitChart(typeIdProftLoss);
                DrawChartEquityChart(typeIdChart);
                BindMonthlyBreaupGrid();
                calStartdate = new Date(from);
                range = monthDiff(new Date(from), new Date(to));
                initCalendar();
                BindSummary();
            } else {
                alert('Please select from and to date');
            }
        }

        function BindGrid() {
            Global.ShowLoading();
            var $grid = $("#tansction_grid tbody");
            $grid.empty();

            var from = $("#fromdate").val();

            $.ajax(`/EmployeeGroup/GetTransction?from=${from}`, {
                type: "GET",
                success: function (result) {
                    if (result.data.length > 0) {
                        for (var i = 0; i < result.data.length; i++) {
                            var pro = result.data[i];
                            var $tr = '<tr><td>' + pro.product + '</td><td>' + moment(pro.entryDate).format("DD/MM/YYYY") + '</td><td>' + moment(pro.existDateh).format("DD/MM/YYYY") + '</td><td>' + pro.qty + '</td><td>' + Global.kFormatter(pro.price) + '</td></tr>';
                            $grid.append($tr);
                        }
                    }

                    Global.HideLoading();
                }
            });
        }

        function BindSummary() {
            Global.ShowLoading();

            var from = $("#from_date").val();
            var to = $("#to_date").val();
            var groupId = $("#hid_groupid").val();
            $.ajax(`/EmployeeGroup/GetPLSummary?groupId=${groupId}&fromDate=${from}&toDate=${to}`, {
                type: "GET",
                success: function (result) {
                    if (result.realisedPL > 0) {
                        $("#pl").text("+" + Global.kFormatter(result.realisedPL));
                        $("#pl").css('color', '#1eb182');
                    } else if (result.realisedPL == 0) {
                        $("#pl").text(Global.kFormatter(result.realisedPL));
                        $("#pl").css('color', '#1eb182');
                    } else {
                        $("#pl").text("- " + Global.kFormatter(result.realisedPL));
                        $("#pl").css('color', '#fd033c');
                    }

                    if (result.netRealisedPL > 0) {
                        $("#npl").text("+ " + Global.kFormatter(result.netRealisedPL));
                        $("#npl").css('color', '#1eb182');
                    } else if (result.netRealisedPL == 0) {
                        $("#npl").text(Global.kFormatter(result.netRealisedPL));
                        $("#npl").css('color', '#1eb182');
                    } else {
                        $("#npl").text(Global.kFormatter(result.netRealisedPL));
                        $("#npl").css('color', '#fd033c');
                    }
                    $("#cpl").text(Global.kFormatter(result.charge));
                    $("#upl").text(Global.kFormatter(result.unRealisedPL));
                    Global.HideLoading();
                }
            });
        }

        function BindMonthlyBreaupGrid() {

            var from = $("#from_date").val();
            var to = $("#to_date").val();

            var $grid = $("#monthly_grid tbody");
            $grid.empty();
            var groupId = $("#hid_groupid").val();

            $.ajax(`/EmployeeGroup/GetMonthlyBreaupData?groupId=${groupId}&fromDate=${from}&toDate=${to}`, {
                type: "GET",
                success: function (result) {
                    if (result.data.length > 0) {
                        for (var i = 0; i < result.data.length; i++) {
                            var pro = result.data[i];
                            var $tr = '<tr><td>' + pro.year + '</td>';
                            for (var j = 0; j < pro.monthly.length; j++) {
                                $tr += `<td style="background-color:${pro.monthly[j].dailyPnL < 0 ? 'antiquewhite' : 'darkseagreen'};">` + Global.kFormatter(pro.monthly[j].dailyPnL) + '</td>';
                            }
                            $tr += '<td style="color:green;">' + Global.kFormatter(pro.total) + '</td></tr>';

                            $grid.append($tr);
                        }
                    }


                }
            });
        }

        function monthDiff(d1, d2) {
            var months;
            months = (d2.getFullYear() - d1.getFullYear()) * 12;
            months -= d1.getMonth();
            months += d2.getMonth();
            return (months <= 0 ? 0 : months) + 1;
        }

        $this.init = function () {

            initilizeForm();
        }
        $this.RefreshChart = function () {

            var typeIdChart = $(".btn_equity.active").data('typeid');
            var typeIdProftLoss = $(".btn_loss_profit.active").data('typeid');

            DrawChartLossProfitChart(typeIdProftLoss);
            DrawChartEquityChart(typeIdChart);
            BindMonthlyBreaupGrid();
            initCalendar();
            BindSummary();
        }

        function getRandomNumberBetween() {
            var min = 0, max = 60000;
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
    }

    $(function () {
        //var self = new EmpGroupView();
        //self.init();
        empGroupChart = new EmpGroupView();
        // empGroupChart.init();
    })
})(jQuery)