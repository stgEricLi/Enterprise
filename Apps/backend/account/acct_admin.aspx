<%@ Page Title="" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="acct_admin.aspx.cs" Inherits="backend_account_acct_admin" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
  <script src="js/acct_admin.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
   <div id="wrap">
    <h3>新增管理員帳號</h3>
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
      <div class="input-zone" style="">
        <button id="btnRegister" type="button" class="btn btn-danger btn-md">新增管理員帳號</button>
        <span id="imgLoading" style="display:none; color:blue;"><img src="../../img/basic/loader3.gif" />&nbsp;處理中...</span>
        <span id="lbmsg" class="warning"></span>        
      </div>
    </div>
  </div>
</asp:Content>

