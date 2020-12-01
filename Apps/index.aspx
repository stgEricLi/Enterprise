<%@ Page Language="C#" AutoEventWireup="true" CodeFile="index.aspx.cs" Inherits="index" %>
<!DOCTYPE html>
<html>
<head runat="server">
  <title></title>
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <link href="css/login.css" rel="stylesheet" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>

</head>
<body>
  <div id="wrap">
    <form id="form1" runat="server">
    <div class="container-fluid" style="padding: 0px;">
      <div id="maintitle">
        <a href="../normal/camp.aspx"></a>
      </div>

      <div class="panel panel-primary ">
          <div class="panel-heading">
            <h3 class="panel-title"><span class="glyphicon glyphicon-log-in"></span>&nbsp;&nbsp;企業專區登入</h3>
          </div>
          <div class="panel-body">
            <div class="form-group">
              <span class="desc">帳號</span>
              <asp:TextBox ID="txtAcctID" runat="server" CssClass="form-control"></asp:TextBox>
            </div>

            <div class="form-group">
              <span class="desc">密碼</span>
              <asp:TextBox ID="txtPwd" runat="server" TextMode="Password" CssClass="form-control"></asp:TextBox>
            </div>
          </div>
          <div class="panel-footer clearfix">
            <div class="pull-right">             
             <asp:Button ID="btnLogin" runat="server" Text="登入" CssClass="btn btn-danger btn-md" style="width:66px!important;" OnClick="btnLogin_Click" />
            </div>
            <div class="clearfix"></div>
            <div>
              <asp:Literal ID="lbmg" runat="server"></asp:Literal>
            </div>
            
          </div>
        </div>
    </div>   
  </form>
    <div id="push"></div>
  </div>
   <div id="footer">
    <div class="container">
      <p>
            <a href="normal/camp.aspx">MCP 海天青旅行社</a>
      </p>
      <p>MCP 海天青旅遊臉書粉絲團：<a href="https://www.facebook.com/SkylinesTravel" target="_blank">http://www.facebook.com/mcpsky</a></p>
      <p style="color: #c0c0c0;">&copy; Copyright 2014 All Rights Reserved MCP SKY service</p>
    </div>
  </div>
</body>
</html>
