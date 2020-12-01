<%@ Page Language="C#" AutoEventWireup="true" CodeFile="hotel_checkup.aspx.cs" Inherits="enterprise_wt_hotel_checkup" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>文瞱科技線上飯店房型查詢</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" />

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous" />
    <link rel="stylesheet" href="../css/hotel.css" />
    <!-- jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <!-- Popper JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>

    <!-- Latest compiled JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>

    <link href="css/hotel.css?v=<%= GetVersion() %>" rel="stylesheet" />

    <script src="js/hotel_check.js?v=<%= GetVersion() %>"></script>
    <style>
        #warning {
            font-size: 20px;
            font-weight: 500;
            padding-left: 24px;
            color:brown;
        }
        #loading{
            color:#c0c0c0;
            font-size: 20px;
            padding-left: 24px;
        }
        .available{
            color:#669900;
        }
        .unable{
            color:#c0c0c0;
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
        <asp:HiddenField ID="hidActid" runat="server" />
        <div class="head"></div>
        <h1 class="text-primary text-center mt-5">文瞱科技線上飯店房型查詢</h1>
        <div class="container mt-5">
            <div class="d-flex">
                <select id="ddlHotel" class="form-control" style="width: 240px;">
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
                <span id="warning">您尚未選擇飯店</span>
                <span id="loading">
                    <i class="fas fa-cog fa-spin"></i> &nbsp;載入中，請稍待...
                </span>
            </div>
            <!-- END OF TITLE -->
            <div id="schedule" class="recommend">
             
            </div>
        </div>
    </form>
</body>
</html>
