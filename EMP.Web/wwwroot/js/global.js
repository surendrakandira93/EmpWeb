(function ($) {
    function GlobalSetting() {
        var $this = this;

        $this.init = function () {

            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-bottom-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
        }
    }

    $(function () {
        var self = new GlobalSetting();
        self.init();
    })
})(jQuery)

/*global window, $*/
var Global = {};

Global.FormHelper = function (formElement, options, onSucccess, onError) {

    //"use strict";
    var settings = {};
    settings = $.extend({}, settings, options);
    $.validator.unobtrusive.parse(formElement);
    formElement.validate(settings.validateSettings);
    formElement.submit(function (e) {
        var submitBtn = formElement.find(':submit');
        //var formdata = new FormData();
        if (formElement.validate().valid()) {
            Global.ShowLoading();

            $.ajax(formElement.attr("action"), {
                type: "POST",
                data: formElement.serializeArray(),
                beforeSend: function (xhr) {
                    $(':input[type="submit"]').prop('disabled', true);
                },
                success: function (result) {
                    if (onSucccess === null || onSucccess === undefined) {
                        if (result.isSuccess) {
                            if (settings.refreshGrid) {
                                if (settings.modelId) {
                                    $("#" + settings.modelId).modal('hide');
                                }
                                if (result.message)
                                    Global.ToastrSuccess(result.message);
                                if ($('[data-table="grid"]').length >= 1) {
                                    $('[data-table="grid"]').DataTable().ajax.reload();
                                }
                            } else {

                                window.location.href = result.redirectUrl;
                            }
                        } else {

                            if (settings.updateTargetId) {
                                if (result.data == undefined) {
                                    formElement.find("#" + settings.updateTargetId).html("<span>" + result + "</span>");
                                }
                                else {
                                    formElement.find("#" + settings.updateTargetId).html("<span>" + result.message + "</span>");
                                }
                            }
                        }
                    } else {

                        onSucccess(result);
                    }
                },
                error: function (jqXHR, status, error) {

                    if (onError !== null && onError !== undefined) {
                        onError(jqXHR, status, error);
                    } else {

                        var $div = $("#validation-summary");
                        $('<div/>', {
                            'class': 'validation-summary-errors',
                            'data-valmsg-summary': 'true',
                            'html': function () {
                                $('<ul/>', {
                                    'html': function () {
                                        $('<li/>', {
                                            'html': jqXHR.responseJSON.message
                                        }).appendTo(this);

                                        //$('<li/>', {
                                        //    'html': jqXHR.responseJSON.data
                                        //}).appendTo(this);
                                    }
                                }).appendTo(this);
                            }
                        }).appendTo($div);

                    }
                    Global.HideLoading();
                    $(':input[type="submit"]').prop('disabled', false);
                }, complete: function () {
                    Global.HideLoading();
                    $(':input[type="submit"]').prop('disabled', false);
                }
            });
        }
        e.preventDefault();
    });

    return formElement;
};

Global.UpdateFormdata = function (action, formdata, options, onSucccess, onError, onComplete) {
    "use strict";
    var settings = {};

    settings = $.extend({}, settings, options);
    $.ajax(action, {
        type: "POST",
        data: formdata,
        contentType: false,
        processData: false,
        beforeSend: function () {
            if (settings.loadingElementId != null || settings.loadingElementId != undefined) {
                $("#" + settings.loadingElementId).show();

            }
        },
        success: function (result) {
            if (onSucccess === null || onSucccess === undefined) {
                if (result.isSuccess) {
                    $(window).unbind('beforeunload');
                    if (settings.refreshGrid) {
                        if (settings.modelId) {
                            $("#" + settings.modelId).modal('hide');
                        }
                        if (result.message)
                            Global.ToastrSuccess(result.message);

                    } else {

                        window.location.href = result.redirectUrl;
                    }
                } else {
                    if (settings.updateTargetId) {
                        var datatresult = (result.message == null || result.message == undefined) ? ((result.data == null || result.data == undefined) ? result : result.data) : result.message;
                        $("#" + settings.updateTargetId).html(datatresult);
                    }
                }
            } else {
                onSucccess(result);
            }
        },
        error: function (jqXHR, status, error) {
            if (onError !== null && onError !== undefined) {
                onError(jqXHR, status, error);
                Global.HideLoading();
            }
        },
        complete: function (result) {
            if (onComplete === null || onComplete === undefined) {
                if (settings.loadingElementId != null || settings.loadingElementId != undefined) {
                    $("#" + settings.loadingElementId).hide();
                }

            } else {
                onComplete(result);
            }
            Global.HideLoading();
        }
    });

    return action;
};

Global.FormHelperWithFiles = function (formElement, options, onSucccess, onError, loadingElementId, onComplete) {
    "use strict";
    var settings = {};

    settings = $.extend({}, settings, options);
    formElement.validate(settings.validateSettings);
    formElement.submit(function (e) {

        var formdata = new FormData();
        formElement.find('input[type="file"]').each(function () {

            var elem = document.getElementById($(this).attr('id'));
            if (elem != undefined && elem.files != undefined && elem.files.length > 0) {
                for (var i = 0; i < elem.files.length; i++) {
                    var file = elem.files[i];
                    formdata.append($(this).attr('name'), file);
                }
            }
        });

        $.each(formElement.serializeArray(), function (i, item) {
            formdata.append(item.name, item.value);
        });


        var submitBtn = formElement.find('#btn-submit');
        if (formElement.validate().valid()) {
            Global.ShowLoading();
            submitBtn.find('i').removeClass("fa fa-arrow-circle-right");
            submitBtn.find('i').addClass("fa fa-refresh");
            submitBtn.prop('disabled', true);
            submitBtn.find('span').html('Submiting..');
            $.ajax(formElement.attr("action"), {
                type: "POST",
                data: formdata,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    if (settings.loadingElementId != null || settings.loadingElementId != undefined) {
                        $("#" + settings.loadingElementId).show();
                        submitBtn.hide();
                    }
                },
                success: function (result) {
                    if (onSucccess === null || onSucccess === undefined) {
                        if (result.isSuccess) {
                            $(window).unbind('beforeunload');
                            if (settings.refreshGrid) {
                                if (settings.modelId) {
                                    $("#" + settings.modelId).modal('hide');
                                }
                                if (result.message)
                                    Global.ToastrSuccess(result.message);
                                if ($('[data-table="grid"]').length >= 1) {
                                    $('[data-table="grid"]').DataTable().ajax.reload();
                                }
                            } else {

                                window.location.href = result.redirectUrl;
                            }
                        } else {
                            if (settings.updateTargetId) {
                                var datatresult = (result.message == null || result.message == undefined) ? ((result.data == null || result.data == undefined) ? result : result.data) : result.message;
                                $("#" + settings.updateTargetId).html(datatresult);
                            }
                        }
                    } else {
                        onSucccess(result);
                    }
                },
                error: function (jqXHR, status, error) {
                    if (onError !== null && onError !== undefined) {
                        onError(jqXHR, status, error);
                        Global.HideLoading();
                    }
                },
                complete: function (result) {
                    if (onComplete === null || onComplete === undefined) {
                        if (settings.loadingElementId != null || settings.loadingElementId != undefined) {
                            $("#" + settings.loadingElementId).hide();
                        }
                        submitBtn.find('i').removeClass("fa fa-refresh");
                        submitBtn.find('i').addClass("fa fa-arrow-circle-right");
                        submitBtn.find('span').html('Submit');
                        submitBtn.prop('disabled', false);
                    } else {
                        onComplete(result);
                    }
                    Global.HideLoading();
                }
            });
        }

        e.preventDefault();
    });

    return formElement;
};

Global.PaymentFormHelper = function (formElement, options, onSucccess, onError) {

    //"use strict";
    var settings = {};
    settings = $.extend({}, settings, options);
    $.validator.unobtrusive.parse(formElement);
    formElement.validate(settings.validateSettings);
    formElement.submit(function (e) {
        var submitBtn = formElement.find(':submit');
        //var formdata = new FormData();
        if (formElement.validate().valid()) {
            $('.loading-data').show();
            $('.loading-overlay').show();

            $.ajax(formElement.attr("action"), {
                type: "POST",
                data: formElement.serializeArray(),
                beforeSend: function (xhr) {
                    $(':input[type="submit"]').prop('disabled', true);
                },
                success: function (result) {
                    if (onSucccess === null || onSucccess === undefined) {
                        if (result.isSuccess) {
                            if (settings.refreshGrid) {
                                if (settings.modelId) {
                                    $("#" + settings.modelId).modal('hide');
                                }
                                if (result.message)
                                    Global.ToastrSuccess(result.message);
                                if ($('[data-table="grid"]').length >= 1) {
                                    $('[data-table="grid"]').DataTable().ajax.reload();
                                }
                            } else {

                                window.location.href = result.redirectUrl;
                            }
                        } else {

                            if (settings.updateTargetId) {
                                if (result.data == undefined) {
                                    formElement.find("#" + settings.updateTargetId).html("<span>" + result + "</span>");
                                }
                                else {
                                    formElement.find("#" + settings.updateTargetId).html("<span>" + result.message + "</span>");
                                }
                            }
                        }
                    } else {

                        onSucccess(result);
                    }
                },
                error: function (jqXHR, status, error) {

                    if (onError !== null && onError !== undefined) {
                        onError(jqXHR, status, error);
                    } else {

                        var $div = $("#validation-summary");
                        $('<div/>', {
                            'class': 'validation-summary-errors',
                            'data-valmsg-summary': 'true',
                            'html': function () {
                                $('<ul/>', {
                                    'html': function () {
                                        $('<li/>', {
                                            'html': jqXHR.responseJSON.message
                                        }).appendTo(this);

                                        //$('<li/>', {
                                        //    'html': jqXHR.responseJSON.data
                                        //}).appendTo(this);
                                    }
                                }).appendTo(this);
                            }
                        }).appendTo($div);

                    }
                    $('.loading-data').hide();
                    $('.loading-overlay').hide();
                    $(':input[type="submit"]').prop('disabled', false);
                }, complete: function () {
                    $('.loading-data').hide();
                    $('.loading-overlay').hide();
                    $(':input[type="submit"]').prop('disabled', false);
                }
            });
        }
        e.preventDefault();
    });

    return formElement;
};

Global.FormValidationReset = function (formElement, validateOption) {
    if ($(formElement).data('validator')) {
        $(formElement).data('validator', null);
    }

    $(formElement).validate(validateOption);
    return $(formElement);
};

Global.DataTable = function (formElement) {
    var table = $(formElement).dataTable({
        "searching": true,
        "paging": true,
        "ordering": true,

        "dom": 'Bfrtip',
        "buttons": ['csv', 'excel', 'pdf', 'print'],
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
    return table;
};

Global.DataTableWithOutPage = function (formElement) {
    var table = $(formElement).dataTable({
        "searching": true,
        "paging": true,
        "ordering": true,
        "fixedHeader": true,
        "dom": 'Bfrtip',
        "buttons": ['csv', 'excel', 'pdf', 'print']

    });
    return table;
};

Global.DataTableWithOutPageOrder = function (formElement) {
    var table = $(formElement).dataTable({
        "searching": true,
        "paging": false,
        "ordering": true,
        "dom": 'Bfrtip',
        "buttons": ['csv', 'excel', 'pdf', 'print'],
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
    return table;
};

Global.DataTableWithSearchOnly = function (formElement) {
    var table = $(formElement).dataTable({
        "searching": true,
        "paging": false,
        "ordering": true,
        "dom": 'Bfrtip',
        "buttons": [],
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
    return table;
};

Global.kFormatter = function (num) {
    var result = num;
    if (Math.abs(num) > 999 && Math.abs(num) < 99999) {
        result = Math.sign(num) * ((Math.abs(num) / 1000).toFixed(2)) + 'K';

    }
    else
        if (Math.abs(num) > 99999 && Math.abs(num) < 9999999) {
            result = Math.sign(num) * ((Math.abs(num) / 100000).toFixed(2)) + 'L';
        }
        else
            if (Math.abs(num) > 9999999) {
                result = Math.sign(num) * ((Math.abs(num) / 10000000).toFixed(2)) + 'Cr';
            }

    return result;
}

Global.DataTable = function (formElement) {
    var table = $(formElement).dataTable({
        "searching": true,
        "paging": true,
        "ordering": true,
        "dom": 'Bfrtip',
        "buttons": ['csv', 'excel', 'pdf', 'print'],
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
    return table;
};

Global.DataTableWithSearch = function (formElement) {
    var table = $(formElement).dataTable({
        "searching": true,
        "paging": false,
        "ordering": true
    });
    return table;
};

Global.DateProcess = function process(date) {
    var parts = date.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

Date.prototype.isSameDateAs = function (pDate) {
    return (
        this.getFullYear() === pDate.getFullYear() &&
        this.getMonth() === pDate.getMonth() &&
        this.getDate() === pDate.getDate()
    );
}

Global.ShowLoading = function (setting) {
    // debugger
    $('.loading-common').show();
    $('.loading-overlay').show();

    //setting = jQuery.extend({
    //    effect: 'ios',
    //    text: '',
    //    bg: 'rgba(255, 255, 255, 0.7)',
    //    color: '#000',
    //    maxSize: '',
    //    waitTime: -1,
    //    textPos: 'vertical',
    //    fontSize: '',        
    //    source: '/plugins/waitMe/img.svg',
    //    onClose: function () { },
    //    dvContent: 'dvWaitMe'
    //}, setting);

    //var $container = $('#' + setting.dvContent);
    //if ($container.length) {
    //    //clear if already opened.
    //    $container.removeAttr('class').hide().children().remove();
    //    $container.css({
    //        'width': '100%',
    //        'height': '100%',
    //        'position': 'fixed',
    //        'top': '0',
    //        'left': '0',
    //        'z-index': '99999',
    //        'display': 'none'
    //    });
    //    $('body').addClass('ajax-waitme');
    //    $container.waitMe({
    //        effect: setting.Effect,
    //        text: setting.Text,
    //        bg: setting.background,
    //        color: setting.ColorCode,
    //        sizeW: setting.SizeW,
    //        sizeH: setting.SizeH
    //    });
    //    $container.show();
    //}
};

Global.HideLoading = function (setting) {
    $('.loading-common').hide();
    $('.loading-overlay').hide();
    //setting = jQuery.extend({ dvContent: 'dvWaitMe' }, setting);
    //var $container = $('#' + setting.dvContent);
    //$container.removeAttr('class').hide().children().remove();
    //$('body').removeClass('ajax-waitme');
};

Global.ShowSucessMessage = function (message) {
    var $html = '<div class="alert alert-success alert-dismissable">' +
        '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>' + message + '</div>';
    $("#notificationMessage").html($html);
}

Global.ShowErrorMessage = function (message) {
    var $html = '<div class="alert alert-danger alert-dismissable">' +
        '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>' + message + '</div>';
    $("#notificationMessage").html($html);
}

Global.GetEmojiName = function (rating) {
    if (rating) {
        var result = $.grep(emojiArrList, function (e) { return e.Rating == rating });
        if (result != null && result.length > 0)
            return `/DYF/${companyId}/EmojiImages/${result[0].Emoji}`;
        else
            return `/DYF/${companyId}/EmojiImages/1.png`;
    } else {
        return `/DYF/${companyId}/EmojiImages/1.png`;
    }
}

Global.GetEmojiNameMini = function (rating) {
    if (rating) {
        var result = $.grep(emojiArrList, function (e) { return e.Rating == rating });
        if (result != null && result.length > 0) {
            var emoji = result[0].Emoji;
            return `/DYF/${companyId}/EmojiImages/${emoji.Split('.')[0]}-mini.${emoji.Split('.')[1]}`;
        }
        else
            return `/DYF/${companyId}/EmojiImages/1-mini.png`;
    } else {
        return `/DYF/${companyId}/EmojiImages/1-mini.png`;
    }
}

Global.showSessionPendingMsgCount = function () {

    $.ajax({
        url: '/home/messageCount',
        type: 'get',
        cache: false,
        success: function (msgCount) {
            if (parseInt(msgCount) > 0) {
                $('.pending-msg').text(msgCount);
            }
        }
    });

    setTimeout(function () {
        $.ajax({
            url: '/session/sessionMessageCount',
            type: 'get',
            cache: false,
            success: function (msgCount) {
                if (parseInt(msgCount) > 0) {
                    $('.session-pending-msg').text(msgCount);
                }
            }
        });
    }, 800);
}

Global.ValidateImage = function (input, fileId, displayId) {
    var reader = new FileReader();
    if (input.files[0].size > 528385) {
        $("#" + fileId).val('');

        alert("Image Size should not be greater than 500Kb");

        $("#" + fileId).val('');
        return false;
    }

    if (input.files[0].type.indexOf("image/jpeg") == -1 && input.files[0].type.indexOf("image/png") == -1) {
        alert("Invalid format");
        $("#" + fileId).val('');
        return false;
    }


    reader.onload = function (e) {
        $("#" + displayId).attr("src", e.target.result);
        $("#" + displayId).show();
    };
    // read the image file as a data URL.
    reader.readAsDataURL(input.files[0]);
    return true;
}

Global.DocumentValidate = function (input, fileId) {

    var reader = new FileReader();
    if (input.files[0].size > 528385) {
        $("#" + fileId).val('');
        alert("file Size should not be greater than 500Kb");
        $("#" + fileId).val('');
        return false;
    }
    if (input.files[0].type.indexOf("application/pdf") == -1) {
        alert("Invalid file");
        $("#" + fileId).val('');
        return false;
    }
    // read the image file as a data URL.
    reader.readAsDataURL(input.files[0]);
}

Global.GenerateGuid = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

Global.Print = function (html, title) {
    var mywindow = window.open('', 'new div', 'height=400,width=600');
    mywindow.document.write('<html><head><title>' + title + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.writeln(html);
    mywindow.document.write('</body></html>');
    mywindow.print();
    mywindow.close();
    return true;
};

Global.Pdf = function (html) {
    var pdfForm = $('#pdfForm');
    pdfForm.find("input[name='htmlContent']").val(html);
    pdfForm.submit();
};

Global.Excel = function (html) {
    var pdfForm = $('#excelForm');
    pdfForm.find("input[name='htmlContent']").val(html);
    pdfForm.submit();
};

Global.ToastrSuccess = function (message) {
    toastr.success(message,)
}

Global.ToastrInfo = function (message) {
    toastr.info(message)
}

Global.ToastrError = function (message) {
    toastr.error(message)
}

Global.ToastrWarning = function (message) {
    toastr.warning(message)
}
Global.AddUpdateQueryStringParameter = function (uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
};
Global.AttachEventCKEditor = function (instance) {
    CKEDITOR.instances[instance].on("instanceReady", function (e) {
        this.on("change", function () {
            CKEDITOR.instances[instance].updateElement();
        });
    });
}
Global.IsNull = function (o) { return typeof o === "undefined" || typeof o === "unknown" || o == null };
Global.IsNotNull = function (o) { return !Global.IsNull(o); };
Global.IsNullOrEmptyString = function (str) {
    return Global.IsNull(str) || typeof str === "string" && $.trim(str).length == 0
};
Global.IsNotNullOrEmptyString = function (str) { return !Global.IsNullOrEmptyString(str); };
Global.ModelHelper = function (modelElement, onSucess, OnError) {
    $(modelElement).on('show.bs.modal', function (event) {

        var button = $(event.relatedTarget); // Button that triggered the modal
        var url = button.attr("href");
        var modal = $(this);
        if (url !== "" && url != undefined) {
            // note that this will replace the content of modal-content everytime the modal is opened
            modal.find('.modal-content').load(url, function (response, status, xhr) {
                if (status == "success") {
                    onSucess(response)
                } else {
                    modal.find('.modal-content').html(response);
                    OnError(response);
                    if (onError !== null && onError !== undefined) {
                        onError(response);
                    } else {
                        var $div = $("#validation-summary");
                        $('<div/>', {
                            'class': 'validation-summary-errors',
                            'data-valmsg-summary': 'true',
                            'html': function () {
                                $('<ul/>', {
                                    'html': function () {
                                        $('<li/>', {
                                            'html': jqXHR.responseJSON.message
                                        }).appendTo(this);

                                        //$('<li/>', {
                                        //    'html': jqXHR.responseJSON.data
                                        //}).appendTo(this);
                                    }
                                }).appendTo(this);
                            }
                        }).appendTo($div);

                    }
                }
            });
        }
    }).on('hidden.bs.modal', function (e) {
        $(this).removeData('bs.modal');
        $(this).find(".modal-content").empty();
    });
    return modelElement;
};

$(document).on('keypress', '.pincode', function (event) {
    //Added by arnav
    if ((event.which < 48 || event.which > 57) && event.which != 8 && event.which != 0) {
        event.preventDefault();

    }

});

$(document).on('keypress', '.number', function (event) {
    //Added by arnav
    if ((event.which < 48 || event.which > 57) && event.which != 8 && event.which != 0) {
        event.preventDefault();
    }
});


$(document).on('keypress', '.decimal', function (event) {
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57) && event.which != 8 && event.which != 0) {
        event.preventDefault();
    }
});

$(document).on('keypress', '.decimalNegative', function (event) {
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which != 45 || $(this).val().indexOf('-') != -1) && (event.which < 48 || event.which > 57) && event.which != 8 && event.which != 0) {
        event.preventDefault();
    }
});

$(document).on('change', '.number, .decimal, .decimalNegative', function () { if ($(this).val() != "0" && $(this).val() != "" && !$.isNumeric($(this).val())) { alert("Please enter a valid value"); return false; } });

$(document).on('focus', '.number, .decimal, .decimalNegative', function (event) {
    var default_value = 0;
    if ($(this).val() == default_value) $(this).val("");
});

$(document).on('blur', '.number, .decimal, .decimalNegative', function (event) {
    var default_value = 0;
    if ($(this).val().length == 0) $(this).val(default_value);
});

$(document).on('bind', '.disablecopy', function (e) {
    e.preventDefault();
});

$(document).on('cut copy paste', '.disablecopy', function (e) {
    e.preventDefault();
});

$(".disableRightClick").on("contextmenu", function (e) {
    return false;
});


Global.StateCode = function (zipString) {
    /* Ensure param is a string to prevent unpredictable parsing results */
    if (typeof zipString !== 'string') {
        console.log('Must pass the zipcode as a string.');
        return;
    }

    /* Ensure we have exactly 5 characters to parse */
    if (zipString.length !== 5) {
        console.log('Must pass a 5-digit zipcode.');
        return;
    }

    /* Ensure we don't parse strings starting with 0 as octal values */
    const zipcode = parseInt(zipString, 10);

    let st;
    let state;
    // debugger;
    /* Code cases alphabetized by state */
    if (zipcode >= 35000 && zipcode <= 36999) {
        st = 'AL';
        state = 'Alabama';
    } else if (zipcode >= 99500 && zipcode <= 99999) {
        st = 'AK';
        state = 'Alaska';
    } else if (zipcode >= 85000 && zipcode <= 86999) {
        st = 'AZ';
        state = 'Arizona';
    } else if (zipcode >= 71600 && zipcode <= 72999) {
        st = 'AR';
        state = 'Arkansas';
    } else if (zipcode >= 90000 && zipcode <= 96699) {
        st = 'CA';
        state = 'California';
    } else if (zipcode >= 80000 && zipcode <= 81999) {
        st = 'CO';
        state = 'Colorado';
    } else if ((zipcode >= 6000 && zipcode <= 6389) || (zipcode >= 6391 && zipcode <= 6999)) {
        st = 'CT';
        state = 'Connecticut';
    } else if (zipcode >= 19700 && zipcode <= 19999) {
        st = 'DE';
        state = 'Delaware';
    } else if (zipcode >= 32000 && zipcode <= 34999) {
        st = 'FL';
        state = 'Florida';
    } else if ((zipcode >= 30000 && zipcode <= 31999) || (zipcode >= 39800 && zipcode <= 39999)) {
        st = 'GA';
        state = 'Georgia';
    } else if (zipcode >= 96700 && zipcode <= 96999) {
        st = 'HI';
        state = 'Hawaii';
    } else if (zipcode >= 83200 && zipcode <= 83999) {
        st = 'ID';
        state = 'Idaho';
    } else if (zipcode >= 60000 && zipcode <= 62999) {
        st = 'IL';
        state = 'Illinois';
    } else if (zipcode >= 46000 && zipcode <= 47999) {
        st = 'IN';
        state = 'Indiana';
    } else if (zipcode >= 50000 && zipcode <= 52999) {
        st = 'IA';
        state = 'Iowa';
    } else if (zipcode >= 66000 && zipcode <= 67999) {
        st = 'KS';
        state = 'Kansas';
    } else if (zipcode >= 40000 && zipcode <= 42999) {
        st = 'KY';
        state = 'Kentucky';
    } else if (zipcode >= 70000 && zipcode <= 71599) {
        st = 'LA';
        state = 'Louisiana';
    } else if (zipcode >= 3900 && zipcode <= 4999) {
        st = 'ME';
        state = 'Maine';
    } else if (zipcode >= 20600 && zipcode <= 21999) {
        st = 'MD';
        state = 'Maryland';
    } else if ((zipcode >= 1000 && zipcode <= 2799) || (zipcode == 5501) || (zipcode == 5544)) {
        st = 'MA';
        state = 'Massachusetts';
    } else if (zipcode >= 48000 && zipcode <= 49999) {
        st = 'MI';
        state = 'Michigan';
    }
    else if (zipcode >= 55000 && zipcode <= 56899) {
        st = 'MN';
        state = 'Minnesota';
    } else if (zipcode >= 38600 && zipcode <= 39999) {
        st = 'MS';
        state = 'Mississippi';
    } else if (zipcode >= 63000 && zipcode <= 65999) {
        st = 'MO';
        state = 'Missouri';
    } else if (zipcode >= 59000 && zipcode <= 59999) {
        st = 'MT';
        state = 'Montana';
    } else if (zipcode >= 27000 && zipcode <= 28999) {
        st = 'NC';
        state = 'North Carolina';
    } else if (zipcode >= 58000 && zipcode <= 58999) {
        st = 'ND';
        state = 'North Dakota';
    } else if (zipcode >= 68000 && zipcode <= 69999) {
        st = 'NE';
        state = 'Nebraska';
    } else if (zipcode >= 88900 && zipcode <= 89999) {
        st = 'NV';
        state = 'Nevada';
    } else if (zipcode >= 3000 && zipcode <= 3899) {
        st = 'NH';
        state = 'New Hampshire';
    } else if (zipcode >= 7000 && zipcode <= 8999) {
        st = 'NJ';
        state = 'New Jersey';
    } else if (zipcode >= 87000 && zipcode <= 88499) {
        st = 'NM';
        state = 'New Mexico';
    } else if ((zipcode >= 10000 && zipcode <= 14999) || (zipcode == 6390) || (zipcode == 501) || (zipcode == 544)) {
        st = 'NY';
        state = 'New York';
    } else if (zipcode >= 43000 && zipcode <= 45999) {
        st = 'OH';
        state = 'Ohio';
    } else if ((zipcode >= 73000 && zipcode <= 73199) || (zipcode >= 73400 && zipcode <= 74999)) {
        st = 'OK';
        state = 'Oklahoma';
    } else if (zipcode >= 97000 && zipcode <= 97999) {
        st = 'OR';
        state = 'Oregon';
    } else if (zipcode >= 15000 && zipcode <= 19699) {
        st = 'PA';
        state = 'Pennsylvania';
    } else if (zipcode >= 300 && zipcode <= 999) {
        st = 'PR';
        state = 'Puerto Rico';
    } else if (zipcode >= 2800 && zipcode <= 2999) {
        st = 'RI';
        state = 'Rhode Island';
    } else if (zipcode >= 29000 && zipcode <= 29999) {
        st = 'SC';
        state = 'South Carolina';
    } else if (zipcode >= 57000 && zipcode <= 57999) {
        st = 'SD';
        state = 'South Dakota';
    } else if (zipcode >= 37000 && zipcode <= 38599) {
        st = 'TN';
        state = 'Tennessee';
    } else if ((zipcode >= 75000 && zipcode <= 79999) || (zipcode >= 73301 && zipcode <= 73399) || (zipcode >= 88500 && zipcode <= 88599)) {
        st = 'TX';
        state = 'Texas';
    } else if (zipcode >= 84000 && zipcode <= 84999) {
        st = 'UT';
        state = 'Utah';
    } else if (zipcode >= 5000 && zipcode <= 5999) {
        st = 'VT';
        state = 'Vermont';
    } else if ((zipcode >= 20100 && zipcode <= 20199) || (zipcode >= 22000 && zipcode <= 24699) || (zipcode == 20598)) {
        st = 'VA';
        state = 'Virgina';
    } else if ((zipcode >= 20000 && zipcode <= 20099) || (zipcode >= 20200 && zipcode <= 20599) || (zipcode >= 56900 && zipcode <= 56999)) {
        st = 'DC';
        state = 'Washington DC';
    } else if (zipcode >= 98000 && zipcode <= 99499) {
        st = 'WA';
        state = 'Washington';
    } else if (zipcode >= 24700 && zipcode <= 26999) {
        st = 'WV';
        state = 'West Virginia';
    } else if (zipcode >= 53000 && zipcode <= 54999) {
        st = 'WI';
        state = 'Wisconsin';
    } else if (zipcode >= 82000 && zipcode <= 83199) {
        st = 'WY';
        state = 'Wyoming';
    } else {
        st = 'none';
        state = 'none';
        console.log('No state found matching', zipcode);
    }

    return st;


};

Global.GoogleEquityChart = function (data, divId, dataArr) {
    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(GoogleEquityChartDrawBasic(data, divId, dataArr));
}

function GoogleEquityChartDrawBasic(data, divId, dataArr) {
    //var data = new google.visualization.DataTable();
    data.addColumn('date', 'X');
    data.addColumn('number', 'Equity');
    data.addRows(dataArr);

    var options = {
        hAxis: {
            title: 'Date'
        },
        vAxis: {
            title: 'Popularity'
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById(divId));

    chart.draw(data, options);
}
