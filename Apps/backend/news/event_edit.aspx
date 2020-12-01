<%@ Page Title="文曄每週減重目標編輯" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="event_edit.aspx.cs" Inherits="backend_news_event_edit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
  <link href="../css/jquery-ui.css" rel="stylesheet" />
  <link href="../css/calendar.css"  rel="stylesheet"/> 
  <script src="../../js/jquery-ui-1.10.4.custom.min.js"></script>
  <script src="../../js/jquery.ui.datepicker-zh-TW.js"></script> 
  <script src="../js/paging.js?v=<%= GetVersion() %>"></script>
  <script src="js/event_edit.js?v=<%= GetVersion() %>"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
     <div id="wrap">
    <div class="container-fluid">
      <h3>減重每週目標編輯</h3>     
      <div class="line"></div>
      <p class="totalRow"></p>
      <div id="content"></div>
      <div class="text-center">
        <ul class="pagination pagination-sm" style="margin:0 auto;"></ul>
      </div>
      <input id="hidCurrPage" type="hidden" value="1" />
      <input id="hidPagesize" type="hidden" value="15" />
    </div>
  </div>
</asp:Content>

