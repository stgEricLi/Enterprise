<%@ Page Title="" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="act_add.aspx.cs" Inherits="backend_itinerary_act_add" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
  <link href="../css/jquery-ui.css" rel="stylesheet" />
  <link href="../css/calendar.css?v=<%= GetVersion() %>"  rel="stylesheet"/>
  <script src="../../js/jquery-ui-1.10.4.custom.min.js"></script>
  <script src="../../js/jquery.ui.datepicker-zh-TW.js"></script>  
  <script src="js/act_add.js?v=<%= GetVersion() %>"></script>  
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
  <div id="wrap">
    <h3>新增活動資料&nbsp;&nbsp;</h3>    
      <div class="input-zone">
        <span class="titl">所屬企業</span>
        <select id="ddlCompany" class="form-control" style="width:206px!important;"></select>        
      </div>
      <div class="input-zone">
        <span class="titl">活動名稱</span>
        <input id="txtDesc" type="text" maxlength="50" class="form-control required" style="width:460px!important;" />
      </div> 
    <div class="input-zone">
        <span class="titl">活動型態</span>
        <select id="ddlType" class="form-control required" style="width:460px!important;">
          <option value="1">一日遊</option>
          <option value="2">二日遊</option>
        </select>
      </div>      
      <div class="input-zone ll-skin-cangas">
        <span class="titl">活動日</span>
        <input id="txtStDay" type="text" maxlength="10" class="form-control dateISO required" placeholder="yyyy/mm/dd" style="width:120px!important;" />
        
      </div>
    <div class="input-zone ll-skin-santiago">
      <span class="titl">報名終止日</span>
        <input id="txtEdDay" type="text" maxlength="10" class="form-control dateISO required" placeholder="yyyy/mm/dd" style="width:120px!important;"/>
    </div>
      <div class="input-zone">
        <span class="titl">價格A</span>
        <input id="txtPrice1" type="text" maxlength="6" class="form-control digits required" style="width: 84px!important;"/>
        <span class="titl">價格B</span>
        <input id="txtPrice2" type="text" maxlength="6" class="form-control digits required" style="width: 84px!important;" />
      </div>
    <div class="input-zone">
        <span class="titl">兩人房數</span>
        <input id="txtRoom2" type="text" maxlength="2" class="form-control digits required" style="width: 84px!important;"/>
        <span class="titl">四人房數</span>
        <input id="txtRoom4" type="text" maxlength="2" class="form-control digits required" style="width: 84px!important;" />
      </div>
      <div class="input-zone">
        <span class="titl">可容納人數</span>
        <input id="txtCapacity" type="text" maxlength="6" class="form-control digits required" style="width: 84px!important;"/>
        <span class="titl">是否開啟</span>
        <select id="ddlEnable" class="form-control" style="width:120px!important;">
          <option value="true">是</option>
          <option value="false">否</option>
          
        </select>                
      </div>         
      <div class="input-zone">
        <button id="btnNew" type="button" class="btn btn-success">新增活動</button>
        <span id="imgStep1" style="display: none; color: blue;"><img src="../../img/basic/loader3.gif" />&nbsp;處理中...</span>
        <span id="msgStep1" class="wrong"></span>        
      </div> 
    
  
  </div>
</asp:Content>

