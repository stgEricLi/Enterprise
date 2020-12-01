$(document).ready(function () {
  load_act();

  $("#btnSearch").click(function () {
    load_hotel();
  });
});

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
      loading.hide();
    },
  });
}

//載入Hotel清單
function load_hotel() {
  var actid = $("#ddlAct").val();
  var lastId = 0;
  var loading = $("#loading");
  loading.show();

  $("#schedule").html("");
  var sb = "";
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Get_Wt_Hotel_Schedule",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ ActId: actid }),
    cache: false,
    success: function (response) {
      if (response.hasOwnProperty("d")) {
        //var json = JSON.parse(response.d);
        //console.log(response.d);
        sb += "<table class='table table-hover' style='width:36%; font-size:12px;'>";
        sb += "<thead>";
        sb += "<tr>";
        sb += "<th>ID</th>";
        sb += "<th>日期</th>";
        sb += "<th>房型</th>";
        sb += "<th style='width:76px;'>數量</th>";
        sb += "<th style='width:96px;'></th>";
        sb += "</tr>";
        sb += "</thead><tbody>";
        $.each(response.d, function (i, v) {
          sb += "<tr>";
          sb += "<td>" + v.ID + "</td>";
          sb += "<td>" + convertDate(v.OpenDay) + "</td>";
          sb += "<td>" + v.RoomType + "人房</td>";
          sb += "<td><input id='txtQty" + v.ID + "' value='" + v.Qty + "' type='text' maxlength='2' class='form-control required input-sm' /></td>";
          sb += "<td text-align:center;'>";
          sb += "<button  id='sav" + v.ID + "' type='button' onclick='save(this.id)' class='btn btn-success btn-xs udpD'><span class='glyphicon glyphicon-floppy-disk'></span></button>&nbsp;";
          sb += "<button  id='del" + v.ID + "' type='button' onclick='remove(this.id)' class='btn btn-danger btn-xs udpD'><span class='glyphicon glyphicon-remove'></span></button>";
          sb += "</td>";
          sb += "</tr>";
        });
        sb += "</tbody></table>";
        $("#schedule").html(sb);
        loading.hide();
      }
    },
    error: function (xhr, textStatus, error) {
      alert("目前無法載入此旅館資料，請稍後再嘗試。");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      loading.hide();
    },
  });
}

//更新主單資訊
function save(id) {
  var tr = $("#" + id)
    .parent()
    .parent();
  id = id.replace("sav", "");
  var img = $("#loading");

  if (id.length <= 0) {
    alert("無法取得報名編號，目前無法進行更新！");
    return false;
  }
  //console.log("ID: ", id);
  //console.log(tr.find("input[id^='txtQty']").val());
  var qty = tr.find("input[id^='txtQty']").val();

  if (!isInteger(qty)) {
    alert("請輸入數量！");
    return false;
  }

  udpD_btn_disable(true);
  img.show();

  var obj = {};
  obj.ID = id;
  obj.Qty = qty;
  obj.Action = "Update";

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Update_Wt_Hotel_Schedule",
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

function remove(id) {
  var tr = $("#" + id)
    .parent()
    .parent();
  id = id.replace("del", "");
  var img = $("#loading");

  if (id.length <= 0) {
    alert("無法取得報名編號，目前無法進行刪除！");
    return false;
  }
  udpD_btn_disable(true);
  img.show();

  var obj = {};
  obj.ID = id;
  obj.Qty = 0;
  obj.Action = "Delete";

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvHotel.asmx/Update_Wt_Hotel_Schedule",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ model: obj }),
    cache: false,
    success: function (data) {
      var str = data.d;
      if (str != "OK") {
        alert(str);
      } else {
        load_hotel();
        alert("資料已刪除！");
      }
      img.hide();
      udpD_btn_disable(false);
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
