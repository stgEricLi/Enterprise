$(function () {
  $("#L1").click(function (e) {
    popup("飲食卡路里", "<img alt='loading' src='img/food.jpg' style='margin:0px auto;' />")
    $("#myModal").modal('show');
  });

  $("#R2").click(function (e) {
    popup("飲料卡路里", "<img alt='loading' src='img/drink.jpg' />")
    $("#myModal").modal('show');
  });
});

function popup(titleText, content) {

  var cnt = $("#popCnt");
  var tlt = $(".modal-title");
  //var sb = "", str = "";
  cnt.html('');
  tlt.html('');
  tlt.html(titleText);
  cnt.html(content);
}