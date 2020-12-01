<%@ Page Title="最新消息" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="news_add.aspx.cs" Inherits="backend_news_news_add" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
  <link href="../css/jquery-ui.css" rel="stylesheet" />
  <link href="../css/calendar.css"  rel="stylesheet"/> 
  <script src="../../js/jquery-ui-1.10.4.custom.min.js"></script>
  <script src="../../js/jquery.ui.datepicker-zh-TW.js"></script>
  <script src="js/news_add.js?v=<%= GetVersion() %>"></script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
  <div id="wrap">
    <h3>新增最新消息&nbsp;&nbsp;</h3>
    <div class="input-zone">
      <span class="titl">所屬企業</span>
      <select id="ddlCompany" class="form-control" style="width: 206px!important;"></select>
    </div>
    
    <div class="input-zone">
      <span class="titl">消息日期</span>
      <input id="txtStDay" type="text" maxlength="10" class="form-control dateISO required" placeholder="yyyy/mm/dd" style="width: 120px!important;" />

    </div>

    <div class="input-zone">
      <span class="titl">消息內容</span>
      <input id="txtDesc" type="text" maxlength="250" class="form-control"  style="width: 460px!important;" />
    </div>

    <div class="input-zone">
      <span class="titl">對外連結</span>
      <input id="txtLink" type="text" maxlength="320" class="form-control" placeholder="http://www.mcpgo.com" style="width: 460px!important;" />
    </div>

    <div class="input-zone">
      <button id="btnNew" type="button" class="btn btn-success">新增消息</button>
      <span id="imgStep1" style="display: none; color: blue;">
        <img src="../../img/basic/loader3.gif" />&nbsp;處理中...</span>
      <span id="lbMsg" class="wrong"></span>
    </div>
  </div>
</asp:Content>
