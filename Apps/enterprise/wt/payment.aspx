<%@ Page Language="C#" AutoEventWireup="true" CodeFile="payment.aspx.cs" Inherits="enterprise_wt_payment" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>MCP海天青-文曄科技線上匯款登錄</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
    <link href="../../css/jquery-ui.css" rel="stylesheet" />
    <script src="../../js/jquery-ui-1.10.4.custom.min.js"></script>
    <script src="../../js/jquery.ui.datepicker-zh-TW.js"></script>
    <script src="../js/custom-validator.js"></script>
    <script src="js/payment.js?v1"></script>
    <style>
        body {
            font: 400 15px 微軟正黑體, sans-serif;
            line-height: 1.8;
            color: #818181;
            background-color: #f2f2f2;
        }

        .container {
            width: 680px;
        }
          .ui-datepicker {
            font-size: 90% !important;
            margin-bottom: 24px;
        }

        #imgload {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div style="text-align: center;" class="clearfix">
            <h1 class="text-primary" style="margin-top: 66px;">文曄科技線上匯款登錄</h1>
        </div>

        <div class="panel panel-primary">
            <div class="panel-heading">請於下方輸入您的匯款資訊</div>
            <div class="panel-body">
                <form class="form-horizontal" role="form">
                    <div class="form-group">
                        <label class="control-label col-md-2 " for="txtOid">報名編號</label>
                        <div class="col-md-8 col-md-offset-1">
                            <input id="txtOid" type="text" maxlength="11" class="form-control required" placeholder="例如：H2020602001" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="control-label col-md-2" for="txtName">付款人名</label>
                        <div class="col-md-8 col-md-offset-1">
                            <input id="txtName" type="text" maxlength="20" class="form-control" placeholder="請輸入付款人名" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="control-label col-md-2" for="txtCell">聯絡手機</label>
                        <div class="col-md-8 col-md-offset-1">
                            <input id="txtCell" type="text" maxlength="20" class="form-control cell required" placeholder="例如：0933-123456" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-md-2" for="txtPrice">付款金額</label>
                        <div class="col-md-8 col-md-offset-1">
                            <input id="txtPrice" type="text" maxlength="6" class="form-control number" placeholder="" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-md-2" for="txtDate">匯款日期：</label>
                        <div class="col-md-8 col-md-offset-1">
                            <input id="txtDate" type="text" class="form-control" placeholder="YYYY/MM/DD" maxlength="10" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-md-2" for="ddlPay">付款方式</label>
                        <div class="col-md-8 col-md-offset-1">
                            <select id="ddlPay" class="form-control">
                                <option value="ATM轉帳">ATM轉帳</option>
                                <option value="現金存入">現金存入</option>
                                <option value="銀行匯款">銀行匯款</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-md-2" for="txtCode">帳號後五碼</label>
                        <div class="col-md-8 col-md-offset-1">
                            <input id="txtCode" type="text" maxlength="5" class="form-control number" placeholder="若為ATM轉帳請輸入" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="control-label col-md-2" for="txtCmt">備註說明</label>
                        <div class="col-md-8 col-md-offset-1">
                            <input id="txtCmt" type="text" maxlength="50" class="form-control" />
                        </div>
                    </div>
                </form>
            </div>
            <div class="panel-footer clearfix">
                <button id='btnSubmit' type="button" class="btn btn-danger pull-right">送出表單</button>
                <span id="lbmg"></span>
                <span id="imgload">
                    <img src="../../img/basic/loader3.gif" />&nbsp;處理中請稍待...</span>
            </div>
        </div>
    </div>
    <form id="form1" runat="server"></form>
</body>
</html>
