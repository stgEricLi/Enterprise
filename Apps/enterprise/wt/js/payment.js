$(function () {
  $("#txtDate").datepicker({ showOtherMonths: true });

  $("#btnSubmit").click(function () {
    var oid = txtFltr($("#txtOid").val());
    var name = txtFltr($("#txtName").val());
    var cell = $("#txtCell").val();
    var price = $("#txtPrice").val();
    var paytype = $("#ddlPay").val();
    var code = $("#txtCode").val();
    var cmt = $("#txtCmt").val();
    var payDate = $("#txtDate").val();

    if (oid.length != 11) {
      alert("報名編號錯誤，請重新輸入！");
      return false;
    }
    if (name.length <= 0) {
      alert("請輸入付款人名！");
      return false;
    }
    if (!isTel(cell, "cell")) {
      alert("手機號碼格式錯誤！格式應為：09**-******");
      return false;
    }
    if (!isInteger(price)) {
      alert("請輸入付款金額！");
      return false;
    }
    if (!isValidDate(payDate)) {
      alert("匯款日期不正確");
      return false;
    }
    if (paytype == "ATM轉帳") {
      if (code.length != 5) {
        alert("請輸入帳號後五碼！");
        return false;
      }
      if (!isInteger(code)) {
        alert("帳號後五碼應為數字！");
        return false;
      }
    }

    $("#btnSubmit").prop("disabled", true);
    $("#imgload").show();
    $("#lbmg ").text("");

    console.log(price);

    var Payment = {};
    Payment.OrderID = oid;
    Payment.Name = name;
    Payment.Tel = "";
    Payment.Cell = cell;
    Payment.PayType = paytype;
    Payment.ActualPay = price;
    Payment.Account = code;
    Payment.Comment = cmt;
    Payment.PayDay = payDate;

    //var cdata = { "pay": Payment, 'action': 'Add'}
    var cdata = { pay: Payment };
    //url: "../../mcpservices/SvPayment.asmx/wtPayment",
    $.ajax({
      type: "POST",
      url: "../../mcpservices/SvHotel.asmx/Add_Hotel_Pay",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(cdata),
      cache: false,
      beforeSend: function () {},
      success: function (data) {
        var str = data.d;
        if (str != "OK") {
          $("#lbmg ").text(str);
          alert(str);
        } else {
          //$("#txtCapcha").val('');
          $("#txtOid").val("");
          $("#txtName").val("");
          $("#txtCell").val("");
          $("#txtPrice").val("0");
          $("#txtCode").val("");
          $("#txtCmt").val("");
          $("#lbmg ").text("");
          alert("您的匯款已成功登錄，我們會進行查驗以維護您的權益，謝謝！");
        }
        $("#btnSubmit").prop("disabled", false);
        $("#imgload").hide();
      },
      error: function (xhr, textStatus, thrownError) {
        $("#btnSubmit").prop("disabled", false);
        $("#imgload").hide();
        alert("伺服器忙碌中，目前無法送出表單，請稍後在做嘗試或請與我們聯絡。");
        console.log(xhr.status);
        console.log(xhr.responseText);
        console.log(thrownError);
      },
    });
  });
});
