$(function () {
  $('#aspnetForm').validate({
    onkeyup: function (element) { $(element).valid(); },
    blur: function (element) { $(element).valid(); }
  });
});

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