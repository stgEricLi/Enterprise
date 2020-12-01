<%@ Page Title="企業相簿編輯" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="album_edit.aspx.cs" Inherits="backend_album_album_edit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
  <link href="../css/jquery-ui.css" rel="stylesheet" />
  <link href="../css/calendar.css"  rel="stylesheet"/>
  <script src="../../js/jquery-ui-1.10.4.custom.min.js"></script>
  <script src="../../js/jquery.ui.datepicker-zh-TW.js"></script>
  <script src="../js/paging.js?v=<%= GetVersion() %>"></script>
  <script src="js/album_edit.js?v=<%=GetVersion() %>"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
   <div id="wrap">
     <div class="container-fluid">
       <h3>企業相簿查詢編輯</h3>
       <div class="input-zone">
         <span class="titl">所屬企業</span>
         <select id="ddlCompany" class="form-control" style="width: 206px!important;"></select>
         <button id="btnQuery" type="button" class="btn btn-success">查詢</button>
       </div>

       <div id="loading">
         <img src="../../img/basic/loader3.gif" />
         <span style="color: red;">載入中...</span>
       </div>
       <div class="line"></div>
       <p class="totalRow"></p>
      <div id="content"></div>
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
            <h4 class="modal-title" style="display: inline-block!important;">相簿編輯
              <span id="popID" style="color: #c0c0c0; margin-left: 12px;"></span>
              <input id="hidcmp" type="hidden" />
            </h4>
          </div>
          <div class="modal-body">
            <div class="input-zone">
              <span class="titl">相簿日期</span>
              <input id="txtStDay" type="text" maxlength="10" class="form-control dateISO required" placeholder="yyyy/mm/dd" style="width: 120px!important;" />

            </div>

            <div class="input-zone">
              <span class="titl">相簿標題</span>
              <input id="txtDesc" type="text" maxlength="250" class="form-control" style="width: 460px!important;" />
            </div>

            <div class="input-zone">
              <span class="titl">封面來源網址</span>
              <input id="txtImgUrl" type="text" maxlength="250" class="form-control" style="width: 460px!important;" />
            </div>

            <div class="input-zone">
              <span class="titl">對外連結網址</span>
              <input id="txtLink" type="text" maxlength="320" class="form-control" placeholder="http://www.mcpgo.com" style="width: 460px!important;" />
            </div>

            <div class="input-zone">
              <button id="btnUpdate" type="button" class="btn btn-success">更新相簿</button>
              <span id="imgloading" style="display: none; color: blue;"><img src="../../img/basic/loader3.gif" />&nbsp;處理中...</span>
              <span id="lbMsg" class="wrong"></span>
            </div>
        </div>
        </div>
     </div>
    </div>
  </div>
 
</asp:Content>

