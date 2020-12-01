$(function () {
  $("#txtValue").prop("disabled", true);

  //$('#aspnetForm').validate({
  //    onkeyup: function (element) { $(element).valid(); },
  //    blur: function (element) { $(element).valid(); }
  //});

  $("#ddlOption").change(function () {
    toggle_txtbox(this.value);
  });

  $("#btnSearch").click(function () {
    load_data();
  });

  $("#btnExport").click(function () {
    export_excel();
  });
});

function toggle_txtbox(item) {
  $("#txtValue").val("");
  if (item == "All") {
    $("#txtValue").prop("disabled", true);
  } else {
    $("#txtValue").prop("disabled", false);
  }
}

//載入付款資訊
function load_data() {
  var loading = $("#loading");
  var filter = $("#ddlOption").val();
  var value = $("#txtValue").val();

  var cnt = $("#content");
  var total = $(".totalRow");
  var pageindex = numFltr($("#hidCurrPage").val());
  var pagesize = numFltr($("#hidPagesize").val());

  if (filter == "All") {
    value = "H";
  }

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Load_Pay_Paging",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ pageindex: pageindex, pagesize: pagesize, filterby: filter, filtervalue: value }),
    cache: false,
    beforeSend: function () {
      loading.show();
    },
    success: function (response) {
      //console.log(response);
      if (response.hasOwnProperty("d")) {
        var json = JSON.parse(response.d);

        var totalrows = json.TotalRows;

        total.html("---- 共有 " + totalrows.toString() + " 筆資料 ----");
        var obj = json.PayList;
        //console.log(obj);
        var htm = "";
        if (obj != null) {
          var id = "";
          htm += "<div class='table-responsive'>";
          htm += "<table class='table table-hover' style='width:100%; font-size:11px;'>";
          htm += "<tr>";
          htm += "<th style='width:88px'>單號</th>";
          htm += "<th>飯店</th>";
          htm += "<th style='width:76px;'>房型</th>";
          htm += "<th style='width:88px'>付款人</th>";
          htm += "<th style='width:88px'>報名人</th>";
          htm += "<th style='width:106px;'>工號</th>";
          htm += "<th style='width:88px'>應付金額</th>";
          htm += "<th style='width:88px'>實付金額</th>";
          htm += "<th style='width:88px'>手機</th>";
          htm += "<th style='width:88px'>付款方式</th>";
          htm += "<th style='width:88px'>帳號後五碼</th>";
          htm += "<th style='width:88px'>付款日期</th>";
          htm += "<th>說明1</th>";
          htm += "<th>說明2</th>";
          htm += "<th style='width:94px'></th>";
          htm += "</tr>";

          $.each(obj, function (i, v) {
            id = v.OrderID.toString();
            htm += "<tr>";
            htm += "<td><span id='lbID" + id + "'>" + id + "</span></td>";
            htm += "<td><span id='lbActName" + id + "' style='font-size:12px;'>" + v.ActName.toString() + "</span></td>";
            htm += "<td><span id='lbRoom" + id + "'>" + v.RoomType.toString() + "人房</span></td>";
            htm += "<td><span id='lbPayName" + id + "'>" + v.PayName.toString() + "</span></td>";
            htm += "<td><span id='lbName" + id + "'>" + v.Name.toString() + "</span></td>";
            htm += "<td><span id='lbEid" + id + "'>" + v.EID.toString() + "</span></td>";
            htm += "<td><span id='lbPrice" + id + "'>" + v.Price.toString() + "</span></td>";
            htm += "<td><input id='txtTotal" + id + "' type='text' class='form-control' value='" + v.ActualPay.toString() + "' /></td>";
            htm += "<td><span id='lbCell" + id + "'>" + v.PayCell.toString() + "</span></td>";
            htm += "<td><span id='lbType" + id + "'>" + v.PayType.toString() + "</span></td>";
            htm += "<td><input id='txtAcctNo" + id + "' type='text' class='form-control' value='" + v.Account.toString() + "' /></td>";
            htm += "<td><span id='lbDays" + id + "'>" + v.PayDay.toString() + "</span></td>";
            htm += "<td><span id='lbMainCmt" + id + "' style='font-size:12px;'>" + v.Comment.toString() + "</span></td>";
            htm += "<td><input id='txtCmt" + id + "' type='text' class='form-control' value='" + v.PayCmt.toString() + "' /></td>";
            htm += "<td>";
            htm += "<button id='btnSav" + id + "' type='button' onclick='modify(this.id)' class='btn btn-info btn-xs udpD'><span class='glyphicon glyphicon-floppy-disk'></span></button> &nbsp;";
            //htm += "<button id='btnDel" + id + "' type='button' onclick='modify(this.id)' class='btn btn-danger btn-xs udpD'><span class='glyphicon glyphicon-remove'></span></button>";
            htm += "</td>";
            htm += "</tr>";
          });
          htm += "</table>";
          htm += "</div>";
        }
        cnt.html("");
        cnt.html(htm);
        pageing(totalrows, pageindex, pagesize);
      } else {
        cnt.html("");
        total.html("---- 共有 0 筆資料 ----");
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
    },
  });
}

//更新資訊
function modify(id) {
  var img = $("#loading");

  img.show();
  switch_contrl("disable");

  var tr = $("#" + id)
    .parent()
    .parent();
  var action = "Update";

  if (id.substring(0, 6) == "btnDel") {
    action = "Delete";
    id = id.replace("btnDel", "");
  } else {
    action = "Update";
    id = id.replace("btnSav", "");
  }

  var obj = {};
  obj.OrderID = id;
  obj.Price = tr.find("input[id^='txtTotal']").val();
  obj.Account = tr.find("input[id^='txtAcctNo']").val();
  obj.Comment = tr.find("input[id^='txtCmt']").val();
  obj.Action = action;

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Update_Hotel_Payment",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ model: obj }),
    cache: false,
    before: function () {},
    success: function (data) {
      var result = data.d;
      if (result != "OK") {
        alert(result);
      } else {
        alert("資料已更新！");
      }
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
    },
  });
}

function convertDate(input) {
  var regx = /^(\d{4})\/(\d{2})\/(\d{2})$/g;
  var match = regx.exec(input);
  var m = match[2];
  var d = match[3];

  if (m.substring(0, 1) == "0") m = m.replace("0", "");

  if (d.substring(0, 1) == "0") d = d.replace("0", "");

  //console.log(m + "月" + d + "日");
  return m + "月" + d + "日";
}

//匯出
function export_excel() {
  var filter = $("#ddlOption").val();
  var value = $("#txtValue").val();

  var loading = $("#loading");
  switch_contrl("disable");
  loading.show();

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Hotel_Order_Report",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ filterby: filter, filtervalue: value }),
    cache: false,
    asyn: false,
    success: function (data) {
      var json = JSON.parse(data.d);
      console.log(json);
      //var objOd = json.Orders;
      var htm = "";
      if (json.length > 0) {
        htm += "<table>";
        htm += "<tr>";
        htm += "<th>飯店</th>";
        htm += "<th>訂房日</th>";
        htm += "<th>時間</th>";
        htm += "<th>房型</th>";
        htm += "<th>編號</th>";
        htm += "<th>聯絡人</th>";
        htm += "<th>身分證</th>";
        htm += "<th>生日</th>";
        htm += "<th>工號</th>";
        htm += "<th>電話</th>";
        htm += "<th>手機</th>";
        htm += "<th>Email</th>";
        htm += "<th>應付</th>";
        htm += "<th>訂房備註</th>";
        htm += "<th>報名日</th>";

        htm += "<th>付款人</th>";
        htm += "<th>實付金額</th>";
        htm += "<th>付款手機</th>";
        htm += "<th>付款方式</th>";
        htm += "<th>帳號後五碼</th>";
        htm += "<th>付款日期</th>";
        htm += "<th>付款備註</th>";

        htm += "</tr>";
        $.each(json, function (i, v) {
          htm += "<tr>";
          htm += "<td>" + v.ActName.toString() + "</td>";
          htm += "<td>" + v.OpenDay.toString() + "</td>";
          htm += "<td>" + v.CheckIn.toString() + "</td>";
          htm += "<td>" + v.RoomType.toString() + "人房</td>";
          htm += "<td>" + v.OrderID.toString() + "</td>";
          htm += "<td>" + v.Name.toString() + "</td>";
          htm += "<td>" + v.SID.toString() + "</td>";
          htm += "<td>" + v.DOB.toString() + "</td>";
          htm += "<td>" + v.EID.toString() + "</td>";
          htm += "<td>" + v.Tel.toString() + "</td>";
          htm += "<td>" + v.Cell.toString() + "</td>";
          htm += "<td>" + v.Email.toString() + "</td>";
          htm += "<td>" + v.Price.toString() + "</td>";
          htm += "<td>" + v.Comment.toString() + "</td>";
          htm += "<td>" + v.CreateDay.toString() + "</td>";

          htm += "<td>" + v.PayName.toString() + "</td>";
          htm += "<td>" + v.ActualPay.toString() + "</td>";
          htm += "<td>" + v.PayCell.toString() + "</td>";
          htm += "<td>" + v.PayType.toString() + "</td>";
          htm += "<td>" + v.Account.toString() + "</td>";
          htm += "<td>" + v.PayDay.toString() + "</td>";
          htm += "<td>" + v.PayCmt.toString() + "</td>";

          htm += "</tr>";
        });
        htm += "</table>";

        loading.hide();
        //匯出成 Excel 檔案
        var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta charset="UTF-8"></head><body><table>{table}</table></body></html>';
        var dt = new Date();
        var yr = dt.getFullYear() - 1911;
        var m = dt.getMonth();
        var filename = "文曄活動報名清單_" + yr + m;
        var uri = "data:application/vnd.ms-excel;base64,";
        var base64 = function (s) {
          return window.btoa(unescape(encodeURIComponent(s)));
        };
        var format = function (s, c) {
          return s.replace(/{(\w+)}/g, function (m, p) {
            return c[p];
          });
        };
        var a = document.createElement("a");
        var ctx = { worksheet: "S1" || "Worksheet", table: htm };
        a.href = uri + base64(format(template, ctx));
        a.download = filename;
        a.click();
      } else {
        alert("目前查無資料！");
      }
    },
    error: function (xhr, textStatus, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
      loading.hide();
      alert("目前查詢無結果，或是當前伺服器連線異常無法載入資料！");
    },
  });
}

function switch_contrl(action) {
  $("tr.detline").each(function (index) {
    if (action == "disable") {
      $(this).find("button[id^='updt']").prop("disabled", true);
      $(this).find("button[id^='remove']").prop("disabled", true);
    } else {
      $(this).find("button[id^='updt']").prop("disabled", false);
      $(this).find("button[id^='remove']").prop("disabled", false);
    }
  });
}

function udpD_btn_disable(disable) {
  if (disable) {
    $(".udpD").prop("disabled", true);
  } else {
    $(".udpD").prop("disabled", false);
  }
}
