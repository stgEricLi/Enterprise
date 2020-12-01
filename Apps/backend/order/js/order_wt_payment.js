$(function () {
    $("#txtValue").prop('disabled', true);

    //$('#aspnetForm').validate({
    //    onkeyup: function (element) { $(element).valid(); },
    //    blur: function (element) { $(element).valid(); }
    //});


    $("#ddlOption").change(function () {
        toggle_txtbox(this.value)
    });


    $("#btnSearch").click(function () {
        load_data();
    });

    $("#btnExport").click(function () {
        export_excel();
    });


});

function toggle_txtbox(item) {
    $("#txtValue").val('');
    if (item == "All") {
        $("#txtValue").prop('disabled', true);
    } else {
        $("#txtValue").prop('disabled', false);
    }
}

//載入付款資訊
function load_data() {
    var loading = $("#loading");
    var filter = $("#ddlOption").val();
    var value = $("#txtValue").val();

    var cnt = $("#content");
    var total = $(".totalRow");
    var pageindex = numFltr($('#hidCurrPage').val());
    var pagesize = numFltr($('#hidPagesize').val());

    if (filter == 'All') { value = 'M';}

    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvPayment.asmx/Load_Pay_Paging",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "pageindex": pageindex, "pagesize": pagesize, "filterby": filter, "filtervalue": value }),
        cache: false,
        beforeSend: function () {
            loading.show();
        },
        success: function (response) {
            if (response.hasOwnProperty('d')) {
                var json = JSON.parse(response.d);
                var totalrows = json.TotalRows;

                total.html('---- 共有 ' + totalrows.toString() + ' 筆資料 ----');
                var obj = json.SwPay;
                var htm = "";
                if (obj != null) {
                    var id = "";
                    htm += "<div class='table-responsive'>";
                    htm += "<table class='table table-hover' style='width:100%; font-size:11px;'>";
                    htm += "<tr>";                   
                    htm += "<th style='width:88px'>單號</th>";
                    htm += "<th style='width:88px'>行程編號</th>";
                    htm += "<th>行程</th>";
                    htm += "<th style='width:88px'>付款人</th>";
                    htm += "<th style='width:88px'>報名人</th>";
                    htm += "<th style='width:88px'>應付金額</th>";
                    htm += "<th style='width:88px'>實付金額</th>";
                    htm += "<th style='width:88px'>手機</th>";
                    htm += "<th style='width:88px'>付款方式</th>";
                    htm += "<th style='width:88px'>帳號後五碼</th>";
                    htm += "<th style='width:88px'>付款日期</th>";
                    htm += "<th>備註說明1</th>";
                    htm += "<th>備註說明2</th>";                   
                    htm += "<th style='width:94px'></th>";
                    htm += "</tr>";

                    $.each(obj, function (i, v) {
                        id = v.OrderID.toString();
                        htm += "<tr>";
                        htm += "<td><span id='lbID" + id + "'>" + id + "</span></td>";
                        htm += "<td><span id='lbActID" + id + "'>" + v.ActID.toString() + "</span></td>";
                        htm += "<td><span id='lbActName" + id + "' style='font-size:12px;'>" + v.ActName.toString() + "</span></td>";
                        htm += "<td><span id='lbPayName" + id + "'>" + v.PayName.toString() + "</span></td>";
                        htm += "<td><span id='lbName" + id + "'>" + v.Name.toString() + "</span></td>";
                        htm += "<td><span id='lbPayable" + id + "'>" + v.Payable.toString() + "</span></td>";
                        htm += "<td><input id='txtTotal" + id + "' type='text' class='form-control' value='" + v.ActualPay.toString() + "' /></td>";
                        htm += "<td><span id='lbCell" + id + "'>" + v.Cell.toString() + "</span></td>";
                        htm += "<td><span id='lbType" + id + "'>" + v.PayType.toString() + "</span></td>";
                        htm += "<td><input id='txtAcctNo" + id + "' type='text' class='form-control' value='" + v.Account.toString() + "' /></td>";
                        htm += "<td><span id='lbDays" + id + "'>" + v.PayDay.toString() + "</span></td>";             
                        htm += "<td><span id='lbMainCmt" + id + "' style='font-size:12px;'>" + v.MainComment.toString() + "</span></td>";
                        htm += "<td><input id='txtCmt" + id + "' type='text' class='form-control' value='" + v.Comment.toString() + "' /></td>";
                        htm += "<td>";
                        htm += "<button id='btnSav" + id + "' type='button' onclick='modify(this.id)' class='btn btn-info btn-xs udpD'><span class='glyphicon glyphicon-floppy-disk'></span></button> &nbsp;";
                        htm += "<button id='btnDel" + id + "' type='button' onclick='modify(this.id)' class='btn btn-danger btn-xs udpD'><span class='glyphicon glyphicon-remove'></span></button>";
                        htm += "</td>";
                        htm += "</tr>";
                    });
                    htm += "</table>";
                    htm += "</div>";
                }
                cnt.html('');
                cnt.html(htm);
                pageing(totalrows, pageindex, pagesize);
            } else {
                cnt.html('');
                total.html('---- 共有 0 筆資料 ----');
            }
            loading.hide();
        },
        error: function (xhr, textStatus, error) {
            //$("#ddlAct").html("<option value='none'>無法取得活動資料</option>");
            alert("伺服器錯誤，無法取得活動資料！");
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(error);
            loading.hide();
        }
    });
}

//更新資訊
function modify(id) {
    var img = $("#loading");

    img.show();
    switch_contrl("disable");

    var tr = $("#" + id).parent().parent();
    var action = "Update";

    if (id.substring(0, 6) == "btnDel") {
        action = "Delete";
        id = id.replace("btnDel", "");
    } else {
        action = "Update";
        id = id.replace("btnSav", "");
    }

    var Payment = {};
    Payment.OrderID = id;
    Payment.Name = tr.find("span[id^='lbPayName']").text();
    Payment.Tel = "";
    Payment.Cell = tr.find("span[id^='lbCell']").text();
    Payment.PayType = tr.find("span[id^='lbType']").text();
    Payment.ActualPay = tr.find("input[id^='txtTotal']").val();
    Payment.Account = tr.find("input[id^='txtAcctNo']").val();
    Payment.Comment = tr.find("input[id^='txtCmt']").val();

    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvPayment.asmx/wtPayment",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "pay": Payment, 'action': action }),
        cache: false,
        before: function () { },
        success: function (data) {
            var result = data.d;
            if (result != "OK") { alert(result); } else { alert("資料已更新！"); }
            img.hide();
            switch_contrl("enable");
            load_data();
        },
        error: function (xhr, textStatus, error) {
            switch_contrl("enable");
            alert("伺服器連線錯誤，目前無法更新！");
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(error);
            img.hide();
        }
    });
}

//匯出
function export_excel() {    
    var loading = $("#loading");
    switch_contrl("disable");
    loading.show();

    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvPayment.asmx/Get_Pay_Report",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        //data: JSON.stringify({ "pageindex": '1', "pagesize": '100', "filterby": "Report", "filtervalue": "" }),
        cache: false,
        asyn: false,      
        success: function (response) {
            if (response.hasOwnProperty('d')) {
                console.log(response);
                //var json = JSON.parse(response.d);                
                var obj = response.d;
                var htm = "";
                if (obj != null) {
                    var id = "";
                    htm += "<table>";
                    htm += "<tr>";
                    htm += "<th>單號</th>";
                    htm += "<th>行程編號</th>";
                    htm += "<th>行程</th>";
                    htm += "<th>付款人</th>";
                    htm += "<th>報名人</th>";
                    htm += "<th>應付金額</th>";
                    htm += "<th>實付金額</th>";
                    htm += "<th>手機</th>";
                    htm += "<th>付款方式</th>";
                    htm += "<th>帳號後五碼</th>";
                    htm += "<th>付款日期</th>";
                    htm += "<th>備註說明1</th>";
                    htm += "<th>備註說明2</th>";
                    htm += "</tr>";

                    $.each(obj, function (i, v) {
                        htm += "<tr>";
                        htm += "<td>" + v.OrderID.toString() + "</td>";
                        htm += "<td>" + v.ActID.toString() + "</td>";
                        htm += "<td>" + v.ActName.toString() + "</td>";
                        htm += "<td>" + v.PayName.toString() + "</td>";
                        htm += "<td>" + v.Name.toString() + "</td>";
                        htm += "<td>" + v.Payable.toString() + "</td>";
                        htm += "<td>" + v.ActualPay.toString() + "</td>";
                        htm += "<td>" + v.Cell.toString() + "</td>";
                        htm += "<td>" + v.PayType.toString() + "</td>";
                        htm += "<td>" + v.Account.toString() + "</td>";
                        htm += "<td>" + v.PayDay.toString() + "</td>";
                        htm += "<td>" + v.MainComment.toString() + "</td>";
                        htm += "<td>" + v.Comment.toString() + "</td>";
                        htm += "</tr>";
                    });
                    htm += "</table>";
                   
                }
                $("#loading").hide();
                switch_contrl("enable");
                var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta charset="UTF-8"></head><body><table>{table}</table></body></html>';
                var dt = new Date();
                var yr = dt.getFullYear() - 1911;
                var m = dt.getMonth();
                var filename = "文曄活動匯款清單_" + yr + m;
                var uri = 'data:application/vnd.ms-excel;base64,';
                var base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); };
                var format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };
                var a = document.createElement('a');
                var ctx = { worksheet: "S1" || 'Worksheet', table: htm }
                a.href = uri + base64(format(template, ctx));
                a.download = filename;
                a.click();
            } else {
                alert("此條件下查無資料，請重新輸入查詢條件！");
            }
        },
        error: function (xhr, textStatus, thrownError) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(thrownError);
            $("#loading").hide();
            switch_contrl("enable");
            alert("目前查詢無結果，或是當前伺服器連線異常無法載入資料！");
        }
    });
}


function switch_contrl(action) {
    $("tr.detline").each(function (index) {
        if (action == "disable") {
            $(this).find("button[id^='updt']").prop('disabled', true);
            $(this).find("button[id^='remove']").prop('disabled', true);
        } else {
            $(this).find("button[id^='updt']").prop('disabled', false);
            $(this).find("button[id^='remove']").prop('disabled', false);
        }

    });
}


function udpD_btn_disable(disable) {
    if (disable) { $(".udpD").prop('disabled', true); } else { $(".udpD").prop('disabled', false); }
}



