
(function ($) {
    function ShipmentAdd() {
        var $this = this, form;

        function initilizeForm() {
            form = new Global.FormHelper($("#frm-add-shipment"),
                { updateTargetId: "validation-summary" }, null, null);

            $(".shipment-action").on('click', function () {
                var dataId = $(this).data('id');
                var action = $(this).data('action');
                if (dataId != undefined) {
                    if (confirm('Are you sure want to delete !')) {
                        $.get(`/Shipment/${action}/${dataId}`, function (result) {
                            window.location.href = result.redirectUrl;
                        });
                    }

                } else {
                    alert('Select any record in trading account grid');
                }
            });
        }

        $this.init = function () {            
            initilizeForm();
        }
    }

    $(function () {
        var self = new ShipmentAdd();
        self.init();
    })
})(jQuery)