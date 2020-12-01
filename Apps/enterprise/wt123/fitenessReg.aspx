<%@ Page Language="C#" AutoEventWireup="true" CodeFile="fitenessReg.aspx.cs" Inherits="enterprise_wt123_fitenessReg" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
  <title>文曄減重競賽報名</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
  <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.13.1/jquery.validate.min.js"></script>
  <script src="../js/jquery-validator-normalpage.js"></script>
  <script src="../js/custom-validator.js"></script>
  <link href="../css/basic.css" rel="stylesheet" />
  
  <script src="js/fitReg.js?v=<%= GetVersion() %>"></script>
    <style>
     .list-group-item{ background-color:#EDEDB7; border-color:#3DDBCD;}
     .subUl {margin-left:6px; list-style:none;}
     .panel-heading{font-weight:bold; font-size:16px;}
    </style>
</head>
<body>
     <form id="form1" runat="server">
    <div class="container-fluid">
        <div style="text-align:center;">
          <h1 class="text-info">MCP海天青-文曄減重競賽報名</h1>
          <asp:HiddenField ID="hidActid" runat="server" />
          <asp:HiddenField ID="hidActName" runat="server" />
          <asp:HiddenField ID="hidCapacity" runat="server" />         
        </div>

        <div style="margin-top:24px; margin-bottom:24px;">
            <div class="input-zone">
                <span class="titl">報名方式</span>
                <select id="ddlOption" class="form-control" style="width:206px!important;">       
                  <option value="multip">團體報名（須為三人）</option>         
                    <option value="one">個人報名（一人）</option>
                    
                </select>
            </div>
        </div>

        <div class="panel panel-primary">
          <div class="panel-heading">參加人資訊</div>
          <div class="panel-body">
            <div class="input-zone">
              <span class="titl">姓名</span>
              <input id="txtMname" type="text" maxlength="20" class="form-control" placeholder="請輸入真實中文姓名" />
              <span class="titl">身份證號</span>
              <input id="txtMSid" type="text" maxlength="20" class="form-control" placeholder="身份證號或護照號碼" />
            </div>

            <div class="input-zone">
              <%--<span class="titl">生日</span>
               <input id="txtMDob" type="text" maxlength="10" class="form-control dateISO required" placeholder="yyyy/mm/dd" />--%>
               <span class="titl">工號</span>
              <input id="txtMEid" type="text" maxlength="20" class="form-control required" placeholder="請輸入員工工號" />
            </div>

             <div class="input-zone">
              <span class="titl">聯絡電話</span>
               <input id="txtMTel" type="text" maxlength="20" class="form-control tel required" placeholder="格式：02-8226-9088" />
               &nbsp;
               <input id="txtExTel" type="text" maxlength="10" class="form-control number required" style="width: 94px!important;" placeholder="分機" />
            </div>

            <div class="input-zone">
              <span class="titl">聯絡手機</span>
              <input id="txtMCell" type="text" maxlength="20" class="form-control cell required" placeholder="格式為：0936-123456" />
            </div>

            <div class="input-zone">
              <span class="titl">Email</span>
              <input id="txtMMail" type="text" maxlength="60" class="form-control email required" placeholder="請輸入Email" style="width:34%!important;" />
            </div>

           
            <div class="modal-footer">
                  <span id="imgLoading" style="display: none; color: blue;"><img src="../../img/basic/loader3.gif" />&nbsp;處理中請稍待...</span>
                  <span id="msgError" class="wrong"></span>&nbsp;&nbsp;
                  <button id="btnOneSubmit" type="button" class="btn btn-danger btn-md">送出</button>
                  <button id="btnAddMajor" type="button" class="btn btn-success btn-md" style="display:none;">加到參加人</button>
              </div>
     
          </div>      
        </div>

        <div id="mtpl">
            <div class="panel panel-success">
                <div class="panel-heading">參加人資訊</div>
                <div class="panel-body">
                    <div class="input-zone">
                        <span class="titl">團隊名稱</span>
                        <input id="txtGpName" type="text" maxlength="50" class="form-control" placeholder="請輸入團隊名稱" style="width: 34%!important;" />
                    </div>
                    <br />
                    <table class="table table-responsive joinTbl">
                        <thead>
                            <tr>
                                <th>姓名</th><th>身份證</th><th>手機</th><th>Email</th><th>工號</th><th></th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <span id="createLoading" style="display: none; color: blue;"><img src="../../img/basic/loader3.gif" />&nbsp;處理中請稍待...</span>
                    <span id="gpErr" class="wrong"></span>&nbsp;&nbsp;
                    <button id="btnMultipSubmit" type="button" class="btn btn-danger btn-md" style="display:none;">送出</button>
                </div>
            </div>
        </div>
    
        
    </div>
     <div id="myModal" class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">              
              <h4 class="modal-title">線上註冊已完成</h4>
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
