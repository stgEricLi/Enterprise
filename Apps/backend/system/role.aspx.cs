using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Web.Security;
using System.Text;

public partial class backend_system_role : System.Web.UI.Page
{
  private void ShowMessage(string msg) {
    ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alert", "alert('" + msg + "')", true);
  }

  protected void Page_Load(object sender, EventArgs e) {
    if (!IsPostBack) {
      Load_Roles();
      //Load_Employee();
    }
  }

  /// <summary> 新增群組 </summary>
  //protected void btnAdd_Click(object sender, EventArgs e) {
  //  string rolename = txtRole.Text.Trim();
  //  try {
  //    if (Roles.RoleExists(rolename)) { ShowMessage("此一群組已經存在！"); return; }
  //    Roles.CreateRole(rolename);
  //    Load_Roles();
  //  } catch (Exception ex) {
  //    ShowMessage("新增群組失敗！");
  //  }
  //}

  /// <summary> 載入群組 </summary>
  protected void Load_Roles() {
    DataTable dtR = new DataTable();
    dtR = FnSystem.Get_AllRoles();
    ListView1.DataSource = dtR;
    ListView1.DataBind();
    UpdatePanel1.Update();
    dtR.Dispose();
  }
  

  /// <summary >刪除群組 </summary>
  //protected void ListView1_ItemDeleting(object sender, ListViewDeleteEventArgs e) {
  //  try {
  //    string roleName = ((Label)ListView1.Items[e.ItemIndex].FindControl("lbRole")).Text;
  //    Roles.DeleteRole(roleName);
  //    Load_Roles();
  //    ShowMessage("群組" + roleName + "已被刪除！");
  //  } catch (Exception ex) {
  //    ShowMessage(ex.Message);
  //  }
  //}

 
  /// <summary> 跳出視窗 </summary>
  protected void show_popup() {
    //UpdatePanel2.Update();
    //popex_detail.Show();
  }

  protected void Load_Details() {
    //StringBuilder sb = new StringBuilder();
    //DataTable dt = new DataTable();
    //Literal1.Text = "";
    //int count = 0;
    //dt = FNEmployee.sp_getEmpName_InRole(hidRoleID.Value);
    //sb.Append("<table style='' class='editStyle'>");
    //sb.Append("<tr>");
    //sb.Append("<th style='width:86px;'>帳號名稱</th>");
    //sb.Append("<th style='width:86px;'>英文名稱</th>");
    //sb.Append("<th style='width:86px;'>中文名稱</th>");
    //sb.Append("<th style='width:86px;'>移出</th>");
    //sb.Append("</tr>");
    //if (dt.Rows.Count > 0) {
    //  foreach (DataRow oRow in dt.Rows) {
    //    sb.Append("<tr>");
    //    sb.AppendFormat("<td><span id='lbName{0}'>{1}<span></td>", count.ToString(), oRow["UserName"].ToString());
    //    sb.AppendFormat("<td><span id='lbEn{0}'>{1}<span></td>", count.ToString(), oRow["EnName"].ToString());
    //    sb.AppendFormat("<td><span id='lbCh{0}'>{1}<span></td>", count.ToString(), oRow["ChName"].ToString());
    //    sb.Append("<td>");
    //    sb.AppendFormat("<img id='img{0}'src='../../img/basic/loader3.gif' style='display:none;' />", count.ToString());
    //    sb.AppendFormat("<input id='btnRemove{0}' type='button' value='移出' onclick='MoveOut(this.id)' />", count.ToString());
    //    sb.Append("</td>");
    //    sb.Append("</tr>");
    //    count += 1;
    //  }
    //}
    //sb.Append("</table>");
    //dt.Dispose();
    //Literal1.Text = sb.ToString();
  }

}