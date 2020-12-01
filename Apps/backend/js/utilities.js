function dropList(/* id */ id, /* array */ strAry, /* array */ valAry, /* string */ matchText, width) {
  var htm = "";
  htm += "<select id='" + id + "' class='form-control input-sm' ";
  if (width > 0) { htm += "style='width:" + width.toString() + "px!important;'"; }
  htm += " >";

  if (strAry.length <= 0 || valAry.length <= 0) {
    htm += "<option value='none'>無法載入資料</option></select>";
    return htm;
  }

  $.each(strAry, function (i, value) {
    htm += "<option value='" + valAry[i].toString() + "' ";
    if (valAry[i].toString() == matchText.toString()) { htm += " selected "; }
    htm += ">" + value + "</option> ";
  });

  htm += "</select>";
  return htm;
}

//產生文字輸入欄位
function input(id, value, /* class 屬性 */attr, maxlength, width, comment) {
  var sb = "";
  sb += "<input id='" + id + "' type='text' value='" + value + "' ";
  sb += "class='form-control input-sm ";
  if (attr.length > 0) { sb += attr; }
  sb += "' maxLength='" + maxlength.toString() + "' ";
  if (width > 0) { sb += "style='width:" + width.toString() + "px!important;'"; }
  if (comment.length > 0) { sb += " placeholder='" + comment + "' "; }
  sb += " />";
  return sb;
}


function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function datedroplist(yyField, mmField, ddField) {
    var today = new Date();
    var yy = $('#' + yyField);
    var mm = $('#' + mmField);
    var dd = $('#' + ddField);
    var sb = "";
    yy.append("<option value='0'>年</option>");
    for (yr = 1911; yr <= today.getFullYear() ; yr++) {
        yy.append("<option value='" + yr + "'>" + yr + "</option>");
    }

    mm.append("<option value='0'>月</option>");
    for (mt = 1; mt <= 12 ; mt++) {
        mm.append("<option value='" + mt + "'>" + mt + "</option>");
    }

    dd.append("<option value='0'>日</option>");

    yy.change(function () {        
        if (this.value != '0' && mm.val() != '0') {
            dd.empty();
            var days = daysInMonth(parseInt(mm.val()), parseInt(this.value));
            for (dy = 1; dy <= days ; dy++) {
                dd.append("<option value='" + dy + "'>" + dy + "</option>");
            }
        }
    });

    mm.change(function () {
        if (this.value != '0' && yy.val() != '0') {
            dd.empty();
            var days = daysInMonth(parseInt(mm.val()), parseInt(this.value));
            for (dy = 1; dy <= days ; dy++) {
                dd.append("<option value='" + dy + "'>" + dy + "</option>");
            }
        }
    });
}

