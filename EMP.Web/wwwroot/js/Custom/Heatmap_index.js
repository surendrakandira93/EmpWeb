(function ($) {
    function HeapMapIndex() {
        var $this = this, form;
        var cal;

        function initilizeForm() {
            initCalendar(new Date(2022, 0, 1));

           
            $(".year-calendar").on("click", function (event) {
                var year = parseInt($(this).data('year'));
                cal = cal.destroy();
                initCalendar(new Date(year, 0, 1));
            });
        }

        function initCalendar(date) {
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
                start: date,
                domain: "month",
                subDomain: "x_day",
                cellSize: 20,
                range: 12,
                displayLegend: false,
                weekStartOnMonday: false,
                data: "/heatmap/GetData?start={{d:start}}&end={{d:end}}",
                afterLoadData: parser,
                subDomainTextFormat: "%d",
                label: {
                    position: "top",
                    rotate: "",
                    offset: {
                        x: 15,
                        y: 10
                    }
                },
                legend: [-1999, 0, 1999, 4000],
                tooltip: true
            });
        }

        $this.init = function () {         
            initilizeForm();
        }
    }

    $(function () {
        var self = new HeapMapIndex();
        self.init();
    })
})(jQuery)