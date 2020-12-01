<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="enterprise_wt123_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
  <title>MCP海天青-文曄減重專區</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css" />
  <script src="//code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  <link href="css/default.css?v=<%= GetVersion() %>" rel="stylesheet" />
  <link href="css/santiago.css" rel="stylesheet" />
  <script src="../../js/jquery.ui.datepicker-zh-TW.js"></script>
  <script src="js/default.js?v=<%= GetVersion() %>"></script>
  <script>
    (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date(); a = s.createElement(o),
      m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-31388948-4', 'auto');
    ga('send', 'pageview');

</script>
</head>
<body>
  <div id='wrap' class="container">
    <form id="form1" runat="server">
      <div id="myCarousel" class="carousel slide" data-ride="carousel">
        <!-- Indicators -->
        <ol class="carousel-indicators">
          <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
          <li data-target="#myCarousel" data-slide-to="1"></li>
        </ol>
        <!-- Wrapper for slides -->
        <div class="carousel-inner" role="listbox">
          <div class="item active">
            <img src="img/BN01.png?v=<%= GetVersion() %>" alt="文曄減重" />
          </div>

          <div class="item">
            <img src="img/BN02.png?v=<%= GetVersion() %>" alt="文曄減重" />
          </div>
        </div>
      </div>

      <nav class="navbar navbar-inverse">

        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse" id="myNavbar">
          <ul class="nav navbar-nav">
            <li class="active"><a id="btnNews" href="#">最新消息</a></li>
            <li><a id="btnRule" href="#">活動辦法</a></li>
            <li><a id="btnClass" href="#">活動專區</a></li>
            <li><a id="btnFood" href="#">飲食地圖</a></li>
            <li><a id="btnExercise" href="#">運動地圖</a></li>
            <li><a id="btnRank" href="#">團隊減重排行榜</a></li>
            <li><a id="btnBauo" href="#">健康報報</a></li>
            <li><a id="btnAlbum" href="#">活動相簿</a></li>
          </ul>
        </div>

      </nav>

      <div style="padding: 8px; border: dotted 0px #c0c0c0; margin-top: -22px; background:#F6FFE4;">
        <div class="row content">
          <%--<div class="col-sm-2"></div>--%>
          <div class="col-sm-9 text-left main">
            <div id="NewsZone" class="ctn">
              <%--<h3>最新消息</h3>--%>
              <img alt="最新消息" src="img/newsTitle.png" class="img-responsive" style="margin-bottom:12px;" />
              <div id="NewsLoading">
                <img alt="loading" src="../../img/basic/loader3.gif" />
                <span class="loadtxt">載入最新消息中...</span>
              </div>
              <div id="NewsPanel"></div>
              <hr />
            </div>

            <div id="EventZone" class="ctn">
              <img alt="每週目標" src="img/targetTitle.png" class="img-responsive" style="margin-bottom:12px;" />
              
              <%--<div id="EventLoading">
                <img alt="loading" src="../../img/basic/loader3.gif" />
                <span class="loadtxt">載入每週目標中...</span>
              </div>--%>
              <div id="EventPanel" >
                <ul class='list-group'>         
 
                   <li class='list-group-item'><a href="https://c1.staticflickr.com/5/4171/34329241420_773db2a9d0_o.jpg" target="_blank">第十二週(5/20 ~ 5/26)：每天呼拉圈搖20分鐘或跳繩跳20下，拍下其中一次合照即算完成任務</li>      
                   <li class='list-group-item'><a href="https://c1.staticflickr.com/5/4177/33649660523_acde15d6fd_o.jpg" target="_blank">第十一週(5/13 ~ 5/19)：5/19文曄登高活動，歡迎大家踴躍參加</li>       
                   <li class='list-group-item'><a href="https://c1.staticflickr.com/5/4191/33649669843_d81a49b0c6_o.jpg" target="_blank">第十週(5/06 ~ 5/12)：完成一次有氧運動30分鐘&一天三層樓任務</a></li>
                   <li class='list-group-item'><a href="https://c1.staticflickr.com/3/2862/34238912162_964e8ebe98_o.jpg" target="_blank">第九週(4/29 ~ 5/05)：每天三層樓&健走一萬步任務</a></li>
                   <li class='list-group-item'><a href="https://c1.staticflickr.com/3/2861/34132272736_83d9d693e5_o.jpg" target="_blank">第八週(4/22 ~ 4/28)：每天仰臥起坐20下，肌肉訓練，錄下其中一天仰臥起坐影片即算完成任務</a></li>
                   <li class='list-group-item'><a href="https://c1.staticflickr.com/3/2914/34048142576_6d7244c28d_o.jpg" target="_blank">第七週(4/15 ~ 4/21)：參加「文曄大步走 健康Let's Go」健走活動並完成任務即可獲得一點</a></li>
                   <li class='list-group-item'><a href="https://c1.staticflickr.com/3/2883/33890681015_86af26e4a5_o.jpg" target="_blank">第六週(4/08 ~ 4/14)：完成一次2000公尺快走或慢跑&健走一萬步任務</a></li>
                   <li class='list-group-item'><a href="https://c1.staticflickr.com/3/2805/33596752042_187b2895fa_o.jpg" target="_blank">第五週(3/31 ~ 4/07)：完成兩次撐體15秒&健走一萬步任務</a></li>
                   <li class='list-group-item'><a href="https://c2.staticflickr.com/4/3850/33579681806_f8698ab036_o.jpg" target="_blank">第四週(3/25 ~ 3/31)：填寫飲食紀錄表！紀錄當週至少一天的早中晚餐拍照並且記錄</a></li>
                   <li class='list-group-item'><a href="https://c2.staticflickr.com/4/3835/32628497894_e2d96e8845_o.jpg" target="_blank">第三週(3/18 ~ 3/24)：當週完成運動最少一次，拍下自己跟運動地點的照片</a></li>
                   <li class='list-group-item'><a href="https://c2.staticflickr.com/4/3938/33390857635_15920bc934_o.jpg" target="_blank">第二週(3/11 ~ 3/17)：當週完成健走一萬步任務，每天身體動一動</a></li>
                   <li class='list-group-item'><a href="https://c1.staticflickr.com/3/2452/32239032774_a4715717e0_o.jpg" target="_blank">第一週(3/01 ~ 3/10)：飲食要控制，每天均衡營養健康餐1餐(少油鹽、炸)</a></li>
                   <li class='list-group-item'><a href="https://c1.staticflickr.com/3/2491/33084679265_0e8520c72f_o.jpg" target="_blank">週週活動集點辦法</a></li>

                </ul>

              </div>
            </div>

            <div id="RuleZone" class="ctn">             
              <div id="RulePanel">
                
                <h3>報名方式：</h3>
                <%--<ul class='list-group'>                  
                  <li class='list-group-item'>1.團體組：3人/組 (視同享有個人組參賽資格，不須重複報名)。</li>
                  <li class='list-group-item'>2.個人組：採個人自由報名。</li>                  
                </ul>--%>
                <img alt="報名方式" src="img/edm01.jpg?v=<%= GetVersion() %>" class="img-responsive" style="margin-bottom:12px;" />
                <img alt="活動規則" src="img/edm02.jpg?v=<%= GetVersion() %>" class="img-responsive" style="margin-bottom:12px;" />
                <h3>活動規則：</h3>
                <ul class='list-group'>
                  <li class='list-group-item'>1.減重活動時間：3/1~5/31止；初測時間 (2/16 1000-1700)；後測時間6/6(二)09:30~17:00。</li>
                  <li class='list-group-item'>2.限在職員工。</li>
                  <li class='list-group-item'>3.凡報名同仁皆須前測及後測;BMI皆不可<18.5(考量健康安全性問題，採BMI最低標準)。</li>
                  <li class='list-group-item'>4.團體組成績採平均減重比例計之。</li>
                  <li class='list-group-item'>5.團體組不可中途退賽或更換組員。</li>
                  <li class='list-group-item'>6.個人組成績採個人減重比例原則。</li>
                  <li class='list-group-item'>
                    7.檢測方式：
                    <ul class="subUl">
                      <li>a.於2/16(四) 1000-1700至8880會議室進行前測。</li>
                      <li>b.若2/16當日不克前往，請洽詢 Winnie：02-29514508。</li>
                      <li>c.尊重個人隱私，均採個人檢測，檢測數據將由健康管理師統一保管。</li>
                    </ul>
                  </li>
                  <li class='list-group-item'>8.報名參加人員皆須加入Line@文曄減重官方帳號，以利後續活動宣傳使用。</li>
                  <li class='list-group-item'>9.活動期間，所有大小活動(快樂動、健康動)、健康講座、運動課程皆為免費參加。</li>
                  <li class='list-group-item'>10.所有獎項(達標獎、集點獎、團體獎、個人獎、特別獎)皆於活動結束後才可領取。</li>
                  <li class='list-group-item'>11.團體組未達10組，則取消團體組所有活動，皆以個人參賽為主。</li>
                </ul>

                <h3>獎勵規則：</h3>
                <img alt="獎勵規則" src="img/edm03.jpg?v=<%= GetVersion() %>" class="img-responsive" style="margin-bottom:12px;" />
               <%-- <div class="table-responsive">
                  <table class="table table-bordered">
                    <thead>
                      <tr  class="active">
                        <th>項目</th><th>名次</th><th>獎勵</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="danger">
                        <td>團體組</td><td>第一名</td><td>60,000元現金</td>
                      </tr>

                      <tr class="success">
                        <td rowspan="2">個人組</td><td>男生減重王</td><td>10,000元現金</td>
                      </tr>
                      <tr class="success">
                        <td>女生減重王</td><td>10,000元現金</td>
                      </tr>
                      <tr>
                        <td>達標獎</td><td>減重比例達3%</td><td>電影票兩張</td>
                      </tr>
                      
                      <tr class="info">
                        <td rowspan="3">抽抽樂<br /><span class="text-danger" style="font-size:13px;">(減的越多、抽獎機會越多)</span></td><td>減重比例達5%</td><td>5,000元現金</td>
                      </tr>
                      <tr class="info">
                        <td>減重比例達7%</td><td>6,000元現金</td>
                      </tr>
                      <tr class="info">
                         <td>減重比例達9%</td><td>8,000元現金</td>
                      </tr>
                      		
                      <tr class="warning">
                        <td>集點快樂動</td><td>完成每周目標即可領取一點<br />(依點數自由兌獎)</td><td style="text-align:left; padding-left:36px;">3點：超商禮券200元<br />6點：電影票2張<br />9點：小米手環一支</td>
                      </tr>
                      <tr class="active">
                        <td rowspan="2">健康動</td><td>陽明山健走</td><td>參加即贈好禮</td>
                      </tr>
                      <tr class="active">
                        <td>登高活動</td><td>參加即贈好禮</td>
                      </tr>
                    </tbody>
                  </table>
                </div>--%>
              </div>
            </div>

           <div id="RankZone" class="ctn">
            
              <div id="RankPanel" class="table-responsive">


                <table class="table">
                  <thead>
                    <tr>
                      <th>編號</th>
                      <th>隊名</th>
                      <th>減重比例</th>
                      <th>編號</th>
                      <th>隊名</th>
                      <th>減重比例</th>		
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="toRed">1</td><td class="toLeft">BJS No.1</td><td>12.67%</td>
                      <td class="toRed">24</td><td class="toLeft">我討厭五花肉</td><td>未完成後測</td>
                    </tr>
                    <tr>	
                      <td class="toRed">2</td><td class="toLeft">Digi boys</td><td>未完成後測</td>
                      <td class="toRed">25</td><td class="toLeft">李羅王</td><td>未完成後測</td>
                    </tr>
                    <tr>
                      <td class="toRed">3</td><td class="toLeft">EJB</td><td>未完成後測</td>
                      <td class="toRed">26</td><td class="toLeft">身輕如燕</td><td>未完成後測</td>
                    </tr>
                    <tr>	
                      <td class="toRed">4</td><td class="toLeft">IE_CCB_Number 1</td><td>12.29%</td>
                      <td class="toRed">27</td><td class="toLeft">享瘦隊</td><td>6.43%</td>
                    </tr>
                    <tr>
                      <td class="toRed">5</td><td class="toLeft">MO-SIS</td><td>1.33%</td>
                      <td class="toRed">28</td><td class="toLeft">防胖少女團</td><td>4.04%</td>
                    </tr>
                    <tr>
                      <td class="toRed">6</td><td class="toLeft">power</td><td>5.07%</td>
                      <td class="toRed">29</td><td class="toLeft">俏鬍子</td><td>5.03%</td>
                    </tr>
                    <tr>		
                      <td class="toRed">7</td><td class="toLeft">RPG</td><td>9.10%</td>
                      <td class="toRed">30</td><td class="toLeft">為什麼你不住南勢角</td><td>未完成後測</td>
                    </tr>
                    <tr>	
                      <td class="toRed">8</td><td class="toLeft">TPC</td><td>6.09%</td>
                      <td class="toRed">31</td><td class="toLeft">閃亮亮</td><td>未完成後測</td>                     
                    </tr>
                    <tr>
                      <td class="toRed">9</td><td class="toLeft">WT No.1</td><td>12.19%</td>
                      <td class="toRed">32</td><td class="toLeft">媚登峰掐死你</td><td>9.13%</td>
                    </tr>
                    <tr>
                      <td class="toRed">10</td><td class="toLeft">WT最速男團</td><td>4.06%</td>
                      <td class="toRed">33</td><td class="toLeft">就是想瘦</td><td>未完成後測</td>
                    </tr>
                    <tr>
                      <td class="toRed">11</td><td class="toLeft">一姑二婆</td><td>5.07%</td>
                      <td class="toRed">34</td><td class="toLeft">欽爺想瘦了</td><td>未完成後測</td>
                    </tr>
                    <tr>
                      <td class="toRed">12</td><td class="toLeft">三人行不行</td><td>未完成後測</td>
                      <td class="toRed">35</td><td class="toLeft">減幾公斤餓不死的</td><td>3.30%</td>
                    </tr>
                    <tr>
                      <td class="toRed">13</td><td class="toLeft">三比八</td><td>8.17%</td>
                      <td class="toRed">36</td><td class="toLeft">犇</td><td>4.67%</td>
                    </tr>
                    <tr>
                      <td class="toRed">14</td><td class="toLeft">三個酒鬼</td><td>4.38%</td>
                      <td class="toRed">37</td><td class="toLeft">琳溫櫻(你穩贏)</td><td>6.49%</td>
                    </tr>
                    <tr>
                      <td class="toRed">15</td><td class="toLeft">土城健康減肥幫</td><td>2.35%</td>
                      <td class="toRed">38</td><td class="toLeft">超想瘦隊</td><td>7.36%</td>
                    </tr>
                    <tr>
                      <td class="toRed">16</td><td class="toLeft">不成功便成豬</td><td>1.31%</td>
                      <td class="toRed">39</td><td class="toLeft">媽媽必勝</td><td>未完成後測</td>
                    </tr>
                    <tr>
                      <td class="toRed">17</td><td class="toLeft">中央電影票組</td><td>未完成後測</td>
                      <td class="toRed">40</td><td class="toLeft">愛瘦才會win</td><td>2.70%</td>
                    </tr>
                    <tr>
                      <td class="toRed">18</td><td class="toLeft">少林功夫隊</td><td>3.87%</td>
                      <td class="toRed">41</td><td class="toLeft">煉油廠</td><td>未完成後測</td>
                    </tr>
                    <tr>
                      <td class="toRed">19</td><td class="toLeft">文曄肥淪海</td><td>未完成後測</td>
                      <td class="toRed">42</td><td class="toLeft">煞氣的湯姆大車隊</td><td>0.00%</td>
                    </tr>
                    <tr>
                      <td class="toRed">20</td><td class="toLeft">卡比瘦隊</td><td>未完成後測</td>
                      <td class="toRed">43</td><td class="toLeft">腹愁者聯盟</td><td>未完成後測</td>
                    </tr>
                    <tr>
                      <td class="toRed">21</td><td class="toLeft">目標就3%</td><td>未完成後測</td>
                      <td class="toRed">44</td><td class="toLeft">豪昇豪昇我最瘦</td><td>未完成後測</td>
                    </tr>
                    <tr>
                      <td class="toRed">22</td><td class="toLeft">我要穿短裙</td><td>3.01%</td>
                      <td class="toRed">45</td><td class="toLeft">戰勝體脂肪</td><td>5.38%</td>
                    </tr>
                    <tr>
                      <td class="toRed">23</td><td class="toLeft">我要變瘦子!</td><td>3.19%</td>
                      <td class="toRed">46</td><td class="toLeft">爆瘦隊</td><td>4.90%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div id="ClassZone" class="ctn">               
                <div id="ClassPanel">
                    <ul class='list-group'>
                        <li class='list-group-item'>
                          <a class="btnCourse" href="#">燃脂塑身課程(5/3、5/10、5/17、5/24、5/31)</a> 
                           <span class="label label-default pull-right">報名截止</span>    
                           <%--<a href="fitOrder.aspx?aid=E1060421001" target="_blank" class="pull-right"><span class="label label-success pull-right">我要報名</span></a> --%> 
                            
                        </li>
                        <li class='list-group-item'>
                          <a id="btnBaLi" href="#">文曄大步走 健康Let's Go(4月22日)</a>
                          <span class="label label-default pull-right">報名截止</span> 
                           <%--<a href="https://goo.gl/forms/QirwKhfQmEl0HjWF2" target="_blank" class="pull-right"><span class="label label-success pull-right">我要報名</span></a>--%>

                        </li>
                        <li class='list-group-item'>
                          <a class="btnOx" href="#">三餐在外也要健康吃(4月12日)</a>                                                                 
                            <span class="label label-default pull-right">報名截止</span>                  
                            <%-- <a href="fitOrder.aspx?aid=E1060316001" target="_blank" class="pull-right"><span class="label label-success pull-right">我要報名</span></a> --%> 
                            
                         </li>

                    </ul>
                </div>
            </div>

              <div id="BauoZone"  class="ctn">
                  <div id="BauoPanel">
                      <img alt="健康報報" src="img/bauoTitle.png" class="img-responsive" style="margin-bottom:12px;" />
                      <ul class='list-group'>
                          <li class='list-group-item'>
                              <a href="http://obesity.hpa.gov.tw/TC/SportCalculate.aspx" target="_blank">1.衛生福利部國民健康署-運動消耗卡路里計算機</a>
                          </li>
                          <li class='list-group-item'>
                              <a href="http://obesity.hpa.gov.tw/TC/BmiCalculate.aspx" target="_blank">2.衛生福利部國民健康署-BMI計算機</a>
                          </li>
                          <li class='list-group-item'>
                              <a href="http://www.vt.hk/information/kcal" target="_blank">3.虛擬教練-飲食熱量計算機</a>
                          </li>
                           <li class='list-group-item'>
                              <a href="http://www.scu.edu.tw/health/Work/form1.php" target="_blank">4.食物卡路里計算</a>
                          </li>
                           <li class='list-group-item'>
                              <a href="http://www.dreye-health.com/SingularController?service=CalorieList" target="_blank">5.Dr.eye Health-運動食物卡路里計算機 </a>
                          </li>
                           <li class='list-group-item'>
                              <a href="https://www.i-fit.com.tw/" target="_blank">6.iFit愛瘦身 </a>
                          </li>
                      </ul>
                  </div>
              </div>

              <div id="FoodZone"  class="ctn">
                  <div id="FoodPanel">
                      <%--<img alt="美食地圖" src="img/foodMap.png" class="img-responsive" style="" />--%>
                      <table>
                          <tr>
                              <td id="L1">
                                  <img alt="美食地圖" src="img/l1.png" style="width:176px;height:214px;" />
                              </td>
                              <td rowspan="2">
                                   <img alt="美食地圖" src="img/c1.png" style="width:392px;height:465px;" />
                              </td>
                              <td>
                                  <img alt="美食地圖" src="img/r1.png" style="width:171px;height:214px;" />
                              </td>
                          </tr>
                          <tr>
                              <td><img alt="美食地圖" src="img/l2.png" style="width:176px;height:252px;" /></td>                              
                              <td id="R2"><img alt="美食地圖" src="img/r2.png" style="width:171px;height:252px;" /></td>
                          </tr>
                      </table>
                  </div>
              </div>

            <div id="ExerciseZone" class="ctn">
              <div id="ExercisePanel">
                  <img alt="運動地圖" src="img/hymap.jpg" class="img-responsive" style="" />
              </div>
            </div>

            <div id="AlbumZone" class="ctn">
              <%--<h3>活動相簿</h3>--%>
                <img alt="活動相簿" src="img/albumTitle.png" class="img-responsive" style="margin-bottom:12px;" />
              <p id="totalAlbum"></p>
              <div id="AlbumLoading">
                <img alt="loading" src="../../img/basic/loader3.gif" />
                <span class="loadtxt">載入活動相簿中...</span>
              </div>
              <div id="AlbumPanel"></div>
              <div class="text-center">
                <ul class="pagination pagination-sm albumPaging" style="margin: 0 auto;"></ul>
              </div>
            </div>

            <div id="MoreZone" class="ctn">
          <%--    <h3>所有消息<span id="lbTotalRec"></span></h3>--%>
              <img alt="所有消息" src="img/allNewsTitle.png" class="img-responsive" style="margin-bottom:12px;" />
              <span id="lbTotalRec"></span>
              <div id="MoreLoading">
                <img alt="loading" src="../../img/basic/loader3.gif" />
                <span class="loadtxt">載入消息中...</span>
              </div>
              <div id="MorePanel"></div>
              <div class="text-center">
                <ul class="pagination pagination-sm newsPaging" style="margin: 0 auto;"></ul>
              </div>
            </div>
          </div>
          <div class="col-sm-3 sidenav">

            <div class="well picadv">              
               <img alt="累積公斤數" src="img/acculkg.png?v=<%= GetVersion() %>" class="img-responsive img-rounded" />
            </div>

            <div class="well picadv">              
               <a href="http://depart.femh.org.tw/dietary/3OPD/BMI.htm" target="_blank"><img alt="BMI" src="img/bmi.png?v=<%= GetVersion() %>" class="img-responsive img-rounded" /></a> 
            </div>

            <div class="ll-skin-santiago">
              <div id="datepicker"></div>
            </div>

           

            <div class="well picadv">
              <a class="btnCourse" href="#"><img alt="運動課程" src="img/fitAct.png?v=<%= GetVersion() %>" class="img-responsive img-rounded" /></a>                
            </div>

            <div class="well picadv">  
              <a class="btnOx" href="#"><img alt="健康講座" src="img/fitclass.png?v=<%= GetVersion() %>" class="img-responsive img-rounded" /></a>                
               
            </div>

            <div class="well picadv">                
               <img alt="LINE" src="img/line.png?v=<%= GetVersion() %>" class="img-responsive img-rounded" />
            </div>
          </div>

          <%-- <div class="col-sm-1"></div>--%>
        </div>
        <input id="hidCurrPage" type="hidden" value="1" />
        <input id="hidMaxRow" type="hidden" value="10" />

        <input id="hidAlbCurrPage" type="hidden" value="1" />
        <input id="hidAlbPgSize" type="hidden" value="9" />
      </div>

        <div class="footer">
            


            <h5>減重活動聯絡窗口</h5>
            <h6>奧勒斯：02-29514508~9 顏小姐(Winnie) or 曹先生(Ricky)&nbsp;&nbsp;&nbsp;&nbsp;文曄公司：Teri (健康管理師) 分機 8235 Vivian 分機 8584</h6>
            
        </div>
    </form>

       <div id="myModal" class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">              
              <h4 class="modal-title"></h4>
            </div>
            <div class="modal-body">
             <div id="popCnt"></div>
            </div>
            <div class="modal-footer">             
              <button type="button" class="btn btn-danger" data-dismiss="modal">關閉</button>
            </div>
          </div>
        </div>
      </div>
  </div>
</body>
</html>
