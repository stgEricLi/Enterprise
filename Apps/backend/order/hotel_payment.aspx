<%@ Page Title="" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="hotel_payment.aspx.cs" Inherits="backend_order_hotel_payment" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
      <script src="../js/utilities.js?v=<%= GetVersion() %>"></script>
    <script src="../js/paging.js?v=<%= GetVersion() %>"></script>
    <script src="js/hotel_payment.js?v=<%= GetVersion() %>"></script>
    <style>
        #loading {display:none;}
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div id="wrap">
        <h3>匯款資訊資料查詢編輯</h3>
        <div class="input-zone">
            <span class="desc">查詢條件</span>
            <select id="ddlOption" class="form-control" style="width: 206px!important;">
                <option value="All">查詢全部</option>
                <option value="Oid">依單號查詢</option>
                <option value="Name">依名字查詢</option>
                <option value='Acct'>帳號後五碼查詢</option>
            </select>
            <input id="txtValue" type="text" class="form-control" />
            <button id="btnSearch" type="button" class="btn btn-success">查詢</button>
            <button id="btnExport" type="button" class="btn btn-info">匯出</button>
           <span id="loading" style="color: blue;"><img src="../../img/basic/loader3.gif" />&nbsp;資料處理中請稍後...</span>
        </div>

        <div class="line"></div>
        <p class="totalRow"></p>
        <div id="content"></div>
        <div class="text-center">
            <ul class="pagination pagination-sm" style="margin: 0 auto;"></ul>
        </div>
        <input id="hidCurrPage" type="hidden" value="1" />
        <input id="hidPagesize" type="hidden" value="10" />

    </div>
</asp:Content>

