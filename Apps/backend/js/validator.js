$(function () {
  $('#aspnetForm').validate({
    onkeyup: function (element) { $(element).valid(); },
    blur: function (element) { $(element).valid(); }
  });
});

//-------------------------------------------------------------
//                    各種驗證功能
//-------------------------------------------------------------

//檢查頁面上是否有不合法的資料
function Is_Data_Valid() {
  if ($("#aspnetForm").valid() != true) { return false; } else { return true; }
}

jQuery.extend(jQuery.validator.messages, {
  required: "*必填",
  number: "*錯誤",
  digits: "*錯誤",
  email: "*錯誤",
  dateISO: "*錯誤",
  tel: "*錯誤",
  cell: "*錯誤"
});

$.validator.addMethod("tel", function (value, element) {
  return this.optional(element) || /^0\d{1,4}-\d{4}-\d{1,4}(\#\d{1,6})?$/.test(value);
}, "*錯誤");

$.validator.addMethod("cell", function (value, element) {
  return this.optional(element) || /^09\d{2}-([0-9]{6})$/.test(value);
}, "*錯誤");

//-------------------------------------------------------------
//                    數字功能
//------------------------------------------------------------
/***** 是否為浮點數 ****/
function isDecimal(no) {
  try {
    var patt = /^\d{1,4}(.\d{1})?$/; //最多4位整數或最多4位整數加一小數
    return patt.test(no);
  } catch (err) {
    return false;
  }
}

/***** 只允許數字（整數與浮點數） *****/
function numFltr(str) {
  try {
    if (str == undefined) { str = 0; }
    str = str.replace(/[^\d\.]/g, "");
    if (str.length <= 0) { str = 0; }
    return str;
  } catch (err) {
    return 0;
  }
}

//是否為整數
function isInteger(no) {
  try {
    if (no.length <= 0) { return false; }
    if (isNaN(no)) { return false; } else { return true; }
  } catch (err) {
    return false;
  }
}

// 數字欄位如果為空值則設為零
function toInt(str) {
  try {
    if (typeof str == 'undefined') { return 0; }
    if (isNaN(str) || str.toString().length <= 0) { return 0; }
    if (str.toString().indexOf(".") > 0) {
      return parseFloat(str);
    } else {
      return parseInt(str);
    }
  } catch (err) {
    return 0;
  }
}

//-------------------------------------------------------------
//                    字串功能
//------------------------------------------------------------
//檢查電話格式(含手機)
function isTel(telNo,/*cell or tel*/ type) {
  var pattTel = /^0\d{1,4}-\d{4}-\d{1,4}(\#\d{1,6})?$/g;
  var pattCel = /^09\d{2}-([0-9]{6})$/g;
  if (type == "tel") { return pattTel.test(telNo); } //02-2952-7535
  if (type == "cell") { return pattCel.test(telNo); } //0932-666888
}

function isSID(str) {
  var pattSid = /^[A-Z]{1}[0-9]{9}$/g;
  if (!pattSid.test(str)) {
    if (!isInteger(str)) { return false; } else { return true; }
  } else { return true; }
}

//檢查email
function isEmail(str) {
  var pattid = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;
  return pattid.test(str);
}


//過濾所有特殊與空字串
function txtFltr(str) {
  str = spaceFltr(str);
  str = symbolFltr(str);
  return str;
}

//過濾空白與換行字元
function spaceFltr(str) {
  return str.replace(/[\s\r\n\t]/g, "");
}

//過濾特殊字元
function symbolFltr(str) {
  return str.replace(/[<>@#|\/\^&$*;]/g, "");
}

//檢查 Url
function isUrl(value)
{
    return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value);
}
//-------------------------------------------------------------
//                    日期功能
//------------------------------------------------------------
//兩位數日期
function padLeft(nth, str) {
  var res = nth.substring(0, nth.length - str.length) + str;
  return res
}

//取得日期
function GetDay(plusDay) {
    var date = new Date();
    date.setDate(date.getDate() + plusDay);
   var y = date.getFullYear();
   var m = date.getMonth() + 1;
   var d = date.getDate();
   return y.toString() + "/" + padLeft("00", m.toString()) + "/" + padLeft("00", d.toString());
}

//檢查日期 2014/05/08
function isValidDate(value) {
  if (value.length != 10) { return false; }
  var day = new Date(value);
  return !isNaN(day.getDate());
}

//中文星期轉換
function getWeekDay(day) {
  switch (new Date(day).getDay()) {
    case 0:
      day = "(日)";
      break;
    case 1:
      day = "(一)";
      break;
    case 2:
      day = "(二)";
      break;
    case 3:
      day = "(三)";
      break;
    case 4:
      day = "(四)";
      break;
    case 5:
      day = "(五)";
      break;
    case 6:
      day = "(六)";
      break;
  }
  return day;
}

// 24小時判斷  15:00
function isValidTime(value) {
  return /^([01]\d|2[0-3])(:[0-5]\d){1,2}$/.test(value);
}

//日期時間判斷  2014/05/08 12:30
function isValidDateTime(value) {
  if (value.length != 16) { return false; }
  var day = value.substring(0, 10);
  var time = value.substring(11, value.length);
  if (!isValidDate(day)) { return false; }
  if (!isValidTime(time)) { return false; }
  return true;
}

//註冊 Date Picker(格式為 yyyy/mm/dd)
function day_picker(id) {
  $('#' + id).datepicker({ showOtherMonths: true });
}


