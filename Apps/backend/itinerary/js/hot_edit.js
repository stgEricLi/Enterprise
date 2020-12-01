$(document).ready(function () {
  $("#btnUpdate").click(function () {
    update_act();
  });
});



/***********************************************************************************************************************
 *                                             主表資料
***********************************************************************************************************************/
// 頁面再次載入時
function pageLoad() { regenerate_table(); }

//從新組合資料表格
function regenerate_table() {
  var htm = "", seqno = "", name = "", actid = "", day = "", age = "", loc = "", price = "", page = "";
  htm += "<table class='table table-hover' style='width:100%; font-size:13px;'>";
  htm += "<tr>";
  htm += "<th>編輯</th><th>活動編號</th><th>熱推敘述</th><th>活動日期</th><th>價格</th><th>適用年齡</th><th>上課地點</th><th>所屬頁面</th><th>刪除</th>";
  htm += "</tr>";
  $(".list ul li").each(function (i) {
    if (i >= 0) {
      seqno = $(this).find("span[id$='_lbSeqNo']").text().trim();
      actid = $(this).find("span[id$='_lbActID']").text().trim();
      name = $(this).find("span[id$='_lbName']").text().trim();
      day = $(this).find("span[id$='_lbDay']").text().trim();
      age = $(this).find("span[id$='_lbAge']").text().trim();
      loc = $(this).find("span[id$='_lbLoc']").text().trim();     
      price = $(this).find("span[id$='_lbPrice']").text().trim();
      age = $(this).find("span[id$='_lbAge']").text().trim();
      page = $(this).find("span[id$='_lbPage']").text().trim();
      
      htm += "<tr>";
      htm += "<td style='width:64px; text-align:center;'>";
      htm += "<a id='" + seqno + "' href='#' onclick='load_Act(this)' title='編輯'><span class='glyphicon glyphicon-pencil'></span></a>&nbsp;";
      htm += "</td>";
      htm += "<td><span id='lbActID" + i + "'>" + actid + "</span></td>";
      htm += "<td><span id='lbName" + i + "'>" + name + "</span></td>";
      htm += "<td><span id='lbDay" + i + "'>" + day + "</span></td>";
      htm += "<td><span id='lbPrice" + i + "'>" + price + "</span></td>";
      htm += "<td><span id='lbAge" + i + "'>" + age + "</span></td>";
      htm += "<td><span id='lbLoc" + i + "'>" + loc + "</span></td>";
      htm += page_Handler(i, page);
      htm += "<td style='width:64px; text-align:center;'>";
      htm += "<span id='del" + seqno + "' onclick='delete_act(this.id)' class='glyphicon glyphicon-remove'></span>";
      htm += "</td>";
      htm += "</tr>";
    }
  });
  htm += "</table>";
  $(".list").html('');
  $(".list").html(htm);
}

function load_Act(obj) {
  var id = obj.id.toString();
  var tr = $("#" + id).parent().parent();  
  $("#popID").text(id);
  $("#txtDesc").val(tr.find("span[id^='lbName']").text());
  $("#txtDay").val(tr.find("span[id^='lbDay']").text());
  $("#txtActID").val(tr.find("span[id^='lbActID']").text());  
  $("#txtPrice").val(tr.find("span[id^='lbPrice']").text());
  $("#txtAge").val(tr.find("span[id^='lbAge']").text());
  $("#txtLocation").val(tr.find("span[id^='lbLoc']").text());  
  $("#ddlPage").val(tr.find("input[id^='hidPage']").val());
  $("#msgErr").text('');
  $("#myModal").modal('show');
  return false;
}

function update_act() {
  var seqno = $("#popID").text();
 
  var tr = $("#" + seqno).parent().parent();
  var actid = "", name = "", day = "", price = 0, age = "", loc = "", desc = "", page = "";
  var img = $("#imgLoad");
  var msg = $("#msgErr");
  var btn = $("#btnUpdate");
  

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
  Act.SeqNo = seqno;
  Act.ActID = actid;
  Act.Name = name;
  Act.Day = day;
  Act.Price = price;
  Act.AgeRange = age;
  Act.Location = loc;
  Act.Page = page;

  $.ajax({
    type: "POST",
    url: "../../mcpservices/ActivityService.asmx/Update_HotActivity",
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
      if (str != "OK") {
        msg.text(str);        
      } else {        
        msg.text('已更新!');
        tr.find("span[id^='lbName']").text(name);
        tr.find("span[id^='lbDay']").text(day);
        tr.find("span[id^='lbActID']").text(actid);
        tr.find("span[id^='lbPrice']").text(price);
        tr.find("span[id^='lbAge']").text(age);
        tr.find("span[id^='lbLoc']").text(loc);
        tr.find("span[id^='lbPage']").text(page_trans(page));        
        tr.find("input[id^='hidPage']").val(page);       
      }
      btn.prop("disabled", false);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      msg.text('伺服器連線錯誤，目前無法載入所屬群組');
      btn.prop("disabled", false);
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    }
  });
}

function delete_act(id) {
  var tr = $("#" + id).parent().parent();
  var actid = id.replace("del", "");
  
  if (!confirm("確定要刪除此一活動嗎？")) { return false; }  
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "../../mcpservices/ActivityService.asmx/Delete_Activity",
    data: JSON.stringify({ "actid": actid }),
    dataType: "json",
    async: true,
    beforeSend: function () {},
    success: function (data, textStatus) {
      var result = data.d;
      if (result == "OK") {
        tr.remove();
        alert("活動已刪除");
      } else {
        alert(result);
      }
    },
    error: function (xhr, status, error) {
      alert("伺服器異常！刪除失敗！");
    }
  });
}


function page_Handler(no, str) {
  var sb = "<td><span id='lbPage" + no + "'>";
  switch (str) {
    case "search":
      sb += "活動搜尋頁面" + "</span>";
      sb += "<input id='hidPage" + no + "' type='hidden' value='" + str + "'></td>";
      break;
    case "camp":
      sb += "兒童營隊頁面" + "</span>";
      sb += "<input id='hidPage" + no + "' type='hidden' value='" + str + "'></td>";
      break;
    case "youth":
      sb += "青少年營隊頁面" + "</span>";
      sb += "<input id='hidPage" + no + "' type='hidden' value='" + str + "'></td>";
      break;
    case "family":
      sb += "親子活動頁面" + "</span>";
      sb += "<input id='hidPage" + no + "' type='hidden' value='" + str + "'></td>";
      break;
    case "teen":
      sb += "青年活動頁面" + "</span>";
      sb += "<input id='hidPage" + no + "' type='hidden' value='" + str + "'></td>";
      break;
  }
  return sb;
}

function page_trans(str) {
  switch (str) {
    case "search":
      str = "活動搜尋頁面";
      break;
    case "camp":
      str = "兒童營隊頁面";
      break;
    case "youth":
      str = "青少年營隊頁面";
      break;
    case "family":
      str = "親子活動頁面";
      break;
    case "teen":
      str = "青年活動頁面";
      break;
  }
  return str;
}