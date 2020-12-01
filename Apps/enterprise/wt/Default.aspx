﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="enterprise_wt_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>MCP海天青-文曄科技專區</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
    <link href="css/default.css?v=<%= GetVersion() %>" rel="stylesheet" />
    <script src="js/default.js?v=<%= GetVersion() %>"></script>
    <style>
        .sp {
            margin-left: 12px;
        }

        .start {
            color: blue;
        }

        .end {
            color: red;
        }

        .room {
            color: brown;
        }

        .list-group-item:hover {
            background: #fff;
        }
    </style>
</head>
<body id="myPage" data-spy="scroll" data-target=".navbar" data-offset="60">
    <form id="form1" runat="server"></form>
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand logo-title" href="#myPage"></a>
            </div>
            <div class="collapse navbar-collapse" id="myNavbar">
                <ul class="nav navbar-nav navbar-right">
                    <%--<i class="fas fa-bullhorn"></i
            >--%>
                    <li><a href="#about">補助說明</a></li>
                    <li><a href="#registration">報名方式</a></li>
                    <%--
            <li><a href="#one">一日遊</a></li>
            <li><a href="#two">二日遊</a></li>
                    --%>
                    <li><a href="#hotels">推薦飯店</a></li>
                    <li><a href="#portfolio">活動相簿</a></li>
                    <li><a href="#contact">服務團隊</a></li>
                    <li><a href="my_hotel_order.aspx" target="_blank">我的報名</a></li>
                    <li><a href="hotel_checkup.aspx" target="_blank">房數查詢</a></li>
                     <li><a href="hotel_weekday.aspx" target="_blank">平日訂房</a></li>
                    <%--
            <li><a href="my_waiting_order.aspx" target="_blank">我的候補</a></li>
                    --%>
                    <li><a href="payment.aspx" target="_blank">付款登錄</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="jumbotron text-center">
        <%--
      <h1>文曄科技專區</h1>
      <p>MCP 海天青企業活動專區</p>
        --%>
    </div>

    <!-- Container (補助說明 Section) -->
    <div id="about" class="container-fluid">
        <div class="row">
            <div class="col-sm-8">
                <%--
          <h2>一日遊補助說明</h2>

          <h5>適用對象</h5>
          <ol>
            <li>文曄員工本人全額補助(每人限補助一次旅遊)。</li>
            <li>員工家人/親戚/朋友半價補助(每位員工最多補助3位)。</li>
          </ol>

          <h5>補助辦法</h5>
          <ol>
            <li>每位同仁最多攜伴3人〈不含3歲以下孩童〉。</li>
            <li>員工本人全額補助〈每人限參加及補助一次〉。</li>
            <li>員工攜伴第1人免費。</li>
            <li>員工攜伴第2人，需自費新台幣$1000元。</li>
            <li>員工攜伴第3人，需全額自費$2300元。</li>
            <li>員工攜伴者，不可為公司同仁(夫妻不在此限制內，但每人限參加一次活動) 。</li>
            <li>0-3歲兒童定義<span style="color: red;">〈2016年1月以後出生〉</span>，每人酌收200元〈含保險/車資等行政代辦費用〉。</li>
          </ol>
          <hr />
          <h2>二日遊補助說明</h2>

          <h5>適用對象</h5>
          <ol>
            <li>文曄員工本人全額補助(每人限補助一次旅遊)。</li>
            <li>員工家人/親戚/朋友半價補助(每位員工最多補助3位)。</li>
          </ol>

          <h5>補助辦法</h5>
          <ol>
            <li>每位同仁最多攜伴3人〈不含6歲以下孩童〉。</li>
            <li>員工本人全額補助〈每人限參加及補助一次〉。</li>
            <li>員工攜伴第1人免費。</li>
            <li>員工攜伴第2人，需自費新台幣$5000元。</li>
            <li>員工攜伴第3人，需自費新台幣$5000元。</li>
            <li>員工攜伴者，不可為公司同仁(夫妻不在此限制內，但每人限參加一次活動) 。</li>
            <li>4-6歲兒童定義<span style="color: red;">〈2013年01月~2015年12月間〉</span>，每人酌收1000元〈含保險/車資/活動門票費用等行政代辦費用〉。</li>
            <li>0-3歲幼童定義<span style="color: red;">〈2016年01月以後出生〉</span>，每人酌收500元〈含保險/車資等行政代辦費用〉。</li>
          </ol>
                --%>
                <h2>補助說明</h2>

                <h5>適用對象：</h5>
                <ul style="font-size: 18px;">
                    <li>文曄員工本人全額補助一間雙人房費用(每位員工限補助一次)。</li>
                    <li>員工家人/親戚/朋友部分補助</li>
                </ul>
                <h5>訂房補助說明：</h5>
                <ol style="font-size: 18px;">
                    <li>員工本人及攜伴1人全額補助一間雙人房費用<span style="color: red;">〈每人限參加及補助一次</span>〉。</li>
                    <li>員工如攜伴2人，房型需調整為3人房，需自費<span style="color: red;">新台幣$1,000元</span>。</li>
                    <li>員工如攜伴3人，房型需調整為4人房，需自費<span style="color: red;">新台幣$2,500元</span>。</li>
                    <li>三歲以下小孩不佔床，不列入房型人數。</li>
                    <li>四~六歲不佔床，雖不列入房型人數，但若現場身高超過飯店規定需另補加床或房型差額及早餐費用則依各飯店規定直接向同仁收取。</li>
                    <li style="color: red;">入住人數如低於房型人數，需提前告知並經福委會同意才可訂定該房型，若未經同意且無事先告知導致不必要的支出浪費，將會收取額外的房型費用並禁止該年度所有的福利活動。</li>
                    <li>此次飯店行程僅提供飯店住宿搭配一泊二食，不另提供相關行程門票、交通補助等部分。</li>
                    <li>所有飯店房型皆為一泊二食，如改為一泊一食者，即視為自行放棄權利，無法予以退款。</li>
                    <li>各飯店停車場數量及停放規定，依各飯店規定為主。</li>
                    <li>此次飯店行程不適用政府推出之安心旅遊方案。</li>
                    <li>飯店旅遊補助僅提供入住當天在職員工享有。</li>
                </ol>
            </div>
            <div class="col-sm-4">
                <span class="logo"><i class="fas fa-info-circle"></i></span>
            </div>
        </div>
    </div>

    <div class="container-fluid bg-grey">
        <div class="row">
            <%--
        <div class="col-sm-1">
          <span class="glyphicon glyphicon-alert logo slideanim"></span>
        </div>
            --%>
            <div class="col-sm-12">
                <%--
          <h2>一日遊注意事項</h2>
          <ol>
            <li>每梯次旅遊，<span style="color: red;">每車人數需滿30人才可開梯</span>，如未達30人則取消該車活動。</li>
            <li>報名成功後如不克前往，最晚需於出發前<span style="color: red;">5日</span>下午5:00前，自行登入取消，未提前取消者則無法退費，並喪失公司補助權益。 (公司仍需支付此筆費用予旅行社) 。</li>
            <li>已報名旅遊行程之參加者<span style="color: red;">不可無故不到，亦不可員工本人未到僅眷屬自行參與，未到者即視同棄權需自行負擔全額旅費，且由當月薪資扣除</span>。</li>
            <li>請勿冒名頂替他人參與活動，違者須自行負擔全額旅費，且由當月薪資扣除。</li>
            <li>每位參加同仁及親友皆有投保旅遊責任險 (無法提供當日臨時加保服務)。</li>
            <li>報到當日請務必攜帶有<span style="color: red;">照片</span>之「身份證件」(如:身分證、駕照、健保卡)。查驗不符者將無法參與活動，敬請同仁配合。</li>
            <li>請於行前通知單規定時間內準時集合，如遲到<span style="color: red;">超過規定集合時間五分鐘以上</span>，則視同放棄此活動，則無法退任何費用，並喪失公司補助權益，且該員工需付全額旅費費用，由當月薪資扣除。</li>
            <li>公司員工旅遊需團體同進同出，故皆不開放同仁自行開車前往及提早離開，請同仁們多加留意，違者須自行負擔全額旅費，且由當月薪資扣除。</li>
            <li>活動報名成功後，會於活動出發前<span style="color: red;">三日</span>統一寄發行前通知單，在煩請同仁特別注意信箱資訊及當日報到時間和集合地點，並煩請告知同行親友。</li>
            <li>如活動當天臨時生病或發燒，煩請先聯絡當日主辦人員，並提供當日就醫證明給福委會，則免扣除員工薪資。</li>
            <li>補助期限至2019年12月，依網站公告的最後一次旅遊活動行程為止。</li>
            <li>如於補助期限內未參加任何活動，則視同放棄權利，不另轉發現金。</li>
            <li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li>
            <li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將於現場補足實際產生之費用。</li>
            <li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液.等。本單位不提供任何口服藥物。</li>
            <li>遊覽車上請勿攜帶寵物及危險物品參與行程，感謝您的配合。</li>
            <li>以上行程載明之車行時間僅供參考，如因路況或假日遊客眾多行程順序將視情況做更動調整。</li>
            <li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li>
            <li>旅遊活動諮詢專線：02-29527535 #32 徐小姐 。</li>
          </ol>
          <hr />
          <h2>二日遊注意事項</h2>
          <ol>
            <li>每梯次旅遊，<span style="color: red;">每車人數需滿 30 人才可開梯</span>，如未達 30 人則取消該車活動。</li>
            <li>報名成功後如不克前往，最晚需於出發前<span style="color: red;">35日</span>下午5:00前，自行登入取消，未提前取消者則無法退費，並喪失公司補助權益。 (公司仍需支付此筆費用予旅行社) 。</li>
            <li>已報名旅遊行程之參加者<span style="color: red;">不可無故不到，亦不可員工本人未到僅眷屬自行參與，未到者即視同棄權需自行負擔全額旅費，且由當月薪資扣除</span>。</li>
            <li>請勿冒名頂替他人參與活動，違者須自行負擔全額旅費，且由當月薪資扣除。</li>
            <li>每位參加同仁及親友皆有投保旅遊責任險 (無法提供當日臨時加保服務)。</li>
            <li>報到當日請務必攜帶有<span style="color: red;">照片</span>之「身份證件」(如:身分證、駕照、健保卡)。查驗不符者將無法參與活動，敬請同仁配合。</li>
            <li>請於行前通知單規定時間內準時集合，如遲到<span style="color: red;">超過規定集合時間五分鐘以上</span>，則視同放棄此活動，無法退回任何費用，並喪失公司補助權益，且該員工需付全額旅費費用，由當月薪資扣除。</li>
            <li>公司員工旅遊需團體同進同出，故皆不開放同仁<span style="color: red;">自行開車前往及提早離開</span>，請同仁們多加留意，違者須自行負擔全額旅費，且由當月薪資扣除。</li>
            <li>活動報名成功後，會於活動出發前<span style="color: red;">三日</span>統一寄發行前通知單，在煩請同仁特別注意信箱資訊及當日報到時間和集合地點，並煩請告知同行親友。</li>
            <li>如活動當天臨時生病或發燒，煩請先聯絡當日主辦人員，並提供當日就醫證明給福委會，則免扣除員工薪資。</li>
            <li>補助期限至2019年12月底，依網站公告的最後一次旅遊活動行程為止。</li>
            <li>如於補助期限內未參加任何活動，則視同放棄權利，不另轉發現金。</li>
            <li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li>
            <li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將於現場補足實際產生之費用。</li>
            <li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液.等。本單位不提供任何口服藥物。</li>
            <li>遊覽車上請勿攜帶寵物及危險物品參與行程，感謝您的配合。</li>
            <li>以上行程載明之車行時間僅供參考，如因路況或假日遊客眾多行程順序將視情況做更動調整。</li>
            <li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li>
            <li>旅遊活動諮詢專線：02-29527535 #32 徐小姐。</li>
          </ol>
                --%>
                <h2>訂房相關注意事項：</h2>
                <ol style="font-size: 18px;">
                    <li>文曄員工本人需親自入住。</li>
                    <li>登記成功後如不克前往，最晚於入住前15日下午5:00前致電取消，未提前取消者無法退費，並喪失此補助權益。</li>
                    <li>已登記入住行程不可無故不到，未到者即視同棄權，需自行負擔全額房價，且由當月薪資扣除。</li>
                    <li>入住當日請務必攜帶【身分證及員工識別證】辦理入住。</li>
                    <li>訂房成功後，系統會寄發【入住登記確認單】，再煩請同仁特別注意信箱資訊。</li>
                    <li>訂房日期如該飯店已顯示無房間，可改選其他飯店或等待候補。</li>
                    <li>選擇候補同仁如有房間，旅行社會再依照候補順序依序通知。</li>
                    <li>如入住當天臨時生病或發燒，煩請先聯絡旅行社人員，並提供當日就醫證明給福委會，則免扣除員工薪資。</li>
                    <li>補助期限至2020年12月底。</li>
                    <li>如於補助期限內未登記入住任何飯店，則視同放棄權利，不另轉發現金。</li>
                    <li>凡個人患有政府規定之法定傳染病或疑似症狀，請務必主動告知，違反規定者應自行負責。</li>
                    <li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將依照飯店規定補足實際產生之費用。</li>
                    <li>若遇天候不佳或不可抗拒之因素，請主動聯繫旅行社人員，則免扣除員工薪資。</li>
                    <li>旅遊活動諮詢專線：02-29527535 #38 曹先生，#14 張先生 #36 周小姐。</li>
                </ol>
            </div>
        </div>
    </div>

    <!-- registration (報名方式 Section) -->
    <div id="registration" class="container-fluid">
        <div class="row">
            <div class="col-sm-9">
                <h2>報名方式</h2>

                <h5>線上報名</h5>
                <p style="font-size: 18px;">
                    請直接於MCP海天青網站企業專區，輸入帳號及密碼至文曄科技企業專屬網站，至網站上直接做線上報名。
            <br />
                    <span style="color: #c0c0c0; font-size: 14px;">（建議使用 Chrome 瀏覽器來進行報名）</span>
                </p>

                <h5>付款方式</h5>
                <%--
          <p>線上報名後，除公司補助名額外，如有額外人員參加，請您於收到信件後3天內將額外將費用匯至本公司承辦之旅行社。</p>
                --%>
                <p style="font-size: 18px;">線上報名後，除公司補助兩人房外，如訂三人房及四人房，請您於收到信件後3天內將額外將費用匯至本公司承辦之旅行社。</p>

                <h5>匯款方式</h5>
                <p style="font-size: 18px;">銀行匯款/ATM轉帳/現金存入</p>

                <h5>匯款帳號</h5>
                <ul style="font-size: 18px;">
                    <li>銀行：新光銀行-新板分行</li>
                    <li>戶名：海天青旅行社股份有限公司</li>
                    <li>帳號：0462-10-100-2861</li>
                </ul>
            </div>

            <div class="col-sm-3">
                <span class="logo"><i class="fas fa-edit"></i></span>
            </div>
        </div>
    </div>

    <!-- services (推薦行程 Section) 
    <div id="one" class="container-fluid bg-grey I1">        
        <h2>本季推薦一日遊行程</h2>
        <br/>
      
    </div>

    <div id="two" class="container-fluid I2">
        <h2>本季推薦二日遊行程</h2>
        <br/>
    </div>
-->

    <div id="hotels" class="container-fluid">
        <h2>推薦飯店</h2>
        <br />
    </div>

    <!-- portfolio (活動相簿 Section) -->
    <div id="portfolio" class="container-fluid text-center bg-grey">
        <h2>活動相簿</h2>
        <br />
        <h4>文曄科技活動相簿</h4>
    </div>

    <!-- Contact (服務團隊 Section) -->
    <div id="contact" class="container-fluid">
        <h2 class="text-center">服務團隊</h2>
        <div class="row">
            <div class="col-sm-4">
                <h5>服務時間</h5>
                <p>
                    <span><i class="far fa-clock"></i></span>&nbsp;周一至周五早上九點到晚間七點
                </p>

                <h5>聯絡信箱</h5>
                <p><span class="glyphicon glyphicon-envelope"></span>&nbsp;mcp.otherstw@gmail.com</p>

                <h5>聯絡專線</h5>
                <p><span class="glyphicon glyphicon-phone"></span>&nbsp;02-29514508；02-29514509</p>
            </div>

            <div class="col-sm-4 slideanim">
                <h5>服務專員</h5>
                <p class="text-success">張峻誠 (Allen)</p>
                <p class="text-warning">周珈吟 (Gabrielle)</p>
            </div>

            <div class="col-sm-4 slideanim">
                <h5>承辦人員</h5>
                <p class="text-success">曹閔宣 (Ricky)</p>
            </div>

            <div class="col-sm-4 slideanim">
                <h5>服務項目</h5>
                <p>旅遊活動諮詢、行程規劃安排。</p>
                <p>寒暑假冬夏令營活動推薦。</p>
                <p>兒童冬夏令營 <a href="http://www.mcpsky.org" target="_blank">http://www.mcpsky.org</a></p>
            </div>
        </div>
    </div>

    <footer class="container-fluid text-center bg-grey">
        <a href="#myPage" title="To Top">
            <span class="glyphicon glyphicon-chevron-up"></span>
        </a>
        <p>MCP 海天青企業活動專區網站 Made By <a href="https://www.mcpgo.com" title="MCP 海天青">www.mcpgo.com</a></p>
    </footer>

    <div id="myModal" class="modal fade" data-backdrop="static">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 id="poptilte">說明事項</h4>
                </div>

                <div class="modal-body">
                    <p style="color: red;">本季各項活動皆已結束。</p>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">關閉</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
