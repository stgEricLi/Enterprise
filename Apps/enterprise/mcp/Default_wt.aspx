<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default_wt.aspx.cs" Inherits="enterprise_mcp_Default_wt" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
  <title>MCP海天青-文曄科技專區</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
  <link href="css/default_wt.css?v=1.01" rel="stylesheet" />
  <script src="js/default_wt.js?v=1.13"></script>
</head>
<body>
  <div id='wrap' class="container">
    <form id="form1" runat="server">
      <%--  <div id='header'></div>--%>
      <%--<div id='companylogo'></div>--%>
      <img src="img/wtLogo.jpg" class="img-responsive" />
      <nav role="navigation" class="navbar navbar-default">
        <div class="navbar-header">
          <button type="button" data-target="#navbarCollapse" data-toggle="collapse" class="navbar-toggle">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a href="#" class="navbar-brand"></a>
        </div>

        <div id="navbarCollapse" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a id="btnSuport" href="#">補助說明</a></li>
            <li><a id="btnTeam" href="#">服務團隊</a></li>
            <li><a id="btnItinerary" href="#">行程推薦</a></li>
            <li><a id="btnReg" href="#">線上報名</a></li>
            <li><a id="btnPicture" href="#">相片專區</a></li>
          </ul>
        </div>
      </nav>
      
      <div style="padding:8px; border:dotted 0px #c0c0c0; margin-top:-22px; background:#fff;">

        <div id="support" class="ctn">
          <table class="table table-striped table-hover">
            <tr>
              <th style="width:166px;" class="title">適用對象</th>
              <th class="title" style="text-align:left;">文曄科技在職員工</th>
            </tr>
           
            <tr>
              <th class="title">補助辦法</th>
              <td>
                <ol>
                  <li>每位同仁最多可攜伴3人(不含未足6歲不佔床不占餐兒童)。</li>
                  <li>員工本人全額補助（每人限補助一次）。</li>
                  <li>員工攜伴第1人免費。</li>
                  <li>員工攜伴第2人需自費新台幣 $5,000元。</li>
                  <li>員工攜伴第3人需自費新台幣 $5,000元。</li>
                  <li>員工攜伴者，不可為公司同仁(夫妻不在此限制內)。</li>
                  <li>3歲以下兒童定義 (2014年1月以後出生之小朋友)，每人酌收500元(含保險/車資等行政代辦費用)。</li>
                  <li>4-6歲不佔床不佔餐 (2011年1月~2013年12月)，每人酌收1000元(含活動/保險/車資等行政代辦費用)。</li>
                  <li>4-6歲小朋友身高如有超過收費規定，衍伸火車票或是飯店住宿早餐等其他費用，則依當日實際支付之費用另收。</li>
                </ol>             
              </td>
            </tr>
            <tr>
              <th class="title">其他注意事項</th>
              <td>
                <ol>
                  <li style="color: red">每梯需滿30人才可開梯。</li>
                  <li>因多日遊須事前預留飯店房型，如不克參加，須於活動前35天來電告知。</li>
                  <li>飯店預留房型-34人(2人房-11間；4人房-3間)；70人(2人房23間；4人房6間)</li>
                  <li>若於35天內臨時有事不克參加，可詢問公司其他同仁是否參加，可將名額轉給其他同仁報名參加，恕不接受取消行程，否則視同棄權且須自行負擔全額旅費。</li>
                  <li>活動報名成功後，會於活動出發前三日統一寄發行前通知單，在煩請同仁特別注意信箱資訊及當日報到時間和集合地點，並煩請告知同行親友。</li>
                  <li>請於行前通知單規定時間內準時集合，如遲到超過規定集合時間5分鐘以上，則視同放棄此活動，則無法退任何費用，並喪失公司補助權益，且該員工需付全額旅費費用，由當月薪資扣除。</li>
                  <li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li>
                  <li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將於現場補足實際產生之費用。</li>
                  <li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液.等。本單位不提供任何口服藥物。</li>
                  <li>遊覽車上請勿攜帶寵物及危險物品參與行程，感謝您的配合。</li>
                  <li>以上行程載明之車行時間僅供參考，如因路況或假日遊客眾多行程順序將視情況做更動調整。</li>
                  <li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li>
                  <li>旅遊活動諮詢專線：02-29527535#32徐小姐  </li>
                </ol>
              </td>
            </tr>
          </table>
        </div>

        <div id="team" class="ctn">
          <table class="table table-striped table-hover">
            <tr>
              <th style="width:266px;" class="title">服務專員</th>
              <td>
                <ul>
                  <li><span class="name">徐嘉函(Apple)</span>02-29527535#32&nbsp;&nbsp;apple@mcpgo.com</li>
                  <li><span class="name">顏維伶(Winnie)</span>02-29527535#40&nbsp;&nbsp;winnie@mcpgo.com</li>
                  <li><span class="name">曹閔宣(Ricky)</span>02-29527535#38&nbsp;&nbsp;Ricky@mcpgo.com</li>
                </ul>                
              </td>
            </tr>
            <tr>
              <th class="title">服務時間</th>
              <td>
                <ul>
                  <li>星期一~星期五 (0900-2000)</li>
                  <li style="color:#5C8A00;">星期六(0900-1800)</li>
                </ul>                
              </td>
            </tr>
            <tr>
              <th class="title">服務項目</th>
              <td>
                <ol>
                  <li>旅遊活動諮詢、行程規劃安排。</li>
                  <li>寒暑假冬夏令營活動推薦。</li>
                  <li>兒童冬夏令營 <a href="http://www.mcpsky.org" target="_blank">http://www.mcpsky.org</a></li>
                </ol>
              </td>
            </tr>
          </table>
        </div>

        <div id="itinerary" class="ctn">
      
	 <%--<h3 class="text-center text-primary">文曄龍門露營活動</h3>
          <table class='table table-striped table-hover acttb'>
            <tr>
              <th>活動名稱</th>
              <th>活動日期</th>
              <th>報名截止日</th>
              <th>可報名額</th>
              <th>報名限制</th>
              <th>線上報名</th>
            </tr>
            <tr>
              <td class="text-primary" style="text-align: left;"><a href="activities/E1060703001.html" target="_blank" title="查看詳細資訊"><b>2017龍門露營活動第一梯次</b></a></td>
              <td class="text-success">2017/08/12-2017/08/13</td>
              <td class="text-danger">2017/07/20</td>
              <td class="text-warning"><span id="E1060703001">尚有名額0</span></td>
              <td class="text-danger">限文曄員工</td>
              <td style="color: #c0c0c0;">報名已截止</td>

            </tr>
            <tr>
              <td class="text-primary" style="text-align: left;"><a href="activities/E1060703001.html" target="_blank" title="查看詳細資訊"><b>2017龍門露營活動第二梯次</b></a></td>
              <td class="text-success">2017/08/19-2017/08/20</td>
              <td class="text-danger">2017/07/20</td>
              <td class="text-warning"><span id="E1060703002">尚有名額0</span></td>
              <td class="text-danger">限文曄員工</td>
              <td style="color: #c0c0c0;">報名已截止</td>
            </tr>
          </table>--%>

          

          <h3 class="text-center text-primary">文曄二日遊活動</h3>
          <table class='table table-striped table-hover acttb'>
           <tr>
              <th>活動名稱</th>
              <th>活動日期</th>
              <th>報名截止日</th>
              <th>可報名額</th>             
              <th>線上報名</th>
            </tr>

            <tr>
              <td class="text-primary" style="text-align: left;"><a href="activities/E1060718004.html" target="_blank" title="查看詳細資訊"><b>【台北】夏日狂想曲~福隆海灘大奔放</b></a></td>
              <td class="text-success">2017.09.09~09.10</td>
              <td class="text-danger">2017/08/07</td>
              <td class="text-warning"><span id="E1060718004">尚有名額70</span></td>             
              <td style="color: #c0c0c0;">尚未開放</td>
            </tr>

            <tr>
              <td class="text-primary" style="text-align: left;"><a href="activities/E1060718007.html" target="_blank" title="查看詳細資訊"><b>【苗栗】漫遊新風情~尚順玩樂新體驗（第一梯次）</b></a></td>
              <td class="text-success">2017.09.09~09.10</td>
              <td class="text-danger">2017/08/07</td>
              <td class="text-warning"><span id="E1060718007">尚有名額70</span></td>             
              <td style="color: #c0c0c0;">尚未開放</td>
            </tr>

            <tr>
              <td class="text-primary" style="text-align: left;"><a href="activities/E1060718007.html" target="_blank" title="查看詳細資訊"><b>【苗栗】漫遊新風情~尚順玩樂新體驗（第二梯次）</b></a></td>
              <td class="text-success">2017.12.02~12.03</td>
              <td class="text-danger">2017/10/20</td>
              <td class="text-warning"><span id="E1060718008">尚有名額70</span></td>             
              <td style="color: #c0c0c0;">尚未開放</td>
            </tr>
            
            <tr>
              <td class="text-primary" style="text-align: left;"><a href="activities/E1060718005.html" target="_blank" title="查看詳細資訊"><b>【花蓮】鬼斧太魯閣~花蓮慢活享樂之旅（第一梯次）</b></a></td>
              <td class="text-success">2017.10.21~10.22</td>
              <td class="text-danger">2017/09/08</td>
              <td class="text-warning"><span id="E1060718005">尚有名額34</span></td>             
              <td style="color: #c0c0c0;">尚未開放</td>
            </tr>

            <tr>
              <td class="text-primary" style="text-align: left;"><a href="activities/E1060718005.html" target="_blank" title="查看詳細資訊"><b>【花蓮】鬼斧太魯閣~花蓮慢活享樂之旅（第二梯次）</b></a></td>
              <td class="text-success">2017.11.04~11.05</td>
              <td class="text-danger">2017/09/22</td>
              <td class="text-warning"><span id="E1060718006">尚有名額34</span></td>             
              <td style="color: #c0c0c0;">尚未開放</td>
            </tr>

            <tr>
              <td class="text-primary" style="text-align: left;"><a href="activities/E1060718001.html" target="_blank" title="查看詳細資訊"><b>【宜蘭】瘋玩泰國蝦~樂活五星農場初體驗</b></a></td>
              <td class="text-success">2017.11.18~11.19</td>
              <td class="text-danger">2017/10/06</td>
              <td class="text-warning"><span id="E1060718001">尚有名額70</span></td>             
              <td style="color: #c0c0c0;">尚未開放</td>
            </tr>

            <tr>
              <td class="text-primary" style="text-align: left;"><a href="activities/E1060718009.html" target="_blank" title="查看詳細資訊"><b>【台中】麗寶新樂園、特色觀光工廠玩樂趣（第一梯次）</b></a></td>
              <td class="text-success">2017.11.18~11.19</td>
              <td class="text-danger">2017/10/06</td>
              <td class="text-warning"><span id="E1060718009">尚有名額34</span></td>             
              <td style="color: #c0c0c0;">尚未開放</td>
            </tr>

            <tr>
              <td class="text-primary" style="text-align: left;"><a href="activities/E1060718009.html" target="_blank" title="查看詳細資訊"><b>【台中】麗寶新樂園、特色觀光工廠玩樂趣（第二梯次）</b></a></td>
              <td class="text-success">2017.11.25~11.26</td>
              <td class="text-danger">2017/10/13</td>
              <td class="text-warning"><span id="E1060718010">尚有名額34</span></td>             
              <td style="color: #c0c0c0;">尚未開放</td>
            </tr>

            <tr>
              <td class="text-primary" style="text-align: left;"><a href="activities/E1060718002.html" target="_blank" title="查看詳細資訊"><b>【新竹】竹風賞煙波~手做樂活初體驗（第一梯次）</b></a></td>
              <td class="text-success">2017.11.25~11.26</td>
              <td class="text-danger">2017/08/18</td>
              <td class="text-warning"><span id="E1060718002">尚有名額34</span></td>             
              <td style="color:#c0c0c0;"><a href="order_days.aspx?aid=E1060718002" target="_blank" title="線上報名">我要報名</a></td>
            </tr>

            <tr>
              <td class="text-primary" style="text-align: left;"><a href="activities/E1060718002.html" target="_blank" title="查看詳細資訊"><b>【新竹】竹風賞煙波~手做樂活初體驗（第二梯次）</b></a></td>
              <td class="text-success">2017.12.09~12.10</td>
              <td class="text-danger">2017/08/18</td>
              <td class="text-warning"><span id="E1060718003">尚有名額70</span></td>             
              <td style="color: #c0c0c0;">尚未開放</td>
            </tr>
            
          </table>

        
          <asp:Literal ID="Literal1" runat="server"></asp:Literal>        
          <asp:Literal ID="Literal2" runat="server"></asp:Literal>

        </div>

        <div id="register" class="ctn">
          <table class="table table-striped table-hover">
            <tr>
              <th style="width:120px;" class="title">報名方式</th>
              <td>
                <ul>
                  <li>線上報名：請直接於MCP海天青網站企業專區，輸入帳號及密碼至文曄科技企業專屬網站，至網站上直接做線上報名
                            <span style='color: #c0c0c0;'>（請盡量使用安全性較佳的 Chrome 瀏覽器來進行報名）</span>。
                            <input id='btnGoReg' type="button" class="btn btn-default" value="前往線上報名" />
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <th class="title">付款方式</th>
              <td>
                <p>
                  線上報名後，除公司補助名額外，如有額外人員參加，待該梯活動確認成行後，需額外將費用匯至本公司承辦之旅行社。
                </p>
                <p>匯款方式為：銀行匯款/ATM轉帳/現金付款</p>
                <p>匯款帳號如下：</p>

                <ul style='color: Blue;'>
                  <li>銀行：新光銀行-城內分行(代號103)</li>
                  <li>戶名：海天青旅行社股份有限公司 </li>
                  <li>帳號：0116-10-001228-4</li>
                </ul>
              </td>
            </tr>            
          </table>
        </div>

        <div id="picture" class="ctn" style="text-align:center;">
            <div class="row">
                 <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/albums/721576779251334763">
                            <img src=" https://c1.staticflickr.com/1/446/31700888466_a0f618a0d8_n.jpg" alt="遺落的原住民部落、採茶、採棗、泡湯趣" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">遺落的原住民部落、採茶、採棗、泡湯趣</div>
                </div>
                 <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/albums/72157676226975492">
                            <img src="https://c1.staticflickr.com/1/664/31591464982_ca359c5d7c_n.jpg" alt="溪頭森呼吸~忘憂好風情之旅B" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">溪頭森呼吸~忘憂好風情之旅B</div>
                </div>
                 <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/albums/72157673563379633">
                            <img src="https://c2.staticflickr.com/6/5666/30644785813_073df1baf1_n.jpg" alt="2016.11.26-27 三峽在地體驗~大板根森呼吸之旅" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2016.11.26 三峽在地體驗~大板根之旅</div>
                </div>
            </div>

            <div class="row">              
                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157673563429273">
                            <img src="https://c2.staticflickr.com/6/5707/31452940975_4dbe8645a5_n.jpg" alt="2016.12.03-04 九族文化村~桃米社區生態體驗之旅A" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2016.12.03 九族文化村~桃米社區之旅A</div>
                </div>


                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157675770295622">
                            <img src="https://c2.staticflickr.com/6/5671/30644891883_965edd5f16_n.jpg" alt="2016.12.03-04 泰安溫泉鄉~苗栗在地產業體驗之旅" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2016.12.03 泰安溫泉鄉~苗栗之旅</div>
                </div>

                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/albums/72157676683684465">
                            <img src="https://c2.staticflickr.com/6/5675/31042053355_06d3fe4408_n.jpg" alt="2016.11.12-13六福村~馬武督綠光小學探索森林之旅" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2016.11.12馬武督綠光小學探索之旅</div>
                </div>
            </div>

            <div class="row">
                
                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/albums/72157675566911826">
                            <img src="https://c2.staticflickr.com/6/5672/30549267295_f3635273dc_n.jpg" alt="2016.10.22-23漫步中台灣、搭蚵車、賞穀堡、採果趣之旅" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2016.10.22中台灣、搭蚵車、賞穀堡、採果趣</div>
                </div>


                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/albums/72157671805038814">
                            <img src="https://c2.staticflickr.com/6/5347/30382557905_bf089692d5_c.jpg" alt="2016.10.15-16溪頭森呼吸~忘憂好風情之旅" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2016.10.15-16溪頭森呼吸-忘憂好風情</div>
                </div>

                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/albums/72157670492861796">
                            <img src="https://c2.staticflickr.com/8/7353/28072569025_2b1638a844_n.jpg" alt="2016賞鯨+傳藝一日遊" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2016.06.25賞鯨+傳藝一日遊</div>
                </div>
            </div>

            <div class="row">                                
                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/albums/72157669475929061">
                            <img src="https://c2.staticflickr.com/8/7408/27969775352_5e66c81d1d_n.jpg" alt="宜蘭牽罟活動" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2016.06.18宜蘭牽罟活動</div>
                </div>
                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157666529299873">
                            <img src="https://c2.staticflickr.com/8/7302/26740675773_450a4fa07a_n.jpg" alt="中信兄弟棒球日" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2016.05.28 中信兄弟棒球日</div>
                </div>

                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/albums/72157668154669892">
                            <img src="https://c2.staticflickr.com/8/7273/27050195975_8e1cd6d4bd_n.jpg" alt="苗栗一日遊" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2016.05.14苗栗一日遊</div>
                </div>
            </div>

            <div class="row">             
                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/albums/72157667855177095">
                            <img src="https://c2.staticflickr.com/2/1462/26163439203_8d54d2f852_n.jpg" alt="母親節旅遊" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2016.04.30母親節旅遊</div>
                </div>    
                 <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/albums/72157667555701015">
                            <img src="https://c2.staticflickr.com/2/1545/26024547604_ffd8c8160d_n.jpg" alt="廣興農場+藏酒酒莊" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2016.04.23廣興農場+藏酒酒莊</div>
                </div>      
                
                  <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/albums/72157668993005126">
                            <img src="https://c2.staticflickr.com/8/7686/27072313070_532d896e2e_n.jpg" alt="皇后鎮森林露營活動" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2015.11.14-15 皇后鎮森林露營活動</div>
                </div>     
            </div>

            <div class="row">
                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157668704541761">
                            <img src="https://c2.staticflickr.com/8/7602/27347314925_75389cf477_n.jpg" alt="皇后鎮森林露營活動" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2015.10.24-10.25 皇后鎮森林露營活動</div>
                </div>

                 <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157653007058894">
                            <img src="https://farm1.staticflickr.com/288/19156546888_6c3ac3a02a_n.jpg" alt="文曄宜蘭安農溪泛" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2015.06.27 文曄宜蘭安農溪泛</div>
                </div>

                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157652666311004">
                            <img src="https://farm1.staticflickr.com/369/18922685798_11987a4278_n.jpg" alt="文曄苗栗華陶窯" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2015.06.13 文曄苗栗華陶窯</div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157654933652196">
                            <img src="https://farm1.staticflickr.com/367/18922603088_6c75d5bdf1_n.jpg" alt="苗栗飛牛牧場" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2015.06.06 苗栗飛牛牧場</div>
                </div>

                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157654586506070">
                            <img src="https://farm1.staticflickr.com/455/18489285353_b0a490f335_n.jpg" alt="文曄宜蘭賞鯨" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2015.05.13 文曄宜蘭賞鯨</div>
                </div>

                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157650820782123">
                            <img src="https://farm9.staticflickr.com/8764/17703673289_13f7ef3179_n.jpg" alt="綠色博覽會" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2015.05.16 綠色博覽會</div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157653129674822">
                            <img src="https://farm9.staticflickr.com/8806/17269349053_580654aca6_n.jpg" alt="南園人文客棧" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2015.05.19 南園人文客棧</div>
                </div>

                  <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157651933354129/">
                            <img src="https://farm9.staticflickr.com/8790/17156861277_bc308dd0a4_n.jpg" alt="桃源仙谷賞螢一日遊" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2015.04.25 桃源仙谷賞螢一日遊</div>
                </div>

                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157652066975231/">
                            <img src="https://farm8.staticflickr.com/7699/16587617314_0d7fe2938d_z.jpg" alt="2015.04.18 宜蘭冬山河自行車採桑葚" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2015.04.18 宜蘭冬山河自行車採桑葚</div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157649355395561/">
                            <img src="https://farm9.staticflickr.com/8271/15802013256_96f40763de_n.jpg" alt="東豐鐵馬道一日遊" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2014.11.15 東豐鐵馬道一日遊</div>
                </div>

                 <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157648861208051/">
                            <img src="https://farm4.staticflickr.com/3953/14959972393_64d8d7629f_n.jpg" alt="宜蘭大閘蟹一日遊" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2014.10.19 宜蘭大閘蟹一日遊</div>
                </div>

                 <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157648874049795/">
                            <img src="https://farm6.staticflickr.com/5605/15393866598_f9eeb9e55e_n.jpg" alt="宜蘭大閘蟹一日遊" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2014.10.18 宜蘭大閘蟹一日遊</div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157648461568218/">
                            <img src="https://farm6.staticflickr.com/5600/15580459662_35d2fdbb34_n.jpg" alt="宜蘭大閘蟹一日遊" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2014.10.11 宜蘭大閘蟹一日遊</div>
                </div>

                 <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157647786706139/">
                            <img src="https://farm4.staticflickr.com/3883/15396531251_3cf3be153f_n.jpg" alt="九斗村-鄉村體驗之旅" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2014.09.27 九斗村-鄉村體驗之旅</div>
                </div>

                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157647210502667/">
                            <img src="https://farm6.staticflickr.com/5585/15253126492_fe33486747_m.jpg" alt="新竹溯溪-內灣老街行" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2014.09.13 新竹溯溪-內灣老街行</div>
                </div>
            </div>

            <div class="row">          
                <div class="col-md-4">
                    <div class="photo">
                        <a target="_blank" href="https://www.flickr.com/photos/119450965@N07/sets/72157646688878640/">
                            <img src="https://farm6.staticflickr.com/5563/14916517389_9cfc8bfd2d_m.jpg" alt="宜蘭三星採蔥-內城鐵牛車之旅" class="img-rounded img-thumbnail" />
                        </a>
                    </div>
                    <div class="descpt">2014.08.23 宜蘭三星採蔥-內城鐵牛車之旅</div>
                </div>

                 <div class="col-md-4">
                   
                </div>
                <div class="col-md-4">
                   
                </div>
            </div>

          
        </div>
        
      </div>

      <div id="footer">
     <h5>MCP 奧勒斯創意行銷股份有限公司</h5> 
     <h6>地址：新北市板橋區四川路一段23號10樓之1&nbsp;｜&nbsp;服務專線：（02）2951-4508、（02）2951-4509&nbsp;｜&nbsp;統一編號：29171930</h6>
   </div>
    </form>
  </div>
  
</body>
</html>
