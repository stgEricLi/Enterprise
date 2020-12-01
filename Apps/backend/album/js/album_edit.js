$(document).ready(function () {
  $("#loading").hide();
  day_picker("txtStDay");  
  load_company();

  $("#btnUpdate").click(function () {
    update_album();
  });

  $("#btnQuery").click(function () {
      load_data();
  });

  
});

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

function load_data() {
  var loading = $("#loading");
  var cnt = $("#content");
  var total = $(".totalRow");
  var pageindex = numFltr($('#hidCurrPage').val());
  var pagesize = numFltr($('#hidPagesize').val());
  var cmp = $("#ddlCompany").val();
  $.ajax({
      type: "POST",
      url: "../../mcpservices/SvAlbum.asmx/load_Album_Paging",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({ "pageindex": pageindex, "pagesize": pagesize, "company": cmp }),
      cache: false,
      asyn: true,
      beforeSend: function () {
          loading.show();
      },
      success: function (response) {
          if (response.hasOwnProperty('d')) {
              var json = JSON.parse(response.d);
              var totalrows = json.TotalRows;

              total.html('---- 共有 ' + totalrows.toString() + ' 筆資料 ----');
              var objAlbum = json.Albums;
              var htm = "";
              if (objAlbum != null) {
                  var id = "";
                  htm += "<table class='table'>";
                  htm += "<tr>";
                  htm += "<th>編輯</th><th>相簿ID</th><th>相簿標題</th><th>封面來源網址</th><th>對外連結網址</th><th>相簿日期</th><th>所屬企業</th><th>刪除</th>";
                  htm += "</tr>";
                  $.each(objAlbum, function (i, v) {                     
                      htm += showLine(v.ID.toString(), v.Title.toString(), v.ImgUrl.toString(), v.TargetLink.toString(), v.AlbumDate.toString(), v.Company.toString());
                  });
                  htm += "</table>";
              }
              cnt.html('');
              cnt.html(htm);
              pageing(totalrows, pageindex, pagesize);
          } else {
              cnt.html('');
              total.html('---- 共有 0 筆資料 ----');
          }
          loading.hide();
      },
      error: function (xhr, textStatus, thrownError) {
          console.log(xhr.status);
          console.log(xhr.responseText);
          console.log(thrownError);
          total.html('');
          cnt.html("<p class='loadingError'>目前網路連線異常無法載入資料！</p>");
          //$(".pagination a").unbind("click", function () { });
          $(".pagination").html('');
          loading.hide();
      }
  });  
}

function showLine(i, title, imgUrl, link, day, cmp) {
  var sb = ""; 
  sb += "<tr class='listline'>";
  sb += "<td style='width:64px; text-align:center;'>";
  sb += "<span id='" + i.toString() + "' onclick='edit_album(this.id)' title='編輯'  class='glyphicon glyphicon-pencil'></span>";
  sb += "<input id='hidUrl" + i.toString() + "' type='hidden' value='" + imgUrl + "'/>"
  sb += "<input id='hidLink" + i.toString() + "' type='hidden' value='" + link + "'/>"
  sb += "</td>";
  if (link.length > 30) { link = link.substring(0, 29) + "..."; }
  if (imgUrl.length > 30) { imgUrl = imgUrl.substring(0, 29) + "..."; }
  sb += "<td><span>" + i.toString() + "</td>";
  sb += "<td><span id='lbTitle" + i.toString() + "'>" + title + "</td>";
  sb += "<td><span id='lbUrl" + i.toString() + "'>" + imgUrl + "</td>";
  sb += "<td><span id='lbLink" + i.toString() + "'>" + link + "</td>";
  sb += "<td><span id='lbDay" + i.toString() + "'>" + day + "</td>";
  sb += "<td><span id='lbCmp" + i.toString() + "'>" + cmp + "</td>";
  sb += "<td style='width:64px; text-align:center;'>"; 
  sb += "<span id='del" + i.toString() + "' onclick='delete_album(this.id)' class='glyphicon glyphicon-remove'></span>";
  sb += "</td>";
  sb += "</tr>";
  return sb;
}

//載入詳細資訊
function edit_album(id) {
  var tr = $("#" + id).parent().parent();
  $("#lbMsg").text('');
  $("#popID").text(id);
  $("#txtStDay").val(tr.find("span[id^='lbDay']").text());
  $("#txtDesc").val(tr.find("span[id^='lbTitle']").text());
  $("#txtImgUrl").val(tr.find("input[id^='hidUrl']").val());
  $("#txtLink").val(tr.find("input[id^='hidLink']").val());
  $("#hidcmp").val(tr.find("span[id^='lbCmp']").text());  
  $("#myModal").modal('show');
  return false;
}

//更新消息詳細資訊
function update_album() {
  var company = "", desc = "", stday = "", link = "", url = "";
  var img = $("#imgloading");
  var msg = $("#lbMsg");
  var id = $("#popID").text();
  var tr = $("#" + id).parent().parent();

  company = $("#hidcmp").val(); 
  desc = $("#txtDesc").val();
  stday = $("#txtStDay").val();
  link = $("#txtLink").val();
  url = $("#txtImgUrl").val();

  //if (company.length <= 0) { msg.text("無法取得企業清單，目前無法新增相簿！"); return false; }
  if (desc.length <= 0) { msg.text("請輸入相簿標題！"); return false; }
  if (!isValidDate(stday)) { msg.text("相簿日期格式錯誤！"); return false; }
  //if (!isUrl(url)) { msg.text("請輸入封面來源網址！"); return false; }
  //if (!isUrl(link)) { msg.text("請輸入對外連結網址！"); return false; }


  var Album = {};
  Album.ID = id;
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
    data: JSON.stringify({ "album": Album, "action":"Update" }),
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
          var shortlink = "";
          if (link.length > 30) { shortLink = link.substring(0, 29) + "..."; } else { shortLink = link; }
          tr.find("span[id^='lbTitle']").text(desc);
          tr.find("span[id^='lbDay']").text(stday);
          tr.find("input[id^='hidUrl']").val(url);
          tr.find("input[id^='hidLink']").val(link);
          if (link.length > 30) { link = link.substring(0, 29) + "..."; }
          if (url.length > 30) { url = url.substring(0, 29) + "..."; }
          tr.find("span[id^='lbLink']").text(link);
          tr.find("span[id^='lbUrl']").text(url);        
        msg.text("資料已更新！");
      }
      img.hide();
    },
    error: function (xhr, textStatus, error) {
      msg.text('伺服器連線錯誤，目前無法更新');
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      img.hide();
    }
  });
}

//刪除相簿
function delete_album(id) {
  var tr = $("#" + id).parent().parent();
  var albumID = id.replace("del", "");
  
  if (!confirm("確定要刪除此一相簿嗎？")) { return false; }

  var Album = {};
  Album.ID = albumID;
  Album.Title = '';
  Album.AlbumDate = '2017/02/01';
  Album.Company = '';
  Album.TargetLink = '';
  Album.ImgUrl = '';

  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "../../mcpservices/SvAlbum.asmx/Modify_Album",
    data: JSON.stringify({ "album": Album, "action": "Delete" }),
    dataType: "json",
    async: true,
    beforeSend: function () {},
    success: function (data, textStatus) {
      var result = data.d;
      if (result == "OK") {
        tr.remove();
        alert("相簿已刪除");
      } else {
        alert(result);
      }
    },
    error: function (xhr, status, error) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      alert("伺服器異常！刪除失敗！");
    }
  });
}