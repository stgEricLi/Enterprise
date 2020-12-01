
function pageing(total, pageindex, maxRow) {
  var sb = "";
  var pg = $(".pagination");
  var totalPage = 0;
  $(".pagination a").unbind("click", function () { });
  pg.html('');
  if (total <= 0) { return false; }
  if (maxRow > 20) { maxRow = 20; }
  if (maxRow > total) { maxRow = total; }
  
 
  totalPage = Math.floor(total / maxRow);
  if (total % maxRow > 0) {
    totalPage += 1;
  }
  if (totalPage <= 1) { return false; }
  sb += "<li><a id='fp1' href='#'>第一頁</a></li>";
  for (var i = 1; i <= totalPage; i++) {
    if (i == pageindex) {
      sb += "<li class='disabled'>";
    } else {
      sb += "<li>";
    }
    sb += "<a id='page" + i.toString() + "' href='#'>" + i.toString() + "</a></li>";
  }
  sb += "<li><a id='fp" + totalPage + "' href='#'>最終頁</a></li>";
  pg.html(sb);

  $(".pagination a").bind("click", function (e) {
    pagechange($(this).attr('id'));
    e.preventDefault();
  });
}

function pagechange(id) {
  if (id.substring(0, 2) == 'fp') {
    id = id.replace("fp", "");
  } else {
    id = id.replace("page", "");
  }
  $('#hidCurrPage').val(id);
  load_data();
}