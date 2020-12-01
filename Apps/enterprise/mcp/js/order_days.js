$(document).ready(function () {

  initial();

  $("#btnToS2").click(function () {
    var roomval = room_validate();
    if (roomval != "OK") {
      alert(roomval); return false;
    } else {
      if (!$("#ckAgree").is(":checked")) { alert("您必須同意上述申明才可進行報名！"); return false; }
      create_table();
      show_setp("2");
    }
  });

  $("#btnToS1").click(function () {
    var isok = confirm("回第一步驟會將參加人資料全部清除，確定要回上一步驟嗎？");
    if (isok == false) { return false; }
    $("#joiner").html('');
    show_setp("1");
  });

  $("#btnToS3").click(function () {
    confirmaion();
  });

  $("#btnBackS2").click(function () {
    show_setp("2");
  });

  $("#btnSubmit").click(function () {
    create_order();
  });

  $("#btnFinish").click(function () {
    order_complete();
  });


});


function getAges(dateString) {
  var days = getDays(dateString);
  var age = 18;
  if (days <= 2404) {
    age = 6;
    if (days <= 1308) { age = 3; }
  }
  return age;
}

function getDays(dateString) {
  var today = new Date();
  var days = mydiff(dateString, today, 'days');
  return days;
}

function mydiff(date1, date2, interval) {
  var second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, week = day * 7;
  date1 = new Date(date1);
  date2 = new Date(date2);
  var timediff = date2 - date1;
  if (isNaN(timediff)) return NaN;
  switch (interval) {
    case "years": return date2.getFullYear() - date1.getFullYear();
    case "months": return (
        (date2.getFullYear() * 12 + date2.getMonth())
        -
        (date1.getFullYear() * 12 + date1.getMonth())
    );
    case "weeks": return Math.floor(timediff / week);
    case "days": return Math.floor(timediff / day);
    case "hours": return Math.floor(timediff / hour);
    case "minutes": return Math.floor(timediff / minute);
    case "seconds": return Math.floor(timediff / second);
    default: return undefined;
  }
}


function is_validEid(id) {
  var result = true;
  if (id.length != 8) { result = false; }
  if (id.substring(0, 1) != "1") { result = false; }
  if (!isInteger(id)) { result = false; }
  return result;
}

var room2_c = 0;
var room4_c = 0;

function initial() {
  show_setp("1");
  $("#txtPhone").val('02-8226-9088');
  $("#txtExt").val('');
  $("#joiner").html('');
  $("#confirmation").html('');
  room2_c = parseInt($("#hidRoom2").val());
  room4_c = parseInt($("#hidRoom4").val());
  $("#txtRestRoom").text('此活動目前兩人房剩 ' + room2_c + ' 間，四人房剩 ' + +room4_c + ' 間');
}

function show_setp(step) {
  $("#step1").hide();
  $("#step2").hide();
  $("#step3").hide();
  $("#step" + step).show();
}

function room_validate() {
  var room = $("#ddlRoom").val();

  if (room == '2A' || room == '2B' || room == '2C') {
    if (room2_c <= 0) { return "此活動目前兩人房已無餘額，請從新選擇！"; }
  }

  if (room == '4A' || room == '4B' || room == '4C') {
    if (room4_c <= 0) { return "此活動目前四人房已無餘額，請從新選擇！"; }
  }
  return "OK";
}

var txtveg = ["吃素", "不吃素"];
var valveg = ["true", "false"];

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
  return sb;
}

function Testline(i, name, sid, eid, cell, email) {
  var sb = "";
  sb += "<tr class='listline'>";
  sb += "<td style='width:116px;'>" + input('txtName' + i, name, 'required', 15, 0, '中文姓名') + "</td>";
  sb += "<td style='width:116px;'>" + input('txtSid' + i, sid, 'required', 10, 0, '身分字號') + "</td>";
  sb += "<td style='width:265px;'>";
  sb += "<select id='ddlYr" + i + "' class='form-control input-sm' style='width:72px;'></select>";
  sb += "<select id='ddlMm" + i + "' class='form-control input-sm' style='width:56px;'></select>";
  sb += "<select id='ddlDd" + i + "' class='form-control input-sm' style='width:56px;'></select>";
  sb += "</td>";
  sb += "<td style='width:86px;'>" + input('txtEid' + i, eid, '', 10, 0, '員工工號') + "</td>";
  sb += "<td style='width:120px;'>" + input('txtCell' + i, cell, 'required', 11, 0, '手機：0900-000000"') + "</td>";
  sb += "<td  style='width:86px;'>" + dropList('ddlVeg' + i, txtveg, valveg, 'false', 84) + "</td>";
  sb += "<td >" + input('txtEmail' + i, email, 'required', 120, 0, 'Email') + "</td>";
  sb += "</tr>";
  return sb;
}

function create_table() {
  var room = 0;
  var desc = '';
  switch ($("#ddlRoom").val()) {
    case "2A":
      room = 2;
      desc = '請於下方輸入2位成人參加者資料。';
      break;
    case "2B":
      room = 3;
      desc = '請於下方輸入2位成人參加者，及1位三歲以下兒童資料（2014年1月以後出生）。';
      break;
    case "2C":
      room = 4;
      desc = '請於下方輸入2位成人參加者，1位四至六歲兒童（2011年1月以後出生），及1位三歲以下兒童資料（2014年1月以後出生）。';
      break;
    case "2D":
      room = 2;
      desc = '請於下方輸入1位成人參加者，1位四至六歲兒童（2011年1月以後出生）。';
      break;
    case "2F":
      room = 3;
      desc = '請於下方輸入2位成人參加者，1位四至六歲兒童（2011年1月以後出生）。';
      break;
    case "2G":
      room = 4;
      desc = '請於下方輸入2位成人參加者，2位三歲以下兒童（2014年1月以後出生）。';
      break;
    case "2H":
      room = 4;
      desc = '請於下方輸入2位成人參加者，2位四至六歲兒童（2011年1月以後出生）。';
      break;
    case "4A":
      room = 4;
      desc = '請於下方輸入4位成人參加者資料。';
      break;
    case "4B":
      room = 5;
      desc = '請於下方輸入4位成人參加者，及1位三歲以下兒童資料（2014年1月以後出生）。';
      break;
    case "4C":
      room = 6;
      desc = '請於下方輸入4位成人參加者，1位四至六歲兒童（2011年1月以後出生），及1位三歲以下兒童資料（2014年1月以後出生）。';
      break;
    case "4D":
      room = 4;
      desc = '請於下方輸入3位成人參加者，1位四至六歲兒童（2011年1月以後出生）。';
      break;
    case "4F":
      room = 5;
      desc = '請於下方輸入4位成人參加者，1位四至六歲兒童（2011年1月以後出生）。';
      break;
    case "4G":
      room = 6;
      desc = '請於下方輸入4位成人參加者，2位三歲以下兒童（2014年1月以後出生）。';
      break;
    case "4H":
      room = 6;
      desc = '請於下方輸入4位成人參加者，2位四至六歲兒童（2011年1月以後出生）。';
      break;
  }

  $("#txtRoomRemind").text(desc);

  var sb = "<table class='table table-striped' style='width:100%;'>";
  sb += "<tr><th>中文姓名</th><th>身分字號</th><th>生日</th><th>員工工號</th><th>手機</th><th>素食</th><th>Email</th></tr>";
  for (i = 1; i <= room; i++) {
    sb += line(i);
  }
  //sb += Testline(0, 'A1', 'S276604761', '11223344', '0933-000111', 'lee13079@hotmail.com');
  //sb += Testline(1, 'B2', 'H121277205', '', '0933-222333', 'lee123@hotmail.com');
  //sb += Testline(2, 'C3', 'U291512211', '', '0933-444555', 'lee456@hotmail.com');
  //sb += Testline(3, 'D4', 'K175780504', '', '0933-555666', 'lee789@hotmail.com');
  //sb += Testline(4, 'E5', 'K234819828', '', '0933-777888', 'lee100@hotmail.com');
  //sb += Testline(5, 'F6', 'M122574377', '', '0933-999000', 'lee200@hotmail.com');
  sb += "</table>";
  $("#joiner").html(sb);
  $('tr.listline').each(function (index) {
    datedroplist($(this).find("select[id^='ddlYr']").attr('id'),
        $(this).find("select[id^='ddlMm']").attr('id'),
        $(this).find("select[id^='ddlDd']").attr('id'));
  });
}


function confirmaion() {
  if (!Is_Data_Valid()) { alert("頁面上有不合法的資料型態，請檢查後再繼續！"); }

  if ($("tr.listline").size() > 0) {
    $("#confirmation").html('');
    var validator = "OK", name = "", sid = "", dob = "", eid = "", tel = "", ext = "", cell = "", veg = false, email = "", desc = "";
    var freeAmt = 0, joinAmt = 0, total = 0, adult = 0, threeyr = 0; sixyr = 0, age = 0, room = 0;
    var array = [], temp = [];

    tel = $("#txtPhone").val();
    ext = $("#txtExt").val();
    if (tel.length <= 0) { alert("請輸入聯絡人電話！格式：02-0000-0000"); return false; }
    if (!isTel(tel, 'tel')) { alert("：電話號碼錯誤！格式：02-0000-0000"); return false; }
    if (ext.length <= 0) { alert('請輸入分機號碼！'); return false; }
    if (!isInteger(ext)) { alert('分機號碼錯誤請重新輸入！'); return false; }
    var sb = "<table class='table table-striped' style='width:100%;'>";
    sb += "<tr><th>中文姓名</th><th>身分字號</th><th>生日</th><th>員工工號</th><th>手機</th><th>素食</th><th>Email</th></tr>";
    $('tr.listline').each(function (i) {
      name = $(this).find("input[id^='txtName']").val();
      sid = $(this).find("input[id^='txtSid']").val();
      dob = $(this).find("select[id^='ddlYr']").val() + "/" +
          padLeft("00", $(this).find("select[id^='ddlMm']").val()) + "/" +
          padLeft("00", $(this).find("select[id^='ddlDd']").val());
      eid = $(this).find("input[id^='txtEid']").val();
      cell = $(this).find("input[id^='txtCell']").val();
      veg = $(this).find("select[id^='ddlVeg']").val();
      email = $(this).find("input[id^='txtEmail']").val();
      validator = joiner_validate((i + 1), name, sid, dob, eid, cell, email);
      if (validator != "OK") { return false; }

      age = getAges(dob);

      sb += "<tr class='FinalLine'>";
      sb += "<td><span id='lbName" + i + "'>" + name + "</span>";
      if (i == 0) { sb += "<span class='text-danger'>(主要聯絡人)</span>"; }
      sb += "</td>";
      sb += "<td><span id='lbSid" + i + "'>" + sid + "</span></td>";

      switch (age) {
        case 3:
          threeyr += 1;
          sb += "<td><span id='lbDob" + i + "'>" + dob + "</span><sapn class='text-danger'>（3歲以下）</span></td>";
          break;
        case 6:
          sixyr += 1;
          sb += "<td><span id='lbDob" + i + "'>" + dob + "</span><sapn class='text-danger'>（4-6歲）</span></td>";
          break;
        default:
          adult += 1;
          sb += "<td><span id='lbDob" + i + "'>" + dob + "</span></td>";
          break;
      }


      sb += "<td><span id='lbEid" + i + "'>" + eid + "</span></td>";
      sb += "<td><span id='lbCell" + i + "'>" + cell + "</span></td>";
      sb += "<td><input type='hidden' id='hidVeg" + i + "' value='"
      if (veg == "true") { sb += "true' />素食"; } else { sb += "false' />X"; }
      sb += "</td>";
      sb += "<td><span id='lbEmail" + i + "'>" + email + "</span></td>";
      sb += "</tr>";

      if (eid.length > 0) { freeAmt += 2; array[i] = eid; }
      joinAmt += 1;

    });
    sb += "</table>";
    if (validator != "OK") { alert(validator); return false; }

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

    if (validator != "OK") { alert(validator); return false; }

    if (freeAmt <= 0) { alert("參加者中至少要有一位員工，請輸入一組員工工號！"); return false; }


    $.each(array, function (key, value) {
      if ($.inArray(value, temp) === -1) {
        temp.push(value);
      } else {
        validator = "有重覆的工號！請重新輸入！"; return false;
      }
    });

    if (validator != "OK") { alert(validator); return false; }


    if ($("#ddlRoom").val() == '2D' || $("#ddlRoom").val() == '4D') {
      total = (5000 * adult) + (5000 * sixyr) - (5000 * freeAmt);
    } else {
      total = (5000 * adult) - (5000 * freeAmt);

      if (total < 0) { total = 0; }

      total = (1000 * sixyr) + (500 * threeyr);
    }

    if (total <= 0) { total = 0; }

    sb += "<div style='margin-top:12px; border-top:dotted 1px #c0c0c0; padding:12px; text-align:right;'>";
    sb += "<p>您預定了一間 " + room.toString() + " 人房，共有 " + joinAmt + " 參加人，預估應付總金額為：<span class='text-danger'>" + total + "</span></p>";
    sb += '<p>' + desc + '</p>';
    sb += "</div>";
    $("#total").val(total);
    $("#confirmation").html(sb);
    show_setp("3");

  } else {
    alert("請輸入參加人資料！");
  }
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
  var lineNo = $(".FinalLine").size();
  if (lineNo <= 0) { alert("您尚未加入參加人，請先加入參加人再繼續！"); return false; }

  var actid = $("#hidActid").val();
  var actName = $("#hidActName").val();
  var capacity = $("#hidCapacity").val();
  var prom = "false";

  if (lineNo > parseInt(capacity)) { alert("此活動項目名額不足，請選擇其他活動項目再繼續！"); return false; }

  $("#btnSubmit").prop('disabled', true);
  var img = $("#imgLoading");
  var msg = $("#msgError");
  var Order = {};
  var name = "", dob = "", sid = "", eid = "", tel = "", cell = "", email = "", veg = "";

  tel = $("#txtPhone").val() + "#" + $("#txtExt").val();
  if ($("tr.FinalLine").size() > 0) {
    $('tr.FinalLine').each(function (index) {
      name = $(this).find("span[id^='lbName']").text();
      dob = $(this).find("span[id^='lbDob']").text();
      sid = $(this).find("span[id^='lbSid']").text();
      eid = $(this).find("span[id^='lbEid']").text();
      cell = $(this).find("span[id^='lbCell']").text();
      email = $(this).find("span[id^='lbEmail']").text();
      veg = $(this).find("input[id^='hidVeg']").val();
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
  }

  var img = $("#imgLoading");

  var cdata = { "order": Order, "detail": aryJoinner };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvOrder.asmx/Create_Wt_TwoDaysOrder",
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
        result = result.substring(2, result.length);//OKE1040402002800
        var oid = result.substring(0, 11);
        var total = result.substring(11, result.length);
        var sb = "";
        sb += "<p class='text-info'>";
        sb += "您已完成線上報名程序，您的報名編號為：<span class='emphsize'>" + oid + "</span>，此次應付總金額為：<span class='emphsize'>" + total + "</span>";
        sb += "，報名細節請前往您的電子郵件信箱察看。系統已發送email到您所填寫的電子信箱中，若您沒收到此一信件請先檢查是否在您的垃圾郵件當中或直接與我們聯絡。";
        sb += "</p>";
        sb += "<p class='text-info'>";
        sb += "為了維護您的權益，煩請於三日內完成付款動作，您可使用 ATM 轉帳、匯款或其他現金存入的方式，將您的款項匯至：";
        sb += "</p>";
        sb += "<address>";
        sb += "<strong>銀行：新光銀行-新板分行</strong><br />";
        sb += "<strong>戶名：海天青旅行社股份有限公司</strong><br />";
        sb += "<strong>帳號：0462-10-100-286</strong><br />";
        sb += "</address>";
        $("#odcnt").html('');
        $("#odcnt").html(sb);
        $("#myModal").modal('show');
        $("#btnFinish").show();
        $("#btnSubmit").hide();
      }
      img.hide();
      $("#btnSubmit").prop('disabled', false);
    },
    error: function (xhr, status, error) {
      img.hide();
      $("#btnSubmit").prop('disabled', false);
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
      alert("伺服器過於繁忙，目前無法送出報名表，請稍候再做嘗試！");
    }
  });

}

function order_complete() {
  initial();
  $("#myModal").modal('hide');
  window.open("http://enterprise.mcpgo.com/enterprise/wt/Default.aspx", "_self");
}


