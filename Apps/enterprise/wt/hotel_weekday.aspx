<%@ Page Language="C#" AutoEventWireup="true" CodeFile="hotel_weekday.aspx.cs" Inherits="enterprise_wt_hotel_weekday" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>文瞱科技線上飯店房型查詢</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>

    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>

    <link href="../../css/jquery-ui.css" rel="stylesheet" />
    <%-- <link href="../../backend/css/calendar.css"  rel="stylesheet"/>--%>



    <script src="../../js/jquery-ui-1.10.4.custom.min.js"></script>
    <script src="../../js/jquery.ui.datepicker-zh-TW.js"></script>
    <script src="js/wt.js?v=<%= GetVersion() %>"></script>
    <link href="css/hotel.css?v=<%= GetVersion() %>" rel="stylesheet" />
    <script src="js/hotel_weekday.js?v=<%= GetVersion() %>"></script>

    <style>
        body {
            font-family: "微軟正黑體";
            /* background-color: #e3e5e7b2 !important; */
        }

        .jumbotron {
            /* color: #e6f2ff; */
            background-color: #e6f2ff !important;
        }

        .head {
            background-repeat: no-repeat;
            /*  */
            height: 220px;
            margin: 3px auto 0;
            position: relative;
            background-position: center;
            background-image: url("../../../img/basic/logo.jpg");
            background-color: #e6f2ff;
        }

        @media only screen and (max-width: 600px) {
            .head {
                height: 56px;
                background-size: 100% 100%;
            }
        }

        .ui-datepicker {
            font-size: 90% !important;
            margin-bottom: 24px;
        }

        /*.card {
            margin: 0 auto;
            width: 50%;
        }*/
        .form-row {
            margin-bottom: 24px;
        }

        input.form-control {
            width:80%;
        }
        select.form-control {
            width:80%;
        }

        .card-body {
            padding: 12px !important;
        }

        #errMsg {
            font-size: 16px;
            font-weight: 500;           
            color: red;
        }
        #okMsg{
            font-size: 16px;
            font-weight: 500;           
            color: forestgreen;
        }

        #loading {
            color: #c0c0c0;
            font-size: 20px;
            padding-left: 24px;
        }

        .available {
            color: #669900;
        }

        .unable {
            color: #c0c0c0;
        }

        table.table-bordered > thead > tr > th {
            border: 1px solid #336699;
            background: #336699;
            color: white;
            text-align: center;
        }

        table.table-bordered > tbody > tr > td {
            border: 1px solid #336699;
            text-align: center;
        }
    </style>

</head>

<body>
    <form id="form1" runat="server">
        <asp:HiddenField ID="hidMaster" runat="server" />

        <div class="head"></div>
     
        <div class="container mt-5 mb-5">
            <div class="card">
                <div class="card-header text-center">
                    <h3>文瞱集團平日飯店補助申請表</h3>
                </div>
                <div class="card-body">

                    <div class="form-row">
                        <div class="col">
                            <label for="ddlHotel">入住飯店：</label>
                            <select id="ddlHotel" class="form-control">
                                <option value="N">請選擇飯店</option>
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
                        </div>
                        <div class="col">
                            <label for="txtDate">員工姓名：</label>
                            <input id="txtName" type="text" class="form-control" maxlength="8"  placeholder="姓名" />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="col">
                            <label for="txtDate">入住人數：<span id="myRoom" class="text-success small"></span></label>
                            <select id="ddlMb" class="form-control">
                                 <option value="N">請選擇入住人數</option>
                                <option value="2A">2大</option>
                                <option value="2B">2大+6歲以下不佔床小朋友</option>
                                <option value="3A">2大+1位(4-6歲佔床)+3歲以下 baby</option>
                                <option value="3B">3大</option>
                                <option value="3C">3大+6歲以下不佔床小朋友</option>
                                <option value="4A">3大+1位(4-6歲佔床)+3歲以下 baby</option>
                                <option value="4B">4大</option>
                                <option value="4C">4大+6歲以下不佔床小朋友</option>
                            </select>
                            
                        </div>
                        <div class="col">
                            <label for="txtEid">員工工號：</label>
                            <input id="txtEid" type="text" class="form-control" maxlength="8"  placeholder="工號" />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="col">
                            <label for="txtDate">入住日期：</label>
                            <input id="txtDate" type="text" class="form-control" placeholder="YYYY/MM/DD" maxlength="10" />
                        </div>
                        <div class="col">
                            <label for="txtDob">員工生日：</label>
                             <input id="txtDob" type="text" class="form-control" placeholder="YYYY/MM/DD" maxlength="10"/>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="col">
                            <label for="ddlCk">CHICK-IN 時間： </label>
                            <select id="ddlCk" class="form-control">
                                <option value="15:00">15:00</option>
                                <option value="15:30">15:30</option>
                                <option value="16:00">16:00</option>
                                <option value="16:30">16:30</option>
                                <option value="17:00">17:00</option>
                                <option value="17:30">17:30</option>
                                <option value="18:00">18:00</option>
                                <option value="18:30">18:30</option>
                                <option value="19:00">19:00</option>
                                <option value="19:30">19:30</option>
                            </select>
                        </div>
                        <div class="col">
                            <label for="txtSid">員工身分證：</label>
                            <input id="txtSid" type="text" class="form-control"  placeholder="身分證號" maxlength="20"/>                            
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="col">
                            <label for="txtPhone">聯絡電話-分機： </label>
                            <div class="d-flex">
                                <input id="txtPhone" type="text" class="form-control" maxlength="12" style="width: 60%;" placeholder="02-0000-0000"/>
                                &nbsp; - &nbsp;
                                <input id="txtExt" type="text" class="form-control" maxlength="6" style="width: 96px;" placeholder="分機號"/>
                            </div>

                        </div>
                        <div class="col">
                            <label for="txtEmail">員工 E-mail：</label>
                            <input id="txtEmail" type="text" class="form-control"  placeholder="email" maxlength="80"/>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="col">
                            <label for="txtCell">聯絡手機： </label>
                            <input id="txtCell" type="text" class="form-control" maxlength="12" placeholder="0900-000000"/>
                        </div>
                        <div class="col">
                            <label for="txtCmt">備註說明：</label>
                            <input id="txtCmt" type="text" class="form-control"  placeholder="備註說明" maxlength="100"/>
                        </div>
                    </div>

                    <div id="errMsg">

                    </div>

                    <div id="okMsg">

                    </div>

                    <div id="loading">                       
                    <i class="fas fa-cog fa-spin"></i> &nbsp;資料處理中，請稍待...               
                    </div>

                </div>
                <div class="card-footer">
                    <button id="btnSubmit" type="button" class="btn btn-primary btn-block">確認送出</button>
                </div>
            </div>

           

        </div>
    </form>
</body>
</html>
