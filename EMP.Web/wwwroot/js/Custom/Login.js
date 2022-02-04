(function ($) {
    function AccountLogin() {
        var $this = this, form, form1;



        function initilizeModel() {


            form = new Global.FormHelper($("#account_login"), { updateTargetId: "validation-summary" }, function (result) {

                if (result.isSuccess) {
                    window.location.href = result.redirectUrl;
                } else {
                    form.find("#validation-summary").html(result);
                }
            }, null);

            $('#IsPersistent').click(function () {
                $(this).val($(this).is(':checked'));
            });


            form1 = new Global.FormHelper($("#account_signup"), { updateTargetId: "validation-summary" }, function (result) {

                if (result.isSuccess) {
                    window.location.href = result.redirectUrl;
                } else {
                    form1.find("#validation-summary").html(result);
                }
            }, null);

            form1.find('#Password').on('change', function () {
                PasswordMatch();
            });

            form1.find('#ConfirmPassword').on('change', function () {
                PasswordMatch();
            });
            

        }

        function PasswordMatch() {
            var password = $('#Password').val();
            var confirmPass = $('#ConfirmPassword').val();
            debugger;
            if (password != confirmPass) {
                $("#ConfirmPassword_error").html('Confirm Password not matched with Password');
                $("#ConfirmPassword_error").show();
            } else {
                $("#ConfirmPassword_error").hide();
            }
        }

        $this.init = function () {

            initilizeModel();
        }
    }

    $(function () {
        var self = new AccountLogin();
        self.init();
    })
})(jQuery)