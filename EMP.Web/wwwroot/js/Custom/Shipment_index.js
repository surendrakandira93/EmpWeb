
(function ($) {
    function ShipmentIndex() {
        var $this = this;

        function initilizeForm() {
            $(".shipment-action").on('click', function () {
                var dataId = $(this).data('id');
                var action = $(this).data('action');
                var message = $(this).data('message');
                if (dataId != undefined) {
                    if (confirm(message)) {
                        $.get(`/Shipment/${action}/${dataId}`, function (result) {
                            window.location.href = result.redirectUrl;
                        });
                    }

                } else {
                    alert('Select any record in trading account grid');
                }
            });

            $("input:radio[name=radio_shipment]").click(function () {

                if ($(this).is(':checked')) {                    
                    $(".shipment-action").attr('data-id', $(this).val());
                } else {
                    $(".shipment-action").removeAttr('data-id');
                }
            });
        }

        $this.init = function () {
            initilizeForm();
        }
    }

    $(function () {
        var self = new ShipmentIndex();
        self.init();
    })
})(jQuery)