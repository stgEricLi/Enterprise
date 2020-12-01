$(function () {
  initial();
  $("#btnToS2").click(function () {
    verify_employee();
  });

  $("#btnBackS2").click(function () {
    show_setp("2");
  });

  $("#btnConfirm").click(function () {
    if (target == "one") {
      confirm_one_day();
    } else {
      confirm_two_days();
    }
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
    $("#errModal").modal("hide");
  });
});

function initial() {
  show_setp("1");

  $("#txtEid").val("");
  $("#txtSid").val("");
}

function verify_employee() {
  employeeID = $("#txtEid").val();
  SSID = $("#txtSid").val();
  // aryOne = [];
  // aryTwo = [];

  if (!WT.isSID(SSID)) {
    showMsg("<p>請輸入正確身分證！</p>");
    return false;
  }
  if (!WT.isEID(employeeID)) {
    showMsg("<p>請輸正確的工號！</p>");
    return false;
  }

  $("#loading1").show();
  $("#login-msg").html("");

  WT.checkEmployee(employeeID, SSID, "N")
    .done(function (response) {
      var leaderName = "";
      if (response.hasOwnProperty("d")) {
        leaderName = response.d;
        if (leaderName == "Empty") {
          showMsg("<p>很抱歉查不到您的員工資料！</p>");
          $("#loading1").hide();
          return false;
        }
        //if (leaderName == 'Join') { showMsg("<p>您已經報名過此一系列的活動了，每位同仁限參加一日與二日活動各一次！</p>"); $("#loading1").hide(); return false; }
        load_my_order();
      } else {
        showMsg("<p>很抱歉服務器繁忙中，請稍後再嘗試！</p>");
      }
    })
    .fail(function (xhr, textStatus, error) {
      console.log(xhr.status);
      console.log(error);
      console.log("checkEmployee Failed");
      showMsg("<p>很抱歉服務器發生錯誤，請稍後再嘗試！</p>");
      $("#loading1").hide();
      return false;
    });
}

function load_my_order() {
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Get_Hotel_Order_Paging",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ pageindex: 1, pagesize: 10, filterby: "EID", filtervalue: $("#txtEid").val() }),
    success: function (response) {
      if (response.hasOwnProperty("d")) {
        var json = JSON.parse(response.d);

        if (json.TotalRows == 0) {
          showMsg("<p>您目前沒有任何報名資訊！</p>");
          show_setp("1");
          $("#loading1").hide();
          return;
        }

        var objOd = json.Orders;
        console.log(objOd);
        var htm = "";
        htm += "<div class='table-responsive'>";
        htm += "<table class='table table-hover' style='width:100%; font-size:12px;'>";
        htm += "<tr>";
        htm += "<th style='width:76px;'>編號</th>";
        htm += "<th>飯店</th>";
        htm += "<th style='width:96px;'>姓名</th>";
        htm += "<th style='width:106px;'>工號</th>";
        htm += "<th style='width:106px;'>生日</th>";
        htm += "<th style='width:146px;'>電話</th>";
        htm += "<th style='width:106px;'>手機</th>";
        htm += "<th style='width:180px;'>Email</th>";
        htm += "<th style='width:76px;'>房型</th>";
        htm += "<th style='width:106px;'>訂房日</th>";
        htm += "<th style='width:76px;'>Check In</th>";
        htm += "<th style='width:76px;'>應付</th>";
        htm += "<th>備註</th>";
        htm += "<th style='width:86px;'>取消</th>";
        htm += "</tr>";

        $.each(objOd, function (i, v) {
          htm += "<tr>";
          htm += "<td>" + v.OrderID.toString() + "</td>";
          htm += "<td>" + v.ActName.toString() + "</td>";
          htm += "<td>" + v.Name.toString() + "</td>";
          htm += "<td>" + v.EID.toString() + "</td>";
          htm += "<td>" + v.DOB.toString() + "</td>";
          htm += "<td>" + v.Tel.toString() + "</td>";
          htm += "<td>" + v.Cell.toString() + "</td>";
          htm += "<td>" + v.Email.toString() + "</td>";
          htm += "<td>" + v.RoomType.toString() + "人房</td>";
          htm += "<td>" + convertDate(v.OpenDay.toString()) + "</td>";
          htm += "<td>" + v.ChickIn.toString() + "</td>";
          htm += "<td>" + v.Price.toString() + "</td>";
          htm += "<td>" + v.Comment.toString() + "</td>";
          htm += "<td style='text-align:center;'>";
          if (dayDiff(v.OpenDay.toString(), "days") <= 15) {
            htm += "<span style='color:#c0c0c0;'>取消禁制</span>";
          } else {
            htm += "<button  id='del" + v.OrderID.toString() + "' type='button' onclick='deleteOd(this.id)' class='btn btn-danger btn-xs udpD'><span class='glyphicon glyphicon-remove'></span></button>";
          }
          htm += "</td>";
          htm += "</tr>";
        });
        htm += "</table>";
        htm += "</div>";
        $("#odList").html(htm);
        show_setp("2");
      } else {
        showMsg("<p>您目前沒有任何報名資訊！</p>");
        show_setp("1");
      }
      $("#loading1").hide();
    },
    error: function (xhr, textStatus, error) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      $("#loading1").hide();
      showMsg("很抱歉服務器發生錯誤，請稍後再嘗試！");
      return false;
    },
  });
}

//刪除訂單
function deleteOd(id) {
  if (!confirm("確定要取消嗎？")) {
    return false;
  }
  var tr = $("#" + id)
    .parent()
    .parent();
  id = id.replace("del", "");
  var img = $("#loading-submit");

  if (id.length <= 0) {
    showMsg("<p>無法取得報名編號，目前無法進行更新！</p>");
    return false;
  }

  var obj = {};
  obj.OrderID = id;
  obj.Tel = "";
  obj.Cell = "";
  obj.Email = "";
  obj.Price = 0;
  obj.ChickIn = "";
  obj.Comment = "";
  obj.Action = "Delete";
  udpD_btn_disable(true);
  img.show();

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Update_Hotel_Order",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ model: obj }),
    cache: false,
    success: function (data) {
      var str = data.d;
      if (str != "OK") {
        showMsg("<p>" + str + "</p>");
      } else {
        alert("資料已刪除！");
        window.open("http://enterprise.mcpgo.com/enterprise/wt/Default.aspx", "_self");
      }
      img.hide();
      udpD_btn_disable(false);
      tr.remove();
    },
    error: function (xhr, textStatus, error) {
      showMsg("<p>伺服器連線錯誤，目前無法刪除！</p>");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      img.hide();
      udpD_btn_disable(false);
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

function dayDiff(date1, interval) {
  var second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24,
    week = day * 7;
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

function show_setp(step) {
  $(".steps").hide();
  if (step == "1") {
    //$('#actTr').html('');
    //$('#JoinerTr').html('');
    $("#txtEid").val("");
    $("#txtSid").val("");
    enableAllBtns();
  }
  $("#step" + step).show();
}

function enableAllBtns() {
  $("#btnSubmit").show();
  $("#btnBackS3").show();
  $("#btnBackS2").show();
  $("#btnSubmit").prop("disabled", false);
  $("#btnBackS2").prop("disabled", false);
  $("#btnBackS3").prop("disabled", false);
  $(".btn").prop("disabled", false);
}

function showMsg(str) {
  $("#divErr").html("");
  $("#errTitle").text("錯誤訊息");
  $("#divErr").html(str);
  $("#errModal").modal("show");
}

function showConfirm(str) {
  $("#divErr").html("");
  $("#errTitle").text("更新確認");
  $("#divErr").html("<h5>" + str + "</h5>");
  $("#errModal").modal("show");
}
