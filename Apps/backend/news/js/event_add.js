$(function () {   
    initial();
    $("#btnNew").click(function () {
        add_event();
    });
});

//頁面初始化
function initial() {
    load_period();
  clear_input();
  day_picker("txtStDay");
}

function numberToText(num) {
    switch (num) {
        case 0:
            return "月第一週"
            break;
        case 1:
            return "月第二週"
            break;
        case 2:
            return "月第三週"
            break;
        case 3:
            return "月第四週"
            break;
    }
}

//載入週期
function load_period() {
    //var d = new Date();
    //var m = d.getMonth() + 1;
    //if (m <= 3) { m = 3;}   
    var sb = "", temp = "";
    for (var m = 3; m <= 5; m++) {
        for (var i = 0; i <= 3; i++) {
            temp = m.toString() + numberToText(i);
            sb += "<option value='" + temp + "'>" + temp + "</option>";
        }
    }
    
    $("#ddlPeriod").html(sb);
}

//清理輸入欄位
function clear_input() { 
  $("#txtGoal").val("");  
}

//新增一筆目標
function add_event() { 
  var img = $("#imgStep1");
  var msg = $("#lbMsg");
  var period = $("#ddlPeriod").val();
  var goal = $("#txtGoal").val();  
  
  if (period.length <= 0) { msg.text("沒有週期，目前無法新增目標！"); return false; }
  if (goal.length <= 0) { msg.text("請輸入目標內容！"); return false; }

  var News = {};
  News.Company = period;
  News.Desc = goal;

  var News = {};
  News.NewsID = 0;
  News.Desc = goal;
  News.Company = period;
  
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvNews.asmx/Modify_Fitness",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "news": News, "action" : "Add" }),
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
          msg.text("已新增一目標！");
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

