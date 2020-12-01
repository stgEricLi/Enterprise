<%@ Page Title="" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="act_import.aspx.cs" Inherits="backend_itinerary_act_import" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="../css/jquery-ui.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
    <script src="js/act_import.js?v=<%= GetVersion() %>"></script>
    <style>
        input[type="file"] {
            display: none;
        }

        .custom-file-upload:hover {
            background-color: #86b300;
        }

        .custom-file-upload {
            font-size: 1.0em;
            background-color: #1383ec;
            display: inline-block;
            padding: 6px;
            color: #FFFFFF;
            cursor: pointer;
            border: solid 2px #CFCFCF;
            border-radius: 6px;
            min-width: 86px;
            margin-left: 12px;
        }

        #loadimg {
            color: #8c8c8c;
            font-size: 1.0em;
            margin: 12px;    
             display: none;
        }

        .fas { margin-right:6px;}

        #result {
            border: solid 1px #c0c0c0;
            padding: 12px;
            margin-bottom: 24px;
           
        }

        #btnSubmit {
            display: none;
        }
    </style>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div id="wrap">
        <h3>CSV 活動行程匯入</h3>

        <div class="col-md-10 col-md-offset-1">
            <div id="fileselector" style="margin-top: 24px; margin-bottom: 24px;">                
                <label for="csvfile" class="custom-file-upload">選取 CSV 匯入檔案</label>
                <input type="file" id="csvfile" required />
            </div>

            <div style="margin-bottom:12px;">
                <span id="loadimg"><i class="fas fa-circle-notch fa-spin"></i>資料匯入中，請稍後...</span>
            </div>

            <div id="result">
            </div>

            <div class="clearfix">
                <button id="btnSubmit" type="button" class="btn btn-primary btn-md pull-right">開始匯入</button>                
            </div>

            <div id="divMsg" class="alert  collapse">
                <a id="btnMgClose" class="close" href="#">&times;</a>
                <div id="txtMsg"></div>
            </div>
        </div>

       
    </div>
</asp:Content>

