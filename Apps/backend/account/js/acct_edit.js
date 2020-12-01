
$(document).ready(function () {
  $("#btnSearch").click(function () {
    load_data();
  });
  $("#ddlOption").change(function () {
    if (this.value == "All")
      $("#txtValue").prop('disabled', true);
    else
      $("#txtValue").prop('disabled', false);
  });

  load_data();
});

function load_data() {
  var filterby = $("#ddlOption").val();
  var cnt = $("#content");
  var loading = $("#loading");
  var total = $(".totalRow");
  var pageindex = numFltr($('#hidCurrPage').val());
  var pagesize = numFltr($('#hidPagesize').val());

  var value = "";

  if (filterby == "All") {
    value = "";
  } else {
    value = $("#txtValue").val();
  }

 
  loading.show();

  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAccount.asmx/load_account_Paging",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "pageindex": pageindex, "pagesize": pagesize, "filterby": filterby, "filtervalue": value }),
    cache: false,
    beforeSend: function () {
      
    },
    success: function (response) {
      console.log(response);
      if (response.hasOwnProperty('d')) {
        var json = JSON.parse(response.d);
        var totalrows = json.TotalRows;

        total.html('---- 共有 ' + totalrows.toString() + ' 筆資料 ----');
        var objOd = json.Users;
        var htm = "";
        if (objOd != null) {
          htm += "<div class='table-responsive'>";
          htm += "<table class='table table-hover' style='width:100%; font-size:13px;'>";
          htm += "<tr>";
          htm += "<th>變更</th><th>帳號名稱</th><th>帳號 Email</th><th>開通狀態</th><th>鎖定狀態</th><th>鎖住日期</th><th>最近登入日</th><th>密碼輸入錯誤次數</th><th></th>";
          htm += "</tr>";
          $.each(objOd, function (i, v) {
            id = v.UserId.toString();
            htm += "<tr>";
            htm += "<td style='width:64px;'>";
            // htm += "<span id='" + id + "' onclick='load_details(this.id)' title='編輯'  class='glyphicon glyphicon-search'></span>";
            htm += "<button  id='" + id + "' type='button' onclick='load_detail(this.id)' class='btn btn-info btn-xs'><span class='glyphicon glyphicon-search'></span></button>";
            htm += "</td>";
            
            htm += "<td><span id='lbName" + id + "'>" + v.Name.toString() + "</span></td>";
            htm += "<td><span id='lbEmail" + id + "'>" + v.Email.toString() + "</span></td>";
            if (v.IsApproved.toString() == 'false') {
              //htm += "<td><span id='lbApproved" + id + "' class='glyphicon glyphicon-lock'>未開通</span></td>";              
              htm += "<td><label class='switch'><input id='lbApproved" + id + "' onclick='approve(this.id)' type='checkbox'><span class='slider round'></span></label></td>";
            } else {
              //htm += "<td><span id='lbApproved" + id + "' onclick='approve(this.id)' class='glyphicon glyphicon-ok-sign'></span></td>";
              htm += "<td><label class='switch'><input id='lbApproved" + id + "'  onclick='approve(this.id)' type='checkbox' checked><span class='slider round'></span></label></td>";
            }
            if (v.IsLockedOut.toString() == 'false') {
              htm += "<td><span id='lbLock" + id + "' class='glyphicon glyphicon-ok-sign'></span></td>";                
            } else {
              htm += "<td><span  id='lbLock" + id + "' onclick='unlock(this.id)' class='glyphicon glyphicon-lock'></span></td>";
            }
           
            htm += "<td><span id='lbLockDate" + id + "'>" + v.LastLockoutDate.toString() + "</span></td>";
            htm += "<td><span id='lbLoginDate" + id + "'>" + v.LastLoginDate.toString() + "</span></td>";
            htm += "<td><span id='lbTryPwd" + id + "'>" + v.FailedPasswordAttemptCount.toString() + "</span></td>";           
           // htm += "<td><button  id='sent" + id + "' type='button' onclick='send_mail(this.id)' class='btn btn-warning btn-xs udpD'><span class='glyphicon glyphicon-envelope'></span></button></td>";

            htm += "<td style='width:96px; text-align:center;'>";
            htm += "<button  id='sav" + id + "' type='button' onclick='save_main(this.id)' class='btn btn-success btn-xs udpD'><span class='glyphicon glyphicon-floppy-disk'></span></button>&nbsp;";
            htm += "<button  id='del" + id + "' type='button' onclick='delete_main(this.id)' class='btn btn-danger btn-xs udpD'><span class='glyphicon glyphicon-remove'></span></button>";
            htm += "<input id='hidQuestion" + id + "' type='hidden' value='" + v.PasswordQuestion + "' />";        
            //htm += "<span id='sav" + id + "' onclick='save_main(this.id)' class='glyphicon glyphicon-floppy-disk'></span>&nbsp;";
            //htm += "<span id='del" + id + "' onclick='delete_all(this.id)' class='glyphicon glyphicon-remove'></span>";
            htm += "</td>";
            htm += "</tr>";
          });
          htm += "</table>";
          htm += "</div>";
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
    error: function (xhr, textStatus, error) {
      console.log(xhr.status);
      console.log(xhr.responseText);
     // console.log(thrownError);
      total.html('');
      cnt.html("<p class='loadingError'>目前網路連線異常無法載入資料！</p>");     
      $(".pagination").html('');
      loading.hide();
    }
  });
}

//從新組合資料表格
function regenerate_table() {
  var htm = "", id = "";
  htm += "<table class='table table-hover' style='width:100%; font-size:13px;'>";
  htm += "<tr>";
  htm += "<th>編輯</th><th>帳號</th><th>公司名稱</th><th>公司電話</th><th>聯絡人手機</th><th>公司地址</th>";
  htm += "</tr>";
  $(".list ul li").each(function (i) {
    if (i >= 0) {
      id = $(this).find("span[id$='_lbUsr']").text().trim();
      htm += "<tr>";
      htm += "<td style='width:64px; text-align:center;'>";
      htm += "<span id='" + id + "' title='編輯' class='glyphicon glyphicon-pencil' onclick='load_detail(this.id)'></span>";
      htm += "</td>";
      htm += "<td><span id='lbUser" + i + "'>" + id + "</span></td>";
      htm += "<td><span id='lbName" + i + "'>" + $(this).find("span[id$='_lbName']").text() + "</span></td>";
      htm += "<td><span id='lbTel" + i + "'>" + $(this).find("span[id$='_lbTel1']").text() + "</span></td>";
      htm += "<td><span id='lbCell" + i + "'>" + $(this).find("span[id$='_lbCell1']").text() + "</span></td>";  
      htm += "<td>";
      htm += "<span id='lbAddr" + i + "'>" + $(this).find("span[id$='_lbAddr']").text() + "</span>";
      htm += "<input id='hidUser" + i + "' type='hidden' value='" + $(this).find("span[id$='_lbSid']").text()+ "'>";
      htm += "<input id='hidTel" + i + "' type='hidden' value='" + $(this).find("span[id$='_lbTel2']").text() + "'>";
      htm += "<input id='hidCell" + i + "' type='hidden' value='" + $(this).find("span[id$='_lbCell2']").text() + "'>";      
      htm += "<input id='hidFax" + i + "' type='hidden' value='" + $(this).find("span[id$='_lbFax']").text() + "'>";
      htm += "<input id='hidAddr" + i + "' type='hidden' value='" + $(this).find("span[id$='_lbAddr']").text() + "'>";
      htm += "</td>";
      htm += "</tr>";
    }
  });
  htm += "</table>";
  $(".list").html('');
  $(".list").html(htm);
}

function load_detail(id) {
  //var img = $("#lbLoading");
  //img.show();
  //load_status(id,"approve");
  //load_status(id, "lock");
  //var tr = $("#" + id).parent().parent();
  //$("#UserTitle").text(id);  
  //$("#txtCompanyName").val(tr.find("span[id^='lbName']").text());
  //$("#txtCompantTel").val(tr.find("span[id^='lbTel']").text());
  //$("#txtTel2").val(tr.find("input[id^='hidTel']").val());
  //$("#txtCell1").val(tr.find("span[id^='lbCell']").text());
  //$("#txtCell2").val(tr.find("input[id^='hidCell']").val());
  //$("#txtAddress").val(tr.find("span[id^='lbAddr']").text());
  //$("#txtFax").val(tr.find("input[id^='hidFax']").val());
  
  //img.hide();

  var tr = $("#" + id).parent().parent();
  var name = tr.find("span[id^='lbName']").text();
  $("#UserTitle").text(name);
  $("#myModal").modal('show');
  return false;
}

//新增客戶
function update_account() {
  if (!Is_Data_Valid()) { alert("頁面上有錯誤的資料格式，請先修正後再繼續！"); return false; }
  
  var msg = $("#lineError");
  var img = $("#lbLoading");
  var user = $("#UserTitle").text();
  var name = $("#txtCompanyName").val();
  var tel1 = $("#txtCompantTel").val();
  var tel2 = $("#txtTel2").val();
  var cell1 = $("#txtCell1").val();
  var cell2 = $("#txtCell2").val();
  var addr = txtFltr($("#txtAddress").val());
  var fax = $("#txtFax").val();
  var sid = $("#txtCompanyID").val();
  msg.text('');

  if (user.length <= 0) { msg.text('帳號名稱遺失，目前無法更新資料！'); return false; }
  if (name.length <= 0) { msg.text('請輸入公司名稱！'); return false; } 
  if (!isTel(tel1, "tel")) { msg.text('電話格式需為：02-2952-7535'); return false; }
  if (!isTel(cell1, "cell")) { msg.text('手機格式需為：0932-666888'); return false; }
  if (tel2.length > 0) { if (!isTel(tel2, "tel")) { msg.text('其他電話格式需為：02-2952-7535'); return false; } }
  if (cell2.length > 0) { if (!isTel(cell2, "cell")) { msg.text('其他手機格式需為：02-2952-7535'); return false; } }
  if (fax.length > 0) { if (!isTel(fax, "tel")) { msg.text('傳真格式需為：02-2952-7535'); return false; } }
  
  var cdata = { "username": name, 'companyName': name, 'companyID': sid, 'tel1': tel1, 'cell1': cell1, 'tel2': tel2, 'cell2': cell2, 'fax': fax, 'address': addr };
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "../../mcpservices/SvAccount.asmx/Update_Account_info",
    data: JSON.stringify(cdata),
    dataType: "json",
    async: false,
    beforeSend: function () {
      img.show();
    },
    success: function (data, textStatus) {
      var str = data.d;
      if (str != "OK") {
        msg.text(str);
      } else {
        msg.text("資料已更新!");
      }
      img.hide();
    },
    error: function (xhr, status, error) {
      msg.text("伺服器連線發生錯誤！更新失敗！");
      img.hide();
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
    }
  });
  event.preventDefault();
}


//載入帳號狀態
function load_status(user, status) {
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAccount.asmx/Get_Account_Status",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "username": user, "status": status }),
    cache: false,
    beforeSend: function () { },
    success: function (data) {
      var str = data.d;
      if (str == "true") {
        if (status == "approve") { $("#ddlApprove").val('True'); }
        if (status == "lock") { $("#btnLock").prop('disabled', false); }
      } else {
        if (status == "approve") { $("#ddlApprove").val('False'); }
        if (status == "lock") { $("#btnLock").prop('disabled', true); }
      }
    },
    error: function (xhr, textStatus, thrownError) {
      msg.text("伺服器錯誤，無法取得密碼！");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    }
  });
}

//密碼變更
function ChangePwd() {
  var name = $("#UserTitle").text();
  var pwd = $("#txtNewPwd").val();
  if (name.length <= 0) { alert('使用者名稱遺失，無法進行加入程序！'); return false; }
  if (pwd.length <= 0) { alert('請輸入新密碼！'); return false; }
  var img = $("#lbLoading");
  var msg = $("#lineError");
  var cdata = { 'username': name, 'newpassword': pwd };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAccount.asmx/ChangePassword",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(cdata),
    cache: false,
    beforeSend: function () {
      msg.text("");
      img.show();
    },
    success: function (data) {
      var str = data.d;
      if (str != "OK") { msg.text(str); } else { msg.text("密碼已變更！"); }
    },
    error: function (xhr, textStatus, thrownError) {
      msg.text("伺服器錯誤，密碼變更失敗！");
      $("#txtNewPwd").val("");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    }
  });
  $("#txtNewPwd").val("");
  img.hide();
}

//取得此帳號目前密碼
function GetPwd() {
  var name = $("#UserTitle").text();
  //var pwd = $("#txtNewPwd").val();
  if (name.length <= 0) { alert('使用者名稱遺失，無法進行加入程序！'); return false; }
  //if (pwd.length <= 0) { alert('請輸入新密碼！'); return false; }
  var img = $("#lbLoading");
  var msg = $("#lineError");
  var cdata = { 'username': name, };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAccount.asmx/Get_Account_Password",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(cdata),
    cache: false,
    beforeSend: function () {
      msg.text("");
      img.show();
    },
    success: function (data) {
      var str = data.d;
      $("#currpwd").text(str);
      img.hide();
    },
    error: function (xhr, textStatus, thrownError) {
      msg.text("伺服器錯誤，無法取得密碼！");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
      img.hide();
    }
  });
 
}

// 開通與取消開通
function approve(id) {
  var tr = $("#" + id).parent().parent().parent();
  var name = tr.find("span[id^='lbName']").text();
  var btn = $("#" + id);
  var approve = false;
  if (typeof (btn.attr('checked')) == 'undefined')     
    approve = true;
   else 
    approve = false;

  var cdata = { 'username': name, 'IsApprove': approve };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAccount.asmx/ApproveUser",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(cdata),
    cache: false,    
    success: function (data) {
      //var str = data.d;      
      if (approve) {
        btn.attr('checked', true);
        alert('帳號: ' + name + '已開通');
      } else {
        btn.attr('checked', false);
        alert('帳號: ' + name + '已關閉');
      }
    },
    error: function (xhr, textStatus, thrownError) {
      alert("伺服器錯誤！無法進行開通與關閉！");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    }
  });


  //img.hide();
}

//解除封鎖
function unlock(id) {
  var tr = $("#" + id).parent().parent();  
  var name = tr.find("span[id^='lbName']").text();
  var btn = tr.find("span[id^='lbLock']");
  var cdata = { 'username': name };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAccount.asmx/UnLockUser",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(cdata),
    cache: false,   
    success: function (data) {
      var str = data.d;
      if (str == "OK") {
        btn.removeClass("glyphicon-lock");
        btn.addClass("glyphicon-ok-sign");
      } else { alert(str); }
    },
    error: function (xhr, textStatus, thrownError) {
      alert("伺服器錯誤！無法進行解鎖！");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    }
  });
}

