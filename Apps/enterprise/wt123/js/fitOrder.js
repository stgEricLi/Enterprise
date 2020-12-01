
$(document).ready(function () {
 
  initial();  

  $("#btnOneSubmit").click(function () {
    create_order();
  });

  $("#btnFinish").click(function () {
    order_complete();
  });

});

function initial() {   
  clean_input();
  $("#txtMTel").val('02-8226-9088'); 
  //TESTINFO();
}

function clean_input() {    
    $("#txtMname").val('');
    $("#txtMDob").val('');
    $("#txtMSid").val('');
    $("#txtMEid").val('');
    $("#txtMTel").val('');
    $("#txtExTel").val('');
    $("#txtMCell").val('');
    $("#txtMMail").val('');    
}

function check_input(name, dob, sid, eid, cell, phone, ext, email) {
  var result = "OK"
  if (name.length <= 0) { result = "請輸入姓名"; }
  if (eid.length <= 0) { result = "請輸入工號"; }
  if (dob.length <= 0) { result = "請輸入生日"; }
  if (!isValidDate(dob)) { result = "生日格式錯誤！格式應為：yyyy/mm/dd"; }
  if (sid.length <= 0) { result = "請輸入身份證號"; }
  if (!isSID(sid)) { result = "身份證或護照號碼錯誤！"; }
  if (cell.length <= 0) { result = "請輸入手機號碼"; }
  if (!isTel(cell, 'cell')) { result = "手機號碼格式錯誤！格式應為：0933-666888"; }
  if (phone.length <= 0) { result = "請輸電話號碼"; }
  if (ext.length <= 0) { result = "請輸電話分機";}
  if (!isInteger(ext)) { result = "分機需為數字";}
  if (!isTel(phone, 'tel')) { result = "電話號碼格式錯誤！格式應為：02-8226-9088"; }
  if (email.length <= 0) { result = "請輸入Email"; }
  if (!isEmail(email)) { result = "聯絡人Email格式錯誤！格式應為：xxx@xxx.com"; }
  return result;
}

var aryJoinner = [];
function Joinner(actid, actname, name, sid, eid, dob, cell, email) {
  this.ActID=actid;
  this.ActName=actname;
  this.Name = name;
  this.SID = sid;
  this.EmpID=eid;
  this.DOB = dob;
  this.Cell = cell;
  this.Email = email;
}

function create_order() {
  //if ($("#hidActid").val() == "E1050301002") { alert("很抱歉此活動只接受電話報名！"); return false; }
  aryJoinner = [];
  var img = $("#imgLoading");
  var msg = $("#msgError");
  var actid = $("#hidActid").val();
  var actName = $("#hidActName").val();
 
  if (actid == null) { alert("活動編號遺失，無法進行報名！"); return false; }
  if (actid.length <= 0) { alert("活動編號遺失，無法進行報名！"); return false; }
 

  $("#btnOneSubmit").prop('disabled', true);  

  var name = $("#txtMname").val();
  var dob = $("#txtMDob").val();
  var sid = $("#txtMSid").val().toUpperCase();
  var eid = $("#txtMEid").val();
  var cell = $("#txtMCell").val();
  var email = $("#txtMMail").val();
  var phone = $("#txtMTel").val();
  var ext = $("#txtExTel").val();
  var cmt = $("#txtGpName").val();

  var isValid = check_input(name, dob, sid, eid, cell, phone, ext, email);
  if (isValid != 'OK') {
      alert(isValid);
      $("#btnOneSubmit").prop('disabled', false);
      return false;
  }
  phone = phone + "#" + ext;  
  var Order = {};
  Order.OrderID = "";  
  Order.Name = name;
  Order.Tel1 = phone;
  Order.Cell1 = cell;  
  Order.Email = email;  
  Order.Company = 'wt123';
  Order.Comment = cmt; 
  aryJoinner[0] = new Joinner(actid, actName, name, sid, eid, dob, cell, email);

  var cdata = {"order":Order, "detail": aryJoinner};
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvOrder.asmx/Create_Wt_Fitness_Order",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(cdata),
    cache: false,
    beforeSend: function () {
      img.show();
    },
    success: function (data) {
      var result = data.d;
      if (result.substring(0, 2) != "OK") {
        alert(result); $("#btnSubmit").prop('disabled', false);
      } else {
        var oid = result.substring(2, result.length);//OKE1040402002800
        
        var sb = "";
        sb += "<p class='text-info'>";
        sb += "您已完成個人線上報名程序，您的報名編號為：<span class='emphsize'>" + oid + "</span>";
        sb += "</p>";
        $("#odcnt").html('');
        $("#odcnt").html(sb);
        $("#myModal").modal('show');
        $("#btnFinish").show();
        $("#btnMultipSubmit").hide();
        $("#btnOneSubmit").hide();
        $("#btnAddMajor").hide();
      }
      img.hide();
      $("#btnOneSubmit").prop('disabled', false);
    },
    error: function (xhr, status, error) {      
      img.hide();
      $("#btnOneSubmit").prop('disabled', false);
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      alert("網路連線發生問題，目前無法送出報名表，請稍候再做嘗試！");
    }
  });
  
}

function order_complete() {
  clean_input();
  $("#myModal").modal('hide');
  //window.open("http://enterprise.mcpgo.com/enterprise/wt/Default.aspx", "_self");
}


function TESTINFO() {
  $("#txtMname").val('Rob');
  $("#txtMDob").val('1996/05/27');
  $("#txtMSid").val('T123534560');
  $("#txtMEid").val('34560');
  $("#txtMTel").val('02-2383-0294');
  $("#txtMCell").val('0933-613551');
  $("#txtMMail").val('lee13079@gmail.com');
  //$("#txtAddr").val('台北市中正區重慶南路一段');
}

