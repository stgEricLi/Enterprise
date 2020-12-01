
$(document).ready(function () {
 
    initial();    

  $("#ddlOption").change(function () {
      if (!confirm("變更註冊方式將會清除目前所填資料，確定要繼續嗎？")) { return false; }     
      clean_input();
      if (this.value == "multip") {
          $("#btnAddMajor").show();
          $("#btnOneSubmit").hide();                  
          $("#majorHd").text('主要聯絡人資訊');
      } else {
          $("#btnAddMajor").hide();
          $("#btnOneSubmit").show();
          $("#mtpl").hide();
          $("#majorHd").text('參加人資訊');
      }
      
  });


  $("#btnOneSubmit").click(function () {
    create_order();
  });

  $("#btnMultipSubmit").click(function () {
      create_group_order();
  });  

  $("#btnAddMajor").click(function () {
      add_Major_joiner();
  });

  $("#btnFinish").click(function () {
    order_complete();
  });
});

function initial() {
 
  $("#mtpl").hide();
  $("#btnAddMajor").show();
  $("#btnOneSubmit").hide();
  $("#majorHd").text('主要聯絡人資訊');
  
  $("#txtMTel").val('02-8226-9088');
  clean_input();
  //TESTINFO();
}

function clean_input() {
    clean_table();
    $("#txtMname").val('');
    $("#txtMDob").val('');
    $("#txtMSid").val('');
    $("#txtMEid").val('');
    $("#txtMTel").val('');
    $("#txtExTel").val('');
    $("#txtMCell").val('');
    $("#txtMMail").val('');
    $("#txtGpName").val(''); 
}

function clean_table() {
    $(".joinTbl tbody").empty();
    $("#btnMultipSubmit").hide();
   
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

function add_Major_joiner() {
  if ($(".newline").size() > 0) { return false; }
  //var isValid = check_input($("#txtMname").val(), $("#txtMDob").val(), $("#txtMSid").val().toUpperCase(), $("#txtMEid").val(), $("#txtMCell").val(), $("#txtMTel").val(), $("#txtExTel").val(), $("#txtMMail").val());
  var isValid = check_input($("#txtMname").val(), '1999/11/15', $("#txtMSid").val().toUpperCase(), $("#txtMEid").val(), $("#txtMCell").val(), $("#txtMTel").val(), $("#txtExTel").val(), $("#txtMMail").val());

  if (isValid != 'OK') { alert(isValid); return false; }
  clean_table();
  var sb = "";
  sb += "<tr class='newline'>";
  sb += "<td><input id='lbName0' value='" + $("#txtMname").val() + "' type='text' maxlength='50' class='form-control required' /></td>";
  sb += "<td><input id='lbSid0' value='" + $("#txtMSid").val().toUpperCase() + "' type='text' maxlength='10' class='form-control required' /></td>";
  //sb += "<td><input id='lbDob0' value='" + $("#txtMDob").val() + "' type='text' maxlength='10' class='form-control dateISO required' /></td>";
  sb += "<td><input id='lbCell0' value='" + $("#txtMCell").val() + "' type='text' maxlength='20' class='form-control cell required' /></td>";
  sb += "<td><input id='lbMail0' value='" + $("#txtMMail").val() + "' type='text' maxlength='60' class='form-control email required' /></td>";
  sb += "<td><input id='lbEid0' value='" + $("#txtMEid").val() + "' type='text' maxlength='20' class='form-control required' /></td>";  
  sb += "</tr>";
  $(".joinTbl tbody").append(sb);
  $("#btnAddMajor").hide();
  add_newline();
  add_newline();
  $("#mtpl").show();
  $("#btnMultipSubmit").show();
}

function add_newline() {       
    var sb = "";
    var id = get_last_no() + 1;    
    sb += "<tr class='newline'>";
    sb += "<td><input id='lbName" + id.toString() + "' placeholder='姓名' type='text' maxlength='50' class='form-control required' /></td>";
    sb += "<td><input id='lbSid" + id.toString() + "' placeholder='身份證' type='text' maxlength='10' class='form-control required' /></td>";
    //sb += "<td><input id='lbDob" + id.toString() + "' placeholder='yyyy/mm/dd' type='text' maxlength='10' class='form-control dateISO required' /></td>";
    sb += "<td><input id='lbCell" + id.toString() + "' placeholder='09xx-xxxxxx' type='text' maxlength='20' class='form-control cell required' /></td>";
    sb += "<td><input id='lbMail" + id.toString() + "' placeholder='Email' type='text' maxlength='60' class='form-control email required' /></td>";
    sb += "<td><input id='lbEid" + id.toString() + "' placeholder='工號' type='text' maxlength='20' class='form-control required' /></td>";
    sb += "<td>";
    sb += "</td>";    
    sb += "</tr>";
    $(".joinTbl tbody").append(sb);    
}

function get_last_no() {
  var id = "0";
  if ($('tr.newline').size() > 0) {
    $('tr.newline').each(function (index) {
      id = $(this).find("input[id^='lbName']").attr('id');
    });
    id = id.replace("lbName", "");
  }
  return parseInt(id);
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

function is_duplation(eid, sid) {
    var result = true;
    if ($("tr.newline").size() > 0) {
        $('tr.newline').each(function (index) {
            if (eid == $(this).find("span[id^='lbEid']").text()) { result = false; }
            if (sid == $(this).find("span[id^='lbSid']").text()) { result = false; }
        });
    }
    return result;
}

function create_group_order() {
    aryJoinner = [];
   
    //if (!$("#ckAgree").is(":checked")) { alert("您必須同意上述申明才可進行報名！"); return false; }
    var isValid = check_input($("#txtMname").val(), '1972/12/12', $("#txtMSid").val().toUpperCase(), $("#txtMEid").val(), $("#txtMCell").val(), $("#txtMTel").val(), $("#txtExTel").val(), $("#txtMMail").val());
    if (isValid != 'OK') { alert(isValid); return false; }
    var lineNo = $("tr.newline").size();
    if (lineNo != 3) { alert("您註冊方式為團體註冊，請加入足夠的參加人再繼續！"); return false; }

    var groupName = $("#txtGpName").val();
    if (groupName.length <= 0) { alert("您註冊方式為團體註冊，請輸入團隊名稱再繼續！"); return false; }

    var actid = $("#hidActid").val();
    var actName = $("#hidActName").val();   

    $("#btnMultipSubmit").prop('disabled', true);
    var img = $("#createLoading");
    var msg = $("#gpErr");

    var Order = {};
    Order.OrderID = "";
    Order.Name = $("#txtMname").val();
    Order.Tel1 = $("#txtMTel").val() + "#" + $("#txtExTel").val();
    Order.Cell1 = $("#txtMCell").val();
    Order.Address = '';
    Order.Email = $("#txtMMail").val();
    Order.IsPromote = false;
    Order.Company = 'wt123';
    Order.Comment = groupName;

    var isok = true;
    var name = "", dob = "", sid = "", eid = "", cell = "", email = "", valid = "";
    if ($("tr.newline").size() > 0) {
        $('tr.newline').each(function (index) {
            name = $(this).find("input[id^='lbName']").val();
            dob = '1972/12/12';
            sid = $(this).find("input[id^='lbSid']").val();
            eid = $(this).find("input[id^='lbEid']").val();
            cell = $(this).find("input[id^='lbCell']").val();
            email = $(this).find("input[id^='lbMail']").val();
            //alert(name + ", " + dob + ", " + sid + ", " +eid+ ", " +cell+ ", " +email );
            valid = check_input(name, dob, sid, eid, cell, '02-8226-9088', '123', email);
            if (valid != "OK") {
                isok = false;
                valid = "第 "+ (index+1) + " 列資料有錯誤：" + valid;
                return false;
            }

            if (!is_duplation(eid, sid)) {
                isok = false;
                valid = "第 " + (index + 1) + " 列資料有重覆的身份證號或員工工號，請重新輸入！";
                return false;
            }

            aryJoinner[index] = new Joinner(actid, actName, name, sid, eid, dob, cell, email);
        });

        if (!isok) {
            alert(valid);
            $("#btnMultipSubmit").prop('disabled', false);
            return false;
        }

        var cdata = { "order": Order, "detail": aryJoinner };
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
                    alert(result);
                    $("#btnMultipSubmit").prop('disabled', false);
                } else {
                    result = result.substring(2, result.length);//OKE1040402002800
                    var oid = result.substring(0, 11);
                    var total = result.substring(11, result.length);
                    var sb = "";
                    sb += "<p class='text-info'>";
                    sb += "您已完成團體線上報名程序，您的報名編號為：<span class='emphsize'>" + oid + "</span>";                  
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
                $("#btnMultipSubmit").prop('disabled', false);
            },
            error: function (xhr, status, error) {
                img.hide();
                $("#btnMultipSubmit").prop('disabled', false);
                console.log(xhr.status);
                console.log(xhr.responseText);
                console.log(error);
                alert("網路連線發生問題，目前無法送出報名表，請稍候再做嘗試！");
            }
        });
    }
}

function create_order() {
  //if ($("#hidActid").val() == "E1050301002") { alert("很抱歉此活動只接受電話報名！"); return false; }
  aryJoinner = [];
  var img = $("#imgLoading");
  var msg = $("#msgError");
  var actid = $("#hidActid").val();
  var actName = $("#hidActName").val();
 
  $("#btnOneSubmit").prop('disabled', true);  

  var name = $("#txtMname").val();
  var dob = '1972/12/12';
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

