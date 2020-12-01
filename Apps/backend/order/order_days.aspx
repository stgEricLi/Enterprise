<%@ Page Title="" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="order_days.aspx.cs" Inherits="backend_order_order_days" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
  <script src="../js/utilities.js?v=<%= GetVersion() %>"></script>
  <script src="js/order_days.js?v=<%= GetVersion() %>"></script>
  <style>
        .listline td select{display:inline-block; margin-left:2px;}
        .table {width:80%;}
        .table th{text-align:center; padding:6px; background-color:#EAF6FD;}
        .panel-body{background-color:transparent;}
        .input-sm{display:inline-block;}
        #joiner{ min-height:300px; margin-top:36px;}
        #lbMsg{ margin-top:12px;margin-bottom:12px; color:red;}
  </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div id="wrap">
      <div class="container-fluid">
        <div>
          <select id="ddlAct" class="form-control" style="width:480px!important; display:inline-block;"></select>
          <span id="loading" style="color: blue;"><img src="../../img/basic/loader3.gif" />&nbsp;資料處理中請稍後...</span>
        </div>
        
        <div id="lbInfo" style="display:none; margin-top:24px;">
          <select id="ddlRoom" class="form-control" style="width:280px; display:inline-block; margin-right:12px;"></select>
          剩餘人數: &nbsp;<span id="txtCapacity"></span>&nbsp;
          剩餘二人房: &nbsp;<span id="txtRoom2"></span>&nbsp;
          剩餘四人房: &nbsp;<span id="txtRoom4"></span>
        </div>

        <p id="lbMsg"></p>

        

        <div id="joiner" style="display:none;">
          <div style="margin-top:12px; margin-bottom:12px;">
            <input id="txtPhone" type="text" class="form-control input-sm" maxlength="12" style="width:246px;" placeholder="聯絡人電話 02-0000-0000" />
            <input id="txtExt" type="text" class="form-control input-sm" maxlength="6" style="width:96px;" placeholder="分機" /> 
          </div>
          
        
          
          <table class="table">
            <thead>
              <tr>
                <th>中文姓名</th><th>身分字號</th><th>生日</th><th>員工工號</th><th>手機</th><th>素食</th><th>Email</th>
              </tr>
            </thead>
            <tbody id="tbl">

            </tbody>
            <tfoot>
              <tr>
                <td colspan="7" style="text-align:right;">
                  <button id="btnVerify" type="button" class="btn btn-danger">資料驗證</button>
                  <button id="btnSubmit" type="button" class="btn btn-success" style="display:none;">送出訂單</button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>    
  </div>
</asp:Content>

