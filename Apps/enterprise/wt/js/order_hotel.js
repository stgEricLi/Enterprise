$(document).ready(function () {
  initial();

  $("#lbAgree").click(function () {
    if (!$("#ckAgree").is(":checked")) $("#ckAgree").prop("checked", true);
    else $("#ckAgree").prop("checked", false);
  });

  $("#btnToS2").click(function () {
    initial_step2();
  });

  $("#btnToS1").click(function () {
    var isok = confirm("回第一步驟會將參加人資料全部清除，確定要回上一步驟嗎？");
    if (isok == false) {
      return false;
    }
    errorMsg = [];
    arrayJoinner = [];
    info = null;
    $("#btnWaiting").hide();
    show_setp("1");
  });

  $("#btnToS3").click(function () {
    confirmaion();
  });

  $("#btnBackS2").click(function () {
    $("#btnBackUp").hide();
    $("#btnSubmit").show();
    $("#btnSubmit").prop("disabled", false);
    load_hotel(true);
    show_setp("2");
  });

  $("#btnSubmit").click(function () {
    create_order();
  });

  $("#btnBackUp").click(function () {
    order_Backup();
  });

  $("#btnFinish").click(function () {
    order_complete();
  });

  $("#btnMgClose").click(function () {
    $("#divMsg").hide();
  });
});

var capacity = 0;
var errorMsg = [];
var arrayJoinner = [];
var info = null;
var HotelArray = [];
var currRoom = [];
var Order = {};

function initial() {
  show_setp("1");
  $("#txtPhone").val("02-8226-9088");
  $("#txtExt").val("");
  $("#joiner").html("");
  $("#confirmation").html("");
  $("#txtLeaderEid").val("");
  $("#txtLeaderSid").val("");
  $("#btnWaiting").hide();

  load_hotel(false);
  /**
   * 李志偉	11300017	F896316421
   * 許志瑋	11101139	F125400771
   * 陳紹煒	11101209	A120675728
   * 江妙娟	11101066	U221127686
   */
}

//載入Hotel清單
function load_hotel(isTouch) {
  var actid = $("#hidActid").val();
  $("#schedule").html("");
  //var sb = "";
  HotelArray = [];
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Get_Wt_Hotel_Schedule",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ ActId: actid }),
    cache: false,
    beforeSend: function () {},
    success: function (response) {
      if (response.hasOwnProperty("d")) {
        HotelArray = response.d;
        if (isTouch) load_room_tbl();
        /*
        sb = ' <table class="table table-bordered w50">';
        sb += "<thead>";
        sb += "<tr><th>日期</th><th>兩人房</th><th>三人房</th><th>四人房</th></tr>";
        sb += "</thead><tbody>";
        $.each(response.d, function (i, v) {
          HotelArray.push(v);
          if (i == 0) {
            // 兩人房
            sb += "<tr>";
            sb += "<td>" + convertDate(v.OpenDay) + "</td>";
            if (v.Qty > 0) {
              sb += "<td onclick='clickMe(" + v.ID + ")' class='clickable'>" + v.Qty + "</td>";
            } else {
              sb += "<td class='unable'>" + v.Qty + "</td>";
            }
          } else {
            if (i % 3 > 0) {
              // 三,四人房
              if (v.Qty > 0) {
                sb += "<td onclick='clickMe(" + v.ID + ")' class='clickable'>" + v.Qty + "</td>";
              } else {
                sb += "<td class='unable'>" + v.Qty + "</td>";
              }
            } else {
              sb += "</tr>";
              // 兩人房
              sb += "<tr>";
              sb += "<td>" + convertDate(v.OpenDay) + "</td>";
              if (v.Qty > 0) {
                sb += "<td onclick='clickMe(" + v.ID + ")' class='clickable'>" + v.Qty + "</td>";
              } else {
                sb += "<td class='unable'>" + v.Qty + "</td>";
              }
            }
          }
        });
        sb += "</tr></tbody></table>";
        $("#schedule").html(sb);
        */
        //console.log(HotelArray);
      }
    },
    error: function (xhr, textStatus, error) {
      alert("目前無法載入此旅館資料，請稍後再嘗試。");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
    },
  });
}

function initial_step2() {
  if (!$("#ckAgree").is(":checked")) {
    alert("您必須同意上述申明才可進行報名！");
    return false;
  }

  if (HotelArray.length <= 0) {
    alert("目前無法載入此旅館資料，請稍後再嘗試。");
    return false;
  }
  //var dbCapacity = $("#hidCapacity").val();
  var eid = $("#txtLeaderEid").val();
  var sid = $("#txtLeaderSid").val();
  var actid = $("#hidActid").val();
  var leaderName = "";

  if (!WT.isSID(sid)) {
    alert("請輸入正確身分證！");
    return false;
  }

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Check_Eligible",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ eid: eid, sid: sid }),
    success: function (response) {
      console.log(response);
      if (response.hasOwnProperty("d")) {
        leaderName = response.d;
        if (leaderName == "NotFound") {
          alert("很抱歉查不到您的員工資料！");
          return false;
        }
        if (leaderName == "Joined") {
          alert("您已經登記過，每位同仁限登記一次！");
          return false;
        }
        $("#joiner").html(WT.createJoinerForm(1, leaderName, sid, eid));
        WT.assignDateToDll();
        load_room_tbl();
        show_setp("2");
      } else {
        alert("很抱歉服務器繁忙中，請稍後再嘗試！");
      }
    },
    error: function (xhr, textStatus, error) {
      console.log(xhr.status);
      console.log(error);
      console.log("checkEmployee Failed");
      alert("很抱歉服務器發生錯誤，請稍後再嘗試！");
      return false;
    },
  });

  // WT.checkEmployee(eid, sid, actid)
  //   .done((response) => {
  //     if (response.hasOwnProperty("d")) {
  //       leaderName = response.d;
  //       if (leaderName == "Empty") {
  //         alert("很抱歉查不到您的員工資料！");
  //         return false;
  //       }
  //       if (leaderName == "Join") {
  //         alert("您已經登記過，每位同仁限登記一次！");
  //         return false;
  //       }
  //       //$("#ldName").html(leaderName);
  //       $("#joiner").html(WT.createJoinerForm(1, leaderName, sid, eid));
  //       WT.assignDateToDll();
  //       load_room_tbl();
  //       show_setp("2");
  //     } else {
  //       alert("很抱歉服務器繁忙中，請稍後再嘗試！");
  //     }
  //   })
  //   .fail((xhr, textStatus, error) => {
  //     console.log(xhr.status);
  //     console.log(error);
  //     console.log("checkEmployee Failed");
  //     alert("很抱歉服務器發生錯誤，請稍後再嘗試！");
  //     return false;
  //   });
}

function load_room_tbl() {
  var room = $("#ddlMb").val();
  var roomVal = 0;

  switch (room.substring(0, 1)) {
    case "2":
      roomVal = 2;
      break;
    case "3":
      roomVal = 3;
      break;
    case "4":
      roomVal = 4;
      break;
  }

  HotelArray = HotelArray.filter((x) => x.RoomType == roomVal);

  //console.log(HotelArray);

  var sb = "";

  var isAdmin = $("#hidMaster").val();

  sb = ' <table class="table table-bordered w50">';
  sb += "<thead>";
  sb += "<tr><th>入住日期</th><th>" + roomVal + "人房剩餘間數</th></tr>";
  sb += "</thead><tbody>";
  $.each(HotelArray, function (i, v) {
    sb += "<tr>";
    sb += "<td>" + convertDate(v.OpenDay) + "</td>";
    if (v.Qty > 0) {
      sb += "<td onclick='clickMe(" + v.ID + ")' class='clickable'>" + v.Qty + "</td>";
    } else {
      if (isAdmin == "Pass") {
        sb += "<td onclick='waiting_list(" + v.ID + ")' class='clickable'>候補</td>";
      } else {
        if (dayDiff(v.OpenDay.toString(), "days") <= 21) {
          sb += "<td>---</td>";
        } else {
          sb += "<td onclick='waiting_list(" + v.ID + ")' class='clickable'>候補</td>";
        }
      }
    }
    sb += "</tr>";
  });
  sb += "</tr></tbody></table>";
  $("#schedule").html(sb);
}

function clickMe(id) {
  $("#btnBackUp").hide();
  $("#btnSubmit").show();

  console.log(id);
  currRoom = HotelArray.filter((x) => x.ID == id);
  //console.log(currRoom);
  if (currRoom.length == 0) {
    alert("找不到此房型！");
    return false;
  }
  var sb = "<p>你選擇了，" + convertDate(currRoom[0].OpenDay) + "的";
  switch (currRoom[0].RoomType) {
    case 2:
      sb += "2人房，自付金額 $0</p>";
      break;
    case 3:
      sb += "3人房，自付金額 $1,000</p>";
      break;
    case 4:
      sb += "4人房，自付金額 $2,500</p>";
      break;
  }
  $("#selectedInfo").html(sb);
}

function waiting_list(id) {
  $("#btnBackUp").show();
  $("#btnSubmit").hide();

  currRoom = HotelArray.filter((x) => x.ID == id);
  //console.log(currRoom);
  if (currRoom.length == 0) {
    alert("找不到此房型！");
    return false;
  }
  var sb = "<p>你選擇候補，" + convertDate(currRoom[0].OpenDay) + "的";
  switch (currRoom[0].RoomType) {
    case 2:
      sb += "2人房，自付金額 $0</p>";
      break;
    case 3:
      sb += "3人房，自付金額 $1,000</p>";
      break;
    case 4:
      sb += "4人房，自付金額 $2,500</p>";
      break;
  }
  $("#selectedInfo").html(sb);
}

function show_setp(step) {
  $(".steps").hide();
  $("#step" + step).show();
}

function confirmaionError(errorMsg) {
  var error = "<ul>";
  $.each(errorMsg, function (i, e) {
    error += "<li>" + e + "</li>";
  });
  error += "</ul>";
  showMsg(error);
}

function confirmaion() {
  hideMsg();
  errorMsg = [];
  arrayJoinner = [];

  var tel = $("#txtPhone").val();
  var ext = $("#txtExt").val();
  var actid = $("#hidActid").val();
  var actName = $("#hidActName").val();
  var cmt = $("#txtCmt").val();

  if (actid.length <= 0) {
    alert("行程資料遺失，無法進行報名，請刷新此頁面後再試一次！");
    return false;
  }
  if (actName.length <= 0) {
    alert("行程資料遺失，無法進行報名，請刷新此頁面後再試一次！");
    return false;
  }

  arrayJoinner = WT.getJoinerList(actid, actName);

  if (arrayJoinner.length <= 0) {
    showMsg("<ul></li>請輸入參加人資料！</li></ul>");
    return false;
  }
  //console.log(arrayJoinner);

  errorMsg = WT.validateJoiner(arrayJoinner);

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
  if (currRoom.length == 0) {
    errorMsg.push("請選擇房型！");
  }
  if (cmt.length > 100) {
    errorMsg.push("備註欄位最多100字！");
  }
  if (errorMsg.length > 0) {
    confirmaionError(errorMsg);
    return false;
  }

  $("#confirmation").html("");

  var sb = "";
  sb += "<div style='margin-top:12px; margin-bottom:12px; font-size:15px;'>";
  sb += "<p>入住飯店'<strong>" + $("#hidActName").val() + "</strong>'";
  sb += "<p>入住房型：<strong>" + currRoom[0].RoomType + "人房</strong></p>";
  sb += "<p>入住日期：<strong>" + convertDate(currRoom[0].OpenDay) + "</strong></p>";
  sb += "<p>CHICK-IN時間：<strong>" + $("#ddlCk").val() + "</strong></p>";
  sb += "<p>房型人員(含自己) ：<strong>" + $("#ddlMb option:selected").text() + "</strong></p>";

  switch (currRoom[0].RoomType) {
    case 2:
      sb += "<strong>自付金額 $0</strong></p>";
      break;
    case 3:
      sb += "<strong>自付金額 $1,000</strong></p>";
      break;
    case 4:
      sb += "<strong>自付金額 $2,500</strong></p>";
      break;
  }
  sb += "</div>";

  sb += "<table class='table table-striped' style='width:100%;'>";
  sb += "<tr><th>中文姓名</th><th>身分字號</th><th>生日</th><th>員工工號</th><th>手機</th><th>素食</th><th>Email</th></tr>";
  $.each(arrayJoinner, function (i, joiner) {
    sb += "<tr class='FinalLine'>";
    sb += "<td>" + joiner.Name + "</span>";
    sb += "</td>";
    sb += "<td>" + joiner.SID + "</td>";
    sb += "<td>" + joiner.DOB + "<sapn class='text-danger'>";
    if (joiner.Age == 3) {
      sb += "（3歲以下）";
    }
    sb += "</span></td>";
    sb += "<td>" + joiner.EmpID + "</td>";
    sb += "<td>" + joiner.Cell + "</td>";
    if (joiner.IsVeg == "true") {
      sb += "<td>素食</td>";
    } else {
      sb += "<td>X</td>";
    }
    sb += "<td>" + joiner.Email + "</td>";
    sb += "</tr>";
  });
  sb += "</table>";

  $("#confirmation").html(sb);

  get_order_instance();

  show_setp("3");
}

function get_order_instance() {
  Order = {};
  var cmt = $("#txtCmt").val();
  var price = 0;

  switch (currRoom[0].RoomType) {
    case 3:
      price = 1000;
      break;
    case 4:
      price = 2500;
      break;
  }

  cmt = cmt.replace(/[\r\n\t]/g, "");
  cmt = cmt.replace(/[<>@#|\/\^&$*;\!]/g, "");

  Order.OrderID = "";
  Order.Name = arrayJoinner[0].Name;
  Order.EID = arrayJoinner[0].EmpID;
  Order.SID = arrayJoinner[0].SID;
  Order.DOB = arrayJoinner[0].DOB;
  Order.Email = arrayJoinner[0].Email;
  Order.Tel = $("#txtPhone").val() + "#" + $("#txtExt").val();
  Order.Cell = arrayJoinner[0].Cell;
  Order.Price = price;
  Order.ChickIn = $("#ddlCk").val();
  Order.HotelID = currRoom[0].ID;
  Order.Comment = $("#ddlMb option:selected").text() + " " + cmt;
  Order.CreateDay = "";

  console.log("Order", Order);
}

function create_order() {
  var img = $("#imgLoading");

  img.show();
  $("#btnSubmit").prop("disabled", true);

  WT.makeHotelOrder({ order: Order })
    .done(function (response) {
      console.log(response);
      if (response.hasOwnProperty("d")) {
        var result = response.d;

        if (result.substring(0, 2) != "OK") {
          if (result == "SOLD") {
            $("#btnBackUp").show();
            $("#btnSubmit").hide();
            alert("請按我要候補加入至候補清單中。");
          } else {
            alert(result);
          }
          $("#btnSubmit").prop("disabled", false);
          img.hide();
          return false;
        }

        // ---- OKH20712050010 ----
        result = result.substring(2, result.length);
        var oid = result.substring(0, 11);
        var sb = "";
        sb += "<p class='text-info'>";
        sb += "您已完成線上線訂房，您的編號為：<span class='emphsize'>" + oid + "</span>，";
        sb += "已將確認信發送到您填寫的電子信箱中，如於三日內無收到確認信，請主動與旅行社聯繫，謝謝";
        sb += "</p>";
        $("#odcnt").html("");
        $("#odcnt").html(sb);
        $("#myModal").modal("show");
        $("#btnFinish").show();
        $("#btnWaiting").hide();
        $("#btnSubmit").hide();
        $("#btnBackS2").hide();
        img.hide();
        //$("#btnSubmit").prop("disabled", false);
      }
    })
    .fail(function (xhr, textStatus, error) {
      console.log(xhr.status);
      console.log(error);
      console.log("makeTowDaysOrder Failed");
      img.hide();
      $("#btnSubmit").prop("disabled", false);
      alert("很抱歉服務器發生錯誤，目前無法送出報名表，請稍後再嘗試！");
    });
}

function order_Backup() {
  var img = $("#imgLoading");
  //console.log("Order", Order);
  // return false;
  $("#btnBackUp").prop("disabled", true);
  img.show();

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Backup_Wt_HotelOrder",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ order: Order }),
    success: function (response) {
      var result = response.d;
      if (result.substring(0, 2) != "OK") {
        $("#btnBackUp").prop("disabled", false);
        img.hide();
        alert(result);
        return false;
      }

      // ---- OK ----
      var sb = "";
      sb += "<p class='text-info'>";
      sb += "已為您加入至候補清單中，由於訂房處理程序要視各飯店狀況而定，一旦有名額釋放出，我們會立即發送確認 email 到您所填寫的電子信箱中。";
      sb += "</p>";
      $("#odcnt").html("");
      $("#odcnt").html(sb);
      $("#myModal").modal("show");
      $("#btnFinish").show();
      $("#btnWaiting").hide();
      $("#btnBackUp").hide();
      $("#btnBackS2").hide();
      img.hide();
      //$("#btnSubmit").prop("disabled", false);
    },
    error: function (xhr, textStatus, error) {
      $("#btnBackUp").prop("disabled", false);
      img.hide();
      console.log(xhr.status);
      console.log(error);
      alert("很抱歉服務器發生錯誤，目前無法送出，請稍後再嘗試！");
    },
  });
}

function order_complete() {
  initial();
  $("#myModal").modal("hide");
  window.open("http://enterprise.mcpgo.com/enterprise/wt/Default.aspx", "_self");
}

function showMsg(msg) {
  $("#txtMsg").html(msg);
  $("#divMsg").addClass("alert-danger");
  $("#divMsg").show("fade");
}

function hideMsg() {
  $("#txtMsg").html("");
  $("#divMsg").removeClass("alert-danger");
  $("#divMsg").removeClass("alert-success");
  $("#divMsg").hide();
}

function datRange(startDate, endDate) {
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  // Validate input
  if (endDate < startDate) return 0;

  // Calculate days between dates
  var millisecondsPerDay = 86400 * 1000; // Day in milliseconds
  startDate.setHours(0, 0, 0, 1); // Start just after midnight
  endDate.setHours(23, 59, 59, 999); // End just before midnight
  var diff = endDate - startDate; // Milliseconds between datetime objects
  var days = Math.ceil(diff / millisecondsPerDay);
  return days;
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
