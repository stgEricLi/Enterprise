$(document).ready(function () {
  day_picker("txtStDay");
  $("#txtStDay").val(GetDay(0));

  initial();
  load_act();

  $("#btnNew").click(function () {
    add_hotel();
  });
});

//頁面初始化
function initial() {
  $("#txtRoom2").val("0");
  $("#txtRoom3").val("0");
  $("#txtRoom4").val("0");
}

//載入活動清單
function load_act() {
  $("#ddlAct").html("");
  var loading = $("#loading");
  loading.show();
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAct.asmx/load_Act",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ pageindex: 1, pagesize: 100, company: "wt" }),
    cache: false,
    success: function (response) {
      if (response.hasOwnProperty("d")) {
        var json = JSON.parse(response.d);
        var objAct = json.Acts;
        var sb = "<option value='none'>無飯店資料</option>";
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
      $("#ddlAct").html("<option value='none'>無法取得飯店資料</option>");
      alert("伺服器錯誤，無法取得飯店資料！");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      //loading.hide();
    },
  });
}

//新增一筆企業活動行程
function add_hotel() {
  var actid = "",
    stday = "",
    room2 = 0,
    room3 = 0,
    room4 = 0;

  var img = $("#imgStep1");
  var msg = $("#msgStep1");
  actId = $("#ddlAct").val();
  stday = $("#txtStDay").val();
  room2 = $("#txtRoom2").val();
  room3 = $("#txtRoom3").val();
  room4 = $("#txtRoom4").val();

  if (actId.length <= 0) {
    msg.text("無法取得飯店清單，目前無法新增活動！");
    return false;
  }
  if (!isValidDate(stday)) {
    msg.text("活動日格式錯誤！");
    return false;
  }
  if (!isInteger(room2)) {
    room2 = 0;
  }
  if (!isInteger(room3)) {
    room3 = 0;
  }
  if (!isInteger(room4)) {
    room4 = 0;
  }

  var obj = {};
  obj.ActID = actId;
  obj.R2 = room2;
  obj.R3 = room3;
  obj.R4 = room4;
  obj.Date = stday;

  msg.text("");
  img.show();
  //   console.log(obj);
  //   return false;

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Add_Wt_Hotel_Schedule",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ model: obj }),
    cache: false,
    success: function (data) {
      var str = data.d;
      if (str.substring(0, 2) != "OK") {
        msg.text(str);
      } else {
        msg.text("已新增一筆資料！");
        initial();
      }
      img.hide();
    },
    error: function (xhr, textStatus, error) {
      msg.text("伺服器連線錯誤，目前無法載入所屬群組");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      img.hide();
    },
  });
}
