

$(function () {
  $("#support").show();

  $("#btnSuport").click(function (e) {
    menu_controler(e.target.id);
    project_switcher("support");
  });

  $("#btnTeam").click(function (e) {
    menu_controler(e.target.id);
    project_switcher("team");
  });
 
  $("#btnItinerary").click(function (e) {
    menu_controler(e.target.id);
    project_switcher("itinerary");
  });

  $("#btnGoReg").click(function (e) {
    menu_controler('btnItinerary');
    project_switcher("itinerary");
  });


  $("#btnReg").click(function (e) {
    menu_controler(e.target.id);
    project_switcher("register");
  });

  $("#btnPicture").click(function (e) {
    menu_controler(e.target.id);
    project_switcher("picture");
  });
  
  
 
  //get_OdTotal("M1051015001", 34);
  get_OdTotal("E1060718004");
  get_OdTotal("E1060718007");
  get_OdTotal("E1060718008");
  get_OdTotal("E1060718005");
  get_OdTotal("E1060718006");
  get_OdTotal("E1060718001");
  get_OdTotal("E1060718009");
  get_OdTotal("E1060718010");
  get_OdTotal("E1060718002");
  get_OdTotal("E1060718003");



});



function get_OdTotal(id) {
  //originalVal = $("#" + id).html();
  var cdata = { "actid": id };
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAct.asmx/get_Act_Capacity",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(cdata),
    cache: false,
    success: function (data) {
      var result = data.d;
      var int = 0;
      if (!isInteger(result)) { int = 0; } else { int = parseInt(result); }
      //int = num - int ;
      if (int <= 0) { int = 0; }
      $("#" + id).text("尚有" + int.toString() + "名額");
    },
    error: function (xhr, status, error) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(error);
    }
  });
}

function recall(id) { 
  $("#" + id).html($("#" + id).attr('amt'));
  
}

function menu_controler(id) {
  $("#" + id).parent().siblings().attr('class', 'none');
  $("#" + id).parent().attr('class', 'active');
}


function project_switcher(module) {
  $(".ctn").hide();
  switch (module) {
    case "support":
      $("#support").show();
      break;
    case "team":
      $("#team").show();
      break;
    case "itinerary":
      $("#itinerary").show();
      break;
    case "register":
      $("#register").show();
      break;
    case "picture":
      $("#picture").show();
      break;
  }
}


function isInteger(no) {
  try {
    if (no.length <= 0) { return false; }
    if (isNaN(no)) { return false; } else { return true; }
  } catch (err) {
    return false;
  }
}