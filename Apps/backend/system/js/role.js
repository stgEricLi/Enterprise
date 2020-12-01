$(document).ready(function () {
  $("#btnAdd").click(function () {
    add_role();
  });
  

});

// 頁面再次載入時
function pageLoad() { regenerate_table(); }

//從新組合資料表格
function regenerate_table() {
  var htm = "", role= "";
  htm += "<table id='tbl' class='table table-hover' style='width:20%; font-size:13px;'>";
  htm += "<tr>";
  htm += "<th>群組名稱</th><th>刪除</th>";
  htm += "</tr>";
  $(".list ul li").each(function (i) {
    if (i >= 0) {
      role = $(this).find("span[id$='_lbRole']").text().trim();    
      htm += "<tr>";
      htm += "<td>" + role + "</td>";      
      htm += "<td style='width:64px; text-align:center;'>";
      htm += "<a id='" + role + "' href='#' onclick='del_role(this.id)'><span class='glyphicon glyphicon-remove'></span></a>";
      htm += "</td>";
      htm += "</tr>";
    }
  });
  htm += "</table>";
  $(".list").html('');
  $(".list").html(htm);
}


function add_role() {
  var rolename = $("#txtRole").val();    
  var img = $("#imgLoad");
  if (rolename.length <= 0) { alert("請輸入群組名稱後再新增！"); return false;}
  var cdata = { 'rolename': rolename };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvSystem.asmx/add_newRole",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(cdata),
    cache: false,
    beforeSend: function () {    
      img.show();
    },
    success: function (data) {
      var str = data.d;
      if (str == "OK") {        
        var htm = "";        
        htm += "<tr>";
        htm += "<td>" + rolename + "</td>";
        htm += "<td style='width:64px; text-align:center;'>";
        htm += "<a id='" + rolename + "' href='#' onclick='del_role(this.id)'><span class='glyphicon glyphicon-remove'></span></a>";
        htm += "</td>";
        htm += "</tr>";
        $('#tbl tr:last').after(htm);
        alert("群組已新增");
      } else { alert(str); }
      img.hide();
    },
    error: function (xhr, textStatus, thrownError) {
      alert("伺服器錯誤！無法新增！");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
      img.hide();
    }
  });
}


function del_role(rolename) {
  var tr = $("#" + rolename).parent().parent();  
  var cdata = { 'rolename': rolename };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvSystem.asmx/delete_role",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(cdata),
    cache: false,
    beforeSend: function () {
  
    },
    success: function (data) {
      var str = data.d;
      if (str == "OK") {
        tr.remove();
        alert("群組已刪除");
      } else { alert(str); }
    },
    error: function (xhr, textStatus, thrownError) {
      msg.text("伺服器錯誤！無法新增！");
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
    }
  });
}
