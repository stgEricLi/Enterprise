$(document).ready(function () {

  day_picker("txtStDay");
  day_picker("txtEdDay");
  load_company();

  $("#btnSearch").click(function () {
      load_data();
  });

  $("#btnUpdate").click(function () {
    update_act();
  });

});

//載入企業清單
function load_company() {

    $("#ddlCompany").html("<option value='wt'>文曄科技</option>");
  
  //$.ajax({
  //  type: "GET",
  //  url: "../../mcpservices/SvAccount.asmx/Get_Account_DDL",
  //  contentType: "application/json; charset=utf-8",
  //  dataType: "json",
  //  cache: false,
  //  beforeSend: function () { },
  //  success: function (data) {
  //      var str = data.d;
  //      console.log(str);
  //    if (str.length > 0) {
  //      var sb = "";
  //      $.each(str, function (i, v) {
  //          sb += "<option value='" + v.UserName.toString() + "'>" + v.UserName.toString() + "</option>";
  //      });
  //    } else {
  //      sb = "<option value='none'>目前無資料</option>";
  //    }
  //    $("#ddlCompany").html(sb);
  //  },
  //  error: function (xhr, textStatus, error) {
  //    $("#ddlCompany").html("<option value='none'>目前無資料</option>");
  //    alert("伺服器錯誤，無法取得企業清單！");
  //    console.log(xhr.status);
  //    console.log(xhr.responseText);
  //    console.log(error);
  //  }
  //});
}

//載入企業活動
function load_data() {
  var cnt = $("#actcontent");
  var loading = $("#loading");
  var total = $(".totalRow");

  var pageindex = numFltr($('#hidCurrPage').val());
  var pagesize = numFltr($('#hidPagesize').val());

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAct.asmx/load_Act",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "pageindex": pageindex, "pagesize": pagesize, "company": $("#ddlCompany").val() }),
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
        var objAct = json.Acts;
        var htm = "";
        if (objAct != null) {
            htm += "<table class='table table-hover' style='width:100%; font-size:13px;'>";
            htm += "<tr>";
            htm += "<th>編輯</th><th>編號</th><th>名稱</th><th>出發日</th><th>報名截止日</th><th>最大人數</th><th>價格A</th><th>價格B</th><th>開放</th><th>刪除</th>";
            htm += "</tr>";
            $.each(objAct, function (i, v) {
                htm += "<tr>";
                htm += "<td style='width:64px; '>";
                htm += "<span id='" + v.ActID.toString() + "' onclick='load_Act(this.id)' title='編輯'  class='glyphicon glyphicon-pencil'></span>";
                htm += "</td>";
                htm += "<td><span id='lbActID" + i + "'>" + v.ActID.toString() + "</span></td>";
                htm += "<td><span id='lbName" + i + "'>" + v.Name.toString() + "</span></td>";
                htm += "<td><span id='lbStDay" + i + "'>" + v.StartDay.toString() + "</span></td>";
                htm += "<td><span id='lbEnDay" + i + "'>" + v.RegExpDay.toString() + "</span></td>";
                htm += "<td><span id='lbCapacity" + i + "'>" + v.Capacity.toString() + "</span></td>";
                htm += "<td><span id='lbPrice1" + i + "'>" + v.Price.toString() + "</span></td>";
                htm += "<td><span id='lbPrice2" + i + "'>" + v.Price2.toString() + "</span></td>";
                htm += "<td><span id='lbEnable" + i + "' "
                if (v.Enable.toString() == "False") { htm += "class='no'>否"; } else { htm += "class='yes'>是"; }
                htm += "</span>";
                htm += "<input id='hidCmp" + i + "' type='hidden' value='" + v.Company.toString() + "'>";
                htm += "</td>";
                htm += "<td style='width:64px; text-align:center;'>";
                htm += "<span id='del" + v.ActID.toString() + "' onclick='delete_act(this.id)' class='glyphicon glyphicon-remove'></span>";
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
function load_Act(id) {  
  var tr = $("#" + id).parent().parent();
  $("#msgErr").text('');
  $("#popID").text(id);
  $("#hidUser").val(tr.find("input[id^='hidCmp']").val());
  $("#txtDesc").val(tr.find("span[id^='lbName']").text());
  $("#txtStDay").val(tr.find("span[id^='lbStDay']").text());
  $("#txtEdDay").val(tr.find("span[id^='lbEnDay']").text());
  $("#txtPrice1").val(tr.find("span[id^='lbPrice1']").text());
  $("#txtPrice2").val(tr.find("span[id^='lbPrice2']").text());
  $("#txtCapacity").val(tr.find("span[id^='lbCapacity']").text());  
  if (tr.find("span[id^='lbEnable']").text() == "是") { $("#ddlEnable").val('true'); } else { $("#ddlEnable").val('false'); }
  $("#myModal").modal('show');
  return false;
}

//更新活動詳細資訊
function update_act() {
  var actid = "", company = "", name = "", stday = "", eday = "", price1 = 0, price2 = 0, amt = 0, enable = "true";
  var img = $("#imgLoad");
  var msg = $("#msgErr");    
  var actid = $("#popID").text();
  var tr = $("#" + actid).parent().parent();
  company = $("#hidUser").val();
  name = txtFltr($("#txtDesc").val());
  stday = $("#txtStDay").val();
  eday = $("#txtEdDay").val();
  price1 = $("#txtPrice1").val();
  price2 = $("#txtPrice2").val();
  amt = $("#txtCapacity").val();
  enable = $("#ddlEnable").val();

  if (company.length <= 0 ) { msg.text("無法取得活動所屬企業，目前無法更新活動！"); return false; }
  if (name.length <= 0) { msg.text("請輸入活動名稱！"); return false; }
  if (!isValidDate(stday)) { msg.text("活動日格式錯誤！"); return false; }
  if (!isValidDate(eday)) { msg.text("報名終止日格式錯誤！"); return false; }
  if (!isInteger(price1)) { msg.text("請輸入活動價格A！"); return false; }
  if (!isInteger(price2)) { msg.text("請輸入活動價格B！"); return false; }
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

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAct.asmx/Update_Activity",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "act": Act }),
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
        tr.find("span[id^='lbName']").text(name);
        tr.find("span[id^='lbStDay']").text(stday);
        tr.find("span[id^='lbEnDay']").text(eday);
        tr.find("span[id^='lbPrice1']").text(price1);
        tr.find("span[id^='lbPrice2']").text(price2);
        tr.find("span[id^='lbCapacity']").text(amt);
        if (enable == "true") {
          tr.find("span[id^='lbEnable']").text("是");
          tr.find("span[id^='lbEnable']").attr("class","yes")
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

//刪除活動
function delete_act(id) {
  var tr = $("#" + id).parent().parent();
  var actid = id.replace("del", "");
  
  if (!confirm("確定要刪除此一活動嗎？")) { return false; }  
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "../../mcpservices/SvAct.asmx/Delete_Activity",
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
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      alert("伺服器異常！刪除失敗！");
    }
  });
}