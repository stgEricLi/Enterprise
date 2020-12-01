$(document).ready(function () {
 
    initial();

    $("#lbAgree").click(function () {
        if (!$("#ckAgree").is(":checked")) 
            $("#ckAgree").prop('checked', true);
        else
            $("#ckAgree").prop('checked', false);
    });

    $("#btnToS2").click(function () {
      initial_step2();       
    });

    $("#btnToS1").click(function () {
      var isok = confirm("回第一步驟會將參加人資料全部清除，確定要回上一步驟嗎？");
      if (isok == false) { return false; }
      $("#joiner").html('');
      errorMsg = [];
      arrayJoinner = [];
      info = null;
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

  $("#btnMgClose").click(function () {
      $('#divMsg').hide();
  });
  
});


var room2_c = 0;
var room4_c = 0;
var errorMsg = [];
var arrayJoinner = [];
var info = null;

function initial() {
  WT.pageDescTwoDays();
  show_setp("1");
  $("#txtPhone").val('02-8226-9088');
  $("#txtExt").val('');
  $("#joiner").html('');
  $("#confirmation").html('');
  room2_c = parseInt($("#hidRoom2").val());
  room4_c = parseInt($("#hidRoom4").val());
  $("#txtRestRoom").text('此活動目前兩人房剩 ' + room2_c + ' 間，四人房剩 ' + +room4_c + ' 間');
  //$("#btnToS2").prop('disabled', true);
    $("#txtLeaderEid").val('');
    $("#txtLeaderSid").val('');
  WT.initialRoom();
    //http://localhost:29895/enterprise/wt/waiting_two_days.aspx?aid=E1070510025
}

function initial_step2() {  
  if (!$("#ckAgree").is(":checked")) { alert("您必須同意上述申明才可進行報名！"); return false; }

  var eid = $("#txtLeaderEid").val();
  var sid = $("#txtLeaderSid").val();
  var actid = $("#hidActid").val();
  var capacity = WT.getCapacity($("#ddlRoom").val());
  var leaderName = "";
  if (!WT.isSID(sid)) { alert("請輸入正確身分證！"); return false; }

  WT.checkEmployee(eid, sid, actid).done(response => {
      if (response.hasOwnProperty('d')) {
          leaderName = response.d;
          if (leaderName == 'Empty') { alert("很抱歉查不到您的員工資料！"); return false; }
          if (leaderName == 'Join') { alert("您已經報名過此一系列的活動了，每位同仁限參加一日與二日活動各一次！"); return false; }
          $("#joiner").html(WT.createJoinerForm(capacity, leaderName, sid, eid));
          WT.assignDateToDll();
          show_setp("2");
      } else { alert("很抱歉服務器繁忙中，請稍後再嘗試！"); }
  }).fail((xhr, textStatus, error) => {
      console.log(xhr.status);
      console.log(error);
      console.log("checkEmployee Failed");
      alert("很抱歉服務器發生錯誤，請稍後再嘗試！");
      return false;
  });  
}

function show_setp(step) {  
    $(".steps").hide();
    $("#step"+ step).show();
}


function confirmaion() {
    hideMsg();
    errorMsg = [];
    arrayJoinner = [];
    info = null;
    var tel = $("#txtPhone").val();
    var ext = $("#txtExt").val();
    var actid = $("#hidActid").val();
    var actName = $("#hidActName").val();

    if (actid.length <= 0) { alert("行程資料遺失，無法進行報名，請刷新此頁面後再試一次！"); return false; }
    if (actName.length <= 0) { alert("行程資料遺失，無法進行報名，請刷新此頁面後再試一次！"); return false; }

    arrayJoinner = WT.getJoinerList(actid, actName);

    if (arrayJoinner.length <= 0) { showMsg("<ul></li>請輸入參加人資料！</li></ul>"); return false; }
    //console.log(arrayJoinner);

    errorMsg = WT.validateJoiner(arrayJoinner);

    if (tel.length <= 0){ errorMsg.push("請輸入聯絡人電話！格式：02-0000-0000"); }
    if (!WT.isTel(tel, 'tel')) { errorMsg.push("電話號碼錯誤！格式：02-0000-0000"); }
    if (ext.length <= 0) { errorMsg.push("請輸入分機號碼！"); }
    if (!WT.isInt(ext)) { errorMsg.push("分機號碼錯誤請重新輸入！"); }

    if (errorMsg.length > 0) {
        var error = "<ul>";
        $.each(errorMsg, function (i, e) {
            error += "<li>" + e + "</li>";
        });
        error += "</ul>";
        showMsg(error);
        return false;
    }

    info = WT.validateTwoDaysOrder(arrayJoinner, $("#ddlRoom").val());
    if (info.Error.length > 0) { showMsg(info.Error); return false; }
    WT.generateTwoDaysConfirm(arrayJoinner, info);
    show_setp("3");    
}



function create_order() { 
  //$("#btnSubmit").prop('disabled', true);
  var img = $("#imgLoading");
  //var msg = $("#msgError");
  var Order = {};
  Order.OrderID = "";
  Order.Name = arrayJoinner[0].Name;
  Order.Tel1 = $("#txtPhone").val() + '#' + $("#txtExt").val();
  Order.Cell1 = arrayJoinner[0].Cell;
  Order.Address = "新北市中和區中正路738號14樓";
  Order.Email = arrayJoinner[0].Email;
  Order.IsPromote = false;
  Order.Company = 'wt';
  Order.Tel2 = $("#ddlRoom").val();
  img.show();
  $("#btnSubmit").prop('disabled', true);
   
    WT.makeTwoDaysWaitingList({ "order": Order, "detail": arrayJoinner, "waiting": "Y" }).done(function (response)  {
        //console.log(response);
      if (response.hasOwnProperty('d')) {
          var result = response.d;
          if (result.substring(0, 2) != "OK") {
              alert(result);
              $("#btnSubmit").prop('disabled', false);
              img.hide();
              return false;
          }
          //OKW20712050010
          result = result.substring(2, result.length);
          var oid = result.substring(0, 11);
          var total = result.substring(11, result.length);
          var sb = "";
          sb += "<p class='text-info'>";
          sb += "您已完成線上線上報名候補程序，您的候補編號為：<span class='emphsize'>" + oid + "</span>，此次候補應付總金額為：<span class='emphsize'>" + total + "</span>";
          //sb += "，報名細節請前往您的電子郵件信箱察看。系統已發送email到您所填寫的電子信箱中，若您沒收到此一信件請先檢查是否在您的垃圾郵件當中或直接與我們聯絡。";
          sb += "</p>";
          $("#odcnt").html('');
          $("#odcnt").html(sb);
          $("#myModal").modal('show');
          $("#btnFinish").show();
          $("#btnSubmit").hide();
          $("#btnBackS2").hide();
          img.hide();
          $("#btnSubmit").prop('disabled', false);
      }
  }).fail((xhr, textStatus, error) => {
      console.log(xhr.status);
      console.log(error);
      console.log("makeTowDaysOrder Failed");
      txtbox.val('');
      alert("很抱歉服務器發生錯誤，目前無法送出報名表，請稍後再嘗試！");

  });
   /*  */

  
  
}

function order_complete() {
    initial();
  $("#myModal").modal('hide');
  window.open("http://enterprise.mcpgo.com/enterprise/wt/Default.aspx", "_self");
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


