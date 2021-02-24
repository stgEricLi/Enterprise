<%@ Page Language="C#" AutoEventWireup="true" CodeFile="order_hotel.aspx.cs" Inherits="enterprise_wt_order_hotel" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>文曄科技線上報名</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
    <%--<link href="../../css/Jquery-ui.css" rel="stylesheet" />
    <link href="../../css/calendar.css?v=<%= GetVersion() %>" rel="stylesheet" />--%>
    <link href="../css/basic.css" rel="stylesheet" />
    <link href="css/order.css?v=<%= GetVersion() %>" rel="stylesheet" />
    <%--  <script src="../../js/jquery-ui-1.10.4.custom.min.js"></script>
    <script src="../../js/jquery.ui.datepicker-zh-TW.js"></script>--%>
    <script src="js/wt.js?v=<%= GetVersion() %>"></script>
    <script src="js/order_hotel.js?v=<%= GetVersion() %>"></script>
    <style>
        .listline td select {
            display: inline-block;
            margin-left: 2px;
        }

        .table th {
            text-align: center;
            padding: 6px;
            background-color: #EAF6FD;
        }

        .panel-body {
            background-color: transparent;
        }



            .panel-body ul {
                list-style: none;
            }

                .panel-body ul li {
                    margin-top: 24px;
                }

                    .panel-body ul li input {
                        display: inline-block;
                        width: 52px;
                    }

        #joiner {
            min-height: 80px;
        }

        #lbAgree {
            font-size: 18px;
        }

        .clickable {
            text-decoration: underline;
            color: cornflowerblue;
            cursor: pointer;
        }

        .unable {
            color: #c0c0c0;
        }

        .beRed {
            color: red;
        }

        .w50 {
            width: 40%;
        }

        .attention {
            margin-top: 24px;
            margin-bottom: 24px;
            font-size: 16px;
            font-weight: 800;
            color: red;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="container-fluid">
            <div style="text-align: center;">
                <h1 class="text-info">MCP海天青-文瞱科技線上報名</h1>
                <asp:Literal ID="Literal1" runat="server"></asp:Literal>
                <asp:HiddenField ID="hidActid" runat="server" />
                <asp:HiddenField ID="hidActName" runat="server" />
                <asp:HiddenField ID="hidCapacity" runat="server" />
                 <asp:HiddenField ID="hidMaster" runat="server" />
            </div>

            <div id="step1" class="steps">
                <div class="panel panel-danger ">
                    <div class="panel-heading panel-heading-custom">
                        <h4 class="panel-title">MCP海天青重要隱私權聲明 </h4>
                    </div>
                    <div style="padding: 12px; border-bottom: solid 1px #c0c0c0;">
                        <h4 class="text-important">為了資料的安全性與頁面功能的完整性，建議您使用最新版本的瀏覽器來進行線上報名。在進行報名之前請先詳細閱讀<span class="text-primary">「MCP海天青重要隱私權聲明」</span>，然後請勾選<span class="text-primary">「我同意此項聲明」</span>來進行線上報名程序。</h4>
                    </div>
                    <div class="panel-body">
                        <p>本公司僅收集我們認為相關且有助於您的旅遊保險所必要的個人資料。我們會運用您的個人資料，以向您提供更好的客戶服務。除非已經取得您的同意、或依法令規定、或事前已向您通知，本會不會向任何外界機構或個人透露您的個人資料。</p>
                        <p>本公司實行嚴格的個資安全政策，以防止任何人（包括本公司職員）未經授權而取得您的個人資料。本公司所有獲准使用您的個人資料的職員及第三人，均被特別要求遵守本公司的保密義務。網際網路資料的傳輸於現行科技下，尚不能保證百分之百的安全；因此，儘管MCP海天青旅行社在保護您的個人資料安全上做最嚴格的把關，我們也無法確信或保證您傳送給MCP海天青旅行社的資料之絕對安全；所以鄭重提醒您，並請您瞭解、注意並承擔此部分之風險。</p>
                        <p>本公司會將活動照片放在報名網站上或粉絲團內，以供同仁下載，不會用在商業行為上。</p>
                        <h5>適用對象：</h5>
                        <ul>
                            <li>文曄員工本人全額補助一間雙人房費用(每位員工限補助一次)。</li>
                            <li>員工家人/親戚/朋友部分補助</li>
                        </ul>
                        <h5>訂房補助說明：</h5>
                        <ol>
                            <li>員工本人及攜伴1人全額補助一間雙人房費用〈每人限參加及補助一次〉。</li>
                            <li>員工如攜伴2人，房型需調整為3人房，需自費<span class="beRed">新台幣$1,000元</span>。</li>
                            <li>員工如攜伴3人，房型需調整為4人房，需自費<span class="beRed">新台幣$2,500元</span>。</li>
                            <li>三歲以下小孩不佔床，不列入房型人數。</li>
                            <li>四~六歲不佔床，雖不列入房型人數，但若現場身高超過飯店規定需另補加床或房型差額及早餐費用則依各飯店規定直接向同仁收取。</li>
                            <li style="color: red;">入住人數如低於房型人數，需提前告知並經公司同意才可訂定該房型，若未經同意且無事先告知導致公司不必要的支出浪費，將會收取額外的房型費用並禁止該年度所有的福利活動。</li>
                            <li>此次飯店行程僅提供飯店住宿搭配一泊二食，不另提供相關行程門票、交通補助等部分。</li>
                            <li>所有飯店房型皆為一泊二食(除花蓮秧悅飯店為一泊一食)，如改為一泊一食者，即視為自行放棄權利，無法予以退款。</li>
                            <li>各飯店停車場數量及停放規定，依各飯店規定為主。</li>
                            <li>此次飯店行程不適用政府推出之安心旅遊方案。</li>
                            <li>飯店旅遊補助僅提供入住當天在職員工享有。</li>
                        </ol>
                        <h5>訂房相關注意事項：</h5>
                        <ol>
                            <li>文曄員工本人需親自入住。</li>
                            <li>登記成功後如不克前往，最晚於入住前15日下午5:00前致電取消，未提前取消者無法退費，並喪失此補助權益。</li>
                            <li>已登記入住行程不可無故不到，未到者即視同棄權，需自行負擔全額房價，且由當月薪資扣除。</li>
                            <li>入住當日請務必攜帶【身分證及員工識別證】辦理入住。</li>
                            <li>訂房成功後，系統會寄發【入住登記確認單】，再煩請同仁特別注意信箱資訊。</li>
                            <li>訂房日期如該飯店已顯示無房間，可改選其他飯店或等待候補。</li>
                            <li>選擇候補同仁如有房間旅行社會再依照候補順序依序通知。</li>
                            <li>如入住當天臨時生病或發燒，煩請先聯絡旅行社人員，並提供當日就醫證明給福委會，則免扣除員工薪資。</li>
                            <li>補助期限至2021年12月底。</li>
                            <li>如於補助期限內未登記入住任何飯店，則視同放棄權利，不另轉發現金。</li>
                            <li>凡個人患有政府規定之法定傳染病或疑似症狀，請務必主動告知，違反規定者應自行負責。</li>
                            <li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將依照飯店規定補足實際產生之費用。</li>
                            <li>若遇天候不佳或不可抗拒之因素，請主動聯繫旅行社人員，則免扣除員工薪資。</li>
                            <li>旅遊活動諮詢專線：02-29527535 #38 曹先生，#20 吳小姐 #36 周小姐。</li>
                        </ol>
                    </div>
                    <div class="modal-footer">
                        <input id="ckAgree" type="checkbox" /><span id="lbAgree">我同意此項聲明</span>
                    </div>

                </div>

                <div class="panel panel-primary">
                    <div class="panel-heading">
                        <h4 class="panel-title">員工驗證</h4>
                    </div>
                    <div class="panel-body">
                        <ul>

                            <li>
                                <span style="margin-right: 42px;">您的工號</span>
                                <input id="txtLeaderEid" type="text" class="form-control input" maxlength="8" style="width: 120px;" placeholder="工號" />
                            </li>
                            <li>
                                <span style="margin-right: 12px;">您的身分證號</span>
                                <input id="txtLeaderSid" type="text" class="form-control input" maxlength="10" style="width: 120px;" placeholder="身分證號" />
                            </li>

                            <li>房型人員(含自己) ：                                
                                <select id="ddlMb" class="form-control" style="width: 240px;">
                                    <option value="2A">2大</option>
                                    <option value="2B">2大+4-6歲不佔床小朋友</option>
                                    <option value="2C">2大+3歲以下baby</option>
                                    <option value="3A">2大+1位(4-6歲佔床)+3歲以下baby</option>
                                    <option value="3B">3大</option>
                                    <option value="3C">3大+4-6歲不佔床小朋友</option>
                                    <option value="3D">3大+3歲以下不佔床baby</option>
                                    <option value="4A">3大+1位(4-6歲佔床)+3歲以下 baby</option>
                                    <option value="4B">4大</option>
                                    <option value="4C">4大+4-6歲不佔床小朋友</option>
                                    <option value="4D">4大+3歲以下不佔床baby</option>
                                    <%-- <option value="其他">其他</option>--%>
                                </select>
                            </li>
                        </ul>

                        <p class="attention">
                            入住時間非週六晚上者,請前往 <a href="hotel_weekday.aspx" target="_self">平日訂房</a>填寫申請表。
                        </p>

                    </div>
                </div>


                <div class="clearfix">
                    <button id="btnToS2" type="button" class="btn btn-success pull-right">下一步</button>
                </div>
            </div>

            <div id="step2" class="steps">
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        <h4 class="panel-title">請於下方表單中詳實輸入登記人資料</h4>
                    </div>

                    <div class="panel-body">

                        <h4>登記人資料</h4>
                        <ul>
                            <li>
                                <span id="ldName"></span>
                            </li>
                            <li>電話：<input id="txtPhone" type="text" class="form-control" maxlength="12" style="width: 136px;" />
                                分機：<input id="txtExt" type="text" class="form-control" maxlength="6" style="width: 66px;" />
                                <span id="txtRoomRemind" style="margin-left: 12px; color: red;"></span>
                            </li>
                            <li>CHICK-IN 時間：                                
                                <select id="ddlCk" class="form-control" style="width: 120px;">
                                    <option value="15:00">15:00</option>
                                    <option value="15:30">15:30</option>
                                    <option value="16:00">16:00</option>
                                    <option value="16:30">16:30</option>
                                    <option value="17:00">17:00</option>
                                    <option value="17:30">17:30</option>
                                    <option value="18:00">18:00</option>
                                    <option value="18:30">18:30</option>
                                    <option value="19:00">19:00</option>
                                    <option value="19:30">19:30</option>
                                </select>
                            </li>

                            <li>備註：<input id="txtCmt" type="text" class="form-control" maxlength="100" style="width: 336px;" />
                                <span style="color: #c0c0c0; font-size: 12px;">100 字內</span>
                            </li>

                            <%--<li>入住日期：
                                <input id="txtStDay" type="text" class="form-control input" maxlength="10" style="width: 120px;" /> &nbsp;&nbsp;
                                退房日期：
                                <input id="txtEdDay" type="text" class="form-control input" maxlength="10" style="width: 120px;" />
                            </li>--%>
                        </ul>

                        <div id="joiner"></div>

                        <h4>請選擇入住日:</h4>
                        <div id="schedule"></div>

                        <div id="selectedInfo"class="attention"></div>

                    </div>

                    <div class="modal-footer clearfix">
                        <button id="btnToS1" type="button" class="btn btn-danger pull-left">上一步</button>
                        <button id="btnToS3" type="button" class="btn btn-success pull-right">下一步</button>
                    </div>
                </div>

                <div id="divMsg" class="alert  collapse">
                    <a id="btnMgClose" class="close" href="#">&times;</a>
                    <div id="txtMsg"></div>
                </div>
            </div>

            <div id="step3" class="steps">
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        <h4 class="panel-title">請先確認下方資料是否正確，然後再送出表單</h4>
                    </div>

                    <div class="panel-body">
                        <input id="total" type="hidden" value="0" />
                        <div id="confirmation"></div>
                    </div>

                    <div class="modal-footer clearfix">
                        <button id="btnBackS2" type="button" class="btn btn-danger pull-left">上一步</button>
                        <span id="imgLoading" style="display: none; color: #c0c0c0;">
                            <img src="../../img/basic/loader3.gif" />&nbsp;處理中請稍待...
                        </span>
                        <button id="btnSubmit" type="button" class="btn btn-success pull-right">確認送出</button>
                        <button id="btnBackUp" type="button" class="btn btn-danger pull-right" style="display: none;">我要候補</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="myModal" class="modal fade" data-keyboard="false" data-backdrop="static">
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
</body>
</html>
