(function ($) {
    function EmpGroupView() {
        var $this = this, arr = new Array();

        function initilizeForm() {
            BindGrid();
            google.charts.load('current', { packages: ['corechart', 'line'] });
            google.charts.setOnLoadCallback(drawBasic);

            $("#btn_filter").on('click', function () {
                if ($("#fromdate").val() != "" && $("#todate").val() != "") {
                    BindGrid();
                } else {
                    alert("from and to date are required !");
                }
            });

        }

        function drawBasic() {
            var now = new Date();
            for (var d = new Date('2021-08-01'); d <= now; d.setDate(d.getDate() + 1)) {
                var subArr = new Array();
                subArr.push(new Date(d));
                subArr.push(getRandomNumberBetween());
                arr.push(subArr);
            }

            var data = new google.visualization.DataTable();
            data.addColumn('date', 'X');
            data.addColumn('number', 'Equity');
            data.addRows(arr);

            var options = {
                hAxis: {
                    title: 'Date'
                },
                vAxis: {
                    title: 'Popularity'
                }
            };

            var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

            chart.draw(data, options);
        }

        function BindGrid() {
            Global.ShowLoading();
            var $grid = $("#tansction_grid tbody");
            $grid.empty();

            var from = $("#fromdate").val(), to = $("#todate").val();

            $.ajax(`/EmployeeGroup/GetTransction?from=${from}&to=${to}`, {
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