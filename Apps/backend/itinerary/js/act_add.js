$(function () {
  $("#btnNew").click(function () {
    add_activity();
  });
  initial();
});

//頁面初始化
function initial() {
  load_company();
  $("#txtPrice1").val('0');
  $("#txtPrice2").val('0');
  $("#txtCapacity").val('80');
  $("#txtRoom2").val('0');
  $("#txtRoom4").val('0');  
  $("#txtStDay").val(GetDay(0));
  $("#txtEdDay").val(GetDay(0));
  day_picker("txtStDay");
  day_picker("txtEdDay");
}

//載入企業清單
function load_company() {
  $.ajax({
    type: "GET",
    url: "../../mcpservices/SvAccount.asmx/Get_Account_DDL",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    cache: false,
    beforeSend: function () { },
    success: function (data) {
      console.log(data);
      var str = data.d;
      if (str.length > 0) {
        var sb = "";
        $.each(str, function (i, v) {
          sb += "<option value='" + v.UserName.toString() + "'>" + v.UserName.toString() + "</option>";
        });        
      } else {
        sb = "<option value='none'>目前無資料</option>";
      }
      $("#ddlCompany").html(sb);
    },
    error: function (xhr, textStatus, error) {
      $("#ddlCompany").html("<option value='none'>目前無資料</option>");
      alert("伺服器錯誤，無法取得企業清單！");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
    }
  });
}

//清理輸入欄位
function clear_input() {
  $("#txtDesc").val("");
  $("#txtPrice2").val("0");
  $("#txtPrice1").val("0");
  $("#txtStDay").val(GetDay(0));
  $("#txtEdDay").val(GetDay(0));
  $("#txtCapacity").val("80");
  $("#txtRoom2").val('0');
  $("#txtRoom4").val('0');
}

//新增一筆企業活動行程
function add_activity() {
  var actid = "", company="", type="", name = "", stday = "", eday = "", price1 = 0, price2 = 0, amt = 0, enable = "true", room2=0, room4=0;
  var img = $("#imgStep1");
  var msg = $("#msgStep1");

  company = $("#ddlCompany").val();
  name = txtFltr($("#txtDesc").val());
  stday = $("#txtStDay").val();
  eday = $("#txtEdDay").val();
  price1 = $("#txtPrice1").val();
  price2 = $("#txtPrice2").val();
  amt = $("#txtCapacity").val();
  enable = $("#ddlEnable").val();
  room2 = $("#txtRoom2").val();
  room4 = $("#txtRoom4").val();
  type = $("#ddlType").val();
  
  if (company.length <= 0 || company == "none") { msg.text("無法取得企業清單，目前無法新增活動！"); return false; }
  if (name.length <= 0) { msg.text("請輸入活動名稱！"); return false; }  
  if (!isValidDate(stday)) { msg.text("活動日格式錯誤！"); return false; }
  if (!isValidDate(eday)) { msg.text("報名終止日格式錯誤！"); return false; }
  if (!isInteger(price1)) { msg.text("請輸入活動價格A！"); return false; }
  if (!isInteger(price2)) { msg.text("請輸入活動價格B！"); return false; }
  if (!isInteger(room2)) { room2 = 0; }
  if (!isInteger(room4)) { room4 = 0; }
  if (!isInteger(amt)) { msg.text("請輸入可容納人數！"); return false; }

  var Act = {};
  Act.ActID = actid;
  Act.Name = name;
  Act.StartDay = stday;
  Act.RegExpDay = eday;
  Act.Company = company;
  Act.Capacity = amt;
  Act.Price = price1;
  Act.Price2 = price2;
  Act.Enable = enable;
  Act.FieldStr1 = '';
  Act.FieldStr2 = '';
  Act.FieldInt1 = room2;
  Act.FieldInt2 = room4;

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAct.asmx/Add_Activity",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "act": Act, "acttype" : type }),
    cache: false,
    before: function () {
      msg.text('');
      img.show();
    },
    success: function (data) {
      var str = data.d;
      if (str.substring(0,2) != "OK") {
        msg.text(str);
      } else {
        $("#lbActid").text(str);
        msg.text('活動：「' + name + "」-" + str.replace("OK","") + "已新增！");
        clear_input();
      }
    },
    error: function (xhr, textStatus, error) {
      msg.text('伺服器連線錯誤，目前無法載入所屬群組');
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
    }
  });
}

