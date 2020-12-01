$(function () {   
    initial();
    $("#btnNew").click(function () {
        add_news();      
    });
});

//頁面初始化
function initial() {
  load_company();
  clear_input();
  day_picker("txtStDay");
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
      var str = data.d;
      if (str.length > 0) {
        var sb = "";
        $.each(str, function (i, v) {
          sb += "<option value='" + v.UserName.toString() + "'>" + v.TrueName.toString() + "</option>";
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
  $("#txtStDay").val(GetDay(0));
  $("#txtDesc").val("");
  $("#txtLink").val("");  
}

//新增一筆企業活動行程
function add_news() {
    
  var  company="", desc = "", stday = "", link = "";
  var img = $("#imgStep1");
  var msg = $("#lbMsg");

  company = $("#ddlCompany").val();
  desc = $("#txtDesc").val();
  
  stday = $("#txtStDay").val();
  link = $("#txtLink").val();
  
  if (company.length <= 0 || company == "none") { msg.text("無法取得企業清單，目前無法新增消息！"); return false; }
  if (desc.length <= 0) { msg.text("請輸入消息內容！"); return false; }
  if (!isValidDate(stday)) { msg.text("消息日格式錯誤！"); return false; }

  var News = {};
  News.NewsID = 0;
  News.Desc = desc;
  News.Company = company;
  News.NewsDate = stday;
  News.Link = link;
  News.Enable = true;
  
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvNews.asmx/Modify_News",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "news": News, "action":'Add' }),
    cache: false,
    before: function () {
      msg.text('');
      img.show();
    },
    success: function (data) {      
      var str = data.d;
      if (str != "OK") {
        msg.text(str);
      } else {       
        msg.text("已新增一消息！");
        clear_input();
      }
    },
    error: function (xhr, textStatus, error) {
      msg.text('伺服器連線錯誤，目前無法執行相關作業!');
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
    }
  });
}

