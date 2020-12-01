var oneday = [];
var twoday = [];
var today = new Date();

$(document).ready(function () {
  // Add smooth scrolling to all links in navbar + footer link
  $(".navbar a, footer a[href='#myPage']").on("click", function (event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();
      var hash = this.hash;
      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        900,
        function () {
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        }
      );
    } // End if
  });

  $(window).scroll(function () {
    $(".slideanim").each(function () {
      var pos = $(this).offset().top;

      var winTop = $(window).scrollTop();
      if (pos < winTop + 600) {
        $(this).addClass("slide");
      }
    });
  });
  load_album();
  //load_acts();
  load_hotels();
  // getDays();
  //$.cookie('Vulcan', '79882-usdh-0901');
  //console.log($.cookie("Vulcan"));
  //$.removeCookie("Vulcan");
  //console.log($.cookie("Vulcan"));
  //if (typeof $.cookie("Vulcan") == "undefined") { console.log("Nothing"); }
});

function load_hotels() {
  var sb = "";
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAct.asmx/get_All_Act_Details",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ filtervalue: "H" }),
    cache: false,
    asyn: false,
    success: function (response) {
      if (response.hasOwnProperty("d")) {
        var json = JSON.parse(response.d);
        var totalrows = json.TotalRows;
        var objAct = json.Acts;
        if (objAct != null) {
          $.each(objAct, function (i, v) {
            sb += build_hotel_list(i, v);
          });
        }
      } else {
        // $("#tblBody").append("<tr><td colspan='5'>目前尚無活動</td></tr>");
      }
      //loading.hide();
      $("#hotels").append(sb);
    },
    error: function (xhr, textStatus, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
      //   $("#tblBody").html("");
      //   $("#tblBody").append("<tr><td colspan='5'>目前尚無活動</td></tr>");
    },
  });
}

function build_hotel_list(i, hotel) {
  var sb = "";
  sb += '<div class="list-group-item ';
  if (i % 2 == 0) {
    sb += "list-group-item-success";
  }
  if (i % 2 == 1) {
    sb += "list-group-item-warning";
  }
  sb += '">';
  sb += '<a href="order_hotel.aspx?aid=' + hotel.ActID + '" class="btn btn-primary pull-right" target="_blank">我要報名</a>';
  sb += '<h4 class="list-group-item-heading"><a href="activities/' + hotel.ActID + '.html" target="_blank">';
  sb += hotel.Name + "</a></h4>";
  sb += '<p class="list-group-item-text">';
  sb += '<span class="start sp">可訂房日期：' + hotel.StartDay + "~2020/12/31</span>";
  sb += '<span class="end sp">最後訂房日期：' + hotel.RegExpDay + "</span>";
  sb += "</p>";
  sb += "</div>";

  return sb;
}

function load_acts() {
  aryOne = [];
  aryTwo = [];
  var def = $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAct.asmx/get_All_Act_Details",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ filtervalue: "E" }),
    cache: false,
    asyn: false,
    success: function (response) {
      if (response.hasOwnProperty("d")) {
        var json = JSON.parse(response.d);
        var totalrows = json.TotalRows;
        var objAct = json.Acts;
        if (objAct != null) {
          $.each(objAct, function (i, v) {
            if (v.ActID.substring(0, 2) == "E1") aryOne.push(v);
            if (v.ActID.substring(0, 2) == "E2") aryTwo.push(v);
          });
        }
      } else {
        // $("#tblBody").append("<tr><td colspan='5'>目前尚無活動</td></tr>");
      }
      //loading.hide();
    },
    error: function (xhr, textStatus, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
      $("#tblBody").html("");
      $("#tblBody").append("<tr><td colspan='5'>目前尚無活動</td></tr>");
    },
  });

  def.done(function () {
    //console.log(aryOne);
    //console.log(aryTwo);

    generate_act_block();
  });
}

function generate_act_block() {
  //$('.I1 > .row').remove();
  //$('.I2 > .row').remove();

  $(".I1 > .list-group").remove();
  $(".I2 > .list-group").remove();

  if (aryOne.length > 0) {
    strOne = '<div class="list-group">';
    $.each(aryOne, function (i) {
      if (aryOne[i].ActID != "E1000000018") {
        strOne += one_day_act(i);
      }
    });
    strOne += "</div>";
    $(".I1").append(strOne);
  }

  if (aryTwo.length > 0) {
    strTwo = '<div class="list-group">';
    $.each(aryTwo, function (i) {
      if (aryTwo[i].ActID != "E2000000039" && aryTwo[i].ActID != "E2000000040" && aryTwo[i].ActID != "E2000000041" && aryTwo[i].ActID != "E2000000042" && aryTwo[i].ActID != "E2000000043" && aryTwo[i].ActID != "E2000000044" && aryTwo[i].ActID != "E2000000045" && aryTwo[i].ActID != "E2000000046" && aryTwo[i].ActID != "E2000000047" && aryTwo[i].ActID != "E2000000048") {
        strTwo += two_days_act(i);
      }
    });
    strTwo += "</div>";
    $(".I2").append(strTwo);
  } else {
    //$('.I2').append(no_act());
  }
}

function one_day_act(i) {
  var sb = "";
  sb += '<div class="list-group-item ';
  if (i % 2 == 0) {
    sb += "list-group-item-success";
  }
  if (i % 2 == 1) {
    sb += "list-group-item-warning";
  }
  sb += '">';
  sb += generate_regBtn(i, "one");

  if (aryOne[i].ActID == "E1000000015") {
    sb += '<h4 class="list-group-item-heading"><a href="activities/' + aryOne[i].ActID + '.html" target="_blank">';
    sb += aryOne[i].Name + '</a>&nbsp;<span style="color:#B0B0B0; font-size:14px;">#原誤植名稱為:冬令泡湯~繽紛暖冬行(適合全年齡)</span></h4>';
  } else {
    sb += '<h4 class="list-group-item-heading"><a href="activities/' + aryOne[i].ActID + '.html" target="_blank">';
    sb += aryOne[i].Name + "</a></h4>";
  }

  sb += '<p class="list-group-item-text">';
  sb += '<span class="start sp">活動日期：' + aryOne[i].StartDay + "</span>";
  sb += '<span class="end sp">報名截止日期：' + aryOne[i].RegExpDay + "</span>";

  switch (aryOne[i].ActID) {
    case "E1000000001":
      sb += '<span class="room sp">剩餘名額：<span class="badge">0</span></span>';
      break;
    case "E1000000003":
      sb += '<span class="room sp">剩餘名額：<span class="badge">0</span></span>';
      break;
    case "E1000000004":
      sb += '<span class="room sp">剩餘名額：<span class="badge">0</span></span>';
      break;
    case "E1000000005":
      sb += '<span class="room sp">剩餘名額：<span class="badge">0</span></span>';
      break;
    case "E1000000007":
      sb += '<span class="room sp">剩餘名額：<span class="badge">0</span></span>';
      break;
    default:
      sb += '<span class="room sp">剩餘名額：<span class="badge">' + aryOne[i].Capacity + " </span></span>";
      break;
  }

  sb += "</p>";
  sb += "</div>";

  return sb;
}

function two_days_act(i) {
  var sb = "";

  sb += '<div class="list-group-item ';
  if (i % 2 == 0) {
    sb += "list-group-item-info";
  }
  if (i % 2 == 1) {
    sb += "list-group-item-warning";
  }
  sb += '">';
  sb += generate_regBtn(i, "two");
  sb += '<h4 class="list-group-item-heading"><a href="activities/' + aryTwo[i].ActID + '.html" target="_blank">';
  sb += aryTwo[i].Name + "</a></h4>";
  sb += '<p class="list-group-item-text">';
  sb += '<span class="start sp">活動日期：' + aryTwo[i].StartDay + "~" + plusOneDate(aryTwo[i].StartDay) + "</span>";
  sb += '<span class="end sp">報名截止日期：' + aryTwo[i].RegExpDay + "</span>";

  switch (aryTwo[i].ActID) {
    case "E2000000019":
      sb += '<span class="room sp">剩餘名額：<span class="badge">0</span></span>';
      sb += '<span class="room sp">剩餘兩人房：<span class="badge">0</span></span>';
      sb += '<span class="room sp">剩餘四人房：<span class="badge">0</span></span>';
      break;
    case "E2000000032":
      sb += '<span class="room sp">剩餘名額：<span class="badge">0</span></span>';
      sb += '<span class="room sp">剩餘兩人房：<span class="badge">0</span></span>';
      sb += '<span class="room sp">剩餘四人房：<span class="badge">0</span></span>';
      break;
    case "E2000000034":
      sb += '<span class="room sp">剩餘名額：<span class="badge">0</span></span>';
      sb += '<span class="room sp">剩餘兩人房：<span class="badge">0</span></span>';
      sb += '<span class="room sp">剩餘四人房：<span class="badge">0</span></span>';
      break;
    case "E2000000036":
      sb += '<span class="room sp">剩餘名額：<span class="badge">0</span></span>';
      sb += '<span class="room sp">剩餘兩人房：<span class="badge">0</span></span>';
      sb += '<span class="room sp">剩餘四人房：<span class="badge">0</span></span>';
      break;
    case "E2000000038":
      sb += '<span class="room sp">剩餘名額：<span class="badge">0</span></span>';
      sb += '<span class="room sp">剩餘兩人房：<span class="badge">0</span></span>';
      sb += '<span class="room sp">剩餘四人房：<span class="badge">0</span></span>';
      break;
    default:
      sb += '<span class="room sp">剩餘名額：<span class="badge">' + aryTwo[i].Capacity + " </span></span>";
      sb += '<span class="room sp">剩餘兩人房：<span class="badge">' + aryTwo[i].FieldInt1 + " </span></span>";
      sb += '<span class="room sp">剩餘四人房：<span class="badge">' + aryTwo[i].FieldInt2 + "</span></span>";
      break;
  }

  sb += "</p>";
  sb += "</div>";

  return sb;
}

function generate_regBtn(i, type) {
  var days = 0;
  var sb = "";
  if (type == "one") {
    days = dateDiff(aryOne[i].RegExpDay, today, "days");
    if (days < 0) {
      sb = '<a href="order_one_day.aspx?aid=' + aryOne[i].ActID + '" class="btn btn-primary pull-right" target="_blank">我要報名</a>';
      if (parseInt(aryOne[i].Capacity) < 4) {
        sb = '<a href="order_one_day.aspx?aid=' + aryOne[i].ActID + '" class="btn btn-primary pull-right" target="_blank">我要報名</a>';
        sb += '<a href="waiting_one_day.aspx?aid=' + aryOne[i].ActID + '" class="btn btn-warning pull-right" target="_blank">我要候補</a>';
      }

      if (parseInt(aryOne[i].Capacity) == 0 || aryOne[i].ActID == "E1000000001" || aryOne[i].ActID == "E1000000003" || aryOne[i].ActID == "E1000000004" || aryOne[i].ActID == "E1000000005" || aryOne[i].ActID == "E1000000007") {
        sb = '<a href="waiting_one_day.aspx?aid=' + aryOne[i].ActID + '" class="btn btn-warning pull-right" target="_blank">我要候補</a>';
      }
    } else {
      sb = '<span class="label label-danger pull-right">報名已截止</span>';
    }
  } else {
    days = dateDiff(aryTwo[i].RegExpDay, today, "days");
    if (days < 0) {
      if (aryTwo[i].ActID == "E2000000019" || aryTwo[i].ActID == "E2000000038" || aryTwo[i].ActID == "E2000000032" || aryTwo[i].ActID == "E2000000034" || aryTwo[i].ActID == "E2000000036") {
        sb = '<a href="waiting_two_days.aspx?aid=' + aryTwo[i].ActID + '" class="btn btn-warning pull-right" target="_blank">我要候補</a>';
      } else {
        sb = '<a href="order_two_days.aspx?aid=' + aryTwo[i].ActID + '" class="btn btn-primary pull-right" target="_blank">我要報名</a>';
        if (parseInt(aryTwo[i].Capacity) < 4) {
          sb = '<a href="order_two_days.aspx?aid=' + aryTwo[i].ActID + '" class="btn btn-primary pull-right" target="_blank">我要報名</a>';
          sb += '<a href="waiting_two_days.aspx?aid=' + aryTwo[i].ActID + '" class="btn btn-warning pull-right" target="_blank">我要候補</a>';
        }
        if (parseInt(aryTwo[i].Capacity) == 0) {
          sb = '<a href="waiting_two_days.aspx?aid=' + aryTwo[i].ActID + '" class="btn btn-warning pull-right" target="_blank">我要候補</a>';
        }
      }

      //if (parseInt(aryTwo[i].Capacity) <= 0 ) {
      //    sb = '<a href="waiting_two_days.aspx?aid=' + aryTwo[i].ActID + '" class="btn btn-warning pull-right" target="_blank">我要候補</a>';
      //}
      //if (parseInt(aryTwo[i].FieldInt1) <= 0 && parseInt(aryTwo[i].FieldInt2) <= 0) {
      //    sb = '<a href="waiting_two_days.aspx?aid=' + aryTwo[i].ActID + '" class="btn btn-warning pull-right" target="_blank">我要候補</a>';
      //}
    } else {
      sb = '<span class="label label-danger pull-right">報名已截止</span>';
    }

    //if (days < 0)
    //    sb = '<a href="order_two_days.aspx?aid=' + aryTwo[i].ActID + '" class="btn btn-lg btn-danger" target="_blank">我要報名</a>';
    //else
    //    sb = '<a href="waiting_two_days.aspx?aid=' + aryTwo[i].ActID + '" class="btn btn-lg btn-default" target="_blank">我要候補</a>';
  }

  return sb;
}

function no_act() {
  var sb = '<div class="row slideanim">';
  sb += '<div class="col-sm-12 col-xs-12">';
  sb += '<p style="color:#c0c0c0;">目前沒有任何行程活動</p>';
  sb += "</div>";
  sb += "</div>";
  return sb;
}

function load_album() {
  //album();
  var sb = "";
  var needToEnd = true;

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAlbum.asmx/get_wt_Album",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ filterBy: "All", filterVal: "" }),
    cache: false,
    asyn: false,
    success: function (response) {
      // console.log(response);
      if (response.hasOwnProperty("d")) {
        var aryPic = JSON.parse(response.d);
        if (aryPic != null) {
          $("#portfolio > .row").remove();
          sb = '<div class="row text-center slideanim">';
          $.each(aryPic, function (i, v) {
            //console.log(v.desc);
            //console.log(v.link);
            if (i > 0 && i % 3 == 0) {
              sb += '<div class="row text-center slideanim">';
            }
            sb += build_album(v);
            if ((i + 1) % 3 == 0) {
              sb += "</div>";
              needToEnd = false;
            } else {
              needToEnd = true;
            }
          });
          if (needToEnd) {
            sb += "</div>";
          }
          $("#portfolio").append(sb);
        }
      } else {
        // $("#tblBody").append("<tr><td colspan='5'>目前尚無活動</td></tr>");
      }
    },
    error: function (xhr, textStatus, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    },
  });
  //aryRoom['000000'] = { desc: '', date:'', thumb: '', link: ''};
}

function build_album(v) {
  var sb = "";
  sb += '<div class="col-sm-4 col-xs-12">';
  sb += '<div class="thumbnail">';
  sb += '<a target="_blank" href="' + v.TargetLink + '" target="_blank">';
  sb += '<img src="' + v.ImgUrl + '" />';
  sb += "</a>";
  sb += "<p>" + v.AlbumDate + "</p>";
  sb += "<p>" + v.Title + "</p>";
  sb += "</div>";
  sb += "</div>";
  return sb;
}

function getDays() {
  //  var today = new Date();
  console.log("Today = " + today);
  var days = dateDiff("2018/12/21", today, "days");
  console.log("Date Diff = " + days);
  //return days;
}

function dateDiff(date1, date2, interval) {
  var second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24,
    week = day * 7;
  date1 = new Date(date1);
  date2 = new Date(date2);
  var timediff = date2 - date1;
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

function plusOneDate(val) {
  var date = new Date(val);
  date.setDate(date.getDate() + 1);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  return y.toString() + "/" + padLeft("00", m.toString()) + "/" + padLeft("00", d.toString());
}

function padLeft(nth, str) {
  var res = nth.substring(0, nth.length - str.length) + str;
  return res;
}
