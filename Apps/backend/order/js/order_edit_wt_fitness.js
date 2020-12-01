$(document).ready(function () {
  
    //day_picker($(".input-zone").find("input[id$='_txtStart']").attr("id"));
    //day_picker($(".input-zone").find("input[id$='_txtEnd']").attr("id"));
    //$("#txtStart").val(GetDay(0));
    //$("#txtEnd").val(GetDay(0));

  //day_picker("txtStart");
  //day_picker("txtEnd");
  //day_picker("txtStDay");
    
  //load_company();
    $("#ddlAct").hide();
    $("#ddlAct").prop('disabled', true);
  $("#btnSearch").click(function () {
      load_data();
  });

  $("#btnUpdate").click(function () {
      update_news();
  });

  $("#btnExport").click(function () {
      export_excel();
  });

  

  $("#ddlOption").change(function () {    
      if (this.value == "Aid") {
          load_act();
          $("#ddlAct").show();
          $("#ddlAct").prop('disabled', false);
          $("#txtValue").prop('disabled', true);
      } else {          
          $("#ddlAct").hide();
          $("#ddlAct").prop('disabled', true);
          $("#txtValue").prop('disabled', false);
      }
  });
  

});

//載入活動清單
function load_act() {
    $("#ddlAct").html('');
    var loading = $("#loading");
    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvAct.asmx/load_Act",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "pageindex": 1, "pagesize": 100, "company": "wt123" }),
        cache: false,
        beforeSend: function () {
            loading.show();
        },
        success: function (response) {
            if (response.hasOwnProperty('d')) {
                var json = JSON.parse(response.d);
                var objAct = json.Acts;
                var sb = "<option value='none'>無活動資料</option>";
                if (objAct != null) {
                    sb = "";
                    $.each(objAct, function (i, v) {
                        sb += "<option value='" + v.ActID.toString() + "'>" + v.Name.toString() + "</option>";
                    });
                }
            }           
            $("#ddlAct").html(sb);
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
  if (filterby == "none") { filterby = "Oid"; }
  var value = "";

  if (filterby == "Aid") {
      value = $("#ddlAct").val();
  } else {
      value = $("#txtValue").val();
  }

  if (value.length <= 0) { value = "F";}
    //int pageindex, int pagesize, string filterby, string filtervalue
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvOrder.asmx/load_FitnessOrder_Paging",
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
            htm += "<th>詳細</th><th>編號</th><th>聯絡人</th><th>電話</th><th>手機</th><th>Email</th><th>下單日</th><th>團隊</th><th></th>";
            htm += "</tr>";
            $.each(objOd, function (i, v) {
                id = v.OrderID.toString();   
                htm += "<tr>";
                htm += "<td style='width:64px;'>";
               // htm += "<span id='" + id + "' onclick='load_details(this.id)' title='編輯'  class='glyphicon glyphicon-search'></span>";
                htm += "<button  id='" + id + "' type='button' onclick='load_details(this.id)' class='btn btn-info btn-xs'><span class='glyphicon glyphicon-search'></span></button>";
                htm += "</td>";
                htm += "<td><span id='lbID" + id + "'>" + id + "</span></td>";
                htm += "<td><input id='txtCust" + id + "' value='" + v.Name.toString() + "' placeholder='姓名' type='text' maxlength='50' class='form-control required input-sm' /></td>";
                htm += "<td><input id='txtTel" + id + "' value='" + v.Tel1.toString() + "' placeholder='電話' type='text' maxlength='20' class='form-control required input-sm' /></td>";
                htm += "<td><input id='txtCel" + id + "' value='" + v.Cell1.toString() + "' placeholder='手機' type='text' maxlength='20' class='form-control required input-sm' /></td>";
                htm += "<td><input id='txtMail" + id + "' value='" + v.Email.toString() + "' placeholder='Email' type='text' maxlength='120' class='form-control required input-sm' /></td>";
                htm += "<td><span id='lbDate" + id + "'>" + v.CreateDay.toString() + "</span></td>";
                htm += "<td><input id='txtGp" + id + "' value='" + v.Comment.toString() + "' placeholder='團隊' type='text' maxlength='50' class='form-control input-sm' /></td>";
                htm += "<td style='width:80px; text-align:center;'>";
                htm += "<button  id='sav" + id + "' type='button' onclick='save_main(this.id)' class='btn btn-success btn-xs udpD'><span class='glyphicon glyphicon-floppy-disk'></span></button>&nbsp;";
                htm += "<button  id='del" + id + "' type='button' onclick='delete_main(this.id)' class='btn btn-danger btn-xs udpD'><span class='glyphicon glyphicon-remove'></span></button>";
                //htm += "<span id='sav" + id + "' onclick='save_main(this.id)' class='glyphicon glyphicon-floppy-disk'></span>&nbsp;";
                //htm += "<span id='del" + id + "' onclick='delete_all(this.id)' class='glyphicon glyphicon-remove'></span>";
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
}

//載入明細
function load_details(oid) {
    $("#msgErr").text('');
    $("#popID").text(oid);
    var cnt = $(".details");
    var tr = $("#titleline");
    var img = $("#imgLoad");
    var msg = $("#msgErr");
    var actid = "", actname = "";
    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvOrder.asmx/Get_Wt_OrderDetail",
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
                htm += "<th>參加人</th><th>身份證</th><th>生日</th><th>工號</th><th>手機</th> <th>Email</th><th>備註</th><th></th>";
                htm += "</tr>";
                $.each(str, function (i, v) {
                  if (i == 0) {
                    $("#hidActid").val(v.ActID.toString());
                    $("#lbActname").text(v.ActName.toString());
                  }
                  htm += get_line(v.SeqNo.toString(), v.Name.toString(), v.SID.toString(), v.DOB.toString(),
                    v.EmpID.toString(), v.Cell.toString(), v.Email.toString(), v.Comment.toString());
                });
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

function get_line(i, name, sid, dob, empid, cell, email, cmt) {
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
    if (cmt == null) { cmt = "";}
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


//更新主單資訊
function save_main(id) {
  var tr = $("#" + id).parent().parent();
  id = id.replace("sav", "");
  var img = $("#loading");

  if (id.length <= 0) { alert("無法取得報名編號，目前無法進行更新！"); return false; }
 
  var isValid = check_input(tr.find("input[id^='txtCust']").val(), '09/09/1999', 'A132587456', '4321',                            
                            tr.find("input[id^='txtCel']").val(),
                            tr.find("input[id^='txtTel']").val(), '3366',
                            tr.find("input[id^='txtMail']").val());
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
  Order.TotalPrice = 0;
  Order.IsPromote = false;
  Order.IsConfirm = false;
  Order.IsPromote = false;
  Order.Comment = tr.find("input[id^='txtGp']").val();
  Order.Source = '';
  Order.Company = 'wt123';
 
  udpD_btn_disable(true);

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvOrder.asmx/Modify_wt_Order",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "order": Order, "action": "Update" }),
    cache: false,
    before: function () {
      img.show();
    },
    success: function (data) {
      var str = data.d;
      if (str != "OK") {alert(str); } else { alert("資料已更新！"); }
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
                            tr.find("input[id^='txtESid']").val(),
                            tr.find("input[id^='txtECell']").val(),'02-2383-0294', '3366',
                            tr.find("input[id^='txtEEmail']").val());
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
  Dts.Comment = tr.find("input[id^='txtECmt']").val();
  
  udpD_btn_disable(true);

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvOrder.asmx/Modify_wt_OrderDetails",
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

  udpD_btn_disable(true);

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvOrder.asmx/Modify_wt_Order",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "order": Order, "action": "Delete" }),
    cache: false,
    before: function () {
      img.show();
    },
    success: function (data) {
      var str = data.d;
      if (str != "OK") { alert(str); } else { alert("資料已刪除！"); }
      img.hide();
      udpD_btn_disable(false);
    },
    error: function (xhr, textStatus, error) {
      msg.text('伺服器連線錯誤，目前無法刪除');
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
  seqno = seqno.replace("detU", "");
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
    url: "../../mcpservices/SvOrder.asmx/Modify_wt_OrderDetails",
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

function check_input(name, dob, sid, eid, cell, phone, ext, email) {
  var result = "OK"
  if (name.length <= 0) { result = "請輸入姓名"; }
  if (eid.length <= 0) { result = "請輸入工號"; }
  if (dob.length <= 0) { result = "請輸入生日"; }
  if (!isValidDate(dob)) { result = "生日格式錯誤！格式應為：yyyy/mm/dd"; }
  if (sid.length <= 0) { result = "請輸入身份證號"; }
  if (!isSID(sid)) { result = "身份證或護照號碼錯誤！"; }
  if (cell.length <= 0) { result = "請輸入手機號碼"; }
  if (!isTel(cell, 'cell')) { result = "手機號碼格式錯誤！格式應為：0933-666888"; }
  if (phone.length <= 0) { result = "請輸電話號碼"; }
  if (ext.length <= 0) { result = "請輸電話分機"; }
  if (!isInteger(ext)) { result = "分機需為數字";}
  if (!isTel(phone, 'tel')) { result = "電話號碼格式錯誤！格式應為：02-8226-9088"; }
  if (email.length <= 0) { result = "請輸入Email"; }
  if (!isEmail(email)) { result = "聯絡人Email格式錯誤！格式應為：xxx@xxx.com"; }
  return result;
}

//載入費用支出資訊並匯出
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

    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvOrder.asmx/Get_FitnessOrder_Report",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({"filterby": filterby, "filtervalue": value }),
        cache: false,
        asyn: false,
        beforeSend: function () {
            loading.show();
        },
        success: function (data) {
            var str = data.d;
            var htm = "";
            var total = 0, sub = 0;
            if (str.length > 0) {
                htm += "<table>";
                htm += "<tr>";
                htm += "<th style='width:106px;'>單號</th><th>活動名稱</th><th>參加人</th><th>身份證</th><th>生日</th><th>工號</th><th>性別</th><th>手機</th><th>Email</th><th>隊名</th><th>備註</th>";               
                htm += "</tr>";
                var price = 0, qty = 0, dprice = 0, dqty = 0, mprice = 0, prepay = 0, total = 0, subTotal = 0;
                var paytype = "", oid = "", details = "", act = "";

                $.each(str, function (i, v) {                   
                    htm += "<tr>";
                    htm += "<td>" + v.OrderID.toString() + "</td>";
                    htm += "<td>" + v.ActName.toString() + "</td>";
                    htm += "<td>" + v.Name.toString() + "</td>";
                    htm += "<td>" + v.SID.toString() + "</td>";
                    htm += "<td>" + v.DOB.toString() + "</td>";
                    htm += "<td>" + v.EmpID.toString() + "</td>";
                    htm += "<td>" + v.Sex.toString() + "</td>";
                    htm += "<td>" + v.Cell.toString() + "</td>";
                    htm += "<td>" + v.Email.toString() + "</td>";
                    htm += "<td>" + v.Comment.toString() + "</td>";
                    htm += "<td>" + v.TempField.toString() + "</td>";
                    htm += "</tr>";
                });               
                htm += "</table>";
                $("#loading").hide();
                //匯出成 Excel 檔案
                var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta charset="UTF-8"></head><body><table>{table}</table></body></html>';
                var dt = new Date();
                var yr = dt.getFullYear() - 1911;
                var m = dt.getMonth();              
                var filename = "文曄減重清單_" + yr + m;
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
            alert("目前查詢無結果，或是當前伺服器連線異常無法載入資料！");
        }
    });
}

