$(function () {
  initial();
  load_act();

  $("#ddlAct").change(function () {   
    get_acts();
  });

  $("#ddlRoom").change(function () {
    create_table();
  });

  $("#btnVerify").click(function (e) {
    confirmaion();
  });

  $("#btnSubmit").click(function (e) {
    create_order();
  });

});

var txtveg = ["吃素", "不吃素"];
var valveg = ["true", "false"];

function initial() {
  $('#lbMsg').html('');
  $('#lbInfo').hide();  
}

function clear() {
  $("#loading").hide();
  $("#ddlRoom").val('none');
  $("#btnSubmit").prop('disabled', false);
  $("#btnSubmit").hide();
  $("#btnVerify").show();
  $('#tbl').html('');
  $("#txtPhone").val('');
  $("#txtExt").val('');
  $("#joiner").hide();
}

//載入活動清單
function load_act() {
  //console.log("OK");
  $("#ddlAct").html('');
  //var loading = $("#loading");
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAct.asmx/load_Act",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "pageindex": 1, "pagesize": 100, "company": "wt2014" }),
    cache: false,
    success: function (response) {
      if (response.hasOwnProperty('d')) {
        var json = JSON.parse(response.d);
        var objAct = json.Acts;
        //var sb = "<option value='none'>無活動資料</option>";
        $("#ddlAct").append("<option value='none'>請選擇行程</option>");
        if (objAct != null) {          
          $.each(objAct, function (i, v) {
            $("#ddlAct").append("<option value='" + v.ActID.toString() + "'>" + v.Name.toString() + "</option>");
          });
        }
      }
      //ddlActHtml = sb;
      //$("#loading").html(sb);
      $("#loading").hide();
    },
    error: function (xhr, textStatus, error) {     
      $('#lbMsg').html("伺服器錯誤，無法取得活動資料！");     
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      $("#loading").hide();
    }
  });
}

function get_acts() {
  $('#ddlRoom').html('');
  $('#tbl').html('');
  $("#txtPhone").val('');
  $("#txtExt").val('');
  $("#joiner").hide();
  var actid = $("#ddlAct").val();
  //console.log(actid);
  //console.log($("#ddlAct option:selected").text());
  if (actid == "none") {    
    $('#lbMsg').html("無活動資料！無法繼續！");
    return false;
  }

  $("#loading").show();
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAct.asmx/get_All_Act_Details",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "filtervalue": actid }),
    cache: false,
    asyn: false,
    success: function (response) {
      if (response.hasOwnProperty('d')) {
        var json = JSON.parse(response.d);        
        var objAct = json.Acts;
        var room2 = 0;
        var room4 = 0;
        var ddl = $('#ddlRoom');
        $.each(objAct, function (i, v) {
          room2 = parseInt(v.FieldInt1);
          room4 = parseInt(v.FieldInt2);
          $("#txtCapacity").text(v.Capacity);
          $("#txtRoom2").text(room2);
          $("#txtRoom4").text(room4);
          ddl.append('<option value="none">選擇房型</option>');
          if (room2 > 0) {
            ddl.append('<option value="2A">預訂一間2人房（2位成人）</option>');
            ddl.append('<option value="2B">預訂一間2人房（2位成人+1位三歲以下兒童）</option>');
            ddl.append('<option value="2F">預訂一間2人房（2位成人+1位4至6歲兒童不佔床餐）</option>');
            ddl.append('<option value="2C">預訂一間2人房（2位成人+1位4至6歲兒童不佔床餐+1位三歲以下兒童）</option>');
            ddl.append('<option value="2G">預訂一間2人房（2位成人+2位三歲以下兒童）</option>');
            ddl.append('<option value="2H">預訂一間2人房（2位成人+2位4至6歲兒童不佔床餐）</option>');
            ddl.append('<option value="2D">預訂一間2人房（1位成人+1位4至6歲兒童佔床餐）</option>');
          }
          if (room4 > 0) {
            ddl.append('<option value="4A">我要預訂一間4人房（4位成人）</option>');
            ddl.append('<option value="4B">我要預訂一間4人房（4位成人+1位三歲以下兒童）</option>');
            ddl.append('<option value="4F">我要預訂一間4人房（4位成人+1位4至6歲兒童不佔床餐）</option>');
            ddl.append('<option value="4C">我要預訂一間4人房（4位成人+1位4至6歲兒童不佔床餐+1位三歲以下兒童）</option>');
            ddl.append('<option value="4G">我要預訂一間4人房（4位成人+2位三歲以下兒童）</option>');
            ddl.append('<option value="4H">我要預訂一間4人房（4位成人+2位4至6歲兒童不佔床餐）</option>');
            ddl.append('<option value="4D">我要預訂一間4人房（3位成人+1位4至6歲兒童佔床餐）</option>');
          }
                         
          $('#lbInfo').show();          
        });
               
      } else {
        $("#txtCapacity").text("0");
        $("#txtRoom2").text("0");
        $("#txtRoom4").text("0");
        $('#lbInfo').hide();
      }
      $("#loading").hide();
      
    },
    error: function (xhr, textStatus, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
      $("#loading").hide();
    }
  });
}

function line(i) {
  var sb = "";
  sb += "<tr class='listline'>";
  sb += "<td style='width:124px;'>" + input('txtName' + i, '', 'required', 15, 0, '中文姓名') + "</td>";
  sb += "<td style='width:124px;'>" + input('txtSid' + i, '', 'required', 10, 0, '身分字號') + "</td>";
  sb += "<td style='width:266px;'>";
  sb += "<select id='ddlYr" + i + "' class='form-control input-sm' style='width:72px;'></select>";
  sb += "<select id='ddlMm" + i + "' class='form-control input-sm' style='width:56px;'></select>";
  sb += "<select id='ddlDd" + i + "' class='form-control input-sm' style='width:56px;'></select>";
  sb += "</td>";
  sb += "<td style='width:124px;'>" + input('txtEid' + i, '', '', 12, 0, '員工工號') + "</td>";
  sb += "<td  style='width:142px;'>" + input('txtCell' + i, '', 'required', 11, 0, '手機：0900-000000"') + "</td>";
  sb += "<td style='width:96px;'>" + dropList('ddlVeg' + i, txtveg, valveg, 'false', 84) + "</td>";
  sb += "<td>" + input('txtEmail' + i, '', 'required', 120, 0, 'Email') + "</td>";
  sb += "</tr>";
  $('#tbl').append(sb);  
}

function create_table() {
  $('#tbl').html('');
  var room = 0;
  var desc = '';
  switch ($("#ddlRoom").val()) {
    case "2A":
      room = 2;
      desc = '請於下方輸入2位成人參加者資料。';
      break;
    case "2B":
      room = 3;
      desc = '請於下方輸入2位成人參加者，及1位三歲以下兒童資料（2015年1月以後出生）。';
      break;
    case "2C":
      room = 4;
      desc = '請於下方輸入2位成人參加者，1位四至六歲兒童（2012年1月以後出生），及1位三歲以下兒童資料（2015年1月以後出生）。';
      break;
    case "2D":
      room = 2;
      desc = '請於下方輸入1位成人參加者，1位四至六歲兒童（2012年1月以後出生）。';
      break;
    case "2F":
      room = 3;
      desc = '請於下方輸入2位成人參加者，1位四至六歲兒童（2012年1月以後出生）。';
      break;
    case "2G":
      room = 4;
      desc = '請於下方輸入2位成人參加者，2位三歲以下兒童（2015年1月以後出生）。';
      break;
    case "2H":
      room = 4;
      desc = '請於下方輸入2位成人參加者，2位四至六歲兒童（2012年1月以後出生）。';
      break;
    case "4A":
      room = 4;
      desc = '請於下方輸入4位成人參加者資料。';
      break;
    case "4B":
      room = 5;
      desc = '請於下方輸入4位成人參加者，及1位三歲以下兒童資料（2015年1月以後出生）。';
      break;
    case "4C":
      room = 6;
      desc = '請於下方輸入4位成人參加者，1位四至六歲兒童（2012年1月以後出生），及1位三歲以下兒童資料（2015年1月以後出生）。';
      break;
    case "4D":
      room = 4;
      desc = '請於下方輸入3位成人參加者，1位四至六歲兒童（2012年1月以後出生）。';
      break;
    case "4F":
      room = 5;
      desc = '請於下方輸入4位成人參加者，1位四至六歲兒童（2012年1月以後出生）。';
      break;
    case "4G":
      room = 6;
      desc = '請於下方輸入4位成人參加者，2位三歲以下兒童（2015年1月以後出生）。';
      break;
    case "4H":
      room = 6;
      desc = '請於下方輸入4位成人參加者，2位四至六歲兒童（2012年1月以後出生）。';
      break;
  }

  for (i = 1; i <= room; i++) {
    line(i);
  }

  $("#joiner").show();

  $('tr.listline').each(function (index) {
    datedroplist($(this).find("select[id^='ddlYr']").attr('id'),
        $(this).find("select[id^='ddlMm']").attr('id'),
        $(this).find("select[id^='ddlDd']").attr('id'));
  });
}



function isInt(no) {
  return /^\d+$/.test(no);
}

function isValidDate(value) {
  if (value.length != 10) { return false; }
  var day = new Date(value);
  return !isNaN(day.getDate());
}

function is_validEid(id) {
  var result = true;
  if (id.length != 8) { result = false; }
  if (id.substring(0, 1) != "1") { result = false; }
  if (!isInt(id)) { result = false; }
  return result;
}

function isEmail(str) {
  var pattid = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;
  return pattid.test(str);
}

function isTel(telNo,/*cell or tel*/ type) {
  var pattTel = /^0\d{1,4}-\d{4}-\d{1,4}(\#\d{1,6})?$/g;
  var pattCel = /^09\d{2}-([0-9]{6})$/g;
  if (type == "tel") { return pattTel.test(telNo); } //02-2952-7535
  if (type == "cell") { return pattCel.test(telNo); } //0932-666888
}

function getAges(y) {
  var age = 18;
  if (y >= 2012)
    age = 6;
  if (y >= 2015)
    age = 3;
  return age;
}

function joiner_validate(i, name, sid, dob, eid, cell, email) {
  if (name.length <= 0) { return "行" + i + "：請輸入參加人姓名"; }
  if (sid.length <= 0) { return "行" + i + "：請輸入參加人身份證號"; }
  if (!isSID(sid)) { return "行" + i + "：身份證號格式錯誤"; }
  if (!isValidDate(dob)) { return "行" + i + "：請輸入參加人生日"; }
  if (cell.length <= 0) { return "行" + i + "：請輸入參加人手機號碼"; }
  if (!isTel(cell, 'cell')) { return "行" + i + "：手機號碼格式錯誤！格式應為：0900-000000"; }
  if (eid.length > 0) {
    if (!is_validEid(eid)) { return "行" + i + "：工號錯誤請重新輸入！"; }
  }
  if (email.length <= 0) { return "行" + i + "：請輸入Email"; }
  if (!isEmail(email)) { return "行" + i + "：Email格式錯誤！格式應為：xxx@xxx.com"; }
  return "OK";
}

function showError(msg) {
  $('#lbMsg').html(msg);
}

function confirmaion() {  
  if ($("tr.listline").size() > 0) {
    $("#lbMsg").html('');
    var validator = "OK", name = "", sid = "", dob = "", eid = "", tel = "", ext = "", cell = "", veg = false, email = "", desc = "", y = "";
    var freeAmt = 0, joinAmt = 0, total = 0, adult = 0, threeyr = 0; sixyr = 0, age = 0, room = 0;
    var array = [], temp = [];
    tel = $("#txtPhone").val();
    ext = $("#txtExt").val();
    if (tel.length <= 0) { showError("請輸入聯絡人電話！格式：02-0000-0000"); return false; }
    if (!isTel(tel, 'tel')) { showError("：電話號碼錯誤！格式：02-0000-0000"); return false; }
    if (ext.length <= 0) { showError('請輸入分機號碼！'); return false; }
    if (!isInt(ext)) { showError('分機號碼錯誤請重新輸入！'); return false; }

    $('tr.listline').each(function (i) {
      y = $(this).find("select[id^='ddlYr']").val();
      name = $(this).find("input[id^='txtName']").val();
      sid = $(this).find("input[id^='txtSid']").val();
      dob = y + "/" + padLeft("00", $(this).find("select[id^='ddlMm']").val()) + "/" + padLeft("00", $(this).find("select[id^='ddlDd']").val());
      eid = $(this).find("input[id^='txtEid']").val();
      cell = $(this).find("input[id^='txtCell']").val();
      veg = $(this).find("select[id^='ddlVeg']").val();
      email = $(this).find("input[id^='txtEmail']").val();
      validator = joiner_validate((i + 1), name, sid, dob, eid, cell, email);
      if (validator != "OK") { return false; }
          
      age = getAges(parseInt(y));

      switch (age) {
        case 3:
          threeyr += 1;         
          break;
        case 6:
          sixyr += 1;        
          break;
        default:
          adult += 1;    
          break;
      }

      if (eid.length > 0) { freeAmt += 2; array[i] = eid; }
      joinAmt += 1;

    });

    if (validator != "OK") { showError(validator); return false; }

    switch ($("#ddlRoom").val()) {
      case "2A":
        if (adult != 2) { validator = "請輸入2位成人參加者！" }
        room = 2;
        break;
      case "2B":
        if (adult != 2 || threeyr != 1) { validator = "請輸入2位成人參加者，及1位三歲以下兒童資料！" }
        desc = "，1位三歲以下兒童500元行政費用。";
        room = 2;
        break;
      case "2C":
        if (adult != 2 || threeyr != 1 || sixyr != 1) { validator = "請輸入2位成人參加者，1位四至六歲兒童，及1位三歲以下兒童資料！" }
        desc = "，1位四至六歲兒童不佔床餐1000元，1位三歲以下兒童500元行政費用。";
        room = 2;
        break;
      case "2D":
        if (adult != 1 || sixyr != 1) { validator = "請輸入1位成人參加者，1位四至六歲兒童資料！" }
        desc = "，1位四至六歲兒童佔床餐（等同成人費用）。";
        room = 2;
        break;
      case "2F":
        if (adult != 2 || sixyr != 1) { validator = "請輸入2位成人參加者，1位四至六歲兒童資料！" }
        desc = "，1位四至六歲兒童不佔床餐。";
        room = 2;
        break;
      case "2G":
        if (adult != 2 || threeyr != 2) { validator = "請輸入2位成人參加者，2位三歲以下兒童資料！" }
        desc = "，2位四至六歲兒童不佔床餐。";
        room = 2;
        break;
      case "2H":
        if (adult != 2 || sixyr != 2) { validator = "請輸入2位成人參加者，2位四至六歲兒童資料！" }
        desc = "，2位四至六歲兒童不佔床餐。";
        room = 2;
        break;
      case "4A":
        if (adult != 4) { validator = "請輸入4位成人參加者！" }
        room = 4;
        break;
      case "4B":
        if (adult != 4 || threeyr != 1) { validator = "請輸入4位成人參加者，及1位三歲以下兒童資料！" }
        desc = "，1位三歲以下兒童500元行政費用。";
        room = 4;
        break;
      case "4C":
        if (adult != 4 || threeyr != 1 || sixyr != 1) { validator = "請輸入4位成人參加者，1位四至六歲兒童，及1位三歲以下兒童資料！" }
        desc = "，1位四至六歲兒童不佔床餐1000元，1位三歲以下兒童500元行政費用。";
        room = 4;
        break;
      case "4D":
        if (adult != 3 || sixyr != 1) { validator = "請輸入3位成人參加者，1位四至六歲兒童資料！" }
        desc = "，1位四至六歲兒童佔床餐（等同成人費用）。";
        room = 4;
        break;
      case "4F":
        if (adult != 4 || sixyr != 1) { validator = "請輸入4位成人參加者，1位四至六歲兒童資料！" }
        desc = "，1位四至六歲兒童不佔床餐。";
        room = 4;
        break;
      case "4G":
        if (adult != 4 || threeyr != 2) { validator = "請輸入4位成人參加者，2位三歲以下兒童資料！" }
        desc = "，2位四至六歲兒童不佔床餐。";
        room = 4;
        break;
      case "4H":
        if (adult != 4 || sixyr != 2) { validator = "請輸入4位成人參加者，2位四至六歲兒童資料！" }
        desc = "，2位四至六歲兒童不佔床餐。";
        room = 4;
        break;
    }

    if (validator != "OK") { showError(validator); return false; }

    if (freeAmt <= 0) { showError("參加者中至少要有一位員工，請輸入一組員工工號！"); return false; }


    $.each(array, function (key, value) {
      if ($.inArray(value, temp) === -1) {
        temp.push(value);
      } else {
        validator = "有重覆的工號！請重新輸入！"; return false;
      }
    });     

    if (validator != "OK") { showError(validator); return false; }

    var capacity = parseInt($('#txtCapacity').text());

    if (joinAmt > capacity) { showError("此活動項目名額不足，請選擇其他活動項目再繼續！"); return false; }

    total = (adult * 5000) + (sixyr * 1000) + (threeyr * 500) - (freeAmt * 5000);
    
    if (total <= 0) { total = 0; }

    showError(room.toString() + " 人房一間，共有 " + joinAmt + " 參加人，預估應付總金額為：" + total);
    $('#btnVerify').hide();
    $('#btnSubmit').show();

  } else {
    showError("請輸入參加人資料！");
  }
}

var aryJoinner = [];

function Joinner(actid, actname, name, sid, eid, dob, cell, email, veg, cart) {
  this.ActID = actid;
  this.ActName = actname;
  this.Name = name;
  this.SID = sid;
  this.EmpID = eid;
  this.DOB = dob;
  this.Cell = cell;
  this.Email = email;
  this.IsVeg = veg;
  this.TempField = cart;
}

function create_order() {
  aryJoinner = [];
 
  var actid = $("#ddlAct").val();
  var actName = $("#ddlAct option:selected").text();
 
  if (actid.length <= 0) { showError("無法取得行程編號！無法送出訂單！"); return false; }
  if (actName.length <= 0) { showError("無法取得行程名稱！無法送出訂單！"); return false; }
  var prom = "false";

  $("#btnSubmit").prop('disabled', true);
  var img = $("#loading");
  var Order = {};
  var name = "", dob = "", sid = "", eid = "", tel = "", cell = "", email = "", veg = "";
  img.show();
  tel = $("#txtPhone").val() + "#" + $("#txtExt").val();  
  $('tr.listline').each(function (index) {       
    name = $(this).find("input[id^='txtName']").val();
    sid = $(this).find("input[id^='txtSid']").val();
    dob = $(this).find("select[id^='ddlYr']").val() + "/" + padLeft("00", $(this).find("select[id^='ddlMm']").val()) + "/" + padLeft("00", $(this).find("select[id^='ddlDd']").val());
    eid = $(this).find("input[id^='txtEid']").val();
    cell = $(this).find("input[id^='txtCell']").val();
    veg = $(this).find("select[id^='ddlVeg']").val();
    email = $(this).find("input[id^='txtEmail']").val();
    if (index == 0) {
      Order.OrderID = "";
      Order.Name = name;
      Order.Tel1 = tel;
      Order.Cell1 = cell;
      Order.Address = "新北市中和區中正路738號14樓";
      Order.Email = email;
      Order.IsPromote = prom;
      Order.Company = 'wt';
      Order.Tel2 = $("#ddlRoom").val();
    }
    aryJoinner[index] = new Joinner(actid, actName, name, sid, eid, dob, cell, email, veg, 1);
  });

  

  var cdata = { "order": Order, "detail": aryJoinner };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvOrder.asmx/Create_Wt_TwoDaysOrder",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(cdata),
    cache: false,
    success: function (data) {
      var result = data.d;
      if (result.substring(0, 2) != "OK") {
        showError(result);
        $("#btnSubmit").prop('disabled', false);
      } else {
        result = result.substring(2, result.length);//OKE1040402002800
        var oid = result.substring(0, 11);
        var total = result.substring(11, result.length);
        showError("報名編號：<strong>" + oid + "</strong>，金額：<strong>" + total + "</strong>");
        clear();
      }
      img.hide();


    },
    error: function (xhr, status, error) {
      img.hide();
      $("#btnSubmit").prop('disabled', false);
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      showError("伺服器過於繁忙，目前無法送出報名表，請稍候再做嘗試！");
    }
  });

}

