$(document).ready(function () {
  $("#ddlHotel").change(function () {
    load_hotel();
  });
  $("#loading").hide();
});

function load_hotel() {
  var actid = $("#ddlHotel").val();
  if (actid == "N") return;
  console.log(actid);
  $("#warning").hide();
  var loading = $("#loading");
  loading.show();

  $("#schedule").html("");
  var HotelArray = [];
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
        //console.log(HotelArray);

        sb = ' <table class="table table-bordered">';
        sb += "<thead>";
        sb += "<tr><th>日期</th><th>兩人房</th><th>三人房</th><th>四人房</th></tr>";
        sb += "</thead><tbody>";
        $.each(HotelArray, function (i, v) {
          if (i == 0) {
            // 兩人房
            sb += "<tr>";
            sb += "<td>" + convertDate(v.OpenDay) + "</td>";
            if (v.Qty > 0) {
              sb += "<td class='available'>" + v.Qty + "</td>";
            } else {
              sb += "<td class='unable'>已無名額</td>";
            }
          } else {
            if (i % 3 > 0) {
              // 三,四人房
              if (v.Qty > 0) {
                sb += "<td class='available'>" + v.Qty + "</td>";
              } else {
                sb += "<td class='unable'>已無名額</td>";
              }
            } else {
              sb += "</tr>";
              // 兩人房
              sb += "<tr>";
              sb += "<td>" + convertDate(v.OpenDay) + "</td>";
              if (v.Qty > 0) {
                sb += "<td class='available'>" + v.Qty + "</td>";
              } else {
                sb += "<td class='unable'>已無名額</td>";
              }
            }
          }
        });
        sb += "</tr></tbody></table>";
        $("#schedule").html(sb);
        loading.hide();
        //console.log(HotelArray);
      }
    },
    error: function (xhr, textStatus, error) {
      alert("目前無法載入此旅館資料，請稍後再嘗試。");
      loading.hide();
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
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
