$(document).ready(function () {
  $("#imgStep1").show();
  load_discount();

  $("#btnUpdate").click(function () {
    update_detail();
  });
});

function get_listContent(i, name, e1, e2, old, gp, ds, aval) {
  var htm = "";
  htm += "<tr>";
  htm += "<td>";
  htm += "<span id='" + i + "' title='編輯' class='glyphicon glyphicon-pencil' onclick='load_details(this.id)'></span>";
  htm += "</td>";
  htm += "<td><span id='lbName" + i + "'>" + name + "</span></td>";
  htm += "<td><span id='lbEA" + i + "'>" + e1 + "</span></td>";
  htm += "<td><span id='lbEB" + i + "'>" + e2 + "</span></td>";
  htm += "<td><span id='lbOld" + i + "'>" + old + "</span></td>";
  htm += "<td><span id='lbGP" + i + "'>" + gp + "</span></td>";
  htm += "<td><span id='lbDisc" + i + "'>" + ds + "</span></td>";
  htm += "<td><span id='lbApply" + i + "' ";
  if (aval == "false") { htm += "class='no'>否"; } else { htm += "class='yes'>是"; }
  htm += "</span></td>";
  htm += "<td>";
  htm += "<span id='del" + i + "' title='刪除' class='glyphicon glyphicon-remove' onclick='del_discount(this.id)'></span>";
  htm += "</td>";
  htm += "</tr>";
  return htm;
}

function load_discount() {
  var cnt = $("#discList");
  var img = $("#imgStep1");
  var msg = $("#msgStep1");
  $.ajax({
    type: "GET",
    url: "../../mcpservices/ActivityService.asmx/Get_Discount",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    cache: false,
    before: function () {
      cnt.html("");
      img.show();
    },
    success: function (data) {
      var str = data.d;
      var htm = "";
      htm += "<table class='table table-hover' style='width:962px;; font-size:13px;'>";
      htm += "<tr id='lineth'>";
      htm += "<th style='width:66px;'>編輯</th><th>折扣名稱</th><th>早鳥1折扣</th><th>早鳥2折扣</th>";
      htm += "<th>舊生折扣</th><th>同行折扣</th><th>直接折扣</th><th>套用</th><th style='width:66px;'>刪除</th>";
      htm += "</tr>";
      if (str.length > 0) {
        $.each(str, function (i, dis) {
          htm += get_listContent(dis.SeqNo.toString(), dis.Name.toString(), dis.EarlyBird1.toString(), dis.EarlyBird2.toString(),
                                 dis.OldCust.toString(), dis.Group.toString(), dis.Discount.toString(), dis.IsApply.toString());
        });
      } else {
        htm += "<tr class='nonline'><td colspan='9'><h4 class='text-danger'>目前沒有任何折扣方案</h4></td></tr>";
      }
      htm += "<tr>";
      htm += "<td></td>";
      htm += "<td>";
      htm += "<input id='txtName' type='text' class='form-control' maxlength='20' />";
      htm += "</td>";
      htm += "<td>";
      htm += "<input id='txtEA' type='text' value='0' class='form-control digits' maxlength='2' />";
      htm += "</td>";
      htm += "<td>";
      htm += "<input id='txtEB' type='text' value='0' class='form-control digits' maxlength='2' />";
      htm += "</td>";
      htm += "<td>";
      htm += "<input id='txtOld' type='text' value='0' class='form-control digits' maxlength='2' />";
      htm += "</td>";
      htm += "<td>";
      htm += "<input id='txtGp' type='text' value='0' class='form-control digits' maxlength='2' />";
      htm += "</td>";
      htm += "<td>";
      htm += "<input id='txtDisc' type='text' value='0' class='form-control digits' maxlength='2' />";
      htm += "</td>";
      htm += "<td>";
      htm += "<input id='ck' type='checkbox' />";
      htm += "</td>";
      htm += "<td>";
      htm += "<button id='btnAdd' type='button' class='btn btn-success btn-sm' onclick='add_discount();'>新增</button>";
      htm += "</td>";
      htm += "</tr>";
      htm += "</table>";
      cnt.html(htm);
      img.hide();
    },
    error: function (xhr, textStatus, errorThrown) {
      cnt.html("<h4 class='text-danger'>伺服器繁忙中，目前無法載入資料！</h4>");
      img.hide();
    }
  });
}

function add_discount() {
  var img = $("#imgStep1");
  var msg = $("#msgStep1");
  var tr = $("#lineth");
  var name = txtFltr($("#txtName").val());
  var e1 = txtFltr($("#txtEA").val());
  var e2 = txtFltr($("#txtEB").val());
  var old = txtFltr($("#txtOld").val());
  var gp = txtFltr($("#txtGp").val());
  var disc = txtFltr($("#txtDisc").val());
  var ck = false;

  if (name <= 0) { msg.text("請輸入折扣名稱！"); return false; }  
  if (!isInteger(e1)) { msg.text("早鳥1折扣！"); return false; }
  if (!isInteger(e2)) { msg.text("早鳥2折扣！"); return false; }
  if (!isInteger(old)) { msg.text("舊生折扣！"); return false; }
  if (!isInteger(gp)) { msg.text("同行折扣！"); return false; }
  if (!isInteger(disc)) { msg.text("直接折扣！"); return false; }
  if ($("#ck").is(":checked")) { ck = true; }

  var Discount = {};
  Discount.Seqno = 0;
  Discount.Name = name;
  Discount.EarlyBird1 = e1;
  Discount.EarlyBird2 = e2;
  Discount.OldCust = old;
  Discount.Group = gp;
  Discount.Discount = disc;
  Discount.IsApply = ck;

  $.ajax({
    type: "POST",
    url: "../../mcpservices/ActivityService.asmx/Add_Discount",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "disc": Discount }),
    cache: false,
    before: function () {
      msg.text("");
      img.show();
    },
    success: function (data) {
      var seqno = data.d;
      if (!isInteger(seqno)) {
        msg.text(seqno);
      } else {        
        var htm = get_listContent(seqno, name, e1, e2, old, gp, disc, ck);
        msg.text("已新增一筆資料");
        if (ck) {
          $(".yes").text("否");
          $(".yes").attr("class", "no");
        }
        $(htm).insertAfter(tr).closest('tr');
        $("#txtName").val("");
        $("#txtEA").val("0");
        $("#txtEB").val("0");
        $("#txtOld").val("0");
        $("#txtGp").val("0");
        $("#txtDisc").val("0");
        $("#ck").prop('checked', false);
        $("tr.nonline").remove();
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      msg.text('伺服器連線錯誤，目前無法新增');
    }
  });
}

function load_details(id) {
  $("#hidSeqno").val(id);
  var tr = $("#" + id).parent().parent();  
  $("#txtEName").val(tr.find("span[id^='lbName']").text());
  $("#txtEEA").val(tr.find("span[id^='lbEA']").text());
  $("#txtEEB").val(tr.find("span[id^='lbEB']").text());
  $("#txtEOld").val(tr.find("span[id^='lbOld']").text());
  $("#txtEGp").val(tr.find("span[id^='lbGP']").text());
  $("#txtEDir").val(tr.find("span[id^='lbDisc']").text());
  if (tr.find("span[id^='lbApply']").text() == "否") {
    $("#ckApply").prop('checked', false);
  } else {
    $("#ckApply").prop('checked', true);
  }
 
  $("#myModal").modal('show');
}

function update_detail() {
  var id = $("#hidSeqno").val();
  if (id <= 0) { msg.text("資料行號遺失無法進行更新！"); return false; }
  var tr = $("#" + id).parent().parent();
  var img = $("#imgStep2");
  var msg = $("#msgStep2");
  var name = txtFltr($("#txtEName").val());
  var e1 = txtFltr($("#txtEEA").val());
  var e2 = txtFltr($("#txtEEB").val());
  var old = txtFltr($("#txtEOld").val());
  var gp = txtFltr($("#txtEGp").val());
  var disc = txtFltr($("#txtEDir").val());
  var ck = false;

  if (name <= 0) { msg.text("請輸入折扣名稱！"); return false; }
  if (!isInteger(e1)) { msg.text("早鳥1折扣！"); return false; }
  if (!isInteger(e2)) { msg.text("早鳥2折扣！"); return false; }
  if (!isInteger(old)) { msg.text("舊生折扣！"); return false; }
  if (!isInteger(gp)) { msg.text("同行折扣！"); return false; }
  if (!isInteger(disc)) { msg.text("直接折扣！"); return false; }
  if ($("#ckApply").is(":checked")) { ck = true; }

  var Discount = {};
  Discount.Seqno = id;
  Discount.Name = name;
  Discount.EarlyBird1 = e1;
  Discount.EarlyBird2 = e2;
  Discount.OldCust = old;
  Discount.Group = gp;
  Discount.Discount = disc;
  Discount.IsApply = ck;


  $.ajax({
    type: "POST",
    url: "../../mcpservices/ActivityService.asmx/Update_Discount",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "disc": Discount }),
    cache: false,
    before: function () {
      msg.text('');
      img.show();
    },
    success: function (data) {
      var str = data.d;
      if (str != "OK") {
        msg.text(str);
      } else {        
        msg.text("資料已更新");
        if (ck) {
          $(".yes").text("否");
          $(".yes").attr("class", "no");
          tr.find("span[id^='lbApply']").text("是");
          tr.find("span[id^='lbApply']").attr("class", "yes");
        }
        tr.find("span[id^='lbName']").text(name);
        tr.find("span[id^='lbEA']").text(e1);
        tr.find("span[id^='lbEB']").text(e2);
        tr.find("span[id^='lbOld']").text(old);
        tr.find("span[id^='lbDisc']").text(disc);
        tr.find("span[id^='lbGP']").text(gp);      
        if (ck == "false") {
          $("#ck").prop('checked', false);
        } else {
          $("#ck").prop('checked', true);
        }
      }
    },
    error: function (xhr, textStatus, thrownError) {
      msg.text('伺服器連線錯誤，目前無法更新');
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    }
  });
}

function del_discount(id) {  
  if (!confirm("確定要刪除此一活動嗎？")) { return false; }
  var tr = $("#" + id).parent().parent();
  id = id.replace("del", "");
  var img = $("#imgStep1");
  var msg = $("#msgStep1");
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "../../mcpservices/ActivityService.asmx/Delete_Discount",
    data: JSON.stringify({ "seqno": id }),
    dataType: "json",
    async: true,
    beforeSend: function () {
      img.show();
      msg.text("");
    },
    success: function (data, textStatus) {
      var result = data.d;      
      if (result == "OK") {
        tr.remove();
        msg.text("資料已刪除");
      } else {
        msg.text(result);
      }
      img.hide();
    },
    error: function (xhr, status, thrownError) {
      msg.text("伺服器異常！刪除失敗！");
      img.hide();
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    }
  });
}