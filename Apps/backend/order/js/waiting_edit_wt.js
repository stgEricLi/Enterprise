$(document).ready(function () {
    $("#ddlAct").hide();
    $("#ddlAct").prop('disabled', true);

    $("#btnSearch").click(function () {
        load_data();
    });

    $("#btnExport").click(function () {
        export_excel();
    });


    $("#ddlOption").change(function () {       
        var select = this.value;
        var txt = "";
        $("#txtValue").attr('placeholder', '');
        $("#txtValue").val('');
        $("#ddlAct").hide();
        $("#ddlAct").prop('disabled', true);
        $("#txtValue").prop('disabled', false);
        switch (select) {
            case "Aid":
                $("#ddlAct").html(ddlActHtml);
                $("#ddlAct").show();
                $("#ddlAct").prop('disabled', false);
                $("#txtValue").prop('disabled', true);
                break;
            case "Eid":
                txt = "請輸入員工工號";
                break;
            case "Sid":
                txt = "請輸入身份證號";
                break;
            case "Day":
                txt = "日期格式:2019-04-13";
                break;
            case "Oid":
                txt = "請輸入報名編號";
                break;
        }
        $("#txtValue").attr('placeholder', txt);
    });

    $("#btnMgClose").click(function (e) {
        e.preventDefault();
        hideMsg();
    });

    load_act();

});

var ddlActHtml = "";
var objAct = null;

//載入活動清單
function load_act() {
    $("#ddlAct").html('');
    var loading = $("#loading");
    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvAct.asmx/load_Act",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "pageindex": 1, "pagesize": 100, "company": "wt" }),
        cache: false,
        beforeSend: function () {
            loading.show();
        },
        success: function (response) {
            if (response.hasOwnProperty('d')) {
                var json = JSON.parse(response.d);
                objAct = json.Acts;
                var sb = "<option value='none'>無活動資料</option>";
                if (objAct != null) {
                    sb = "";
                    $.each(objAct, function (i, v) {
                        sb += "<option value='" + v.ActID.toString() + "'>" + v.Name.toString().substring(0, 12) + "(" + v.StartDay.toString() + ")</option>";
                    });
                }
            }
            ddlActHtml = sb;
            loading.hide();
        },
        error: function (xhr, textStatus, error) {
            $("#ddlAct").html("<option value='none'>無法取得活動資料</option>");
            alert("伺服器錯誤，無法取得活動資料！");
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(error);
            loading.hide();
        }
    });
}


//載入主單
function load_data() {
    var filterby = $("#ddlOption").val();
    var cnt = $("#content");
    var loading = $("#loading");
    var total = $(".totalRow");
    var pageindex = numFltr($('#hidCurrPage').val());
    var pagesize = numFltr($('#hidPagesize').val());

    var value = "";

    if (filterby == "Aid") {
        value = $("#ddlAct").val();
    } else {
        value = $("#txtValue").val();
    }

    if (value.length <= 0) { value = "F"; }
    if (filterby == "E") { filterby = "Oid"; value = "E"; }
    if (filterby == "C") { filterby = "Oid"; value = "C"; }
    //int pageindex, int pagesize, string filterby, string filtervalue
    var def = $.ajax({
        type: "POST",
        url: "../../mcpservices/SvOrder.asmx/load_Waiting_Paging",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "pageindex": pageindex, "pagesize": pagesize, "filterby": filterby, "filtervalue": value }),
        cache: false,
        asyn: false,
        beforeSend: function () {
            loading.show();
        },
        success: function (response) {
            if (response.hasOwnProperty('d')) {
                var json = JSON.parse(response.d);
                var totalrows = json.TotalRows;

                total.html('---- 共有 ' + totalrows.toString() + ' 筆資料 ----');
                var objOd = json.Orders;
                var htm = "";
                if (objOd != null) {
                    var id = "";
                    htm += "<div class='table-responsive'>";
                    htm += "<table class='table table-hover' style='width:100%; font-size:13px;'>";
                    htm += "<tr>";
                    htm += "<th style='width:46px;'>詳細</th>";
                    htm += "<th style='width:46px;'>轉梯</th>";
                    htm += "<th style='width:46px;'>轉正</th>";
                    htm += "<th style='width:76px;'>編號</th>";
                    htm += "<th style='width:196px;'>行程</th>";
                    htm += "<th style='width:96px;'>出發日</th>";
                    htm += "<th style='width:96px;'>聯絡人</th>";
                    htm += "<th style='width:166px;'>電話</th>";
                    htm += "<th style='width:106px;'>手機</th>";
                    htm += "<th style='width:180px;'>Email</th>";
                    htm += "<th style='width:96px;'>金額</th>";                
                    htm += "<th>備註</th>";              
                    htm += "<th style='width:86px;'></th>";
                    htm += "</tr>";
                    $.each(objOd, function (i, v) {
                        id = v.OrderID.toString();
                        htm += "<tr>";                   
                        htm += "<td><button  id='" + id + "' type='button' onclick='load_details(this.id)' class='btn btn-info btn-xs'><span class='glyphicon glyphicon-search'></span></button></td>";                        
                        htm += "<td><button  id='switch" + id + "' type='button' onclick='switch_act(this.id)' class='btn btn-info btn-xs'><span class='glyphicon glyphicon-transfer'></span></button></td>";
                        htm += "<td><button  id='tran" + id + "' type='button' onclick='transfer_act(this.id)' class='btn btn-info btn-xs'><span class='glyphicon glyphicon-transfer'></span></button></td>";                    
                        htm += "<td><span id='lbID" + id + "'>" + id + "</span></td>";
                        htm += "<td><span id='lbActName" + id + "'>" + v.ActName.toString().substring(0, 12) + "</span></td>";
                        htm += "<td><span id='lbStDay" + id + "'>" + v.StartDay.toString() + "</span></td>";
                        htm += "<td><input id='txtCust" + id + "' value='" + v.Name.toString() + "' placeholder='姓名' type='text' maxlength='50' class='form-control required input-sm' /></td>";
                        htm += "<td><input id='txtTel" + id + "' value='" + v.Tel1.toString() + "' placeholder='電話' type='text' maxlength='20' class='form-control required input-sm' /></td>";
                        htm += "<td><input id='txtCel" + id + "' value='" + v.Cell1.toString() + "' placeholder='手機' type='text' maxlength='20' class='form-control required input-sm' /></td>";
                        htm += "<td><input id='txtMail" + id + "' value='" + v.Email.toString() + "' placeholder='Email' type='text' maxlength='120' class='form-control required input-sm' /></td>";
                        htm += "<td><input id='txtPrice" + id + "' value='" + v.TotalPrice.toString() + "' type='text' maxlength='6' class='form-control required input-sm' /></td>";
                        htm += "<td><input id='txtGp" + id + "' value='" + v.Comment.toString() + "' type='text' maxlength='50' class='form-control input-sm' /></td>";                      
                        htm += "<td style='text-align:center;'>";
                        htm += "<button  id='sav" + id + "' type='button' onclick='save_main(this.id)' class='btn btn-success btn-xs udpD'><span class='glyphicon glyphicon-floppy-disk'></span></button>&nbsp;";
                        htm += "<button  id='del" + id + "' type='button' onclick='delete_main(this.id)' class='btn btn-danger btn-xs udpD'><span class='glyphicon glyphicon-remove'></span></button>";
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
        error: function (xhr, textStatus, thrownError) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(thrownError);
            total.html('');
            cnt.html("<p class='loadingError'>目前網路連線異常無法載入資料！</p>");
            //$(".pagination a").unbind("click", function () { });
            $(".pagination").html('');
            loading.hide();
        }
    });

    // 顯示此一活動目前有多少人數
    def.done(function () {
        if (filterby == "Aid") {
            $.ajax({
                type: "POST",
                url: "../../mcpservices/SvOrder.asmx/Get_Waiting_ActRegister_Amount",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ "actid": value }),
                cache: false,
                success: function (response) {
                    if (response.hasOwnProperty('d')) {
                        var amount = JSON.parse(response.d);
                        if (parseInt(amount) > 0) {
                            $("#peoplecount").html("<p>---- 此活動目前總人數:" + amount + " ----</p>");
                        }
                    }
                },
                error: function (xhr, textStatus, error) {
                    console.log(xhr.status);
                    console.log(xhr.responseText);
                    console.log(error);
                    $("#peoplecount").html("<p></p>");
                }
            });
        } else {
            $("#peoplecount").html("<p></p>");
        }
    });

}

//載入明細
function load_details(oid) {
    console.log(oid);
    $("#msgErr").text('');
    $("#popID").text(oid);
    var cnt = $(".details");
    var tr = $("#titleline");
    var img = $("#imgLoad");
    var msg = $("#msgErr");
    var actid = "", actname = "";
    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvOrder.asmx/load_Waiting_Details",
        data: JSON.stringify({ "orderid": oid }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        before: function () {
            msg.text('');
            img.show();
        },
        success: function (data) {
            var str = data.d;
            if (str.length > 0) {
                var htm = "";
                htm += "<table class='table table-hover' style='width:100%; font-size:13px;'>";
                htm += "<tr>";
                htm += "<th>參加人</th><th>身份證</th><th>生日</th><th>工號</th><th>手機</th><th>Email</th><th>金額</th><th>備註</th><th></th>";
                htm += "</tr>";
                $.each(str, function (i, v) {
                    if (i == 0) {
                        $("#hidActid").val(v.ActID.toString());
                        $("#lbActname").text(v.ActName.toString());
                    }
                    htm += get_line(v.SeqNo.toString(), v.Name.toString(), v.SID.toString(), v.DOB.toString(),
                        v.EmpID.toString(), v.Cell.toString(), v.Email.toString(), v.Price.toString(), v.Comment.toString());
                });
                htm += "<tr>";
                htm += "<td>";
                htm += "<input id='txtENameX' type='text' maxlength='50' value='' class='form-control input-sm required' style='width:86px!important;'/>";
                htm += "</td>";
                htm += "<td>";
                htm += "<input id='txtESidX' type='text' maxlength='20' value='' class='form-control input-sm required' style='width:96px!important;' />";
                htm += "</td>";
                htm += "<td>";
                htm += "<input id='txtEDobX' type='text' maxlength='10' value='' class='form-control input-sm dateISO required' style='width:94px!important;' />";
                htm += "</td>";
                htm += "<td>";
                htm += "<input id='txtEEmpIDX' type='text' maxlength='20' value='' class='form-control input-sm' style='width:96px!important;' />";
                htm += "</td>";
                htm += "<td>";
                htm += "<input id='txtECellX' type='text' maxlength='20' value='' class='form-control input-sm cell required' style='width:96px!important;' />";
                htm += "</td>";
                htm += "<td>";
                htm += "<input id='txtEEmailX' type='text' maxlength='50' value='' class='form-control input-sm'/>";
                htm += "</td>";
                htm += "<td>";
                htm += "<input id='txtEPriceX' type='text' maxlength='6' value='' class='form-control input-sm'/>";
                htm += "</td>";
                htm += "<td>";
                htm += "<input id='txtECmtX' type='text' maxlength='50' value='' class='form-control input-sm'/>";
                htm += "</td>";
                htm += "<td>";
                htm += "<button  id='detUX' type='button' onclick='add_detail(this.id)' class='btn btn-success btn-xs udpD'><span class='glyphicon glyphicon-floppy-disk'></span></button>";
                htm += "</td>";
                htm += "</tr>";
                htm += "</table>";

            } else {
                htm = "<h4>目前沒有資料</h4>";
            }
            cnt.html('');
            cnt.html(htm);
            //$(htm).insertAfter(tr).closest('tr');
            img.hide();
            $("#myModal").modal('show');

        },
        error: function (xhr, textStatus, thrownError) {
            alert("連線異常新增報名清單失敗！");
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(thrownError);
            img.hide();
        }
    });
    return false;
}

function get_line(i, name, sid, dob, empid, cell, email, price, cmt) {
    var sb = "";
    sb += "<tr class='detline'>";
    sb += "<td>";
    sb += "<input id='txtEName" + i + "' type='text' maxlength='50' value='" + name + "' class='form-control input-sm required' style='width:86px!important;'/>";
    sb += "</td>";
    sb += "<td>";
    sb += "<input id='txtESid" + i + "' type='text' maxlength='20' value='" + sid + "' class='form-control input-sm required' style='width:96px!important;' />";
    sb += "</td>";
    sb += "<td>";
    sb += "<input id='txtEDob" + i + "' type='text' maxlength='10' value='" + dob + "' class='form-control input-sm dateISO required' style='width:94px!important;' />";
    sb += "</td>";
    sb += "<td>";
    sb += "<input id='txtEEmpID" + i + "' type='text' maxlength='20' value='" + empid + "' class='form-control input-sm' style='width:96px!important;' />";
    sb += "</td>";
    sb += "<td>";
    sb += "<input id='txtECell" + i + "' type='text' maxlength='20' value='" + cell + "' class='form-control input-sm cell required' style='width:96px!important;' />";
    sb += "</td>";
    sb += "<td>";
    sb += "<input id='txtEEmail" + i + "' type='text' maxlength='50' value='" + email + "' class='form-control input-sm'/>";
    sb += "</td>";
    sb += "<td>";
    sb += "<input id='txtEPrice" + i + "' type='text' maxlength='6' value='" + price + "' class='form-control input-sm'/>";
    sb += "</td>";
    if (cmt == null) { cmt = ""; }
    sb += "<td>";
    sb += "<input id='txtECmt" + i + "' type='text' maxlength='50' value='" + cmt + "' class='form-control input-sm'/>";
    sb += "</td>";
    sb += "<td>";
    //sb += "<span id='updt" + i + "' title='更新' class='glyphicon glyphicon-floppy-disk' onclick='update_detail(this.id)'></span>";
    sb += "<button  id='detU" + i + "' type='button' onclick='save_detail(this.id)' class='btn btn-success btn-xs udpD'><span class='glyphicon glyphicon-floppy-disk'></span></button>";
    //sb += "&nbsp;";
    sb += "<button  id='detR" + i + "' type='button' onclick='remove_detail(this.id)' class='btn btn-danger btn-xs udpD'><span class='glyphicon glyphicon-remove'></span></button>";
    //sb += "<span id='remove" + i + "' title='刪除' class='glyphicon glyphicon-remove' onclick='remove_detail(this.id)'></span>";
    sb += "</td>";
    sb += "</tr>";
    return sb;
}

//轉正
function transfer_act(oid) {
    hideMsg();
    var tr = $("#" + oid).parent().parent();
    oid = oid.replace("tran", "");   
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "../../mcpservices/SvOrder.asmx/Waiting_to_Order",
        data: JSON.stringify({ "orderid": oid }),
        dataType: "json",
        async: true,
        success: function (data, textStatus) {
            var result = data.d;
            if (result.substring(0, 2) != "OK") {
                showMsg(result);
                return false;
            }
            result = result.replace("OK", "");
            showMsg("已加入到報名清單，單號為：" + result);          
            tr.remove();
        },
        error: function (xhr, status, error) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(error);
            showMsg("伺服器異常！刪除失敗！");
        }
    });

}

//執行轉正
function save_tran() {
    var oid = $("#popID").text();
    var actid = $("#ddlTrans").val();
    var img = $("#imgLoad");
    var msg = $("#msgErr");
    msg.text("");

    if (oid.length <= 0) {
        msg.text("訂單編號遺失無法執行轉梯");
        return false;
    }

    if (actid == undefined) {
        msg.text("請選擇活動再執行轉梯");
        return false;
    }

    if (actid.length <= 0) {
        msg.text("請選擇活動再執行轉梯");
        return false;
    }

    img.show();


    // alert(oid + "  " + actid);
}

//轉活動
function switch_act(oid) {
    oid = oid.replace("switch", "");
    $("#msgErr").text('');
    $("#popID").text(oid);
    var sb = "";
    sb += "<div class='input-zone'>";
    sb += "<select id='ddlSwitch' class='form-control' style='width:320px!important;'>";
    if (objAct != null) {     
        $.each(objAct, function (i, v) {
            sb += "<option value='" + v.ActID.toString() + "'>" + v.Name.toString().substring(0, 12) + "(" + v.StartDay.toString() + ")</option>";
        });
    }
    sb += "</select>";
    sb += "</div>";
    sb += "<div class='input-zone'>";
    sb += "<button type='button' onclick='save_switch()' class='btn btn-danger'>轉換</button>";
    sb += "</div>";
    $(".details").html('');
    $(".details").html(sb);
    $("#imgLoad").hide();
    $("#myModal").modal('show');
}

//執行轉活動
function save_switch() {
    
    var oid = $("#popID").text();
    var actid = $("#ddlSwitch").val();
    var img = $("#imgLoad");
    var msg = $("#msgErr");
    msg.text("");

    var tr = $("#switch" + oid).parent().parent();    

    if (oid.length <= 0) {
        msg.text("訂單編號遺失無法執行轉梯");
        return false;
    }

    if (actid == undefined) {
        msg.text("請選擇活動再執行轉梯");
        return false;
    }

    if (actid.length <= 0) {
        msg.text("請選擇活動再執行轉梯");
        return false;
    }

    img.show();

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "../../mcpservices/SvOrder.asmx/Waiting_Transfer",
        data: JSON.stringify({ "orderid": oid, "actid": actid }),
        dataType: "json",
        async: true,
        success: function (data, textStatus) {
            var result = data.d;
            if (result == "OK") {
                msg.text("已完成轉梯");
                tr.remove();
            } else {
                msg.text(result);
            }
            img.hide();
        },
        error: function (xhr, status, error) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(error);
            img.hide();
            msg.text("伺服器異常！刪除失敗！");
        }
    });    
}


//更新主單資訊
function save_main(id) {
    var tr = $("#" + id).parent().parent();
    id = id.replace("sav", "");
    var img = $("#loading");

    if (id.length <= 0) { alert("無法取得報名編號，目前無法進行更新！"); return false; }

    var isValid = check_input(
        tr.find("input[id^='txtCust']").val(), 
        '09/09/1999', 
        'A132587456', 
        '4321',
        tr.find("input[id^='txtCel']").val(),
        tr.find("input[id^='txtTel']").val(), 
        '3366',
        tr.find("input[id^='txtMail']").val(),
        tr.find("input[id^='txtPrice']").val()
    );
   
    if (isValid != 'OK') { alert(isValid); return false; }   

    var Order = {};
    Order.OrderID = id;
    Order.Name = tr.find("input[id^='txtCust']").val();
    Order.Tel1 = tr.find("input[id^='txtTel']").val();
    Order.Cell1 = tr.find("input[id^='txtCel']").val();
    Order.Tel2 = "";
    Order.Cell2 = "";
    Order.Fax = "";
    Order.Address = '';
    Order.Email = tr.find("input[id^='txtMail']").val();
    Order.TotalPrice = tr.find("input[id^='txtPrice']").val();
    Order.IsPromote = false;
    Order.IsConfirm = false;
    Order.IsPromote = false;
    Order.Comment = tr.find("input[id^='txtGp']").val();
    Order.Source = '';
    Order.Company = 'wt';

    udpD_btn_disable(true);

    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvOrder.asmx/Update_Waiting_Main",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "order": Order, "action": "Update" }),
        cache: false,
        before: function () {
            img.show();
        },
        success: function (data) {
            var str = data.d;
            if (str != "OK") { alert(str); } else { alert("資料已更新！"); }
            img.hide();
            udpD_btn_disable(false);
        },
        error: function (xhr, textStatus, error) {
            msg.text('伺服器連線錯誤，目前無法更新');
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(error);
            img.hide();
            udpD_btn_disable(false);
        }
    });
}

//更新明細資訊
function save_detail(seqno) {
    var tr = $("#" + seqno).parent().parent();
    var img = $("#imgLoad");
    var msg = $("#msgErr");
    msg.text("");
    seqno = seqno.replace("detU", "");

    var isValid = check_input(tr.find("input[id^='txtEName']").val(),
        tr.find("input[id^='txtEDob']").val(),
        tr.find("input[id^='txtESid']").val(),
        tr.find("input[id^='txtEEmpID']").val(),
        tr.find("input[id^='txtECell']").val(), '02-2383-0294', '3366',
        tr.find("input[id^='txtEEmail']").val(),
        tr.find("input[id^='txtEPrice']").val());
    if (isValid != 'OK') { msg.text(isValid); return false; }

    var Dts = {};
    Dts.SeqNo = seqno;
    Dts.OrderID = $("#popID").text();
    Dts.ActID = $("#hidActid").val();
    Dts.ActName = $("#lbActname").text();
    Dts.Name = tr.find("input[id^='txtEName']").val();
    Dts.SID = tr.find("input[id^='txtESid']").val();
    Dts.EmpID = tr.find("input[id^='txtEEmpID']").val();
    Dts.DOB = tr.find("input[id^='txtEDob']").val();
    Dts.Cell = tr.find("input[id^='txtECell']").val();
    Dts.Email = tr.find("input[id^='txtEEmail']").val();
    Dts.Price = tr.find("input[id^='txtEPrice']").val();
    Dts.Comment = tr.find("input[id^='txtECmt']").val();

    udpD_btn_disable(true);

    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvOrder.asmx/Update_Waiting_Detail",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "details": Dts, "action": "Update" }),
        cache: false,
        before: function () {
            img.show();
        },
        success: function (data) {
            var str = data.d;
            if (str != "OK") { msg.text(str); } else { msg.text("資料已更新！"); }
            img.hide();
            udpD_btn_disable(false);
            load_data();
        },
        error: function (xhr, textStatus, error) {
            msg.text('伺服器連線錯誤，目前無法更新');
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(error);
            img.hide();
            udpD_btn_disable(false);
        }
    });

}

//新增明細資訊
function add_detail(xid) {
    var tr = $("#" + xid).parent().parent();
    var img = $("#imgLoad");
    var msg = $("#msgErr");
    msg.text("");
    //xid = seqno.replace("detU", "");

    var isValid = check_input(tr.find("input[id^='txtEName']").val(),
        tr.find("input[id^='txtEDob']").val(),
        tr.find("input[id^='txtESid']").val(),
        tr.find("input[id^='txtEEmpID']").val(),
        tr.find("input[id^='txtECell']").val(), '02-2383-0294', '3366',
        tr.find("input[id^='txtEEmail']").val(),
        tr.find("input[id^='txtEPrice']").val());
    if (isValid != 'OK') { msg.text(isValid); return false; }

    var Dts = {};
    Dts.SeqNo = 0;
    Dts.OrderID = $("#popID").text();
    Dts.ActID = $("#hidActid").val();
    Dts.ActName = $("#lbActname").text();
    Dts.Name = tr.find("input[id^='txtEName']").val();
    Dts.SID = tr.find("input[id^='txtESid']").val();
    Dts.EmpID = tr.find("input[id^='txtEEmpID']").val();
    Dts.DOB = tr.find("input[id^='txtEDob']").val();
    Dts.Cell = tr.find("input[id^='txtECell']").val();
    Dts.Email = tr.find("input[id^='txtEEmail']").val();
    Dts.Price = tr.find("input[id^='txtEPrice']").val();
    Dts.Comment = tr.find("input[id^='txtECmt']").val();


    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvOrder.asmx/Update_Waiting_Detail",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "details": Dts, "action": "Add" }),
        cache: false,
        before: function () {
            img.show();
        },
        success: function (data) {
            var str = data.d;
            if (str != "OK") { msg.text(str); } else { msg.text("資料已更新！"); }
            img.hide();
            udpD_btn_disable(false);
            $("#myModal").modal('hide');
        },
        error: function (xhr, textStatus, error) {
            msg.text('伺服器連線錯誤，目前無法更新');
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(error);
            img.hide();
            udpD_btn_disable(false);
        }
    });

}


//刪除訂單
function delete_main(id) {
    if (!confirm("確定要刪除嗎？")) { return false; }
    var tr = $("#" + id).parent().parent();
    id = id.replace("del", "");
    var img = $("#loading");

    if (id.length <= 0) { alert("無法取得報名編號，目前無法進行更新！"); return false; }

    var Order = {};
    Order.OrderID = id;
    Order.Name = tr.find("input[id^='txtCust']").val();
    Order.Tel1 = tr.find("input[id^='txtTel']").val();
    Order.Cell1 = tr.find("input[id^='txtCel']").val();
    Order.Tel2 = "";
    Order.Cell2 = "";
    Order.Fax = "";
    Order.Address = '';
    Order.Email = tr.find("input[id^='txtMail']").val();
    Order.TotalPrice = 0;
    Order.IsPromote = false;
    Order.IsConfirm = false;
    Order.IsPromote = false;
    Order.Comment = tr.find("input[id^='txtGp']").val();
    Order.Source = '';
    Order.Company = 'wt123';

    hideMsg();
    udpD_btn_disable(true);
    img.show();

    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvOrder.asmx/Update_Waiting_Main",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "order": Order, "action": "Delete" }),
        cache: false,     
        success: function (data) {
            var str = data.d;
            if (str != "OK") { showMsg(str); } else { showMsg("資料已刪除！"); }
            img.hide();
            udpD_btn_disable(false);
            tr.remove();
        },
        error: function (xhr, textStatus, error) {
            showMsg('伺服器連線錯誤，目前無法刪除');
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(error);
            img.hide();
            udpD_btn_disable(false);

        }
    });
}

//刪除明細資訊
function remove_detail(seqno) {
    if (!confirm("確定要刪除嗎？")) { return false; }
    var tr = $("#" + seqno).parent().parent();
    var img = $("#imgLoad");
    var msg = $("#msgErr");
    var oid = $("#popID").text();
    var actid = $("#hidActid").val();
    msg.text("");
    seqno = seqno.replace("detR", "");
    if (!isInteger(seqno)) { msg.text("序列號遺失，無法進行刪除！"); return false; }
    //if (oid.length <= 0) { msg.text("單號遺失，無法進行刪除！"); return false; }
    if (actid.length <= 0) { msg.text("活動編號遺失，無法進行刪除！"); return false; }
    if (actid == "F1060210001") { msg.text("此一活動需至主表單執行刪除動作！"); return false; }

    var Dts = {};
    Dts.SeqNo = seqno;
    Dts.OrderID = oid;
    Dts.ActID = actid;
    Dts.ActName = $("#lbActname").text();
    Dts.Name = tr.find("input[id^='txtEName']").val();
    Dts.SID = tr.find("input[id^='txtESid']").val();
    Dts.EmpID = tr.find("input[id^='txtEEmpID']").val();
    Dts.DOB = tr.find("input[id^='txtEDob']").val();
    Dts.Cell = tr.find("input[id^='txtECell']").val();
    Dts.Email = tr.find("input[id^='txtEEmail']").val();
    Dts.Comment = tr.find("input[id^='txtECmt']").val();

    udpD_btn_disable(true);

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "../../mcpservices/SvOrder.asmx/Update_Waiting_Detail",
        data: JSON.stringify({ "details": Dts, "action": "Delete" }),
        dataType: "json",
        async: true,
        beforeSend: function () {
            img.show();
        },
        success: function (data, textStatus) {
            var result = data.d;
            if (result == "OK") {
                tr.remove();
                msg.text("已刪除");
            } else {
                msg.text(result);
            }
            img.hide();
            udpD_btn_disable(false);
        },
        error: function (xhr, status, error) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(error);
            img.hide();
            msg.text("伺服器異常！刪除失敗！");
            udpD_btn_disable(false);
        }
    });
}

function udpD_btn_disable(disable) {
    if (disable) { $(".udpD").prop('disabled', true); } else { $(".udpD").prop('disabled', false); }
}

function check_input(name, dob, sid, eid, cell, phone, ext, email, price) {
    var result = "OK"
    //if (name.length <= 0) { result = "請輸入姓名"; }
    ////if (eid.length <= 0) { result = "請輸入工號"; }
    //if (dob.length <= 0) { result = "請輸入生日"; }
    //if (!isValidDate(dob)) { result = "生日格式錯誤！格式應為：yyyy/mm/dd"; }
    //if (sid.length <= 0) { result = "請輸入身份證號"; }
    //if (!isSID(sid)) { result = "身份證或護照號碼錯誤！"; }
    //if (cell.length <= 0) { result = "請輸入手機號碼"; }
    //if (!isTel(cell, 'cell')) { result = "手機號碼格式錯誤！格式應為：0933-666888"; }
    //if (phone.length <= 0) { result = "請輸電話號碼"; }
    //if (ext.length <= 0) { result = "請輸電話分機"; }
    //if (!isInteger(ext)) { result = "分機需為數字"; }
    //if (!isTel(phone, 'tel')) { result = "電話號碼格式錯誤！格式應為：02-8226-9088"; }
    //if (email.length <= 0) { result = "請輸入Email"; }
    //if (!isEmail(email)) { result = "聯絡人Email格式錯誤！格式應為：xxx@xxx.com"; }
    if (!isInteger(price)) { result = "金額不正確，請重新輸入！"; }
    return result;
}

//重寄確認信
function send_mail(id) {

    var tr = $("#" + id).parent().parent();
    var img = $("#loading");
    var url = "../../mcpservices/SvOrder.asmx/send_waiting_confirm_mail";

    id = id.replace("sent", "");

    if (id.length <= 0) { alert("無法取得報名編號，目前無法進行重寄！"); return false; }
     

    hideMsg();
    udpD_btn_disable(true);
    img.show();

    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "orderid": id, "sentto": "self" }),
        cache: false,
        success: function (data) {
            var str = data.d;           
            if (str != "OK") { showMsg(str); } else { showMsg("已寄出！"); }
            img.hide();
            udpD_btn_disable(false);
        },
        error: function (xhr, textStatus, error) {
            //msg.text('伺服器連線錯誤，目前無法刪除');
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(error);
            img.hide();
            udpD_btn_disable(false);
            showMsg(error);
        }
    });
}

//匯出
function export_excel() {
    var value = "";
    var loading = $("#loading");
    var filterby = $("#ddlOption").val();
    if (filterby == "none") { filterby = "Oid"; }
    if (filterby == "Aid") {
        value = $("#ddlAct").val();
    } else {
        value = $("#txtValue").val();
    }
    if (value.length <= 0) { value = "F"; }

    hideMsg();
    loading.show();

    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvOrder.asmx/Get_Waiting_Report",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "filterby": filterby, "filtervalue": value }),
        cache: false,
        asyn: false,        
        success: function (data) {
            var str = data.d;
            var htm = "";
            var total = 0, sub = 0;
            if (str.length > 0) {
                htm += "<table>";
                htm += "<tr>";

                htm += "<th>單號</th>";
                htm += "<th>活動名稱</th>";
                htm += "<th>活動日期</th>";
                htm += "<th>聯絡人</th>";
                htm += "<th>電話</th>";
                htm += "<th>聯絡手機</th>";
                htm += "<th>主單說明</th>";
                htm += "<th>應付金額</th>";
                htm += "<th>參加人</th>";
                htm += "<th>身份證</th>";
                htm += "<th>生日</th>";
                htm += "<th>工號</th>";
                htm += "<th>手機</th>";
                htm += "<th>Email</th>";
                htm += "<th>個人金額</th>";
                htm += "<th>素食</th>";
                htm += "<th>備註</th>";
                htm += "</tr>";
                var price = 0, qty = 0, dprice = 0, dqty = 0, mprice = 0, prepay = 0, total = 0, subTotal = 0;
                var paytype = "", oid = "", details = "", act = "";

                $.each(str, function (i, v) {
                    htm += "<tr>";

                    htm += "<td>" + v.OrderID.toString() + "</td>";
                    htm += "<td>" + v.ActName.toString() + "</td>";
                    htm += "<td>" + v.StartDay.toString() + "</td>";
                    htm += "<td>" + v.mainName.toString() + "</td>";
                    htm += "<td>" + v.mainTel.toString() + "</td>";
                    htm += "<td>" + v.mainCell.toString() + "</td>";
                    htm += "<td>" + v.mainCmt.toString() + "</td>";
                    htm += "<td>" + v.TotalPrice.toString() + "</td>";
                    htm += "<td>" + v.Name.toString() + "</td>";
                    htm += "<td>" + v.SID.toString() + "</td>";
                    htm += "<td>" + v.DOB.toString() + "</td>";
                    htm += "<td>" + v.EmpID.toString() + "</td>";
                    htm += "<td>" + v.Cell.toString() + "</td>";
                    htm += "<td>" + v.Email.toString() + "</td>";
                    htm += "<td>" + v.Price.toString() + "</td>";
                    if (v.IsVeg.toString() == 'True' || v.IsVeg.toString() == 'true') {
                        htm += "<td>素食</td>";
                    } else {
                        htm += "<td>X</td>";
                    }
                    htm += "<td>" + v.Comment.toString() + "</td>";
                    htm += "</tr>";
                });
                htm += "</table>";
                $("#loading").hide();
                //匯出成 Excel 檔案
                var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta charset="UTF-8"></head><body><table>{table}</table></body></html>';
                var dt = new Date();
                var yr = dt.getFullYear() - 1911;
                var m = dt.getMonth();
                var filename = "文曄活動候補清單_" + yr + m;
                var uri = 'data:application/vnd.ms-excel;base64,';
                var base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); };
                var format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };
                var a = document.createElement('a');
                var ctx = { worksheet: "S1" || 'Worksheet', table: htm }
                a.href = uri + base64(format(template, ctx));
                a.download = filename;
                a.click();
            } else { alert("此條件下查無資料，請重新輸入查詢條件！"); }
        },
        error: function (xhr, textStatus, thrownError) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(thrownError);
            $("#loading").hide();
            showMsg("目前查詢無結果，或是當前伺服器連線異常無法載入資料！");
        }
    });
}

function showMsg(msg) {
    $("#txtMsg").html(msg);
    $("#divMsg").addClass('alert-danger');
    $("#divMsg").show('fade');
}

function hideMsg() {
    $("#txtMsg").html('');
    $("#divMsg").removeClass('alert-danger');
    $("#divMsg").removeClass('alert-success');
    $("#divMsg").hide();
}

function isInteger(no) {
    try {
        if (no.length <= 0) { return false; }
        if (isNaN(no)) { return false; } else { return true; }
    } catch (err) {
        return false;
    }
}

function isDate(value) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        var day = new Date(value);
        return !isNaN(day.getDate());
    } else {
        return false;
    }
}