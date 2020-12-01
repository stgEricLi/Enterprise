<%@ Page Title="企業活動查詢編輯" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="act_edit.aspx.cs" Inherits="backend_itinerary_act_edit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">  
  <link href="../css/jquery-ui.css" rel="stylesheet" />
  <link href="../css/calendar.css"  rel="stylesheet"/>
  <script src="../../js/jquery-ui-1.10.4.custom.min.js"></script>
  <script src="../../js/jquery.ui.datepicker-zh-TW.js"></script> 
  <script src="../js/paging.js"></script>
  <script src="js/act_edit.js?v=<%= GetVersion() %>"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
  <div id="wrap">
    <div class="container-fluid">
      <h3>企業活動查詢編輯</h3>
      <div class="input-zone"> 
        <span class="titl">所屬企業</span>
        <select id="ddlCompany" class="form-control" style="width:206px!important;"></select>        
        <button id="btnSearch" type="button" class="btn btn-success">活動查詢</button>
        <span id="loading" style="display: none; color: blue;"><img src="../../img/basic/loader3.gif" />&nbsp;處理中...</span>                
      </div>      
      <div class="line"></div>
      <p class="totalRow"></p>
      <div id="actcontent"></div>
      <div class="text-center">
        <ul class="pagination pagination-sm" style="margin:0 auto;"></ul>
      </div>
      <input id="hidCurrPage" type="hidden" value="1" />
      <input id="hidPagesize" type="hidden" value="15" />
    </div>
   
    <div id="myModal" class="modal fade">
      <div class="modal-dialog" style="width:80%!important;">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title" style="display: inline-block!important;">活動編輯
              <span id="popID" style="color: #c0c0c0; margin-left: 12px;"></span>
            </h4>
          </div>
          <div class="modal-body">
            <div class="input-zone">
              <span class="titl">活動名稱</span>
              <input id="txtDesc" type="text" maxlength="50" class="form-control required" style="width: 460px!important;" />
            </div>
            <div class="input-zone">
              <span class="titl">活動日</span>
              <input id="txtStDay" type="text" maxlength="10" class="form-control dateISO required" placeholder="yyyy/mm/dd" style="width: 120px!important;" />

            </div>
            <div class="input-zone">
              <span class="titl">報名終止日</span>
              <input id="txtEdDay" type="text" maxlength="10" class="form-control dateISO required" placeholder="yyyy/mm/dd" style="width: 120px!important;" />
            </div>
            <div class="input-zone">
              <span class="titl">價格A</span>
              <input id="txtPrice1" type="text" maxlength="6" class="form-control digits required" style="width: 84px!important;" />
              <span class="titl">價格B</span>
              <input id="txtPrice2" type="text" maxlength="6" class="form-control digits required" style="width: 84px!important;" />
            </div>
            <div class="input-zone">
              <span class="titl">兩人房數</span>
              <input id="txtRoom2" type="text" maxlength="2" class="form-control digits required" style="width: 84px!important;" />
              <span class="titl">四人房數</span>
              <input id="txtRoom4" type="text" maxlength="2" class="form-control digits required" style="width: 84px!important;" />
            </div>
            <div class="input-zone">
              <span class="titl">可容納人數</span>
              <input id="txtCapacity" type="text" maxlength="6" class="form-control digits required" style="width: 84px!important;" />
              <span class="titl">是否開啟</span>
              <select id="ddlEnable" class="form-control" style="width: 120px!important;">
                <option value="true">是</option>
                <option value="false">否</option>
              </select>
              <input id="hidUser" type="hidden"/>
            </div>
          </div>
            <div class="modal-footer">
                <span id='imgLoad' style="display:none; color:#669900;"><img src="../../img/basic/loader3.gif" />&nbsp;資料處理中...</span>
                <span id='msgErr' class="wrong" style="margin-right:12px;"></span>  
              <button id="btnUpdate" type="button" class="btn btn-danger">更新</button>          
            </div>
        </div>
    </div>
</div>
  </div>
 </asp:Content>

