<%@ Page Title="" Language="C#" MasterPageFile="~/backend/zMaster.master" AutoEventWireup="true" CodeFile="account.aspx.cs" Inherits="backend_system_account" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
  <script src="js/account.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
  <div id="wrap">
    <h3>帳號查詢編輯</h3>
    <div class="input-zone">
      <span class="titl">帳號</span>
      <asp:TextBox ID="txtEmpID" runat="server" CssClass="form-control" MaxLength="15" style="width:124px!important;"></asp:TextBox>
      <asp:Button ID="btnQuery" runat="server" Text="查詢" OnClick="btnQuery_Click" CssClass="btn btn-primary btn-sm" style="width:84px!important;" />&nbsp;
      <asp:Label ID="lbError" runat="server" CssClass="wrong"></asp:Label>
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
          <asp:ListView ID="ListView1" runat="server" OnPagePropertiesChanged="ListView1_PagePropertiesChanged" OnDataBound="ListView1_DataBound" >
            <EmptyItemTemplate>
              <div class='emptydata'>此查詢條件下查無資料...！</div>
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
                <asp:Label ID="lbUsr" runat="server" Text='<%#Eval("UserName")%>'></asp:Label>
                <asp:Label ID="lbEmail" runat="server" Text='<%#Eval("Email")%>'></asp:Label>
                <asp:Label ID="lbStday" runat="server" Text='<%#Eval("CreateDate", "{0:yyyy/MM/dd}")%>'></asp:Label>
                <asp:Label ID="lbLgday" runat="server" Text='<%#Eval("LastLoginDate", "{0:yyyy/MM/dd}")%>'></asp:Label>
                <asp:Label ID="lbApprove" runat="server" Text='<%#Eval("IsApproved") %>'></asp:Label>   
                <asp:Label ID="lbLock" runat="server" Text='<%# Eval("IsLockedOut") %>' ></asp:Label>        
              </li>         
            </ItemTemplate>
          </asp:ListView>
          <div class="pager">
          <asp:DataPager ID="DataPager1" runat="server" PageSize="15" PagedControlID="ListView1">
            <Fields>
                <asp:NextPreviousPagerField ButtonType="Link" ShowFirstPageButton="False" ShowNextPageButton="False" ShowPreviousPageButton="True" FirstPageText="上一頁" />
                  <asp:NumericPagerField />
                <asp:NextPreviousPagerField ButtonType="Link" ShowFirstPageButton="False" ShowNextPageButton="True" ShowPreviousPageButton="False" FirstPageText="下一頁" />
              </Fields>
          </asp:DataPager>
          </div>
        </ContentTemplate>
         <Triggers>
            <asp:AsyncPostBackTrigger ControlID="btnQuery" EventName="Click" />
          </Triggers>
        </asp:UpdatePanel>

        <asp:ObjectDataSource ID="ObjList" runat="server" OnSelected="ObjList_Selected" 
          TypeName="FNSystem" SelectMethod="sp_Get_Users" SelectCountMethod="sp_Get_Users_Rows" EnablePaging="True">
        </asp:ObjectDataSource>

      </div>

        <%--跳出視窗--%>
      <div id="myModal" class="modal fade" data-backdrop="static">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 class="modal-title" style="display:inline-block!important;">帳號編輯</h4>
              <span id="UserTitle"></span>              
              
              <span id="ModalLoading" style="display:none; color:#669900;">
                <img src="../../img/basic/loader3.gif" />&nbsp;資料載入中...
              </span>                      
            </div>
            <div class="modal-body"> 
              <div class="input-zone">
                <span class="titl">此帳號目前所屬群組：</span>
                <span id="lbCurrRole"></span>
              </div>

              <div class="input-zone">
                <span class="titl">將此帳號加到群組：</span>
                <select id="ddlRoles" class='form-control input-sm' style="width:160px!important;"></select>
                <button id="btnAddRole" type="button" onclick="JoinGroup()" class="btn btn-success btn-sm">加入群組</button>
                <button id="btnRemoveRole" type="button" onclick="LeaveGroup()" class="btn btn-danger btn-sm">移出群組</button>
              </div>
              
              <div class="input-zone">
                <span class="titl">將此帳號變更密碼：</span>
                <input id="txtNewPwd" type="text" class="form-control input-sm" style="width:160px!important;" />
                <button id="btnChange" type="button" onclick="ChangePwd()" class="btn btn-success btn-sm">變更</button>
              </div>

              <div class="input-zone">
                <span class="titl">帳號目前開通狀態：</span>
                <select id="ddlApprove" class='form-control input-sm' style="width:160px!important;">                   
                   <option value="False">帳號已被關閉</option>
                   <option value="True">帳號已經開通</option>
                 </select>
                 <button id="btnAppv" type="button" onclick="User_Approve()" class="btn btn-success btn-sm">變更開通狀態</button>
                 <button id="btnLock" type="button" onclick="User_Lock()"class="btn btn-warning btn-sm" >解除鎖定狀態</button>
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

