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
                //subDomain: "x_day",                
                cellSize: 13,
                range: 12,
                weekStartOnMonday: true,
                domainGutter: 10,
                data: "/heatmap/GetData?start={{d:start}}&end={{d:end}}",
                afterLoadData: parser,
                //  subDomainTextFormat: "%d",
                domainLabelFormat: "%b-%Y",
                legendHorizontalPosition: "left",
                legendCellSize: 20,
                legend: [-2000,-1500,-1000,-500,0, 500,1000,1500,2000],
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

        $this.init = function () {
            initilizeForm();
        }
    }

    $(function () {
        var self = new HeapMapIndex();
        self.init();
    })
})(jQuery)