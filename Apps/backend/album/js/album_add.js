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

//新增一筆企業相簿
function add_news() {
    
  var  company="", desc = "", stday = "", link = "", url="";
  var img = $("#imgStep1");
  var msg = $("#lbMsg");

  company = $("#ddlCompany").val(); 
  desc = $("#txtDesc").val();  
  stday = $("#txtStDay").val();
  link = $("#txtLink").val();
  url = $("#txtImgUrl").val();

  if (company.length <= 0 || company == "none") { msg.text("無法取得企業清單，目前無法新增相簿！"); return false; }
  if (desc.length <= 0) { msg.text("請輸入相簿標題！"); return false; }
  if (!isValidDate(stday)) { msg.text("相簿日期格式錯誤！"); return false; }
  //if (!isUrl(url)) { msg.text("請輸入封面來源網址！"); return false; }
  //if (!isUrl(link)) { msg.text("請輸入對外連結網址！"); return false; }
  

  var Album = {};
  Album.Title = desc;
  Album.AlbumDate = stday;
  Album.Company = company;
  Album.TargetLink = link;
  Album.ImgUrl = url;
  
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAlbum.asmx/Modify_Album",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "album": Album, "action": "Add" }),
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
        msg.text("已新增一相簿！");
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
