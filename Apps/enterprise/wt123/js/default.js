

$(function () { 
    $("#datepicker").datepicker({
        inline: true,
        showOtherMonths: true
    });

    project_switcher("news");

    $("#btnNews").click(function (e) {
        menu_controler(e.target.id);
        project_switcher("news");
    });

    $("#btnAlbum").click(function (e) {
        menu_controler(e.target.id);
        project_switcher("album");
    });

    $("#btnBauo").click(function (e) {
        menu_controler(e.target.id);
        project_switcher("baou");
    });

    $("#btnFood").click(function (e) {     
        //menu_controler(e.target.id);
      //project_switcher("food");
      window.open("http://enterprise.mcpgo.com/enterprise/wt123/foodmap.html", "_blank")
    });

    $("#btnRule").click(function (e) {
      menu_controler(e.target.id);
      project_switcher("rule");
    });

    $("#btnRank").click(function (e) {
      menu_controler(e.target.id);
      project_switcher("rank");
    });
    

    $("#btnExercise").click(function (e) {
      //menu_controler(e.target.id);
      //project_switcher("exercise");
      var sb = "";
      sb += '<img alt="運動地圖" src="img/hymap.jpg" class="img-responsive" />';
      popup('運動地圖', sb, 'width', '1240px');
    });

    $(".btnOx").click(function (e) {
      var sb = "";
      sb += '<img alt="運動課程" src="img/airgm.jpg?v=1.01" class="img-responsive" />';
      popup('運動課程', sb, 'height', '600px');
    });

    $(".btnCourse").click(function (e) {
      var sb = "";
      sb += '<img alt="健康講座" src="img/diycan.jpg?v=1.01" class="img-responsive" />';
      popup('健康講座', sb, 'height', '600px');
    });
  

    $("#btnClass").click(function (e) {
        menu_controler(e.target.id);
        project_switcher("class");
    });

    
    
        
});

function popup(titleText, content, diam, size) {
   
    var cnt = $("#popCnt");
    var tlt = $(".modal-title");
    var dialog= $(".modal-dialog");

    //var sb = "", str = "";
    cnt.html('');
    tlt.html('');

    //$.each(ary, function (i, value) {
    //    if (i == 0) {
    //        str += "<li data-target='#myCarousel' data-slide-to='" + i.toString() + "' class='active'></li>";
    //        sb += "<div class='item active'>";
    //    } else {
    //        str += "<li data-target='#myCarousel' data-slide-to='" + i.toString() + "'></li>";
    //        sb += "<div class='item'>";
    //    }
    //    sb += "<img src='" + value + "' alt=''>";

    //    sb += "</div>";
    //});
    //ctrl.html(str);
    tlt.html(titleText);
    cnt.html(content);
    dialog.css(diam, size);
    $("#myModal").modal('show');
}

function menu_controler(id) {
    $("#" + id).parent().siblings().attr('class', 'none');
    $("#" + id).parent().attr('class', 'active');
}

function project_switcher(module) {
    $(".ctn").hide();
    $(".pagination").html('');
    switch (module) {
        case "news":            
          $("#EventZone").show();
          $("#NewsZone").show();
            load_News();
            //load_Fitness();
            break;
        case "album":
          $("#AlbumZone").show();
            load_album();
            break;
        case "more":
            $("#MoreZone").show();
            load_more();
            break;
        case "class":
            $("#ClassZone").show();
            //load_Class();
            break;
        case "baou":
            $("#BauoZone").show();
            break;
        case "rule":
            $("#RuleZone").show();
            break;
      case "rank":
        $("#RankZone").show();
        break;
      case "exercise":
        $("#ExerciseZone").show();        
        break;
            
    }
}

function load_album() {
  //var loading = $("#loading");
    var cnt = $("#AlbumPanel");
    var totalTxt = $("#totalAlbum");
  var loading = $("#AlbumLoading");
  var pageindex = numFltr($('#hidAlbCurrPage').val());
  var pagesize = numFltr($('#hidAlbPgSize').val());
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvAlbum.asmx/load_Album_Paging_Cache",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "pageindex": pageindex, "pagesize": pagesize, "company": "wt123" }),
    cache: true,
    asyn: true,
    beforeSend: function () {
      cnt.html('');    
      loading.show();
    },
    success: function (response) {
        if (response.hasOwnProperty('d')) {
            var json = JSON.parse(response.d);
            var totalrows = json.TotalRows;
            totalTxt.html('---- 共有 ' + totalrows.toString() + ' 本相簿 ----');
            var objAlbum = json.Albums;
            var htm = "";
            if (objAlbum != null) {
                var count = 0;                
                $.each(objAlbum, function (i, v) {
                    count += 1;
                    if (count == 1) { htm += "<div class='row text-center'>" }
                    htm += "<div class='col-sm-4'>";
                    htm += "<div class='thumbnail'>";
                    htm += "<a target='_blank' href='" + v.TargetLink.toString() + "'>";
                    htm += "<img src='" + v.ImgUrl.toString() + "' alt='" + v.Title.toString() + "' width='400' height='300' />";
                    htm += "</a>";
                    htm += "<p><strong>" + v.AlbumDate.toString() + " " + v.Title.toString() + "</strong></p>";
                    htm += "</div>";
                    htm += "</div>";
                    if (count == 3) { htm += "</div>"; count = 0; }                    
                });
                if (count > 0) {
                    var leaveover = 3 - count;
                    for (var l = 1; l <= leaveover; l++) {
                        htm += "<div class='col-sm-4'></div>";
                    }
                    htm += "</div>";
                }
            }
            cnt.html('');
            cnt.html(htm);
            //$(".albumPaging").html('<li>1</li>');
            pageing(totalrows, pageindex, pagesize, "Album");
          
            //if (totalrows > pagesize) { albpageing(totalrows, pageindex, pagesize); }
        } else {
            cnt.html('');
            cnt.html('<p>目前尚無活動相簿</p>');
            totalTxt.html('');
        }
      loading.hide();
    },
    error: function (xhr, textStatus, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
      cnt.html('');
      cnt.html('<p>目前尚無活動相簿</p>');
      totalTxt.html('');
      loading.hide();
      //cnt.html("<p class='loadingError'>目前無相簿資料，或是目前伺服器連線異常無法載入資料！</p>");
      //$(".pagination a").unbind("click", function () { });
     // $(".pagination").html('');
      //loading.hide();
    }
  });
}

function load_News() {
    var timetoLoad = $("#hidTimeToLoad").val();
    if (timetoLoad == "FALSE") { return false; }


  var cnt = $("#NewsPanel");
  var loading = $("#NewsLoading");
  var delay= $.ajax({
    type: "POST",
    url: "../../mcpservices/SvNews.asmx/load_News_Normal",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({ "company": "wt123", "pagesize": "6" }),
    cache: false,
    asyn: false,
    beforeSend: function () {
      cnt.html('');
      //$("#lineError").text('');
      loading.show();
    },
    success: function (data) {
      var str = data.d;
      var htm = "";
      //alert(str.length);
      if (str.length > 0) {
        var Desc = "", Link = "", NewsDate = "";
        htm += "<ul class='list-group'>";
        $.each(str, function (index, v) {         
          Desc = v.Desc.toString();
          Link = v.Link.toString();
          NewsDate = v.NewsDate.toString();
          htm += "<li class='list-group-item'><a target='_blank' href='";
          if (Link.length > 0) { htm += Link + "' >"; } else { htm += "#' >"; }
          htm += Desc + "</a><span class='badge'>" + NewsDate + "</span></li>";
          //htm += NewsDate + " " + Desc + "</a></li>";
        });        
        htm += "</ul>";
        htm += "<p style='text-align:right; padding-right:12px;'><a id='morenews' href='#'>所有消息...</a></p>";
        cnt.html(htm);
          

        $("#morenews").click(function (e) {
            menu_controler(e.target.id);
            project_switcher("more");
        });
      } else {
        cnt.html('<p>目前尚無最新消息</p>');
      }
      loading.hide();
    },
    error: function (xhr, textStatus, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
      //cnt.html("<p class='loadingError'>目前無相簿資料，或是目前伺服器連線異常無法載入資料！</p>");
      //$(".pagination a").unbind("click", function () { });
      // $(".pagination").html('');
      loading.hide();
    }
  });

  //delay.done(function () {
  //    load_Fitness();
  //});
}

function load_Fitness() {
  //var loading = $("#loading");
  var cnt = $("#EventPanel");
  var loading = $("#EventLoading");
  $.ajax({
    type: "POST",
    url: "../../mcpservices/SvNews.asmx/load_Fitness_Cache",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    cache: true,
    asyn: false,
    beforeSend: function () {
      //cnt.html('');
      //$("#lineError").text('');
      loading.show();
    },
    success: function (response) {
        if (response.hasOwnProperty('d')) {
            var json = JSON.parse(response.d);
            //var totalrows = json.TotalRows;            
            var objNews = json.News;
            var htm = "";
            if (objNews != null) {               
                htm += "<ul class='list-group'>";
                $.each(objNews, function (i, v) {
                    id = v.NewsID.toString();                   
                    htm += "<li class='list-group-item goal'>" + v.Company.toString() + "：" + v.Desc.toString() + "</li>";
                });
                htm += "</ul>";
            }
            cnt.html('');
            cnt.html(htm);
            //if (totalrows > pagesize) { pageing(totalrows, pageindex, pagesize); }
        } else {
            cnt.html('');
            //total.html('---- 共有 0 筆資料 ----');
        }
        loading.hide();
    },
    error: function (xhr, textStatus, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(thrownError);
      cnt.html("<p class='loadingError'>目前無資料，或是連線異常無法載入資料！</p>");
      //$(".pagination a").unbind("click", function () { });
      // $(".pagination").html('');
      loading.hide();
    }
  });
}

function load_Class() {
    var cnt = $("#ClassPanel");
    var loading = $("#ClassLoading");    

    $.ajax({
        type: "POST",
        url: "../../mcpservices/SvAct.asmx/load_Act",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "pageindex": 1, "pagesize": 35, "company": "wt123" }),
        cache: false,
        asyn: false,
        beforeSend: function () {
            loading.show();
        },
        success: function (response) {
            if (response.hasOwnProperty('d')) {
                var json = JSON.parse(response.d);
                //var totalrows = json.TotalRows;

                //total.html('---- 共有 ' + totalrows.toString() + ' 筆資料 ----');
                var objAct = json.Acts;
                var htm = "";
                if (objAct != null) {
                    htm += "<table class='table table-hover' style='width:100%; font-size:15px;'>";
                    htm += "<tr>";
                    htm += "<th>課程名稱</th><th>剩餘名額</th><th>日期</th><th>線上註冊</th>";
                    htm += "</tr>";
                    $.each(objAct, function (i, v) {     
                        if (v.Enable.toString() != "False") {
                            htm += "<tr>";
                            htm += "<td><a target='_blank' href='act/" + v.ActID.toString() + ".html'>" + v.Name.toString() + "</a></td>";
                            htm += "<td style='width:164px;'><span>" + v.Capacity.toString() + "</span></td>";
                            htm += "<td style='width:164px;'><span>" + v.StartDay.toString() + "</span></td>";
                            htm += "<td style='width:164px;'><a target='_blank' href='order.aspx?aid=" + v.ActID.toString() + "'>註冊</a></td>";
                            htm += "</tr>";
                        } 
                    });
                    htm += "</table>";
                }
                cnt.html('');
                cnt.html(htm);             
            } else {
                cnt.html('<p>目前尚無減重課程</p>');
            }
            loading.hide();
        },
        error: function (xhr, textStatus, thrownError) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(thrownError);            
            cnt.html("<p class='loadingError'>目前網路連線異常無法載入資料！</p>");
            loading.hide();
        }
    });
}

function load_more() {
    var loading = $("#MoreLoading");
    var cnt = $("#MorePanel");
    var lbTotal = $("#lbTotalRec");
    var pageindex = numFltr($('#hidCurrPage').val());
    var maxRow = numFltr($('#hidMaxRow').val());
    var total = 0;

    var def = $.ajax({
        type: "POST",
        url: "../../mcpservices/SvNews.asmx/load_News_Paging_cache",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "pageindex": pageindex, "pagesize": maxRow, "company": 'w123', "stday": '', "endday": '' }),
        cache: true,
        asyn: true,
        beforeSend: function () {
            loading.show();
            lbTotal.text('');
        },
        success: function (response) {
            if (response.hasOwnProperty('d')) {
                var json = JSON.parse(response.d);
                var total = json.TotalRows;
                lbTotal.html('---- 共有 ' + total.toString() + ' 筆資料 ----');
                var objNews = json.News;
                var htm = "";
                if (objNews != null) {
                    var link = "";
                    htm += "<ul class='list-group'>";
                    $.each(objNews, function (i, v) {
                        Link = v.Link.toString();
                        htm += "<li class='list-group-item'><a target='_blank' href='";
                        if (Link.length > 0) { htm += Link + "' >"; } else { htm += "#' >"; }
                        htm += v.Desc.toString() + "</a><span class='badge'>" + v.NewsDate.toString() + "</span></li>";
                    });
                    htm += "</ul>"
                }
                pageing(total, pageindex, maxRow, "News");
            }
            cnt.html('');
            cnt.html(htm);
            loading.hide();
        },
        error: function (xhr, textStatus, thrownError) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(thrownError);
            cnt.html("<p class='loadingError'>目前無消息，或是目前網路連線異常無法載入資料！</p>");
            $(".pagination a").unbind("click", function () { });
            $(".pagination").html('');
            loading.hide();
        }
    });
}

function pageing(total, pageindex, maxRow, type) {
    var sb = "";
    var pg;
    if (type == "Album") { pg = $(".albumPaging"); }
    if (type == "News") { pg = $(".newsPaging"); }

    $(".pagination a").unbind("click", function () { });
    //$(".newsPaging a").unbind("click", function () { });
    pg.html('');

    if (total <= 0) { return false; }
    if (maxRow > 20) { maxRow = 20; }
    if (maxRow > total) { maxRow = total; }

    var totalPage = Math.floor(total / maxRow);
    if (total % maxRow > 0) { totalPage += 1; }
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
        pagechange($(this).attr('id'), type);
        e.preventDefault();
    });
}

function pagechange(id, type) {
    if (id.substring(0, 2) == 'fp') {
        id = id.replace("fp", "");
    } else {
        id = id.replace("page", "");
    }
    if (type == "Album") { $('#hidAlbCurrPage').val(id); load_album(); }
    if (type == "News") { $('#hidCurrPage').val(id); load_more(); }    
}

function numFltr(str) {
    try {
        if (str == undefined) { str = 0; }
        str = str.replace(/[^\d\.]/g, "");
        if (str.length <= 0) { str = 0; }
        return str;
    } catch (err) {
        return 0;
    }
}

function versionNo() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}