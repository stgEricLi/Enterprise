$(document).ready(function () {
    load_data();

});

//載入資料
function load_data() {
    var cnt = $("#content");
    var loading = $("#loading");
    var total = $(".totalRow");
    var pageindex = numFltr($('#hidCurrPage').val());
    var pagesize = numFltr($('#hidPagesize').val());
   
    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvNews.asmx/load_Fitness_Paging",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "pageindex": pageindex, "pagesize": pagesize}),
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
                var objNews = json.News;
                var htm = "";
                if (objNews != null) {
                    var id = "";
                    htm += "<table class='table table-hover' style='width:100%; font-size:13px;'>";
                    htm += "<tr>";
                    htm += "<th>目標週期</th><th>目標內容</th><th>更新</th><th>刪除</th>";
                    htm += "</tr>";
                    $.each(objNews, function (i, v) {
                        id = v.NewsID.toString();
                        htm += "<tr>";
                        htm += "<td style='width:164px;'><span id='lbPeriod" + i + "'>" + v.Company.toString() + "</span></td>";
                        htm += "<td><input id='txtGoal" + i + "' value='" + v.Desc.toString() + "' type='text' maxlength='250' class='form-control required' />";
                        htm += "</td>";
                        htm += "<td style='width:64px; '>";
                        htm += "<span id='" + id + "' onclick='update_event(this.id)' title='更新'  class='glyphicon glyphicon-floppy-disk'></span>";
                        htm += "</td>";
                        htm += "<td style='width:64px; text-align:center;'>";
                        htm += "<span id='del" + id + "' onclick='delete_event(this.id)' class='glyphicon glyphicon-remove'></span>";
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




//更新消息詳細資訊
function update_event(id) {
    var tr = $("#" + id).parent().parent(); 
    var goal = tr.find("input[id^='txtGoal']").val();
    if (goal.length <= 0) { alert("請輸入目標內容！"); return false; }

    var News = {};
    News.NewsID = id;
    News.Desc = goal;
    News.Company = 'Period';

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvNews.asmx/Modify_Fitness",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "news": News, "action": "Update" }),
    cache: false,
    before: function () {      
    },
    success: function (data) {
      var str = data.d;
      if (str != "OK") {
        msg.text(str);
      } else {         
        alert("資料已更新！");
      }      
    },
    error: function (xhr, textStatus, error) {
        alert('伺服器連線錯誤，目前無法更新');
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      img.hide();
    }
  });
}

//刪除消息
function delete_event(id) {
    var tr = $("#" + id).parent().parent();
  var newsid = id.replace("del", "");  
  if (!confirm("確定要刪除此一目標嗎？")) { return false; }
  var News = {};
  News.NewsID = newsid;
  News.Desc = 'Goal';
  News.Company = 'Period';
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "../../mcpservices/SvNews.asmx/Modify_Fitness",
    data: JSON.stringify({ "news": News, "action": "Delete" }),
    dataType: "json",
    async: true,
    beforeSend: function () {},
    success: function (data, textStatus) {
      var result = data.d;
      if (result == "OK") {   load_data(); alert("活動已刪除"); } else { alert(result); }
    },
    error: function (xhr, status, error) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      alert("伺服器異常！刪除失敗！");
    }
  });
}