$(document).ready(function () {
  get_allRoles();

});

/***********************************************************************************************************************
 *                                             主表資料
***********************************************************************************************************************/
// 頁面再次載入時
function pageLoad() { regenerate_table(); }

//從新組合資料表格
function regenerate_table() {
  var htm = "", stday = "", lgday = "", oid = "", email = "", apv = "", lock = "";
  htm += "<table class='table table-hover' style='width:100%; font-size:13px;'>";
  htm += "<tr>";
  htm += "<th>編輯</th><th>帳號名稱</th><th>Email</th><th>註冊日期</th><th>是否封鎖</th><th>最近登入日</th><th>是否開通</th><th>刪除</th>";
  htm += "</tr>";
  $(".list ul li").each(function (i) {
    if (i >= 0) {
      oid = $(this).find("span[id$='_lbUsr']").text().trim();
      stday = $(this).find("span[id$='_lbStday']").text().trim();
      lgday = $(this).find("span[id$='_lbLgday']").text().trim();
      email = $(this).find("span[id$='_lbEmail']").text().trim();
      apv = $(this).find("span[id$='_lbApprove']").text().trim();
      lock = $(this).find("span[id$='_lbLock']").text().trim();
      htm += "<tr>";
      htm += "<td style='width:42px; text-align:center;'>";
      htm += "<a id='" + oid + "' href='#' onclick='load_details(this.id)' title='編輯'><span class='glyphicon glyphicon-pencil'></span></a>&nbsp;";
      htm += "</td>";
      htm += "<td><span id='lbUsr" + i + "'>" + oid + "</span></td>";
      htm += "<td><span id='lbEmail" + i + "'>" + email + "</span></td>";
      htm += "<td><span id='lbRegDay" + i + "'>" + stday + "</span></td>";
      if (lock == "True") {
        htm += "<td><span id='lbLock" + i + "' class='locked'>已封鎖</span></td>";
      } else { htm += "<td><span id='lbLock" + i + "' class='unlock'>未封鎖</span></td>"; }
      htm += "<td><span id='lblogday" + i + "'>" + lgday + "</span></td>";
      if (apv == "True") {
        htm += "<td><span id='lbApprove" + i + "' class='unlock'>已開通</span></td>";
      } else { htm += "<td><span id='lbApprove" + i + "' class='locked'>未開通</span></td>"; }
      htm += "<td style='width:64px; text-align:center;'>";
      htm += "<a id='" + oid + "' href='#' onclick='User_Delete(this.id)'><span class='glyphicon glyphicon-remove'></span></a>";
      htm += "</td>";
      htm += "</tr>";
    }
  });
  htm += "</table>";
  $(".list").html('');
  $(".list").html(htm);
}


//載入詳細資訊
function load_details(id) {
  var usrname = id;
  var loading = $("#ModalLoading");
  $("#UserTitle").text(usrname);
  var tr = $("#" + usrname).parent().parent(); // 主頁面上的觸發控制項 ID 的 <tr> 列
  var appv = tr.find("span[id^='lbApprove']").text();
  if (appv == '已開通') { $("#ddlApprove").val('True'); } else { $("#ddlApprove").val('False'); }
  var lck = tr.find("span[id^='lbLock']").text();
  if (lck == '未封鎖') { $("#btnLock").prop('disabled', true); } else { $("#btnLock").prop('disabled', false); }
  $("#lineError").text('');
  var cdata = { 'username': usrname };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvSystem.asmx/Get_User_Roles",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(cdata),
    cache: false,
    before: function () {
      $("#lbCurrRole").text('');
      loading.show();
    },
    success: function (data) {
      var str = data.d;
      $("#lbCurrRole").text(str);
    },
    error: function (xhr, textStatus, errorThrown) {
      $("#lbCurrRole").text('伺服器連線錯誤，目前無法載入所屬群組');
    }
  });
  loading.hide();
  $("#myModal").modal('show');
}

//取得所有群組
function get_allRoles() {
  $.ajax({
    type: "GET",
    url: "../../mcpservices/SvSystem.asmx/Get_AllRoles",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    cache: false,
    before: function () {
      $("#ddlRoles").html('');
    },
    success: function (data) {
      var str = data.d;
      var sb = "";
      $.each(str, function (i, value) {
        sb += "<option value='" + value.toString() + "'>" + value.toString() + "</option>";
      });
      $("#ddlRoles").append(sb);
    },
    error: function (xhr, textStatus, thrownError) {
      $("#ddlRoles").append("<option value='none'>無法載入使用群組</option>");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    }
  });

}

//解除封鎖
function User_Lock() {
  var name = $("#UserTitle").text();
  var tr = $("#" + name).parent().parent(); // 主頁面上的觸發控制項 ID 的 <tr> 列  
  var img = $("#lbLoading");
  var msg = $("#lineError");

  var cdata = { 'username': name };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvSystem.asmx/UnLockUser",
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
      if (str == "OK") {
        msg.text("已解除封鎖！");
        var lb = tr.find("span[id^='lbLock']");
        lb.text('未封鎖');
        lb.attr('class', 'unlock')
        $("#btnLock").prop('disabled', true);
      } else { msg.text(str); }
    },
    error: function (xhr, textStatus, thrownError) {
      msg.text("伺服器錯誤！無法進行解鎖！");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    }
  });
}

// 開通與取消開通
function User_Approve() {
  var name = $("#UserTitle").text();
  var tr = $("#" + name).parent().parent(); // 主頁面上的觸發控制項 ID 的 <tr> 列  
  var img = $("#lbLoading");
  var msg = $("#lineError");
  var appv = $("#ddlApprove").val();
  if (appv == 'True') { appv = "Approved"; } else { appv = "Unapprove"; }
  var cdata = { 'username': name, 'IsApprove': appv };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvSystem.asmx/ApproveUser",
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
      msg.text(str);
      var lb = tr.find("span[id^='lbApprove']");
      if (appv == "Approved") {
        lb.text('已開通');
        lb.attr('class', 'unlock')
      } else {
        lb.text('未開通');
        lb.attr('class', 'locked')
      }
    },
    error: function (xhr, textStatus, thrownError) {
      msg.text("伺服器錯誤！無法進行開通與關閉！");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    }
  });
  img.hide();
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
    url: "../../mcpservices/SvSystem.asmx/ChangePassword",
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

//加入到群組中
function JoinGroup() {
  var gp = $("#ddlRoles").val();
  var name = $("#UserTitle").text();
  if (gp == 'none') { alert('目前沒有群組可以使用！'); return false; }
  if (name.length <= 0) { alert('使用者名稱遺失，無法進行加入程序！'); return false; }
  var img = $("#lbLoading");
  var msg = $("#lineError");
  var cdata = { 'username': name, 'groupname': gp };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvSystem.asmx/JoinToGroup",
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
      if (str.substring(0, 2) != "OK") { msg.text(str); }
      else {
        //var currR = $("#lbCurrRole").text();
        str = str.replace("OK", "");
        //currR += ", " + str;
        $("#lbCurrRole").text('');
        $("#lbCurrRole").text(str);
      }
      img.hide();
    },
    error: function (xhr, textStatus, thrownError) {
      msg.text("伺服器錯誤，加入到群組中失敗！");
      img.hide();
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    }
  });
}

//從群組中移出
function LeaveGroup() {
  var gp = $("#ddlRoles").val();
  var name = $("#UserTitle").text();
  if (gp == 'none') { alert('目前沒有群組可以使用！'); return false; }
  if (name.length <= 0) { alert('使用者名稱遺失，無法進行加入程序！'); return false; }
  var img = $("#lbLoading");
  var msg = $("#lineError");
  var cdata = { 'username': name, 'groupname': gp };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvSystem.asmx/RemoveFromGroup",
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
      if (str.substring(0, 2) != "OK") { msg.text(str); }
      else {
        str = str.replace("OK", "");
        $("#lbCurrRole").text('');
        $("#lbCurrRole").text(str);
      }
      img.hide();
    },
    error: function (xhr, textStatus, thrownError) {
      msg.text("伺服器錯誤，移出群組失敗！");
      img.hide();
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    }
  });
}

//移除帳戶
function User_Delete(id) {
  var tr = $("#" + id).parent().parent();
  var r = confirm("確定要刪除 " + id + " 此一帳號？");
  if (r != true) { return false; }
  var cdata = { 'username': id };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvSystem.asmx/RemoveAccount",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(cdata),
    cache: false,
    success: function (data) {
      var str = data.d;
      if (str != "OK") {
        alert(str);
      } else {
        alert("帳號已經移除");
        tr.remove();
      }
    },
    error: function (xhr, textStatus, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
      alert("伺服器錯誤！無法刪除帳號！");
    }
  });
  event.preventDefault();
  return false;
}