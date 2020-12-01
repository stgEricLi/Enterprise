<%@ Page Title="文曄減重報名查詢編輯" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="order_edit_wt_fitness.aspx.cs" Inherits="backend_order_order_edit_wt_fitness" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
  <link href="../css/jquery-ui.css" rel="stylesheet" />
  <link href="../css/calendar.css"  rel="stylesheet"/>   
  <script src="../../js/jquery-ui-1.10.4.custom.min.js"></script>
  <script src="../../js/jquery.ui.datepicker-zh-TW.js"></script> 
  <script src="../js/paging.js?v=<%= GetVersion() %>"></script>
  <script src="js/order_edit_wt_fitness.js?v=<%= GetVersion() %>"></script>
    <style>
       .glyphicon-floppy-disk { color: #fff; cursor: pointer; }
        .glyphicon-remove { color: #fff; cursor: pointer; }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
 <div id="wrap">
    <div class="container-fluid">
      <h3>文曄減重報名查詢編輯</h3>
      <div class="input-zone">
          <select id="ddlOption" class="form-control" style="width: 206px!important;">
              <option value="none">所有單號</option>
              <option value="Eid">依員工工號查詢</option>
              <option value="Sid">依身份證號查詢</option>
              <option value="Oid">依報名編號查詢</option>
              <option value="Aid">依活動編號查詢</option>
              <option value="Cmt">依團隊查詢</option>
          </select> 
        <select id="ddlAct" class="form-control" style="width:206px!important;"></select>         
        <input id="txtValue" type="text" class="form-control required" /maxlength="50">    
        <button id="btnSearch" type="button" class="btn btn-success">查詢</button>
          <button id="btnExport" type="button" class="btn btn-success">匯出</button>
        <span id="loading" style="display: none; color: blue;"><img src="../../img/basic/loader3.gif" />&nbsp;處理中...</span>
      </div>
      <div class="line"></div>
      <p class="totalRow"></p>
      <div id="content"></div>
      <div class="text-center">
        <ul class="pagination pagination-sm" style="margin:0 auto;"></ul>
      </div>
      <input id="hidCurrPage" type="hidden" value="1" />
      <input id="hidPagesize" type="hidden" value="10" />
    </div>
   
   <div id="myModal" class="modal fade">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title" style="display: inline-block!important;">訂單編輯
              <span id="popID" style="color: #c0c0c0; margin-left: 12px;"></span>              
              <span id="lbActname" style="color: #c0c0c0; margin-left: 12px;"></span>
            </h4>
              <input id="hidActid" type="hidden" />
          </div>
          <div class="modal-body">
            <div class='table-responsive details'>
                  
            </div>
          </div>
          <div class="modal-footer">            
            <span id='imgLoad' style="color: #669900;">
              <img src="../../img/basic/loader3.gif" />&nbsp;資料處理中...</span>
            <span id='msgErr' class="wrong" style="margin-right: 12px;"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</asp:Content>

