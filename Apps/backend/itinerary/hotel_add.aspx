<%@ Page Title="新增飯店房型資訊" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="hotel_add.aspx.cs" Inherits="backend_itinerary_hotel_add" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="../css/jquery-ui.css" rel="stylesheet" />
    <link href="../css/calendar.css?v=<%= GetVersion() %>" rel="stylesheet" />
    <script src="../../js/jquery-ui-1.10.4.custom.min.js"></script>
    <script src="../../js/jquery.ui.datepicker-zh-TW.js"></script>
    <script src="js/hotel_add.js?v=<%= GetVersion() %>"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div id="wrap">
        <div class="container-fluid">
            <h3>新增飯店房型資訊</h3>

            <div class="input-zone">
                <span class="titl">飯店</span>
                <select id="ddlAct" class="form-control" style="width: 406px!important;"></select>
                 <span id="loading" style="display: none; color: blue;"><img src="../../img/basic/loader3.gif" />&nbsp;處理中...</span>
            </div>

            <div class="input-zone ll-skin-cangas">
                <span class="titl">日期</span>
                <input id="txtStDay" type="text" maxlength="10" class="form-control dateISO required" placeholder="yyyy/mm/dd" style="width: 120px!important;" />
            </div>

            <div class="input-zone">
                <span class="titl">兩人房數</span>
                <input id="txtRoom2" type="text" maxlength="2" class="form-control digits required" style="width: 84px!important;" />
                 <span class="titl">三人房數</span>
                <input id="txtRoom3" type="text" maxlength="2" class="form-control digits required" style="width: 84px!important;" />
                <span class="titl">四人房數</span>
                <input id="txtRoom4" type="text" maxlength="2" class="form-control digits required" style="width: 84px!important;" />
            </div>

            <div class="input-zone">
                <button id="btnNew" type="button" class="btn btn-success">新增飯店</button>
                <span id="imgStep1" style="display: none; color: blue;">
                    <img src="../../img/basic/loader3.gif" />&nbsp;處理中...
                </span>
                <span id="msgStep1" class="wrong"></span>
            </div>

        </div>
    </div>
</asp:Content>

