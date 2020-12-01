$(function () {
    initial();
    $("#btnToS2").click(function () {
        verify_employee();
    });

    $("#btnBackS2").click(function () {
        show_setp("2");
    });

    $("#btnConfirm").click(function () {
        if (target == "one") { confirm_one_day(); } else { confirm_two_days(); }
    });

    $("#btnBackS3").click(function () {
        show_setp("3");
    });


    $("#btnSubmit").click(function () {
        submit();
    });

    $("#btnFinish").click(function () {
        complete();
    });

    $("#btnDismiss").click(function () {
        $("#errModal").modal('hide');
    });

});


var objRoom = null;
var aryOne = [];
var aryTwo = [];
var arrayJoinner = [];
var target = "one";
var errorMsg = [];
var info = null;
var employeeID = "";
var SSID = "";

function initial() {
    show_setp('1');
    WT.initialRoom();
    $("#txtEid").val('');
    $("#txtSid").val('');
}

function verify_employee() {
    employeeID = $("#txtEid").val();
    SSID = $("#txtSid").val();
    aryOne = [];
    aryTwo = [];

    if (!WT.isSID(SSID)) { showMsg("<p>請輸入正確身分證！</p>"); return false; }
    if (!WT.isEID(employeeID)) { showMsg("<p>請輸正確的工號！</p>"); return false; }

    $("#loading1").show();
    $("#login-msg").html("");

    WT.checkEmployee(employeeID, SSID, 'N').done(function (response) {

        var leaderName = "";
        if (response.hasOwnProperty('d')) {
            leaderName = response.d;
            if (leaderName == 'Empty') { showMsg("<p>很抱歉查不到您的員工資料！</p>"); $("#loading1").hide(); return false; }
            if (leaderName == 'Join') { showMsg("<p>您已經報名過此一系列的活動了，每位同仁限參加一日與二日活動各一次！</p>"); $("#loading1").hide(); return false; }
            load_my_order();
        } else {
            showMsg("<p>很抱歉服務器繁忙中，請稍後再嘗試！</p>");
        }
    }).fail(function (xhr, textStatus, error) {
        console.log(xhr.status);
        console.log(error);
        console.log("checkEmployee Failed");
        $("#loading1").hide();
        showMsg("<p>很抱歉服務器發生錯誤，請稍後再嘗試！</p>");
        return false;
    });
}

function load_my_order() {
    var def = $.ajax({
        type: "POST",
        url: "../../mcpservices/SvOrder.asmx/Load_My_WaitingList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "eid": employeeID, "sid": SSID }),
        cache: false,
        success: function (response) {
            if (response.hasOwnProperty('d')) {
                $.each(response.d, function (idx, val) {
                    if (val.ActID.substring(0, 2) == 'E1')
                        aryOne.push(val);
                    if (val.ActID.substring(0, 2) == 'E2')
                        aryTwo.push(val);
                });
            }
            $("#loading1").hide();
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(error);
            $("#loading1").hide();
            showMsg("很抱歉服務器發生錯誤，請稍後再嘗試！"); return false;
        }
    });

    def.done(function () {
        //console.log(aryOne);
        //console.log(aryTwo);
        if (aryOne.length <= 0 && aryTwo.length <= 0) {
            showMsg("<p>您目前沒有任何候補資訊！</p>");
            show_setp("1");
        } else {
            generate_act_line();
        }
    });
}

function generate_act_line() {
    $('#actTr').html('');
    var sb = '';

    if (aryOne.length > 0) {   
        sb += '<tr><td>' + aryOne[0].OrderID + '</td><td>' + aryOne[0].ActName + '</td><td>' + aryOne[0].StartDay + '</td><td>一日遊行程</td><td>';
        if (aryOne[0].Switch == "Y") {
            sb += '<input onclick="cancel(1)" type="button" class="btn btn-danger" value="取消" style="margin-right:6px;" />';
            sb += '<input onclick="edit(1)" type="button" class="btn btn-success" value="修改" />';
        } else {
            sb += '<span style="color:#c0c0c0; margin-right:6px;">[取消期限已過]</span>';
            sb += '<span style="color:#c0c0c0; margin-right:6px;">[修改期限已過]</span>';
        }
        sb += '</td></tr>';
    }

    if (aryTwo.length > 0) {
        objRoom = WT.getRoomObject(aryTwo[0].Room);      
        sb += '<tr><td>' + aryTwo[0].OrderID + '</td><td>' + aryTwo[0].ActName + '</td><td>' + aryTwo[0].StartDay + '</td><td>二日遊行程</td><td>';
        if (aryTwo[0].Switch == "Y") {
            sb += '<input onclick="cancel(2)" type="button" class="btn btn-danger" value="取消" style="margin-right:6px;" />';
            sb += '<input onclick="edit(2)" type="button" class="btn btn-success" value="修改" />';
        } else {
            sb += '<span style="color:#c0c0c0; margin-right:6px;">[取消期限已過]</span>';
            sb += '<span style="color:#c0c0c0; margin-right:6px;">[修改期限已過]</span>';
        }
        sb += '</td></tr>';
    }
    sb += '<tr><td colspan="5"><input onclick="show_setp(1)" type="button" class="btn btn-default pull-right" value="跳出" /></td></tr>';
    $('#actTr').append(sb);
    show_setp("2");
}

function cancel(id) {
    var isok = confirm("確定要取消候補嗎？");
    if (isok == false) { return false; }
    var oid = "";
    var data = null;
    var capicaty = 0;
    if (id == 1) { target = "one"; oid = aryOne[0].OrderID; }
    if (id == 2) { target = "two"; oid = aryTwo[0].OrderID; }

    if (oid.length <= 0) {
        showMsg("報名編號遺失，無法取消報名");
        return false;
    }
    $(".btn").prop('disabled', true);
    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvOrder.asmx/Cancel_Waiting_Order",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "orderid": oid }),
        cache: false,
        success: function (data) {
            var str = data.d;
            if (str != "OK") {
                showMsg(str);
            } else {
                complete();
            }            
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(error);
            $(".btn").prop('disabled', false);
            showMsg("<p>服務器發生錯誤!目前無法取消，請稍後再做嘗試。</p>");
        }
    });    
}

function edit(id) {
    console.log(id);
    $('#JoinerTr').html('');
    var dob = "", y = "", m = "", d = "", v = "";
    var mm = "", dd = "", isVeg = "", name = '', sid = '', eid = '', cell = '', email = '';
    var sb = "";
    var seqno = 0;

    if (id == 1) {
        target = "one";
        sb = WT.createJoinerForm(aryOne.length, aryOne[0].Leader, aryOne[0].SID, aryOne[0].EmpID);
        $("#lbNote").text('');
    }

    if (id == 2) {
        target = "two";
        sb = WT.createJoinerForm(objRoom.capacity, aryTwo[0].Leader, aryTwo[0].SID, aryTwo[0].EmpID);
        $("#lbNote").text(objRoom.desc + '(請注意您目前的房型無法變更)');
    }

    $('#JoinerTr').html(sb);
    WT.assignDateToDll();


    $('tr.listline').each(function (i) {
        y = $(this).find("select[id^='ddlYr']").attr('id');
        m = $(this).find("select[id^='ddlMm']").attr('id');
        d = $(this).find("select[id^='ddlDd']").attr('id');
        //datedroplist(y, m, d);
        v = $(this).find("select[id^='ddlVeg']").attr('id');
        if (id == 1) {
            $('#hidActid').val(aryOne[i].ActID);
            $('#hidActName').val(aryOne[i].ActName);
            $('#hidRoomType').val('');
            $('#hidOrderID').val(aryOne[i].OrderID);

            name = aryOne[i].Joiner;
            sid = aryOne[i].SID;
            eid = aryOne[i].EmpID;
            cell = aryOne[i].Cell;
            email = aryOne[i].PersonMail;
            dob = aryOne[i].DOB;
            isVeg = aryOne[i].IsVeg.toString();
            seqno = aryOne[i].Seqno;
        }

        if (id == 2) {
            $('#hidActid').val(aryTwo[i].ActID);
            $('#hidActName').val(aryTwo[i].ActName);
            $('#hidRoomType').val(aryTwo[i].Room);
            $('#hidOrderID').val(aryTwo[i].OrderID);

            name = aryTwo[i].Joiner;
            sid = aryTwo[i].SID;
            eid = aryTwo[i].EmpID;
            cell = aryTwo[i].Cell;
            email = aryTwo[i].PersonMail;
            dob = aryTwo[i].DOB;
            isVeg = aryTwo[i].IsVeg.toString();
            seqno = aryTwo[i].Seqno;
        }
        //console.log(dob);
        //console.log(dob.match(/^\d{4}\//g).toString().replace(/\//g, ''));
        //console.log(dob.match(/\/\d{2}\//g).toString().replace(/\//g, ''));
        //console.log(dob.match(/\/\d{2}$/g).toString().replace(/\//g, ''));
        //console.log(aryOne[i].IsVeg);
        $('#' + y).val(dob.match(/^\d{4}\//g).toString().replace(/\//g, ''));
        $('#' + y).trigger("change");
        mm = dob.match(/\/\d{2}\//g).toString().replace(/\//g, '');
        if (mm.substring(0, 1) == '0') { mm = mm.replace(/0/g, ''); }
        $('#' + m).val(mm);
        $('#' + m).trigger("change");
        dd = dob.match(/\/\d{2}$/g).toString().replace(/\//g, '');
        if (dd.substring(0, 1) == '0') { dd = dd.replace(/0/g, ''); }
        $('#' + d).val(dd);
        $('#' + v).val(isVeg);

        $(this).find("input[id^='txtCell']").val(cell);
        $(this).find("input[id^='txtEmail']").val(email);
        $(this).find("input[id^='hidSeqno']").val(seqno);
        if (i > 0) {
            $(this).find("input[id^='txtName']").val(name);
            $(this).find("input[id^='txtSid']").val(sid);
            $(this).find("input[id^='txtEid']").val(eid);
        }
    });
    show_setp("3");
}

function confirm_one_day() {
    arrayJoinner = [];
    errorMsg = [];

    arrayJoinner = WT.getJoinerList($('#hidActid').val(), $('#hidActName').val());

    if (arrayJoinner.length <= 0) { showMsg("<p>請輸入參加人資料！</p>"); return false; }

    errorMsg = WT.validateJoiner(arrayJoinner);
    if (errorMsg.length > 0) { confirmaionError(); return false; }

    errorMsg = WT.validateOneDayOrder(arrayJoinner);
    if (errorMsg.length > 0) { confirmaionError(); return false; }

    arrayJoinner = WT.calculateOneDayPrice(arrayJoinner);

    WT.generateOneDayConfirm(arrayJoinner);
    show_setp("4");
}

function confirm_two_days() {
    arrayJoinner = [];
    errorMsg = [];

    arrayJoinner = WT.getJoinerList($('#hidActid').val(), $('#hidActName').val());

    if (arrayJoinner.length <= 0) { showMsg("<p>請輸入參加人資料！</p>"); return false; }

    errorMsg = WT.validateJoiner(arrayJoinner);

    if (errorMsg.length > 0) { confirmaionError(); return false; }

    info = WT.validateTwoDaysOrder(arrayJoinner, $('#hidRoomType').val());

    if (info.Error.length > 0) { showMsg(info.Error); return false; }
    WT.generateTwoDaysConfirm(arrayJoinner, info);
    show_setp("4");
}

function confirmaionError() {
    var error = "<ul>";
    $.each(errorMsg, function (i, e) {
        error += "<li>" + e + "</li>";
    });
    error += "</ul>";
    showMsg(error);
}

function submit() {
    var oid = $('#hidOrderID').val();

    if (oid.length != 11) {
        showMsg("<p>很抱歉！您的報名編號遺失，目前無法更新您的報名！</p>");
        return false;
    }

    var loading = $("#loading-submit");
    var Order = {};
    Order.OrderID = oid;
    Order.Name = arrayJoinner[0].Name;
    Order.Tel1 = '';
    Order.Cell1 = '';
    Order.Address = '';
    Order.Email = arrayJoinner[0].Email;
    Order.IsPromote = false;
    Order.Company = 'wt';
    Order.Tel2 = $('#hidRoomType').val();

    //console.log(arrayJoinner);
    console.log(target);
    var cdata = { "order": Order, "detail": arrayJoinner, "waiting": "B" };

    loading.show();    

    if (target == "one") {
        if (oid.substring(0, 2) != "W1") {
            showMsg("<p>很抱歉！您的一日遊報名編號錯誤，目前無法更新您的報名！</p>");
            loading.hide();
            return false;
        }
        $("#btnSubmit").prop('disabled', true);
        $("#btnBackS3").prop('disabled', true);

        WT.makeOneDayWaitingList(cdata).done(function (response) {
            //console.log(response);
            if (response.hasOwnProperty('d')) {
                var result = response.d;
                if (result.substring(0, 2) != "OK") {
                    alert(result);
                    $("#btnSubmit").prop('disabled', false);
                    $("#btnBackS3").prop('disabled', false);
                    loading.hide();
                    return false;
                }
                //OKW20712050010
                result = result.substring(2, result.length);
                var oid = result.substring(0, 11);
                var total = result.substring(11, result.length);
                var sb = "";
                sb += "<p class='text-info'>";
                sb += "您的報名 (編號-" + oid + ") 資訊已更新完成，更新後的金額為：<span class='emphsize'>$" + total + "</span>";
                sb += "</p>";
                $("#odcnt").html('');
                $("#odcnt").html(sb);
                $("#myModal").modal('show');                
            }
        }).fail(function (xhr, textStatus, error) {
            console.log(xhr.status);
            console.log(error);
            console.log("Update One Day Order Failed");
            loading.hide();
            showMsg("<p>很抱歉服務器發生錯誤，目前無法送出報名表，請稍後再嘗試！</p>");
            complete();

        });
    } else {
        if (oid.substring(0, 2) != "W2") {
            showMsg("<p>很抱歉！您的二日遊報名編號錯誤，目前無法更新您的報名！</p>");
            loading.hide();
            return false;
        }

        $("#btnSubmit").prop('disabled', true);
        $("#btnBackS3").prop('disabled', true);

        WT.makeTwoDaysWaitingList(cdata).done(function (response) {
            //console.log(response);
            if (response.hasOwnProperty('d')) {
                var result = response.d;
                if (result.substring(0, 2) != "OK") {
                    showMsg("<p>" + result + "</p>");
                    $("#btnSubmit").prop('disabled', false);
                    $("#btnBackS3").prop('disabled', false);
                    loading.hide();
                    return false;
                }
                //OKW20712050010
                result = result.substring(2, result.length);
                var oid = result.substring(0, 11);
                var total = result.substring(11, result.length);
                var sb = "";
                sb += "<p class='text-info'>";
                sb += "您的報名 (編號-" + oid + ") 資訊已更新完成，更新後的金額為：<span class='emphsize'>$" + total + "</span>";
                sb += "</p>";
                $("#odcnt").html('');
                $("#odcnt").html(sb);
                $("#myModal").modal('show');                
                loading.hide();                
            }
        }).fail(function (xhr, textStatus, error) {
            console.log(xhr.status);
            console.log(error);
            console.log("Update Two Days Order Failed");
            loading.hide();
            showMsg("<p>很抱歉服務器發生錯誤，目前無法送出報名表，請稍後再嘗試！ </p>");
            complete();
        });
    }

}

function complete() {
    $("#myModal").modal('hide');
    //objRoom = null;
    aryOne = [];
    aryTwo = [];
    arrayJoinner = [];
    target = "one";
    errorMsg = [];
    info = null;   
    $("#confirmation").html('');
    enableAllBtns();
    load_my_order();    
}

function show_setp(step) {
    $(".steps").hide();
    if (step == "1") {
        objRoom = null;
        aryOne = [];
        aryTwo = [];
        target = "one";
        errorMsg = "";
        freeAmt = 0; joinAmt = 0; total = 0; adult = 0; threeyr = 0; sixyr = 0; age = 0;
        employeeID = "";
        SSID = "";
        $('#actTr').html('');
        $('#JoinerTr').html('');
        $("#txtEid").val('');
        $("#txtSid").val('');
        enableAllBtns();
    }
    $("#step" + step).show();
}

function enableAllBtns() {
    $("#btnSubmit").show();
    $("#btnBackS3").show();
    $("#btnBackS2").show();
    $("#btnSubmit").prop('disabled', false);
    $("#btnBackS2").prop('disabled', false);
    $("#btnBackS3").prop('disabled', false);
    $(".btn").prop('disabled', false);
}

function showMsg(str) {
    $("#divErr").html('');
    $("#errTitle").text('錯誤訊息');
    $("#divErr").html(str);
    $("#errModal").modal('show');
}

function showConfirm(str) {
    $("#divErr").html('');
    $("#errTitle").text('更新確認');
    $("#divErr").html('<h5>' + str + '</h5>');
    $("#errModal").modal('show');
}


