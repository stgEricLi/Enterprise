<%@ Page Language="C#" AutoEventWireup="true" CodeFile="my_waiting_order.aspx.cs" Inherits="enterprise_wt_my_order" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>文曄科技線上報名-報名查詢</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
    <link href="../css/basic.css" rel="stylesheet" />
    <link href="css/order.css?v=<%= GetVersion() %>" rel="stylesheet" />
    <script src="js/wt.js?v=<%= GetVersion() %>"></script>
    <script src="js/my_waiting_order.js?v=<%= GetVersion() %>"></script>

    <style>        
         .listline td select {
            display: inline-block;
            margin-left: 2px;
        }

        .table th {
            text-align: center;
            padding: 6px;
            background-color: #EAF6FD;
        }

        .panel-body {
            background-color: transparent;
        }

            .panel-body ul {
                list-style: none;
            }

                .panel-body ul li input {
                    display: inline-block;
                    width: 52px;
                }

        #joiner {
            min-height: 300px;
        }

        #loading1, #loading-submit {
            display: none;
        }

        #actList li {
            text-decoration: underline;
            color: navy;
            cursor: pointer;
        }

        .modal-dialog {
            width: 600px !important;
        }

        .modal-header {
            padding: 9px 15px;
            border-bottom: 1px solid #eee;
            background-color: #F2DEDE;
            color: #fff;
            -webkit-border-top-left-radius: 5px;
            -webkit-border-top-right-radius: 5px;
            -moz-border-radius-topleft: 5px;
            -moz-border-radius-topright: 5px;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }

        .close {
            color: #595959;
        }

        #divErr {
            color: red;
        }
        .panel-primary{margin: 48px auto;}
    </style>
</head>
<body>
    <div class="container-fluid">

        <div id="step1" class="steps">
            <div class="panel panel-primary " style="width: 560px; margin: 48px auto;">
                <div class="panel-heading">
                    <h3 class="panel-title"><span class="glyphicon glyphicon-search"></span>&nbsp;&nbsp;文曄科技線上候補查詢</h3>
                </div>
                <div class="panel-body">
                    <div class="panel-heading" style="border-bottom: solid 1px #c0c0c0; margin-bottom: 16px;">
                        <h4 class="panel-title">員工驗證</h4>
                    </div>
                    <div class="panel-body">
                        <ul>
                            <li>
                                <span style="margin-right: 42px;">您的工號</span>
                                <input id="txtEid" type="text" class="form-control input" maxlength="8" style="width: 320px;" placeholder="工號" />
                            </li>
                            <li>
                                <span style="margin-right: 12px;">您的身分證號</span>
                                <input id="txtSid" type="text" class="form-control input" maxlength="10" style="width: 320px;" placeholder="身分證號" />
                            </li>
                        </ul>

                    </div>
                </div>
                <div class="panel-footer clearfix">
                    <div class="pull-right">
                        <button id="btnToS2" type="button" class="btn btn-success pull-right">送出</button>
                    </div>
                    <div class="clearfix"></div>

                    <div>
                        <div id="loading1">
                            <img src="../../img/basic/loader3.gif" />&nbsp;處理中，請稍後...</div>
                        <p id="login-msg" class="error"></p>
                    </div>
                </div>
            </div>
        </div>

        <div id="step2" class="steps">
            <div class="panel panel-primary ">
                <div class="panel-heading">
                    <h3 class="panel-title"><span class="glyphicon glyphicon-search"></span>&nbsp;&nbsp;您的候補清單</h3>
                </div>
                <div class="panel-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>單號</th>
                                <th>行程</th>
                                <th>活動日期</th>
                                <th>備註</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="actTr">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="step3" class="steps">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    <h3 class="panel-title"><span class="glyphicon glyphicon-search"></span>&nbsp;&nbsp;報名參加人&nbsp;&nbsp;<span id="lbNote"></span></h3>
                    <input id="hidActid" type="hidden" />
                    <input id="hidActName" type="hidden" />
                    <input id="hidRoomType" type="hidden" />
                    <input id="hidOrderID" type="hidden" />
                </div>
                <div class="panel-body">
                    <table class="table">
                        <tbody id="JoinerTr">
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer clearfix">
                    <button id="btnBackS2" type="button" class="btn btn-danger pull-left">上一步</button>
                    <button id="btnConfirm" type="button" class="btn btn-success pull-right">下一步</button>                 
                </div>
            </div>
        </div>

        <div id="step4" class="steps">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    <h4 class="panel-title">請先確認下方表單中參加人資料是否正確，然後再送出</h4>
                </div>

                <div class="panel-body">
                    <input id="total" type="hidden" value="0" />
                    <div id="confirmation"></div>
                </div>

                <div class="modal-footer clearfix">
                    <button id="btnBackS3" type="button" class="btn btn-danger pull-left">上一步</button>                    
                    <button id="btnSubmit" type="button" class="btn btn-success pull-right">確認送出</button>
                     <span id="loading-submit">
                            <img src="../../img/basic/loader3.gif" />&nbsp;請稍後...&nbsp;
                     </span>
                </div>
            </div>
        </div>

        <div id="errModal" class="modal fade" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 id="errTitle" class="modal-title"></h4>
                    </div>
                    <div class="modal-body">
                        <div id='divErr'>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="btnDismiss" class="btn btn-danger">關閉</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="myModal" class="modal fade" data-keyboard="false" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">報名修改完成</h4>
                    </div>
                    <div class="modal-body">
                        <div id="odcnt"></div>
                    </div>
                    <div class="modal-footer">
                        <button id="btnFinish" type="button" class="btn btn-danger">關閉</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <form id="form1" runat="server"></form>
</body>
</html>
