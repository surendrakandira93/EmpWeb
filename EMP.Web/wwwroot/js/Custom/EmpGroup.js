(function ($) {
    function EmpGroupIndex() {
        var $this = this, form, pageNo = 1, pageSize = 5;

        function initilizeForm() {
            form = new Global.FormHelperWithFiles($("#frm-add-group"),
                { updateTargetId: "validation-summary" },
                function onSucccess(result) {
                    if (result.message) {
                        $("#group_id").val("");
                        $("#group_name").val("");
                        $("#group_description").val("");
                        $("#ImageURLFile").val("");
                        $("#emp_select").select2("val", " ");
                        Global.ToastrSuccess(result.message);
                        BindGrid();
                    } else {
                        $("#validation-summary").html(result);
                    }
                }, null);
            $("#emp_select").select2({
                placeholder: "Select a employee",
                allowClear: true
            });

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

            $.ajax(`/EmployeeGroup/BindGrid?pageNo=${pageNo}&pageSize=${pageSize}`, {
                type: "GET",
                success: function (result) {
                    if (result.data.list.length > 0) {
                        for (var i = 0; i < result.data.list.length; i++) {
                            var group = result.data.list[i];
                            var $tr = '<div class="usr-question"><div class="usr_img"><img src="' + (!group.iconImg != null ? "/GroupImage/" + group.iconImg : "/images/resources/usrr-img1.png") + '" alt=""></div><div class="usr_quest" data-id=' + group.id + '><h3>' + group.name + '</h3><ul class="quest-tags">';

                            for (var j = 0; j < group.employees.length; j++) {
                                $tr += '<li><a href="/employee/view/' + group.employees[j].employeeId + '" title="">' + group.employees[j].name + '</a></li>';
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
            $.ajax(`/EmployeeGroup/GetById?id=${id}`, {
                type: "GET",
                success: function (result) {
                    if (result.data != null) {
                        var empArr = new Array();
                        $("#group_id").val(result.data.id);
                        $("#group_name").val(result.data.name);
                        for (var i = 0; i < result.data.employees.length; i++) {
                            empArr.push(result.data.employees[i].employeeId);
                        }
                        $("#emp_select").val(empArr).trigger("change");
                    }                  

                    Global.HideLoading();
                }
            });
        }

        function gotoDelete(id) {
            if (confirm('Are you sure want to delete !')) {
                Global.ShowLoading();
                $.ajax(`/EmployeeGroup/DeleteById?id=${id}`, {
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
        var self = new EmpGroupIndex();
        self.init();
    })
})(jQuery)