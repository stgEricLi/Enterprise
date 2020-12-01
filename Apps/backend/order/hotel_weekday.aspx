<%@ Page Title="" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="hotel_weekday.aspx.cs" Inherits="backend_order_hotel_weekday" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="css/order_edit_wt.css" rel="stylesheet" />
    <script src="../js/paging.js?v=<%= GetVersion() %>"></script>
    <script src="js/hotel_weekday.js?v=<%= GetVersion() %>"></script>
    <style>
        .glyphicon-floppy-disk {
            color: #fff;
            cursor: pointer;
        }

        .glyphicon-remove {
            color: #fff;
            cursor: pointer;
        }

        .glyphicon-envelope {
            color: #fff;
            cursor: pointer;
        }

        .w120{width:120px!important;}
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div id="wrap">
        <div class="container-fluid">
            <div class="input-zone">
                <select id="ddlOption" class="form-control" style="width: 206px!important;">
                    <option value="ACT">依飯店查詢</option>
                    <option value="EID">依員工工號查詢</option>
                    <option value="DAY">依日期 YYYY-MM-DD</option>
                </select>
                <select id="ddlAct" class="form-control" style="width: 406px!important;">
                    <option value="H2000000001">【宜蘭】傳藝老爺行旅</option>
                    <option value="H2000000003">【礁溪】山形閣飯店</option>
                    <option value="H2000000004">【蘇澳】煙波酒店</option>
                    <option value="H2000000005">【礁溪】兆品酒店</option>
                    <option value="H2000000006">【新竹】煙波湖濱館</option>
                    <option value="H2000000007">【福隆】福容大飯店</option>
                    <option value="H2000000008">【台中】日月千禧酒店</option>
                    <option value="H2000000009">【台南】大員皇冠酒店</option>
                    <option value="H2000000010">【高雄】義大皇冠酒店</option>
                    <option value="H2000000011">【墾丁】悠活度假村</option>
                    <option value="H2000000012">【台北】板橋凱撒飯店</option>
                    <option value="H2000000014">【新竹】六福莊生態渡假旅館</option>
                    <option value="H2000000002">【蘇澳】瓏山林飯店</option>
                </select>
                <input id="txtValue" type="text" class="form-control required w120" maxlength="50" />
                <input id="txtEndDate" type="text" class="form-control required w120" maxlength="50" />
                <button id="btnSearch" type="button" class="btn btn-success">查詢</button>
                <button id="btnExport" type="button" class="btn btn-success">依飯店匯出</button>
            </div>
             <span id="loading" style="display: none; color: blue;"><img src="../../img/basic/loader3.gif" />&nbsp;處理中...</span>
            <div class="line"></div>
            <p class="totalRow"></p>
            <div id="peoplecount" style="padding-top: 12px;  padding-bottom: 12px; color: #c0c0c0;"></div>
            <div id="content"></div>
            <div class="text-center">
                <ul class="pagination pagination-sm" style="margin: 0 auto;"></ul>
            </div>
            <input id="hidCurrPage" type="hidden" value="1" />
            <input id="hidPagesize" type="hidden" value="10" />
        </div>


    </div>
</asp:Content>

