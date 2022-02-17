(function ($) {
    function EmpGroupView() {
        var $this = this, arr = new Array();

        function initilizeForm() {
            BindGrid();
            google.charts.load('current', { packages: ['corechart', 'line'] });            

            google.load('visualization', '1.0', { 'packages': ['corechart'] });
            google.setOnLoadCallback(drawChart);


            $("#btn_filter").on('click', function () {

                BindGrid();

            });

        }

        function drawChart() {


            var arrData2 = new Array();
            arrData2.push(["Month", "Profit", { role: 'style' }]);
            $.get('/employeegroup/GetChartData', function (result) {
                if (result.isSuccess && result.data.result.length > 0) {
                    for (var i = 0; i < result.data.result.length; i++) {
                        var subArr = new Array();                       
                        subArr.push(new Date(result.data.result[i].date));
                        subArr.push(result.data.result[i].dailyPnL);
                        arr.push(subArr);
                    }

                    var data = new google.visualization.DataTable();
                    data.addColumn('date', 'X');
                    data.addColumn('number', 'Equity');
                    data.addRows(arr);
                    
                    var options1 = {
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

                if (result.isSuccess && result.data.groupResult.length > 0) {
                    for (var i = 0; i < result.data.groupResult.length; i++) {
                        var subArr2 = new Array();
                        subArr2.push(result.data.groupResult[i].month);
                        subArr2.push(result.data.groupResult[i].dailyPnL);
                        if (result.data.groupResult[i].dailyPnL < 0) {
                            subArr2.push('color: #dc3912');
                        } else {
                            subArr2.push('color: #109618');
                        }
                        arrData2.push(subArr2);
                    }

                    var data2 = new google.visualization.arrayToDataTable(arrData2);

                    var options2 = {
                        title: 'Loss & Profit Chart',
                        chartArea: { width: '100%' },
                        vAxis: {
                            title: 'Profit'
                        },
                        hAxis: {
                            title: 'Month'
                        }
                    };


                    var chart2 = new google.visualization.ColumnChart(document.getElementById('chart_bar_div'));
                    chart2.draw(data2, options2);

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
                            var $tr = '<tr><td>' + pro.product + '</td><td>' + moment(pro.entryDate).format("DD/MM/YYYY") + '</td><td>' + moment(pro.existDateh).format("DD/MM/YYYY") + '</td><td>' +pro.qty + '</td><td>' + pro.price + '</td></tr>';
                            $grid.append($tr);
                        }
                    }

                    Global.HideLoading();
                }
            });
        }

        $this.init = function () {

            initilizeForm();
        }

        function getRandomNumberBetween() {
            var min = 0, max = 60000;
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
    }

    $(function () {
        var self = new EmpGroupView();
        self.init();
    })
})(jQuery)