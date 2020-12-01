
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
  msg.text('');

  if (name.length <= 0) { msg.text('請輸入群組名稱！'); return false; }
  
  var cdata = { "roleName": name};
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "../../mcpservices/SvAccount.asmx/AddRole",
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
          msg.text("群組已建立!");
        clean_input();
      }
      img.hide();
    },
    error: function (data, status, error) {
        msg.text("伺服器連線發生錯誤！建立群組失敗！");
      img.hide();
    }
  });
  event.preventDefault();
}

function clean_input() {
  $("#txtName").val("");
}
