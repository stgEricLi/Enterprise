$(function () {
  
  $("select").each(function (i) {
    $(this).attr("class", "form-control");
  });

  $("#btnNew").click(function () {
    add_activity();
  });

  initial();
});

function initial() {
  $("#txtPrice").val('5000');
  $("#txtAge").val('6-12');
  $("#txtDay").val('');
  $("#txtActID").val('');
  $("#txtDesc").val('');
  $("#txtLocation").val('東吳');
}


function add_activity() {
  var actid = "", name = "", day = "", price = 0, age = "", loc="", desc="", page="";
  var img = $("#imgStep1");
  var msg = $("#msgStep1");
  var btn = $("#btnNew");
  page = $("#ddlPage").val();
  actid = $("#txtActID").val();
  name = txtFltr($("#txtDesc").val());
  day = $("#txtDay").val();
  price = $("#txtPrice").val();
  age = $("#txtAge").val();
  loc = $("#txtLocation").val();
  
  if (actid.length <= 0) { msg.text("請輸入活動編號一共十碼！"); return false; }
  if (actid.length != 10) { msg.text("請輸入活動編號一共十碼！"); return false; }
  if (name.length <= 0) { msg.text("請輸入熱推敘述！"); return false; }
  if (day.length <= 0) { msg.text("請輸入活動日期！"); return false; }
  if (age.length <= 0) { msg.text("請輸入適用年齡！"); return false; }
  if (loc.length <= 0) { msg.text("請輸入上課地點！"); return false; }
  if (!isInteger(price)) { msg.text("請輸入活動價格！"); return false; }

  var Act = {};
  Act.SeqNo = 0;
  Act.ActID = actid;
  Act.Name = name;
  Act.Day = day; 
  Act.Price = price;
  Act.AgeRange = age;
  Act.Location = loc;
  Act.Page = page;
  
  $.ajax({
    type: "POST",
    url: "../../mcpservices/ActivityService.asmx/Add_HotActivity",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "act": Act }),
    cache: false,
    before: function () {
      msg.text('');
      img.show();
      btn.prop("disabled", true);
    },
    success: function (data) {
      var str = data.d;
      if (!isInteger(str)) {
        msg.text(str);        
      } else {       
        msg.text('已經新增一筆熱推活動！');
        initial();
      }
      btn.prop('disabled', false);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      msg.text('伺服器連線錯誤，目前無法新增！');
      btn.prop('disabled', false);
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    }
  });
}
