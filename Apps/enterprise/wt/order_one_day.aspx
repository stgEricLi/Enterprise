﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="order_one_day.aspx.cs" Inherits="enterprise_wt_order_one_day" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>文曄科技線上一日遊報名</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
    <link href="../css/basic.css" rel="stylesheet" />
    <link href="css/order.css?v=<%= GetVersion() %>" rel="stylesheet" />
    <script src="js/wt.js?v=<%= GetVersion() %>"></script>
    <script src="js/order_oneday.js?v=<%= GetVersion() %>"></script>
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
        #lbAgree{font-size:18px;}
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="container-fluid">
            <div style="text-align: center;">
                <h1 class="text-info">MCP海天青-文瞱科技一日遊線上報名</h1>
                <asp:Literal ID="Literal1" runat="server"></asp:Literal>
                <asp:HiddenField ID="hidActid" runat="server" />
                <asp:HiddenField ID="hidActName" runat="server" />
                <asp:HiddenField ID="hidCapacity" runat="server" />
            </div>

            <div id="step1" class="steps">
               <div id="pgDesc" class="panel panel-danger ">
                </div>

                <div class="panel panel-primary">
                    <div class="panel-heading">
                        <h4 class="panel-title">員工驗證</h4>
                    </div>
                    <div class="panel-body">
                        <ul>
                            <%--<li>
              <span style="margin-right: 42px;">您的姓名</span>
              <input id="txtLeaderName" type="text" class="form-control input" maxlength="20" style="width: 120px;" placeholder="姓名" />
            </li>--%>
                            <li>
                                <span style="margin-right: 42px;">您的工號</span>
                                <input id="txtLeaderEid" type="text" class="form-control input" maxlength="8" style="width: 120px;" placeholder="工號" />
                            </li>
                            <li>
                                <span style="margin-right: 12px;">您的身分證號</span>
                                <input id="txtLeaderSid" type="text" class="form-control input" maxlength="10" style="width: 120px;" placeholder="身分證號" />
                            </li>
                        </ul>

                    </div>
                </div>

                <div class="panel panel-primary">
                    <div class="panel-heading">
                        <%--<h4 class="panel-title">請依需求選擇房型（請注意：參加人數須與房間床位數一致，六歲以下兒童請另行電話報名，不要將其加入清單中）</h4>--%>
                        <h4 class="panel-title">請選擇報名人數</h4>
                    </div>
                    <div class="panel-body">
                        <ul>
                            <li>
                                <select id="ddlRoom" class="form-control" style="width: 42%;">
                                    <option value="1">僅有本人參加</option>
                                    <option value="2">一共2位參加人</option>
                                    <option value="3">一共3位參加人</option>
                                    <option value="4">一共4位參加人</option>
                                    <option value="5">一共5位參加人(4位成人+1位三歲以下小孩)</option>
                                    <option value="6">一共6位參加人(4位成人+2位三歲以下小孩)</option>                                                                   </select>
                            </li>
                            <li><span id="txtRestRoom"></span></li>
                        </ul>
                    </div>
                </div>

                <div class="clearfix">
                    <button id="btnToS2" type="button" class="btn btn-success pull-right">下一步</button>
                </div>
            </div>

            <div id="step2" class="steps">
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        <h4 class="panel-title">請於下方表單中詳實輸入參加人資料</h4>
                    </div>

                    <div class="panel-body">
                        <ul>
                            <li>聯絡人電話：<input id="txtPhone" type="text" class="form-control input-sm" maxlength="12" style="width: 116px;" />
                                分機：<input id="txtExt" type="text" class="form-control input-sm" maxlength="6" style="width: 66px;" />
                                <span id="txtRoomRemind" style="margin-left: 12px; color: red;"></span>
                            </li>

                        </ul>

                        <div id="joiner"></div>
                    </div>

                    <div class="modal-footer clearfix">
                        <button id="btnToS1" type="button" class="btn btn-danger pull-left">上一步</button>
                        <button id="btnToS3" type="button" class="btn btn-success pull-right">下一步</button>
                    </div>
                </div>

                <div id="divMsg" class="alert  collapse">
                    <a id="btnMgClose" class="close" href="#">&times;</a>
                    <div id="txtMsg"></div>
                </div>
            </div>

            <div id="step3" class="steps">
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        <h4 class="panel-title">請先確認下方表單中參加人資料是否正確，然後再送出表單</h4>
                    </div>

                    <div class="panel-body">
                        <input id="total" type="hidden" value="0" />
                        <div id="confirmation"></div>
                    </div>

                    <div class="modal-footer clearfix">
                        <button id="btnBackS2" type="button" class="btn btn-danger pull-left">上一步</button>
                        <span id="imgLoading" style="display: none; color: #c0c0c0;">
                            <img src="../../img/basic/loader3.gif" />&nbsp;處理中請稍待...</span>
                        <button id="btnSubmit" type="button" class="btn btn-success pull-right">確認送出</button>
                        <button id="btnWaiting" type="button" class="btn btn-success pull-right">我要候補</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="myModal" class="modal fade" data-keyboard="false" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">線上報名已完成</h4>
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
    </form>
</body>
</html>
