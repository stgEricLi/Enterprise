<%@ Page Title="" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="acct_edit.aspx.cs" Inherits="backend_account_acct_edit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
  <script src="../js/paging.js?v=<%= GetVersion() %>"></script>
  <script src="js/acct_edit.js?v=<%= GetVersion() %>"></script>
  <style>
       .glyphicon-floppy-disk { color: #fff; cursor: pointer; }
       .glyphicon-remove { color: #fff; cursor: pointer; }
       .glyphicon-envelope	{ color: #fff; cursor: pointer; }
       .glyphicon-lock {  color:Red!important; cursor: pointer!important; }
       .glyphicon-ok-sign {  color:Green!important;  }
      
       .table th { text-align:center!important; }
       .table td { text-align:center!important;}
        tr#footline input{ background-color:#fcfbbf;}
        tr#footline select{ background-color:#fcfbbf;}

       .switch { position: relative; display: inline-block;  width: 40px; height: 18px;}
       .switch input {display:none;}
       .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s;}
       .slider:before {  position: absolute;  content: "";  height: 14px;  width: 14px;  left: 0px;  bottom: 2px;  background-color: white;  -webkit-transition: .4s;  transition: .4s;}
       input:checked + .slider {background-color: #2196F3;}
       input:focus + .slider { box-shadow: 0 0 1px #2196F3;}
       input:checked + .slider:before { -webkit-transform: translateX(26px);  -ms-transform: translateX(26px);  transform: translateX(26px);}
       /* Rounded sliders */
       .slider.round { border-radius: 34px;}
       .slider.round:before { border-radius: 50%;}

  </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
   <div id="wrap">

     <h3>帳號查詢編輯</h3>
     <div class="container-fluid">
       <div class="input-zone">
          <select id="ddlOption" class="form-control" style="width: 206px!important;">
              <option value="All">查詢所有帳號</option>
              <option value="Name">依照帳號名稱查詢</option>
              <option value="Email">依照帳號Email查詢</option>
          </select>             
          <input id="txtValue" type="text" class="form-control required" maxlength="50" />    
          <button id="btnSearch" type="button" class="btn btn-success">查詢</button>          
          <span id="loading" style="display: none; color: blue;"><img src="../../img/basic/loader3.gif" />&nbsp;處理中...</span>
      </div>
      <div class="line"></div>
      <p class="totalRow"></p>
      <div id="content"></div>
      <div class="text-center">
        <ul class="pagination pagination-sm" style="margin:0 auto;"></ul>
      </div>
      <input id="hidCurrPage" type="hidden" value="1" />
      <input id="hidPagesize" type="hidden" value="10" />
     </div>  
    


        <%--跳出視窗--%>
      <div id="myModal" class="modal fade" data-backdrop="static" >
        <div class="modal-dialog" style="width:660px!important;">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 class="modal-title" style="display:inline-block!important;">帳號密碼</h4>
              <span id="UserTitle"></span>              
              
              <span id="ModalLoading" style="display:none; color:#669900;">
                <img src="../../img/basic/loader3.gif" />&nbsp;資料載入中...
              </span>                      
            </div>
            <div class="modal-body">              
             <div id="result">
               <%--<div class="input-zone">
                 <span class="titl">公司名稱</span>
                 <input id="txtCompanyName" type="text" maxlength="50" class="form-control required" style="width:160px!important;"/>
                 <span class="titl">公司統編</span>
                 <input id="txtCompanyID" type="text" maxlength="20" class="form-control" style="width:160px!important;"/>
               </div>
               <div class="input-zone">
                 <span class="titl">公司電話</span>
                 <input id="txtCompantTel" type="text" maxlength="20" class="form-control" placeholder="02-2383-0294" style="width:160px!important;"/>
                 <span class="titl">其他電話</span>
                 <input id="txtTel2" type="text" maxlength="20" class="form-control" placeholder="02-2383-0294" style="width:160px!important;"/>                 
               </div>
               <div class="input-zone">
                 <span class="titl">聯絡人手機</span>
                 <input id="txtCell1" type="text" maxlength="20" class="form-control" placeholder="0932-555666" style="width:160px!important;"/>
                 <span class="titl">其他手機</span>
                 <input id="txtCell2" type="text" maxlength="20" class="form-control" placeholder="0932-555666" style="width:160px!important;"/>
               </div>
               <div class="input-zone">
                 <span class="titl">公司傳真</span>
                 <input id="txtFax" type="text" maxlength="20" class="form-control" placeholder="02-2383-0294" style="width:160px!important;"/>                 
               </div>
               <div class="input-zone">
                 <span class="titl">公司地址</span>
                 <input id="txtAddress" type="text" maxlength="50" class="form-control" style="width:345px!important;" />
                 <button id="btnUpdate" type="button" onclick="update_account()"class="btn btn-danger btn-sm" >更新基本資訊</button>
               </div>               
               <hr />--%>   
               <div class="input-zone">
                 <span class="titl">新密碼：</span>
                 <input id="txtNewPwd" type="text" class="form-control input-sm" style="width:90px!important;" />
                 <button id="btnChange" type="button" onclick="ChangePwd()" class="btn btn-success btn-sm">變更密碼</button>&nbsp;
                 <%--<button id="btnGetPwd" type="button" onclick="GetPwd()" class="btn btn-success btn-sm">取得帳號密碼</button>&nbsp;--%>
                 <span id="currpwd" style="color:red;"></span>
               </div>       
              
             </div>
            </div>
            <div class="modal-footer">
              <span id="lbLoading" style="display:none;"><img src="../../img/basic/loader3.gif" />處理中...</span>
              <span id='lineError' class="wrong" style="margin-right:12px;"></span>
              
            </div>
          </div>
        </div>
      </div>
  
  </div>
</asp:Content>

