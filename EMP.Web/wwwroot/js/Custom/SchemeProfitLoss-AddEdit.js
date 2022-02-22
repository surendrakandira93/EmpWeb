
(function ($) {
    function ShipmentAddEdit() {
        var $this = this, form;

        function initilizeForm() {
            Global.ModelHelper($("#modal-add-edit-schemeporfitloss"), function () {
                form = new Global.FormHelper($("#frm-add-SchemeProfitLoss").find("form"), {
                    updateTargetId: "validation-summary",
                    refreshGrid: false,
                    modelId: 'modal-add-edit-schemeporfitloss'
                }, function (result) {
                    if (result.isSuccess) {
                        if (result.data) {

                            $("#modal-add-edit-schemeporfitloss").modal('hide');

                            if (result.message)
                                Global.ToastrSuccess(result.message);
                            debugger;
                            empGroupChart.RefreshChart();
                        } else {

                            window.location.href = result.redirectUrl;
                        }
                    } else {

                        if (result.data == undefined) {
                            $("#validation-summary").html("<span>" + result + "</span>");
                        }
                        else {
                            $("#validation-summary").html("<span>" + result.message + "</span>");
                        }

                    }

                }, null);

                $("#KeyWord").selectize({
                    options: jsKeywordList,
                    delimiter: ",",
                    searchField: 'text',
                    persist: false,
                    create: function (input) {
                        return {
                            value: input,
                            text: input,
                        };
                    },
                });

            }, null);
        }

        $this.init = function () {
            initilizeForm();
            if (empGroupChart != null) {
                empGroupChart.init();
            }
        }
    }

    $(function () {
        var self = new ShipmentAddEdit();
        self.init();
    })
})(jQuery)