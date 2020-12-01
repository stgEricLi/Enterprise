$(document).ready(function () {
  
    //day_picker($(".input-zone").find("input[id$='_txtStart']").attr("id"));
    //day_picker($(".input-zone").find("input[id$='_txtEnd']").attr("id"));
    $("#txtStart").val(GetDay(0));
    $("#txtEnd").val(GetDay(0));

  day_picker("txtStart");
  day_picker("txtEnd");
  day_picker("txtStDay");
    
  load_company();

  $("#btnSearch").click(function () {
      load_data();
  });

  $("#btnUpdate").click(function () {
      update_news();
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

//載入消息
function load_data() {
  var cnt = $("#content");
  var loading = $("#loading");
  var total = $(".totalRow");

  var pageindex = numFltr($('#hidCurrPage').val());
  var pagesize = numFltr($('#hidPagesize').val());
  var stday = $('#txtStart').val();
  var endday = $('#txtEnd').val();
  var cmp = $("#ddlCompany").val();
  
  if (cmp.length <= 0) { alert("無法取得活動所屬企業，目前無法載入消息！"); return false; }
  if (!isValidDate(stday)) { alert("起始日期格式錯誤！"); return false; }
  if (!isValidDate(endday)) { alert("終止日期格式錯誤！"); return false; }
    

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvNews.asmx/load_News_Paging",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "pageindex": pageindex, "pagesize": pagesize, "company": cmp, "stday": stday, "endday": endday }),
    cache: false,
    asyn: false,
    beforeSend: function () {
      loading.show();
    },
    success: function (response) {
      if (response.hasOwnProperty('d')) {
        var json = JSON.parse(response.d);
        var totalrows = json.TotalRows;

        total.html('---- 共有 ' + totalrows.toString() + ' 筆資料 ----');
        var objNews = json.News;
        var htm = "";
        if (objNews != null) {
            var id = "", link = "", shortLink = "";
            htm += "<table class='table table-hover' style='width:100%; font-size:13px;'>";
            htm += "<tr>";
            htm += "<th>編輯</th><th>編號</th><th>內容</th><th>日期</th><th>連結</th><th>開啟</th><th>刪除</th>";
            htm += "</tr>";
            $.each(objNews, function (i, v) {
                id = v.NewsID.toString();
                link = v.Link.toString();
                if (link.length > 30) { shortLink = link.substring(0, 29) + "..."; } else { shortLink = link; }
                htm += "<tr>";
                htm += "<td style='width:64px; '>";
                htm += "<span id='" + id + "' onclick='load_News(this.id)' title='編輯'  class='glyphicon glyphicon-pencil'></span>";
                htm += "</td>";
                htm += "<td><span id='lbNewsID" + i + "'>" + id + "</span></td>";
                htm += "<td><span id='lbDesc" + i + "'>" + v.Desc.toString() + "</span></td>";
                htm += "<td><span id='lbNewsDate" + i + "'>" + v.NewsDate.toString() + "</span></td>";
                htm += "<td><span id='lbLink" + i + "'>" + shortLink + "</span></td>";
                htm += "<td><span id='lbEnable" + i + "' "
                if (v.Enable.toString() == "False") { htm += "class='no'>否"; } else { htm += "class='yes'>是"; }
                htm += "</span>";
                htm += "<input id='hidCmp" + i + "' type='hidden' value='" + v.Company.toString() + "'>";
                htm += "<input id='hidLink" + i + "' type='hidden' value='" + link + "'>";
                htm += "</td>";
                htm += "<td style='width:64px; text-align:center;'>";
                htm += "<span id='del" + id + "' onclick='delete_news(this.id)' class='glyphicon glyphicon-remove'></span>";
                htm += "</td>";
                htm += "</tr>";
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

//載入詳細資訊
function load_News(id) {  
  var tr = $("#" + id).parent().parent();
  $("#msgErr").text('');
  $("#popID").text(id);
  $("#txtStDay").val(tr.find("span[id^='lbNewsDate']").text());
  $("#txtDesc").val(tr.find("span[id^='lbDesc']").text());
  $("#hidUser").val(tr.find("input[id^='hidCmp']").val());
  $("#txtLink").val(tr.find("input[id^='hidLink']").val());  
  if (tr.find("span[id^='lbEnable']").text() == "是") { $("#ddlEnable").val('true'); } else { $("#ddlEnable").val('false'); }
  $("#myModal").modal('show');
  return false;
}

//更新消息詳細資訊
function update_news() {
  var id = "", company = "", desc = "", stday = "", link = "", enable = "true";
  var img = $("#imgLoad");
  var msg = $("#msgErr");    
  var id = $("#popID").text();
  var tr = $("#" + id).parent().parent();
  desc = $("#txtDesc").val();
  stday = $("#txtStDay").val();
  link = $("#txtLink").val();
  company = $("#hidUser").val();  
  enable = $("#ddlEnable").val();

  if (company.length <= 0) { msg.text("無法取得活動所屬企業，目前無法更新消息！"); return false; }
  if (desc.length <= 0) { msg.text("請輸入消息！"); return false; }
  if (!isValidDate(stday)) { msg.text("消息日格式錯誤！"); return false; }
 

  var News = {};
  News.NewsID = id;
  News.Desc = desc;
  News.Company = company;
  News.NewsDate = stday;
  News.Link = link;
  News.Enable = enable;

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvNews.asmx/Modify_News",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "news": News, "action" : "Update" }),
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
          if (link.length > 30) { shortLink = link.substring(0, 29) + "..."; } else { shortlink = link; }          
          tr.find("span[id^='lbDesc']").text(desc);
          tr.find("span[id^='lbNewsDate']").text(stday);
          tr.find("span[id^='hidLink']").val(link);
          tr.find("span[id^='lbLink']").text(shortlink);
      
        if (enable == "true") {
            tr.find("span[id^='lbEnable']").text("是");
            tr.find("span[id^='lbEnable']").attr("class", "yes")
        } else {
            tr.find("span[id^='lbEnable']").text("否");
            tr.find("span[id^='lbEnable']").attr("class", "no")
        }
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

//刪除消息
function delete_news(id) {
  var tr = $("#" + id).parent().parent();
  var newsid = id.replace("del", "");
  var company = tr.find("input[id^='hidCmp']").val();

  if (!confirm("確定要刪除此一消息嗎？")) { return false; }

  var News = {};
  News.NewsID = newsid;
  News.Desc = '';
  News.Company = company;
  News.NewsDate = '2017/01/01';
  News.Link = '';
  News.Enable = false;

  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "../../mcpservices/SvNews.asmx/Modify_News",
    data: JSON.stringify({ "news": News, "action": "Delete" }),
    dataType: "json",
    async: true,
    beforeSend: function () {},
    success: function (data, textStatus) {
      var result = data.d;
      if (result == "OK") {
          //tr.remove();
          load_data();
        alert("消息已刪除");
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