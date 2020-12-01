$(function () {
  //$(".page-container").addClass("sidebar-collapsed").removeClass("sidebar-collapsed-back");
  //$("#menu span").css({ "position": "absolute" });

  $("#menu").mouseout(function () {
    $(".page-container").addClass("sidebar-collapsed").removeClass("sidebar-collapsed-back");
    $("#menu span").css({ "position": "absolute" });
  })
  .mouseover(function () {
    $(".page-container").removeClass("sidebar-collapsed").addClass("sidebar-collapsed-back");
    $("#menu span").css({ "position": "relative" });
  });
});

