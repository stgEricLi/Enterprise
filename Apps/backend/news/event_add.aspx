<%@ Page Title="文曄減重" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="event_add.aspx.cs" Inherits="backend_news_event_add" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
  <link href="../css/jquery-ui.css" rel="stylesheet" />
  <link href="../css/calendar.css"  rel="stylesheet"/>
  <script src="../../js/jquery-ui-1.10.4.custom.min.js"></script>
  <script src="../../js/jquery.ui.datepicker-zh-TW.js"></script>
  <script src="js/event_add.js?v=<%= GetVersion() %>"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
     <div id="wrap">
    <h3>新增減重每週目標&nbsp;&nbsp;</h3>
         <div class="input-zone">
            <span class="titl">目標週期</span>
             <select id="ddlPeriod" class="form-control" style="width: 120px!important;"> </select>             
         </div>

    <div class="input-zone">
      <span class="titl">目標內容</span>
      <input id="txtGoal" type="text" maxlength="250" class="form-control"  style="width:660px!important;" />
    </div>


    <div class="input-zone">
      <button id="btnNew" type="button" class="btn btn-success">新增目標</button>
      <span id="imgStep1" style="display: none; color: blue;">
        <img src="../../img/basic/loader3.gif" />&nbsp;處理中...</span>
      <span id="lbMsg" class="wrong"></span>
    </div>
  </div>
</asp:Content>

