
(function ($) {
    function EmployeeIndex() {
        var $this = this, form, pageNo = 1, pageSize = 5;

        function initilizeForm() {
            form = new Global.FormHelperWithFiles($("#frm-add-employee"),
                { updateTargetId: "validation-summary" },
                function onSucccess(result) {
                    if (result.message) {
                        $("#employee_id").val("");
                        $("#employee_name").val("");
                        $("#employee_DateOfBrith").val("");
                        $("#employee_Gender").val("");
                        $("#employee_City").val("");
                        $("#employee_LinkedinURL").val("");
                        $("#employee_Technolog").val("");
                        $("#employee_imageURL").val("");
                        $("#ImageURLFile").val("");
                        $("#view_ImageURLFile").hide();
                        Global.ToastrSuccess(result.message);
                        BindGrid();
                    } else {
                        $("#validation-summary").html(result);
                    }
                }, null);

            $("#ImageURLFile").change(function () {
                Global.ValidateImage(this, 'ImageURLFile', 'view_ImageURLFile');

            });
        }

        function BindGrid() {
            Global.ShowLoading();
            var $grid = $(".forum-questions");
            $grid.empty();

            var $page = $(".pagination");
            $page.empty();

            $.ajax(`/Employee/BindGrid?pageNo=${pageNo}&pageSize=${pageSize}`, {
                type: "GET",
                success: function (result) {
                    if (result.data.list.length > 0) {
                        for (var i = 0; i < result.data.list.length; i++) {
                            var emp = result.data.list[i];
                            var $tr = '<div class="usr-question"><div class="usr_img"><img src="' + (!emp.imageURL != null ? "/UserImage/"+emp.imageURL : "/images/resources/usrr-img1.png") + '" alt=""></div><div class="usr_quest" data-id=' + emp.employeeId + '><h3>' + emp.name + '</h3><ul class="react-links">';

                            $tr += '<li><a href="javascript:void(0);" title=""><i class="fas fa-heart"></i>' + emp.gender+'</a></li>';
                            $tr += '<li><a href="javascript:void(0);" title=""><i class="fas fa-comment-alt"></i>' + emp.age + '</a></li>';
                            $tr += '<li><a href="javascript:void(0);" title=""><i class="fas fa-eye"></i>' + emp.city + '</a></li>';

                            $tr += '</ul><ul class="quest-tags">';
                            for (var j = 0; j < emp.technologies.length; j++) {
                                $tr += '<li><a href="javascript:void(0);" title="">' + emp.technologies[j] + '</a></li>';
                            }
                            $tr += '</ul></div></div>';
                            $grid.append($tr);
                        }

                        for (var i = 0; i < result.data.pageNos.length; i++) {
                            var page = result.data.pageNos[i];
                            if (page.isCurrentPage) {
                                $page.append('<li class="page-item"><a class="page-link active" href="javascript:void(0);">' + page.pageNo + '</a></li>');
                            } else {
                                $page.append('<li class="page-item"><a class="page-link page-link-click" data-no=' + page.pageNo +' href="javascript:void(0);">' + page.pageNo + '</a></li>');
                            }

                            
                        }

                    }
                    $(".page-link-click").click(function () {
                        var page = parseInt($(this).data('no'));
                        gotoPage(page);
                    });
                    $(".usr_quest").click(function () {
                        var id = $(this).data('id');
                        gotoDelete(id);
                    })

                    Global.HideLoading();
                }
            });
        }

        function gotoPage(page) {
            pageNo = page;
            BindGrid();
        }

        function gotoEdit(id) {
            Global.ShowLoading();
            $.ajax(`/Employee/GetById?id=${id}`, {
                type: "GET",
                success: function (result) {
                    if (result.data != null) {
                        var emp = result.data;                        
                        $("#employee_id").val(emp.employeeId);
                        $("#employee_name").val(emp.name);
                        $("#employee_DateOfBrith").val(moment(emp.dateOfBrith).format("YYYY-MM-DD"));
                        $("#employee_Gender").val(emp.gender);
                        $("#employee_City").val(emp.city);
                        $("#employee_LinkedinURL").val(emp.linkedinURL);
                        $("#employee_Technolog").val(emp.technolog);                        
                        $("#employee_imageURL").val(emp.imageURL);
                        $("#view_ImageURLFile").attr("src", "/UserImage/" + emp.imageURL);
                        $("#view_ImageURLFile").show();
                    }                  

                    Global.HideLoading();
                }
            });
        }

        function gotoDelete(id) {
            if (confirm('Are you sure want to delete !')) {
                Global.ShowLoading();
                $.ajax(`/Employee/DeleteById?id=${id}`, {
                    type: "GET",
                    success: function (result) {
                        if (result.isSuccess) {
                            Global.ToastrSuccess(result.message);
                            BindGrid();
                        }
                        Global.HideLoading();
                    }
                });
            }
        }

        $this.init = function () {
            BindGrid();
            initilizeForm();
        }
    }

    $(function () {
        var self = new EmployeeIndex();
        self.init();
    })
})(jQuery)