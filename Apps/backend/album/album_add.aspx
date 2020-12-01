<%@ Page Title="企業相簿新增" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="album_add.aspx.cs" Inherits="backend_album_album_add" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
  <link href="../css/jquery-ui.css" rel="stylesheet" />
  <link href="../css/calendar.css"  rel="stylesheet"/>
  <script src="../../js/jquery-ui-1.10.4.custom.min.js"></script>
  <script src="../../js/jquery.ui.datepicker-zh-TW.js"></script>
  <script src="js/album_add.js?v=<%= GetVersion() %>"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div id="wrap">
    <h3>新增相簿&nbsp;&nbsp;</h3>
    <div class="input-zone">
      <span class="titl">所屬企業</span>
      <select id="ddlCompany" class="form-control" style="width: 206px!important;"></select>
    </div>
    
    <div class="input-zone">
      <span class="titl">相簿日期</span>
      <input id="txtStDay" type="text" maxlength="10" class="form-control dateISO required" placeholder="yyyy/mm/dd" style="width: 120px!important;" />

    </div>

    <div class="input-zone">
      <span class="titl">相簿標題</span>
      <input id="txtDesc" type="text" maxlength="250" class="form-control"  style="width: 460px!important;" />
    </div>

    <div class="input-zone">
      <span class="titl">封面來源網址</span>
      <input id="txtImgUrl" type="text" maxlength="250" class="form-control"  style="width: 460px!important;" />
    </div>

    <div class="input-zone">
      <span class="titl">對外連結網址</span>
      <input id="txtLink" type="text" maxlength="320" class="form-control" placeholder="http://www.mcpgo.com" style="width: 460px!important;" />
    </div>

    <div class="input-zone">
      <button id="btnNew" type="button" class="btn btn-success">新增相簿</button>
      <span id="imgStep1" style="display: none; color: blue;">
        <img src="../../img/basic/loader3.gif" />&nbsp;處理中...</span>
      <span id="lbMsg" class="wrong"></span>
    </div>
  </div>
</asp:Content>

