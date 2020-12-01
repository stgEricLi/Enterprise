$(document).ready(function () {
  // $("#ddlAct").hide();
  // $("#ddlAct").prop("disabled", true);

  $("#btnSearch").click(function () {
    load_data();
  });

  $("#btnExport").click(function () {
    export_excel();
  });

  $("#ddlOption").change(function () {
    var select = this.value;
    var txt = "";
    $("#txtValue").attr("placeholder", "");
    $("#txtValue").val("");
    $("#ddlAct").hide();
    $("#ddlAct").prop("disabled", true);
    $("#txtValue").prop("disabled", false);
    switch (select) {
      case "ACT":
        $("#ddlAct").html(ddlActHtml);
        $("#ddlAct").show();
        $("#ddlAct").prop("disabled", false);
        $("#txtValue").prop("disabled", true);
        break;
      case "EID":
        txt = "請輸入員工工號";
        break;
      case "Sid":
        txt = "請輸入身份證號";
        break;
      case "Day":
        txt = "日期格式:2019-04-13";
        break;
      case "OID":
        txt = "請輸入報名編號";
        break;
    }
    $("#txtValue").attr("placeholder", txt);
  });

  load_act();
});

var ddlActHtml = "";

//載入活動清單
function load_act() {
  $("#ddlAct").html("");
  var loading = $("#loading");
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAct.asmx/load_Act",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ pageindex: 1, pagesize: 100, company: "wt" }),
    cache: false,
    beforeSend: function () {
      loading.show();
    },
    success: function (response) {
      if (response.hasOwnProperty("d")) {
        var json = JSON.parse(response.d);
        var objAct = json.Acts;
        var sb = "<option value='none'>無活動資料</option>";
        if (objAct != null) {
          sb = "";
          $.each(objAct, function (i, v) {
            sb += "<option value='" + v.ActID.toString() + "'>" + v.Name.toString().substring(0, 12) + "(" + v.StartDay.toString() + ")</option>";
          });
        }
      }
      ddlActHtml = sb;
      $("#ddlAct").html(ddlActHtml);
      loading.hide();
    },
    error: function (xhr, textStatus, error) {
      $("#ddlAct").html("<option value='none'>無法取得活動資料</option>");
      alert("伺服器錯誤，無法取得活動資料！");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      loading.hide();
    },
  });
}

//載入主單
function load_data() {
  var filterby = $("#ddlOption").val();
  var cnt = $("#content");
  var loading = $("#loading");
  var total = $(".totalRow");
  var pageindex = numFltr($("#hidCurrPage").val());
  var pagesize = numFltr($("#hidPagesize").val());

  var value = "";

  $("#peoplecount").html("");
  total.html("");
  if (filterby == "ACT") {
    value = $("#ddlAct").val();
  } else {
    value = $("#txtValue").val();
    if (filterby == "Day") {
      if (!isDate(value)) {
        alert("日期格式須為:yyyy-mm-dd");
        return false;
      }
    }
  }
  console.log("Fiter Value: ", value);
  // if (value.length <= 0) {
  //   value = "F";
  // }
  // if (filterby == "E") {
  //   filterby = "Oid";
  //   value = "E";
  // }
  // if (filterby == "C") {
  //   filterby = "Oid";
  //   value = "C";
  // }

  loading.show();

  //int pageindex, int pagesize, string filterby, string filtervalue
  var def = $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Get_Hotel_BkOrder_Paging",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ pageindex: pageindex, pagesize: pagesize, filterby: filterby, filtervalue: value }),
    cache: false,
    asyn: false,
    success: function (response) {
      if (response.hasOwnProperty("d")) {
        var json = JSON.parse(response.d);
        var totalrows = json.TotalRows;

        total.html("---- 共有 " + totalrows.toString() + " 筆資料 ----");
        var objOd = json.Orders;
        var htm = "";
        console.log(objOd);
        if (objOd != null) {
          var id = "";

          htm += "<div class='table-responsive'>";
          htm += "<table class='table table-hover' style='width:100%; font-size:12px;'>";
          htm += "<tr>";
          /*
          htm += "<th style='width:46px;'>詳細</th>";
          htm += "<th style='width:46px;'>轉梯</th>";    */
          htm += "<th style='width:76px;'>編號</th>";
          htm += "<th>飯店</th>";
          htm += "<th style='width:96px;'>聯絡人</th>";
          htm += "<th style='width:106px;'>工號</th>";
          htm += "<th style='width:106px;'>生日</th>";
          htm += "<th style='width:146px;'>電話</th>";
          htm += "<th style='width:106px;'>手機</th>";
          htm += "<th style='width:180px;'>Email</th>";
          htm += "<th style='width:76px;'>房型</th>";
          htm += "<th style='width:106px;'>訂房日</th>";
          htm += "<th style='width:76px;'>時間</th>";
          htm += "<th style='width:76px;'>應付</th>";
          htm += "<th>備註</th>";
          htm += "<th style='width:46px;'>轉正</th>";
          htm += "<th style='width:86px;'></th>";
          htm += "</tr>";

          $.each(objOd, function (i, v) {
            id = v.OrderID.toString();
            htm += "<tr>";
            htm += "<td><span id='lbID" + id + "'>" + id + "</span></td>";
            htm += "<td><span id='lbActName" + id + "'>" + v.ActName.toString() + "</span></td>";
            htm += "<td><span id='lbName" + id + "'>" + v.Name.toString() + "</span></td>";
            htm += "<td><span id='lbEid" + id + "'>" + v.EID.toString() + "</span></td>";
            htm += "<td><span id='lbDob" + id + "'>" + v.DOB.toString() + "</span></td>";
            htm += "<td><input id='txtTel" + id + "' value='" + v.Tel.toString() + "' placeholder='電話' type='text' maxlength='20' class='form-control required input-sm' /></td>";
            htm += "<td><input id='txtCel" + id + "' value='" + v.Cell.toString() + "' placeholder='手機' type='text' maxlength='20' class='form-control required input-sm' /></td>";
            htm += "<td><input id='txtMail" + id + "' value='" + v.Email.toString() + "' placeholder='Email' type='text' maxlength='120' class='form-control required input-sm' /></td>";
            htm += "<td><span id='lbRoom" + id + "'>" + v.RoomType.toString() + "人房</span></td>";
            htm += "<td><span id='lbDate" + id + "'>" + convertDate(v.OpenDay.toString()) + "</span></td>";
            htm += "<td><input id='txtTime" + id + "' value='" + v.ChickIn.toString() + "' type='text' maxlength='6' class='form-control required input-sm' /></td>";
            htm += "<td><input id='txtPrice" + id + "' value='" + v.Price.toString() + "' type='text' maxlength='6' class='form-control required input-sm' /></td>";
            htm += "<td><input id='txtCmt" + id + "' value='" + v.Comment.toString() + "' type='text' maxlength='50' class='form-control input-sm' /></td>";
            htm += "<td><button  id='sent" + id + "' type='button' onclick='trans(this.id)' class='btn btn-warning btn-xs udpD'><span class='glyphicon glyphicon-envelope'></span></button></td>";
            htm += "<td style='text-align:center;'>";
            htm += "<button  id='sav" + id + "' type='button' onclick='save_main(this.id)' class='btn btn-success btn-xs udpD'><span class='glyphicon glyphicon-floppy-disk'></span></button>&nbsp;";
            htm += "<button  id='del" + id + "' type='button' onclick='delete_main(this.id)' class='btn btn-danger btn-xs udpD'><span class='glyphicon glyphicon-remove'></span></button>";
            htm += "</td>";
            /*            
            htm += "<td>";
            // htm += "<span id='" + id + "' onclick='load_details(this.id)' title='編輯'  class='glyphicon glyphicon-search'></span>";
            htm += "<button  id='" + id + "' type='button' onclick='load_details(this.id)' class='btn btn-info btn-xs'><span class='glyphicon glyphicon-search'></span></button>";
            htm += "</td>";
            htm += "<td>";
            htm += "<button  id='tran" + id + "' type='button' onclick='transfer_act(this.id)' class='btn btn-info btn-xs'><span class='glyphicon glyphicon-transfer'></span></button>";
            htm += "</td>";*/
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
    error: function (xhr, textStatus, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
      total.html("");
      cnt.html("<p class='loadingError'>目前網路連線異常無法載入資料！</p>");
      //$(".pagination a").unbind("click", function () { });
      $(".pagination").html("");
      loading.hide();
    },
  });
}

//更新主單資訊
function save_main(id) {
  var tr = $("#" + id)
    .parent()
    .parent();
  id = id.replace("sav", "");
  var img = $("#loading");

  if (id.length <= 0) {
    alert("無法取得報名編號，目前無法進行更新！");
    return false;
  }

  //if (!isInteger(tr.find("input[id^='txtPrice']").val())) { alert("金額不正確，請重新輸入！"); return false; }
  var valResult = check_input(tr.find("input[id^='txtCel']").val(), tr.find("input[id^='txtTel']").val(), tr.find("input[id^='txtMail']").val(), tr.find("input[id^='txtPrice']").val(), tr.find("input[id^='txtTime']").val());

  if (valResult != "OK") {
    alert(valResult);
    return false;
  }

  var obj = {};
  obj.OrderID = id;
  obj.Tel = tr.find("input[id^='txtTel']").val();
  obj.Cell = tr.find("input[id^='txtCel']").val();
  obj.Email = tr.find("input[id^='txtMail']").val();
  obj.Price = tr.find("input[id^='txtPrice']").val();
  obj.ChickIn = tr.find("input[id^='txtTime']").val();
  obj.Comment = tr.find("input[id^='txtCmt']").val();
  obj.Action = "Update";
  udpD_btn_disable(true);
  img.show();

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Update_Hotel_BkOrder",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ model: obj }),
    cache: false,
    success: function (data) {
      var str = data.d;
      if (str != "OK") {
        alert(str);
      } else {
        alert("資料已更新！");
      }
      img.hide();
      udpD_btn_disable(false);
    },
    error: function (xhr, textStatus, error) {
      alert("伺服器連線錯誤，目前無法更新");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      img.hide();
      udpD_btn_disable(false);
    },
  });
}

//刪除訂單
function delete_main(id) {
  if (!confirm("確定要刪除嗎？")) {
    return false;
  }
  var tr = $("#" + id)
    .parent()
    .parent();
  id = id.replace("del", "");
  var img = $("#loading");

  if (id.length <= 0) {
    alert("無法取得報名編號，目前無法進行更新！");
    return false;
  }

  var obj = {};
  obj.OrderID = id;
  obj.Tel = "";
  obj.Cell = "";
  obj.Email = "";
  obj.Price = 0;
  obj.Comment = "";
  obj.ChickIn = "";
  obj.Action = "Delete";
  udpD_btn_disable(true);
  img.show();

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Update_Hotel_BkOrder",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ model: obj }),
    cache: false,
    success: function (data) {
      var str = data.d;
      if (str != "OK") {
        alert(str);
      } else {
        alert("資料已刪除！");
      }
      img.hide();
      udpD_btn_disable(false);
      tr.remove();
    },
    error: function (xhr, textStatus, error) {
      alert("伺服器連線錯誤，目前無法刪除");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      img.hide();
      udpD_btn_disable(false);
    },
  });
}

function trans(id) {
  if (!confirm("確定要轉正嗎？")) {
    return false;
  }
  var tr = $("#" + id)
    .parent()
    .parent();
  id = id.replace("sent", "");
  var img = $("#loading");

  if (id.length <= 0) {
    alert("無法取得報名編號，目前無法進行更新！");
    return false;
  }

  var obj = {};
  obj.OrderID = id;
  obj.Tel = "";
  obj.Cell = "";
  obj.Email = "";
  obj.Price = 0;
  obj.Comment = "";
  obj.ChickIn = "";
  obj.Action = "Trans";
  udpD_btn_disable(true);
  img.show();

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Update_Hotel_BkOrder",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ model: obj }),
    cache: false,
    success: function (data) {
      var str = data.d;

      // ---- OKH20712050010 ----
      if (str.substring(0, 2) != "OK") {
        alert(str);
      } else {
        alert("已轉正！");
      }
      img.hide();
      udpD_btn_disable(false);
      tr.remove();
    },
    error: function (xhr, textStatus, error) {
      alert("伺服器連線錯誤，目前無法刪除");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      img.hide();
      udpD_btn_disable(false);
    },
  });
}

//重寄確認信
function send_mail(id) {
  var tr = $("#" + id)
    .parent()
    .parent();
  var img = $("#loading");
  var url = "../../mcpservices/SvHotel.asmx/send_hotel_confirm_mail";

  id = id.replace("sent", "");

  if (id.length <= 0) {
    alert("無法取得報名編號，目前無法進行重寄！");
    return false;
  }

  var email = tr.find("input[id^='txtMail']").val();

  udpD_btn_disable(true);

  $.ajax({
    type: "POST",
    url: url,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ orderid: id, sentto: "ReSend" }),
    cache: false,
    before: function () {
      img.show();
    },
    success: function (data) {
      var str = data.d;
      console.log("Success");
      if (str != "OK") {
        alert(str);
      } else {
        alert("已寄出！");
      }
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
      alert(error);
    },
  });
}

function udpD_btn_disable(disable) {
  if (disable) {
    $(".udpD").prop("disabled", true);
  } else {
    $(".udpD").prop("disabled", false);
  }
}

function check_input(cell, phone, email, price, time) {
  var result = "OK";
  var regx = /^\d{2}:\d{2}$/g;
  if (cell.length <= 0) {
    result = "請輸入手機號碼";
  }
  // if (!isTel(cell, "cell")) {
  //   result = "手機號碼格式錯誤！格式應為：0933-666888";
  // }
  if (phone.length <= 0) {
    result = "請輸電話號碼";
  }
  if (email.length <= 0) {
    result = "請輸入Email";
  }
  if (!isEmail(email)) {
    result = "聯絡人Email格式錯誤！格式應為：xxx@xxx.com";
  }
  if (!isInteger(price)) {
    result = "金額不正確，請重新輸入！";
  }

  if (!regx.test(time)) {
    result = "時間不正確，請重新輸入！";
  }
  return result;
}

//匯出
function export_excel() {
  var loading = $("#loading");
  loading.show();

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Hotel_BkOrder_Report",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    cache: false,
    asyn: false,
    success: function (data) {
      var json = JSON.parse(data.d);
      var objOd = json.Orders;
      var htm = "";
      if (objOd.length > 0) {
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
        htm += "<th>備註</th>";
        htm += "<th>報名日</th>";
        htm += "</tr>";
        $.each(objOd, function (i, v) {
          htm += "<tr>";
          htm += "<td>" + v.ActName.toString() + "</td>";
          htm += "<td>" + v.OpenDay.toString() + "</td>";
          htm += "<td>" + v.ChickIn.toString() + "</td>";
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

function isInteger(no) {
  try {
    if (no.length <= 0) {
      return false;
    }
    if (isNaN(no)) {
      return false;
    } else {
      return true;
    }
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
