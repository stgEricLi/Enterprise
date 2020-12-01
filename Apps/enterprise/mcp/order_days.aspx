<%@ Page Language="C#" AutoEventWireup="true" CodeFile="order_days.aspx.cs" Inherits="enterprise_order_days" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
 <title>文曄科技線上報名</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
  <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.13.1/jquery.validate.min.js"></script>
  <script src="../js/jquery-validator-normalpage.js"></script>
  <script src="../js/custom-validator.js"></script>
  <link href="../css/basic.css" rel="stylesheet" />
  <link href="css/order.css" rel="stylesheet" />  
  <script src="js/order_days.js?v=1.10"></script>
  <script src="js/utilities.js?v=1.00"></script>
  <style>
        .listline td select{display:inline-block; margin-left:2px;}
        .table th{text-align:center; padding:6px; background-color:#EAF6FD;}
        .panel-body{background-color:transparent;}
        .panel-body ul{ list-style:none;}
        .panel-body ul li input{display:inline-block; width:52px;}
        #joiner{ min-height:300px;}
  </style>
</head>
<body>
  <form id="form1" runat="server">  
  <div class="container-fluid">
    <div style="text-align:center;">
      <h1 class="text-info">MCP海天青-文瞱科技線上報名</h1>
      <asp:Literal ID="Literal1" runat="server"></asp:Literal>   
      <asp:HiddenField ID="hidActid" runat="server" />
      <asp:HiddenField ID="hidActName" runat="server" />
      <asp:HiddenField ID="hidCapacity" runat="server" />
      <asp:HiddenField ID="hidRoom2" runat="server" />
      <asp:HiddenField ID="hidRoom4" runat="server" />
    </div>

    <div id="step1">
        <div class="panel panel-danger ">
            <div class="panel-heading panel-heading-custom">
                <h4 class="panel-title">MCP海天青重要隱私權聲明 </h4>
            </div>
            <div style='padding:12px; border-bottom:solid 1px #c0c0c0; '>
                <h4 class="text-important">為了資料的安全性與頁面功能的完整性，建議您使用最新版本的瀏覽器來進行線上報名。在進行報名之前請先詳細閱讀<span class="text-primary">「MCP海天青重要隱私權聲明」</span>，然後請勾選<span class="text-primary">「我同意此項聲明」</span>來進行線上報名程序。</h4>
            </div>
            <div class="panel-body" style="">
                <p>
                    本公司僅收集我們認為相關且有助於您的旅遊保險所必要的個人資料。我們會運用您的個人資料，以向您提供更好的客戶服務。除非已經取得您的同意、或依法令規定、或事前已向您通知，本會不會向任何外界機構或個人透露您的個人資料。
                </p>
                <p>
                    本公司實行嚴格的個資安全政策，以防止任何人（包括本公司職員）未經授權而取得您的個人資料。
              本公司所有獲准使用您的個人資料的職員及第三人，均被特別要求遵守本公司的保密義務。
              網際網路資料的傳輸於現行科技下，尚不能保證百分之百的安全；因此，儘管MCP海天青旅行社在保護您的
              個人資料安全上做最嚴格的把關，我們也無法確信或保證您傳送給MCP海天青旅行社的資料之絕對安全；
              所以鄭重提醒您，並請您瞭解、注意並承擔此部分之風險。
                </p>
                <h5 style='color: Red;'>補助辦法：</h5>
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

                <h5 style='color: Red;'>注意事項：（有關個人權益，請確實詳讀）</h5>
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
                </ol>
            </div>
          <div class="modal-footer">
              <input id="ckAgree" type="checkbox" />
              &nbsp;我同意此項聲明
          </div>
        </div>

      

        <div class="panel panel-primary">
            <div class="panel-heading">
                <%--<h4 class="panel-title">請依需求選擇房型（請注意：參加人數須與房間床位數一致，六歲以下兒童請另行電話報名，不要將其加入清單中）</h4>--%>
              <h4 class="panel-title">請依需求選擇房型</h4>
            </div>
            <div class="panel-body">
               <ul>                
                   <li>
                       <select id="ddlRoom" class="form-control" style="width:42%;">
                         <option value="2A">我要預訂一間2人房（2位成人）</option>
                         <option value="2B">我要預訂一間2人房（2位成人+1位三歲以下兒童）</option>
                         <option value="2F">我要預訂一間2人房（2位成人+1位4至6歲兒童不佔床餐）</option>
                         <option value="2C">我要預訂一間2人房（2位成人+1位4至6歲兒童不佔床餐+1位三歲以下兒童）</option>
                         <option value="2G">我要預訂一間2人房（2位成人+2位三歲以下兒童）</option>
                         <option value="2H">我要預訂一間2人房（2位成人+2位4至6歲兒童不佔床餐）</option>
                         <option value="2D">我要預訂一間2人房（1位成人+1位4至6歲兒童佔床餐）</option>                        
                         <option value="4A">我要預訂一間4人房（4位成人）</option>
                         <option value="4B">我要預訂一間4人房（4位成人+1位三歲以下兒童）</option>
                         <option value="4F">我要預訂一間4人房（4位成人+1位4至6歲兒童不佔床餐）</option>
                         <option value="4C">我要預訂一間4人房（4位成人+1位4至6歲兒童不佔床餐+1位三歲以下兒童）</option>
                         <option value="4G">我要預訂一間4人房（4位成人+2位三歲以下兒童）</option>
                         <option value="4H">我要預訂一間4人房（4位成人+2位4至6歲兒童不佔床餐）</option>
                         <option value="4D">我要預訂一間4人房（3位成人+1位4至6歲兒童佔床餐）</option>
                       </select>
                   </li>
                 <li><span id="txtRestRoom"></span></li>
               </ul>                               
            </div>
        </div>
       
       <div class="clearfix">
           <button id="btnToS2" type="button" class="btn btn-success pull-right">下一步</button>
       </div>      
    </div>

    <div id="step2">
        <div class="panel panel-primary">
            <div class="panel-heading">
                <h4 class="panel-title">請於下方表單中詳實輸入參加人資料，並將主要聯絡人資料置放在第一筆</h4>
            </div>

            <div class="panel-body">
                <ul>
                    <li>聯絡人電話：<input id="txtPhone" type="text" class="form-control input-sm" maxlength="12" style="width:116px;" />
                        分機：<input id="txtExt" type="text" class="form-control input-sm" maxlength="6" style="width:66px;"/> 
                      <span id="txtRoomRemind" style="margin-left:12px; color:red;"></span>
                    </li>
                  
                </ul>
             
                 <div id="joiner"></div>
            </div>

            <div class="modal-footer clearfix">
               <button id="btnToS1" type="button" class="btn btn-danger pull-left">上一步</button>
               <button id="btnToS3" type="button" class="btn btn-success pull-right">下一步</button>
            </div>
        </div>       
    </div>

    <div id="step3">
        <div class="panel panel-primary">
            <div class="panel-heading">
                <h4 class="panel-title">請先確認下方表單中參加人資料是否正確，然後再送出表單</h4>
            </div>

            <div class="panel-body">
                <input id="total" type="hidden" value="0" />
                 <div id="confirmation"></div>
            </div>

            <div class="modal-footer clearfix">
               <button id="btnBackS2" type="button" class="btn btn-danger pull-left">上一步</button>
               <span id="imgLoading" style="display:none; color:#c0c0c0;"><img src="../../img/basic/loader3.gif" />&nbsp;處理中請稍待...</span>
               <button id="btnSubmit" type="button" class="btn btn-success pull-right">確認送出</button>
            </div>
        </div>       
    </div>
  </div>

<div id="myModal" class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">              
              <h4 class="modal-title">線上報名已完成</h4>
            </div>
            <div class="modal-body">
             <div id="odcnt"></div>
            </div>
            <div class="modal-footer">
              <button id="btnFinish" type="button" class="btn btn-danger">關閉</button>
            </div>
          </div>
        </div>
      </div>
</form>
    <br /><br />
</body>
</html>
