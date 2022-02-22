
(function ($) {
    function ShipmentAdd() {
        var $this = this, form;

        function initilizeForm() {
            $(".shipment-action").on('click', function () {
                var dataId = $(this).data('id');
                var groupId = $(this).data('groupid');
                var message = $(this).data('message');
                if (dataId != undefined) {
                    if (confirm(message)) {
                        $.get(`/SchemeProfitLoss/DeleteById/${dataId}?groupId=${groupId}`, function (result) {
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