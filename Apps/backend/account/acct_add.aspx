<%@ Page Title="" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="acct_add.aspx.cs" Inherits="backend_account_acct_add" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
 
  <script src="js/acct_add.js?v=<%= GetVersion() %>"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
  <div id="wrap">
    <h3>新增企業帳號</h3>
    <div style="padding:24px;">
      <div class="input-zone">
        <span class="titl">帳號名稱</span>
        <input id="txtName" type="text" maxlength="20" class="form-control required" placeholder="帳號名稱">
        <span class="titl">帳號 Email</span>
        <input id="txtEmail" type="email" maxlength="50" class="form-control email required"  placeholder="Email">
      </div>
      <div class="input-zone">
       <span class="titl">帳號密碼</span>
       <input id="txtPassword" type="password" maxlength="20" class="form-control required"  placeholder="至少六個字元的密碼">
      </div>
      <div class="input-zone">
        <span class="titl">公司名稱</span>
        <input id="txtCompanyName" type="text" maxlength="50" class="form-control required" />
        <%--<span class="titl">公司統編</span>
        <input id="txtCompanyID" type="text" maxlength="20" class="form-control" />--%>
      </div>
    <%--  <div class="input-zone">
        <span class="titl">公司電話</span>
        <input id="txtCompantTel" type="text" maxlength="20" class="form-control" placeholder="02-2383-0294" />
        <span class="titl">聯絡人手機</span>
        <input id="txtCell" type="text" maxlength="20" class="form-control" placeholder="0932-555666"/>
      </div>
      <div class="input-zone">
        <span class="titl">公司地址</span>
        <input id="txtAddress" type="text" maxlength="50" class="form-control" style="width:345px!important;" />        
      </div>--%>

      <div class="input-zone">
        
        <input id="ckDir" type="checkbox" class="form-control" />   新建資料夾     
      </div>
  
      <div class="input-zone" style="">
        <button id="btnRegister" type="button" class="btn btn-danger btn-md">新增企業帳號</button>
        <span id="imgLoading" style="display:none; color:blue;"><img src="../../img/basic/loader3.gif" />&nbsp;處理中...</span>
        <span id="lbmsg" class="warning"></span>        
      </div>
    </div>
  </div>
</asp:Content>

