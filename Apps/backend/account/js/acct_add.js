
$(document).ready(function () { 
  $('#btnRegister').click(function () {
    account_reg();
  });
});

//新增客戶
function account_reg() {

  

  if (!Is_Data_Valid()) { alert("頁面上有錯誤的資料格式，請先修正後再繼續！"); return false; }
  var msg = $("#lbmsg");
  var img = $("#imgLoading");
  img.show();

  var isPass = "True";
  var name = $("#txtName").val(); 
  var email = $("#txtEmail").val();
  var password = $("#txtPassword").val();
  var cmpName = $("#txtCompanyName").val();
  var dir = false;
  //var cmpid = $("#txtCompanyID").val();
  //var cmpTel = $("#txtCompantTel").val();
  //var cell = $("#txtCell").val();
  //var addr = $("#txtAddress").val();
  msg.text('');

  $("#ckDir").prop("checked") ? dir = true : dir = false;
  

  

  if (name.length <= 0) { msg.text('請輸入帳號名稱！'); return false; }
  if (email.length <= 0) { msg.text('請輸入email！'); return false; }
  if (password.length <= 0) { msg.text('請輸入密碼！'); return false; }
  if (cmpName.length <= 0) { msg.text('請輸入公司名稱！'); return false; }
  //if (!isTel(cmpTel, "tel")) { msg.text('電話格式需為：02-2952-7535'); return false; }
  //if (!isTel(cell, "cell")) { msg.text('手機格式需為：0932-666888'); return false; }
  
  
  //var cdata = { "username": name, 'password': password, 'email': email, 'companyName': cmpName, 'companyID': cmpid, 'companyTel': cmpTel, 'cell': cell, 'address': addr };
  var cdata = { "username": name, 'password': password, 'email': email, 'companyName': cmpName, 'createdir': dir };
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "../../mcpservices/SvAccount.asmx/CreateAccount",
    data: JSON.stringify(cdata),
    dataType: "json",
    async: false,
    beforeSend: function () {
      msg.text('');
     
    },
    success: function (data, textStatus) {
      var str = data.d;
      if (str != "OK") {
        msg.text(str);
      } else {
        msg.text("已新建一個企業帳號!");
        clean_input();
      }
      img.hide();
    },
    error: function (data, status, error) {
      msg.text("伺服器連線發生錯誤！註冊失敗！");
      img.hide();
    }
  });
  event.preventDefault();
}

function clean_input() {
  $("#txtName").val("");
  $("#txtEmail").val("");
  $("#txtPassword").val("");
  $("#txtCompanyName").val("");
  $("#txtCompanyID").val("");
  $("#txtCompantTel").val("");
  $("#txtCell").val("");
  $("#txtAddress").val("");
}
