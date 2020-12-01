$(document).ready(function () {
  initial();
  $("#btnSubmit").click(function () {
    addJoiner();
  });

  $("#ddlMb").change(function () {
    var sb = "";
    switch (this.value.substring(0, 1)) {
      case "2":
        sb = "你選擇了 2人房，自付金額 $0";
        break;
      case "3":
        sb = "你選擇了 3人房，自付金額 $1,000";
        break;
      case "4":
        sb = "你選擇了 4人房，自付金額 $2,500";
        break;
      default:
        sb = "請選擇入住人數";
    }
    $("#myRoom").text(sb);
  });
});

var errorMsg = [];
var arrayJoinner = [];
var Order = {};

//頁面初始化
function initial() {
  $("#loading").hide();
  $("#txtName").val("");
  $("#txtSid").val("");
  $("#txtDob").val("");
  $("#txtEid").val("");
  $("#txtCell").val("");
  $("#txtEmail").val("");
  $("#txtPhone").val("02-8226-9088");
  $("#txtExt").val("");
  $("#txtCmt").val("");
  $("#txtDate").val(WT.getDay(0));
  $("#txtDate").datepicker({ showOtherMonths: true });
}

function addJoiner() {
  hideMsg();
  errorMsg = [];
  Order = {};

  var actid = $("#ddlHotel").val();
  var room = $("#ddlMb").val();

  if (actid == "N") {
    errorMsg.push("請選擇飯店");
    confirmaionError(errorMsg);
    return;
  }

  if (room == "N") {
    errorMsg.push("請選擇入住人數");
    confirmaionError(errorMsg);
    return;
  }

  var roomType = 0;
  var price = 0;
  var accessDate = $("#txtDate").val();

  switch (room.substring(0, 1)) {
    case "2":
      roomType = 2;
      break;
    case "3":
      roomType = 3;
      price = 1000;
      break;
    case "4":
      roomType = 4;
      price = 2500;
      break;
  }

  var tel = $("#txtPhone").val();
  var ext = $("#txtExt").val();
  var cmt = $("#txtCmt").val();
  var isAdmin = $("#hidMaster").val();

  if (tel.length <= 0) {
    errorMsg.push("請輸入聯絡人電話！格式：02-0000-0000");
  }
  if (!WT.isTel(tel, "tel")) {
    errorMsg.push("電話號碼錯誤！格式：02-0000-0000");
  }
  if (ext.length <= 0) {
    errorMsg.push("請輸入分機號碼！");
  }
  if (!WT.isInt(ext)) {
    errorMsg.push("分機號碼錯誤請重新輸入！");
  }
  if (!WT.isValidDate(accessDate)) {
    errorMsg.push("入住日期格式錯誤");
  } else {
    if (isAdmin != "Pass") {
      if (dateDiff(accessDate, "days") <= 21) {
        errorMsg.push("恕不受理 21 日內的平日訂房！");
      }
    }
  }

  Order.ActID = actid;
  Order.Name = $("#txtName").val();
  Order.SID = $("#txtSid").val();
  Order.DOB = $("#txtDob").val();
  Order.EID = $("#txtEid").val();
  Order.Cell = $("#txtCell").val();
  Order.Email = $("#txtEmail").val();
  Order.Tel = tel + "#" + ext;
  Order.Price = price;
  Order.RoomType = roomType;
  Order.CheckIn = $("#ddlCk").val();
  Order.HotelID = 0;
  Order.Comment = $("#ddlMb option:selected").text() + " " + cmt;
  Order.AccessDate = accessDate;

  console.log(Order);

  if (Order.Name.length <= 0) {
    errorMsg.push("請輸入姓名");
  }
  if (!WT.isEID(Order.EID)) {
    errorMsg.push("請輸入正確工號");
  }
  if (!WT.isSID(Order.SID)) {
    errorMsg.push("身份證號格式錯誤");
  }
  if (!WT.isValidDate(Order.DOB)) {
    errorMsg.push("生日格式錯誤");
  }
  if (!WT.isTel(Order.Cell, "cell")) {
    errorMsg.push("手機號碼格式錯誤 0900-000000");
  }
  if (!WT.isEmail(Order.Email)) {
    errorMsg.push("Email 格式錯誤");
  }
  if (Order.Comment.length > 100) {
    errorMsg.push("備註欄位最多100字！");
  }

  if (errorMsg.length > 0) {
    confirmaionError(errorMsg);
    return false;
  }

  postOrder();
}

function confirmaionError(errorMsg) {
  var error = "<ul>";
  $.each(errorMsg, function (i, e) {
    error += "<li>" + e + "</li>";
  });
  error += "</ul>";
  showMsg(error);
}

function postOrder() {
  var img = $("#loading");
  img.show();
  errorMsg = [];
  $("#okMsg").html("");
  $("#okMsg").hide();

  $("#btnSubmit").prop("disabled", true);

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Add_Wt_HotelWeekdayOrder",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ order: Order }),
    success: function (response) {
      var result = response.d;
      if (result.substring(0, 2) != "OK") {
        errorMsg.push(result);
        confirmaionError(errorMsg);
        img.hide();
        $("#btnSubmit").prop("disabled", false);
        return false;
      }

      // ---- OK ----
      var sb = "";
      sb += "<p class='text-info'>";
      sb += "您已成功登記，訂房處理程序要視各飯店狀況而定，一旦與飯店確認此房型數量，我們會立即發送確認 email 到您所填寫的電子信箱中。";
      sb += "</p>";
      $("#txtName").val("");
      $("#txtSid").val("");
      $("#txtDob").val("");
      $("#txtEid").val("");
      $("#txtCell").val("");
      $("#txtEmail").val("");
      $("#txtPhone").val("02-8226-9088");
      $("#txtExt").val("");
      $("#txtCmt").val("");
      $("#okMsg").html(sb);
      $("#okMsg").show();
      img.hide();
    },
    error: function (xhr, textStatus, error) {
      $("#btnSubmit").prop("disabled", false);
      img.hide();
      console.log(xhr.status);
      console.log(error);
      alert("很抱歉服務器發生錯誤，目前無法送出，請稍後再嘗試！");
    },
  });
}

function showMsg(msg) {
  $("#errMsg").html(msg);
  //$("#divMsg").addClass("alert-danger");
  $("#errMsg").show("fade");
}

function hideMsg() {
  $("#errMsg").html("");
  // $("#divMsg").removeClass("alert-danger");
  // $("#divMsg").removeClass("alert-success");
  $("#errMsg").hide();
}

function dateDiff(date1, interval) {
  var second = 1000;
  var minute = second * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var week = day * 7;

  openDay = new Date(date1);
  today = new Date();
  var timediff = openDay - today;

  if (isNaN(timediff)) return NaN;

  switch (interval) {
    case "years":
      return date2.getFullYear() - date1.getFullYear();
    case "months":
      return date2.getFullYear() * 12 + date2.getMonth() - (date1.getFullYear() * 12 + date1.getMonth());
    case "weeks":
      return Math.floor(timediff / week);
    case "days":
      return Math.floor(timediff / day);
    case "hours":
      return Math.floor(timediff / hour);
    case "minutes":
      return Math.floor(timediff / minute);
    case "seconds":
      return Math.floor(timediff / second);
    default:
      return undefined;
  }
}
