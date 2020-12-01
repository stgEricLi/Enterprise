<%@ Page Language="C#" AutoEventWireup="true" CodeFile="order_camping.aspx.cs" Inherits="enterprise_wt_order_camping" %>

<!DOCTYPE html>

<html>
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
  <script src="js/order_camping.js?v=1.26"></script>
</head>
<body>
  <form id="form1" runat="server">
    <div class="container-fluid">
    <div style="text-align:center;">
      <h1 class="text-info">MCP海天青-文瞱科技線上報名</h1>
      <asp:HiddenField ID="hidActid" runat="server" />
      <asp:HiddenField ID="hidActName" runat="server" />
      <asp:HiddenField ID="hidCapacity" runat="server" />
      <asp:HiddenField ID="hidCart" runat="server" />
    </div>    

    <div class="panel panel-pink ">
      <div class="panel-heading panel-heading-custom">
        <h4 class="panel-title">MCP海天青重要隱私權聲明            
            &nbsp;&nbsp;            
        </h4>
      </div>
      <div class="panel-body panel-body-custom">
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
        <h5 style='color: Red;'>露營補助辦法：</h5>       
        <ol>
          <li>每位同仁最多攜伴3人〈不含3歲以下孩童〉。</li>
          <li>員工本人全額補助〈每人限參加及補助一次〉。</li>
          <li>員工攜伴第1人免費。</li>
          <li>員工攜伴第2人需自費新台幣 $1,000元。</li>
          <li>員工攜伴第3人需自費新台幣 $2,300元。</li>
          <li>員工攜伴者，不可為公司同仁(夫妻不在此限制內，但每人限參加一次活動) 。</li>
          <li>0-3歲兒童定義〈2014年7月以後出生〉，每人酌收200元〈含保險/車資等行政代辦費用〉。</li>
        </ol>

        <h5 style='color: Red;'>露營注意事項：（有關個人權益，請確實詳讀）</h5>
        <ol>
          <li style="color: red;">每梯次露營活動需滿 100 人才可開梯，每位員工最多僅能佔用一營位，且每一帳篷須至少3位成人。若帳篷未滿四位成人，須另補新台幣800元的營位場地費用。</li>
          <li style="color: red;">報名成功後本人如不克前往，最晚需於出發前7天下午5:00前，以e-mail信件告知旅行社(同仁不可私自找人替代)，未提前告知者則無法退費，並喪失公司補助權益(此活動費用全額需由同仁自行負擔，並由員工薪資中扣除)。</li>
          <li style="color: red;">已報名露營行程之參加者，不可無故不到，亦不可員工本人不到僅攜伴者參加之情況，不到者即視同棄權且需自行負擔員工本人及眷屬全額旅費並由員工薪資中扣除。</li>
          <li style="color: red;">如於出發前一周內或活動當天因病臨時請假者，請檢附就醫證明，未檢附證明者將視為無故不到則無法退費，並喪失公司補助權益(此活動費用全額需由同仁自行負擔，並由員工薪資中扣除)。</li>
          <li style="color: red;">攜帶之家屬不得為公司同仁。(夫妻不在此限制內，但每人限參加一次活動)</li>
          <li>每位參加同仁及親友皆有投保旅遊責任險 (無法提供當日臨時加保服務)。</li>
          <li>報到當日請務必攜帶「身份證件」(如:身分證、駕照、健保卡)辦理報到事宜。查驗不符將無法參與活動，敬請同仁配合。</li>
          <li>報名成功後，如需報名匯款，待活動報名截止確認成行(活動前30天)後，再將款項匯至本公司。</li>
          <li>活動報名成功後，會於活動出發前<span style="color: red;">三日</span>統一寄發行前通知單，在煩請同仁特別注意信箱資訊及當日報到時間和集合地點，並煩請告知同行親友。</li>
          <li>如活動當天臨時生病或發燒，煩請先聯絡當日主辦人員，並提供當日就醫證明給福委會，則免扣除員工薪資。</li>
          <li>補助期限至2018年7月，依網站公告的最後一次旅遊活動行程為止。</li>
          <li>如於補助期限內未參加任何活動，則視同放棄權利，不另轉發現金。</li>
          <li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li>
          <li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將於現場補足實際產生之費用。</li>
          <li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液.等。本單位不提供任何口服藥物。</li>
          <li>遊覽車上請勿攜帶寵物及危險物品參與行程，感謝您的配合。</li>
          <li>以上行程載明之車行時間僅供參考，如因路況或假日遊客眾多行程順序將視情況做更動調整。</li>
          <li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li>
          <li>旅遊活動諮詢專線：02-29527535  #32 徐小姐 #40 顏小姐。</li>
        </ol>
      </div>
      <div class="modal-footer">
          <input id="ckAgree" type="checkbox" />
          &nbsp;我同意此項聲明
      </div>
    </div>
    
    <div class="jumbotron">
      <h4 class="text-important">為了資料的安全性與頁面功能的完整性，建議您使用 <code>Googel Chrome</code> 瀏覽器來進行線上報名。在進行報名之前請先詳細閱讀<span class="text-primary">「MCP海天青重要隱私權聲明」</span>，然後請勾選<span class="text-primary">「我同意此項聲明」</span>來進行線上報名程序。</h4>
    </div>

    <asp:Literal ID="Literal1" runat="server"></asp:Literal>

    <div class="panel panel-primary">
      <div class="panel-heading">主要聯絡人資訊</div>
      <div class="panel-body">
        <div class="input-zone">
          <span class="titl">姓名</span>
          <input id="txtMname" type="text" maxlength="20" class="form-control" placeholder="請輸入真實中文姓名" />
          <span class="titl">身份證號</span>
          <input id="txtMSid" type="text" maxlength="20" class="form-control" placeholder="身份證號或護照號碼" />
        </div>

        <div class="input-zone">
          <span class="titl">生日</span>
           <input id="txtMDob" type="text" maxlength="10" class="form-control dateISO required" placeholder="yyyy/mm/dd" />
           <span class="titl">工號</span>
          <input id="txtMEid" type="text" maxlength="20" class="form-control required" placeholder="請輸入員工工號" />
        </div>

        <div class="input-zone">
          <span class="titl">電話</span>
          <input id="txtMTel" type="text" maxlength="20" class="form-control tel required" placeholder="格式：02-8226-9088" />
          <span class="titl">分機</span>
          <input id="txtExtend" type="text" maxlength="20" class="form-control required" placeholder="格式：234" />
        </div>

        <div class="input-zone">
          <span class="titl">手機</span>
          <input id="txtMCell" type="text" maxlength="20" class="form-control cell required" placeholder="格式為：0936-123456" />
        </div>
        
       <div class="input-zone">
         <span class="titl">素食</span>
         <select id="ddlMVeg" class="form-control">
           <option value="false">不吃素</option>
           <option value="true">吃素</option>
         </select>
       </div>

        <div class="input-zone">
          <span class="titl">Email</span>
          <input id="txtMMail" type="text" maxlength="50" class="form-control email required" placeholder="請輸入Email" style="width:34%!important;" />
        </div>

         <div class="input-zone">
          <span class="titl">聯絡地址</span>
          <input id="txtAddr" type="text" maxlength="50" class="form-control" placeholder="請輸入地址" style="width:34%!important;" />
        </div>
         
        <div style="margin-top:16px; margin-bottom:6px;">
           <input id="ckJoin" type="checkbox" />&nbsp;主要聯絡人也為參加人&nbsp;&nbsp; 
           <input id="ckReceive" type="checkbox" />&nbsp;往後想收到海天青旅遊訊息        
        </div>
     
      </div>      
    </div>

    <div class="panel panel-primary">
      <div class="panel-heading">其他報名參加人資訊<span style="color:#ffff00;margin-left:2px;">『若帳篷未滿四位成人，須另補新台幣800元的營位場地費用』</span></div>
      <div class="panel-body">
        <input id="hidIndex" type="hidden" />
        <div class="input-zone">
          <span class="titl">報名姓名</span>
          <input id="txtName" type="text" maxlength="12" class="form-control" placeholder="姓名" />
          <span class="titl">身份證號</span>
          <input id="txtSid" type="text" maxlength="20" class="form-control" placeholder="身份證"/>
        </div>

        <div class="input-zone">
          <span class="titl">生日</span>
           <input id="txtBob" type="text" maxlength="10" class="form-control dateISO required" placeholder="yyyy/mm/dd" />
           <span class="titl">工號</span>
          <input id="txtEid" type="text" maxlength="20" class="form-control" placeholder="員工工號" />
        </div>

        <div class="input-zone">
          <span class="titl">手機</span>
          <input id="txtCell" type="text" maxlength="20" class="form-control cell required" placeholder="格式為：0936-123456" />
          <span class="titl">素食</span>
          <select id="ddlVeg" class="form-control" style="width: 112px!important;">
            <option value="false">否</option>
            <option value="true">是</option>
          </select>
        </div>

        <div class="input-zone">
          <span class="titl">Email</span>
          <input id="txtEmail" type="text" maxlength="50" class="form-control" placeholder="Email" style="width:34%!important; ">
          <button id="btnAdd" type="button" class="btn btn-info btn-sm">新增參加人</button>
        </div>
        

        <table class="table" style="width:98%!important;">
          <tr class="tbtitle">
            <th>姓名</th>
            <th>身份證</th>
            <th>生日</th>
            <th>手機</th>
            <th>Email</th>
            <th>工號</th>
            <th>素食</th>
            <th>金額</th>
            <th></th>
          </tr>
          <tr class="initial">
            <td>---</td>
            <td>---</td>
            <td>---</td>
            <td>---</td>
            <td>---</td>
            <td>---</td>
            <td>---</td>
            <td>---</td>
            <td></td>
            <td></td>
          </tr>
        </table>
        <p id="lbPsumy" style="text-align:right;width:98%;"></p>
      </div>
      <div class="modal-footer">
        <span id="imgLoading" style="display:none; color:blue;"><img src="../../img/basic/loader3.gif" />&nbsp;處理中請稍待...</span>
        <span id="msgError" class="wrong"></span>&nbsp;&nbsp;
        <button id="btnSubmit" type="button" class="btn btn-danger btn-md">送出報名表</button>
        <%--<button id="btnShow" type="button" class="btn btn-default btn-md">show para</button>--%>
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
 </div>
  </form>
</body>
</html>
