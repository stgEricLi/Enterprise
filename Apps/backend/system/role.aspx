<%@ Page Title="" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="role.aspx.cs" Inherits="backend_system_role" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
  <script src="js/role.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
  <div id="wrap">
    <h3>群組管理</h3>
      <div class="input-zone">
        <span class="titl">群組名稱</span>
        <input id="txtRole" type="text" maxlength="15" class="form-control input-sm" style="width:160px!important;" />
        <button id="btnAdd" type="button" class="btn btn-sm btn-danger">新增群組</button>    
        &nbsp;
        <span id="imgLoad" style="display:none;"><img src="../../img/basic/loader3.gif" /></span>   
      </div>   
    <div class="line"></div>
     <div>
        <asp:UpdateProgress ID="UpdateProgress1" runat="server" AssociatedUpdatePanelID="UpdatePanel1">
          <ProgressTemplate>
            <img src="../../img/basic/loader3.gif" />
            <span style="color: red;">載入中...</span>
          </ProgressTemplate>
        </asp:UpdateProgress>

        <asp:UpdatePanel ID="UpdatePanel1" runat="server" UpdateMode="Conditional">
         <ContentTemplate>
          <asp:Label ID="lbTotalRec" runat="server"></asp:Label>
          <asp:ListView ID="ListView1" runat="server"  >
            <EmptyItemTemplate>
              <div class='emptydata'>無資料！</div>
            </EmptyItemTemplate>

            <LayoutTemplate>
            <div class='list'>
              <ul>
                <asp:PlaceHolder ID="itemPlaceholder" runat="server"></asp:PlaceHolder>
              </ul>              
            </div>
          </LayoutTemplate>
          <ItemTemplate>
            <li>
              <asp:Label ID="lbRole" runat="server" Text='<%#Eval("RoleName") %>'></asp:Label>              
            </li>           
          </ItemTemplate>
          </asp:ListView>     
        </ContentTemplate>        
        </asp:UpdatePanel>

        

      </div>
  </div>
</asp:Content>

