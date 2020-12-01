$(function () {
    display_info();

    $("input:file").change(function () {
        validateFile();
    });

    $("input:file").click(function () {
        $("#btnSubmit").hide();
        $("#loadimg").hide();
    });

    $("#btnMgClose").click(function () {
        hideMsg();
    });

    $("#btnSubmit").click(function () {
        upload();
    });

});

function ACT() {
    this.ActID = "";
    this.Name = "";
    this.StartDay = "";
    this.RegExpDay = "";
    this.Capacity = "";
    this.Price = 0;
    this.Pric2 = 0;
    this.Company = "wt";
    this.Enable = true;
    this.FieldStr1 = ""
    this.FieldStr2 = "";
    this.FieldInt1 = 0;
    this.FieldInt2 = 0;
}

function _COL() {    
    this.days = 0;
    this.seqno = 1;
    this.name = 2;
    this.start_date = 3;
    this.reg_exp_date = 4;
    this.capacity = 5;
    this.price = 6;
    this.price2 = 7;
    this.room2 = 8;
    this.room4 = 9;
}

var actArray = [];
var messages = [];
var column = new _COL();

function validateFile() {
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;

    if (!regex.test($("#csvfile").val().toLowerCase())) {
        showMsg("請選取 CSV 檔案格式!");
        return false;
    }

    if (typeof (FileReader) == "undefined") {
        showMsg("你使用的瀏覽器不支援 CSV 匯入！");
        return false;
    }

    var reader = new FileReader();

    reader.onload = function (e) {
        actArray = [];
        var csvrows = e.target.result.split("\n");

        if (csvrows.length <= 1) {
            showMsg("無資料可供匯入！");
            return false;
        }

        $("#loadimg").show();

        $.each(csvrows, function (i) {
            if (i == 0) { return true; }
            var cols = csvrows[i].split(",");

            if (cols.length != 10) {
                console.log("SKIP Row " + i + " not enough column");
                return true;
            }
            var act = new ACT();
            //is_duplicateID(aid)
            if (!isNumeric(cols[column.days])) {
                messages.push("第 " + (i + 1) + " 列 - 請指定活動天數，1-為一日遊，2-為二日遊。");
            } else {
                act.ActID = "E" + cols[column.days].toString() + '000000';
                if (parseInt(cols[column.days]) == 2) {
                    if (!isNumeric(cols[column.room2])) {
                        messages.push("第 " + (i + 1) + " 列 - 二日遊二人房數需為數字。");
                    } else {
                        act.FieldInt1 = parseInt(cols[column.room2]);
                    }

                    if (!isNumeric(cols[column.room4])) {
                        messages.push("第 " + (i + 1) + " 列 - 二日遊四人房數需為數字。");
                    } else {
                        act.FieldInt2 = parseInt(cols[column.room4]);
                    }
                }
            }

            if (!isNumeric(cols[column.seqno])) {
                messages.push("第 " + (i + 1) + " 列 -活動流水號需為數字。");
            } else {
                act.ActID = GenerateId(act.ActID, cols[column.seqno]);
            }

            
            if (!isText(cols[column.name])) {
                messages.push("第 " + (i + 1) + " 列 - 沒有活動名稱。");
            } else {
                act.Name = cols[column.name].toString();
            }

            if (!isDate(cols[column.start_date])) {
                messages.push("第 " + (i + 1) + " 列- 活動日期格式應為 mm/dd/yyyy 或 m/d/yyyy.");
            } else {
                act.StartDay = dayConvertion(cols[column.start_date]);
            }
                

            if (!isDate(cols[column.reg_exp_date])) {
                messages.push("第 " + (i + 1) + " 列- 報名截止日期格式應為 mm/dd/yyyy 或 m/d/yyyy.");
            } else {
                act.RegExpDay = dayConvertion(cols[column.reg_exp_date]);
            }              

            if (!isNumeric(cols[column.capacity])) {
                messages.push("第 " + (i + 1) + " 列 - 可參加人數要為數字。");
            } else {
                act.Capacity = parseInt(cols[column.capacity]);
            }

            if (!isNumeric(cols[column.price])) {
                messages.push("第 " + (i + 1) + " 列 - 二人房價格要為數字。");
            } else {
                act.Price = parseInt(cols[column.price]);
            }
                
            if (!isNumeric(cols[column.price2])) {
                messages.push("第 " + (i + 1) + " 列 - 四人房價格要為數字。");
            } else {
                act.Price2 = parseInt(cols[column.price2]);
            }
            actArray.push(act);
        });// LOOP END

         console.log(actArray);

        if (messages.length > 0) { display_issues(); return false; }

        display_import();
    }

    reader.readAsText($("#csvfile")[0].files[0]);
 
}

function upload() {
   
    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvAct.asmx/Import_Activity",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "acts": actArray }),
        cache: false,
        before: function () {
            msg.text('');
            img.show();
        },
        success: function (data) {
            var str = data.d;
            if (str.substring(0, 2) != "OK") {
                showMsg(str);
            } else {
                //$("#lbActid").text(str);
                //msg.text('活動：「' + name + "」-" + str.replace("OK", "") + "已新增！");
                //clear_input();
                alert('匯入作業完成');
            }
        },
        error: function (xhr, textStatus, error) {
            //msg.text('伺服器連線錯誤，目前無法載入所屬群組');
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(error);
        }
    });
}


function display_issues() {
    $("#result").html('');
    var sb = '<p>匯入檔案含有下列問題：</p>';
    sb += '<ul>';
    $.each(messages, function (i, v) {
        sb += '<li>' + v + '</li>';
    });
    sb += '</ul>';    
    $("#result").html(sb);
    $("#loadimg").hide();
    $("#btnSubmit").hide();
}

function display_import() {  
    $("#result").html('');
    var sb = '';
    $("#loadimg").hide();
    $("#btnSubmit").show();
    sb += '<p>總共要匯入 ' + actArray.length + ' 筆行程：</p>';
    sb += '<ul>';
    $.each(actArray, function (i, v) {
        sb += '<li>' + v.ActID + '-' + v.Name + ' （' + v.StartDay + '）可參加' +  v.Capacity + ' 人，';
        sb += '二人房 ' + v.FieldInt1 + ' 間，' + '四人房 ' + v.FieldInt1 + ' 間';
        sb += '</li>';
    });
    sb += '</ul>';
    $("#result").html(sb);
}

function display_info() {
    var sb = '';
    sb += '<p>匯入檔案含需有下列欄位：</p>';
    sb += '<ul>';
    sb += '<li>活動天數</li>';
    sb += '<li>活動流水號</li>'; 
    sb += '<li>活動名稱</li>';
    sb += '<li>活動日期（mm/dd/yyyy 或 m/d/yyyy）</li>';
    sb += '<li>報名截止日期（mm/dd/yyyy 或 m/d/yyyy）</li>';
    sb += '<li>活動可參加人數</li>';
    sb += '<li>二人房價格</li>';
    sb += '<li>四人房價格</li>';
    sb += '<li> 二人房數（非二日遊請填 0）</li>';
    sb += '<li> 四人房數（非二日遊請填 0）</li>';
    sb += '</ul>';
    sb += '<p style="color:red;">注意一：活動天數與活動流水號決定行程編碼</p>';
    sb += '<p style="color:red;">注意二：若資料庫中有相同的行程編碼，此行程資料會直接被覆寫</p>';
    $("#result").html(sb);
}

function isText(value) {
    if (typeof value == 'undefined')
        return false;
    value = remove_space(value);
    if (value.length <= 0)
        return false;
    return true;
}

function isDate(value) {
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
        var day = new Date(value);
        return !isNaN(day.getDate());
    } else {
        return false;
    }
}

function dayConvertion(date) {
    var dateParts = date.split(/-|\\|\//);   
    return dateParts[2] + "-" + padLeft("00", dateParts[0]) + "-" + padLeft("00", dateParts[1]);
}

function GenerateId(id, seqno) {
    return id + padLeft("000", seqno);
}

function padLeft(nth, str) {
    var res = nth.substring(0, nth.length - str.length) + str;
    return res
}

function isSid(value) {
    return /^\d{3}-\d{2}-\d{4}$/.test(value);
}

function isYN(value) {
    return /^(Y|N|y|n)\s*$/.test(value);
}

function isNumeric(value) {
    try {
        if (typeof value == 'undefined')
            return false;
        value = remove_space(value);
        if (value.length <= 0)
            return false;
        return /^\d{1,9}(.\d{2})?$/.test(value);
    } catch (err) {
        return false;
    }
}

function toNumeric(value) {
    try {
        if (typeof value == 'undefined')
            return 0;
        value = remove_space(value);
        if (value.length <= 0)
            return 0;
        if (/^\d{1,9}(.\d{2})?$/.test(value)) {
            return value;
        } else {
            return 0;
        }

    } catch (err) {
        return 0;
    }

}

function remove_space(value) {
    return value.replace(/[\s\t]/g, "");
}

function is_duplicateID(aid) {
    //console.log("Search: " + empid);
    var returnArry = $.grep(actArray, function (e) { return e.ActID === aid; });
    if (returnArry.length > 0)
        return true;
    else
        return false;
}

function showMsg(msg) {
    $("#txtMsg").html(msg);
    $("#divMsg").addClass('alert-danger');
    $("#divMsg").show('fade');
}

function hideMsg() {
    $("#txtMsg").html('');
    $("#divMsg").removeClass('alert-danger');
    $("#divMsg").removeClass('alert-success');
    $("#divMsg").hide();
}





