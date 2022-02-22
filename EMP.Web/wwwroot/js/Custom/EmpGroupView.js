var empGroupChart = null;
(function ($) {
    function EmpGroupView() {
        var $this = this;

        function initilizeForm() {
            BindGrid();
            BindMonthlyBreaupGrid();
            google.charts.load('current', { packages: ['corechart', 'bar'] });

            //google.load('visualization', '1.0', { 'packages': ['corechart'] });
            google.setOnLoadCallback(drawChart);


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


        }



        function drawChart() {

            DrawChartLossProfitChart(1);

            DrawChartEquityChart(1);

        }

        function DrawChartEquityChart(typeId) {

            var typeStr = "Daily";
            if (typeId == "2") {
                typeStr = "Weekly";
            } else if (typeId == "3") {
                typeStr = "Monthly";
            }
            var groupId = $("#hid_groupid").val();
            arr = new Array()
            $.get(`/employeegroup/GetChartData?typeId=${typeId}&groupId=${groupId}`, function (result) {

                if (result.isSuccess && result.data.length > 0) {

                    for (var i = 0; i < result.data.length; i++) {
                        var subArr = new Array();
                        subArr.push(new Date(result.data[i].date));
                        subArr.push(result.data[i].aggregateSum);
                        arr.push(subArr);
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
                }
            })
        }

        function DrawChartLossProfitChart(typeId) {

            var typeStr = "Daily";
            if (typeId == "2") {
                typeStr = "Weekly";
            } else if (typeId == "3") {
                typeStr = "Monthly";
            }
            var groupId = $("#hid_groupid").val();
            var arrData2 = new Array();
            arrData2.push(["Month", "Profit", { role: 'style' }]);
            $.get(`/employeegroup/GetProfitLossChartData?typeId=${typeId}&groupId=${groupId}`, function (result) {

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

                }
            })
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

        function BindMonthlyBreaupGrid() {

            var $grid = $("#monthly_grid tbody");
            $grid.empty();
            var groupId = $("#hid_groupid").val();

            $.ajax(`/EmployeeGroup/GetMonthlyBreaupData?groupId=${groupId}`, {
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

        $this.init = function () {

            initilizeForm();
        }
        $this.RefreshChart = function () {
            
            var typeIdChart = $(".btn_equity.active").data('typeid');
            var typeIdProftLoss = $(".btn_loss_profit.active").data('typeid');

            DrawChartLossProfitChart(typeIdProftLoss);
            DrawChartEquityChart(typeIdChart);
            BindMonthlyBreaupGrid();
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