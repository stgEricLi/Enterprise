<%@ Page Title="新增群組" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="role_add.aspx.cs" Inherits="backend_account_role_add" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
  <script src="js/role_add.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
   <div id="wrap">
    <h3>新增群組</h3>
    <div style="padding:24px;">
      <div class="input-zone">
        <span class="titl">群組名稱</span>
        <input id="txtName" type="text" maxlength="20" class="form-control required" placeholder="群組名稱">       
      </div>     
      <div class="input-zone" style="">
        <button id="btnRegister" type="button" class="btn btn-danger btn-md">新增群組</button>
        <span id="imgLoading" style="display:none; color:blue;"><img src="../../img/basic/loader3.gif" />&nbsp;處理中...</span>
        <span id="lbmsg" class="warning"></span>        
      </div>
    </div>
  </div>
</asp:Content>

