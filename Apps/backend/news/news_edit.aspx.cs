using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class backend_news_news_edit : System.Web.UI.Page
{
  private void ShowMessage(string msg) {
    ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alert", "alert('" + msg + "')", true);
  }

  protected string GetVersion() {
    return Guid.NewGuid().ToString();
  }

  protected void Page_Load(object sender, EventArgs e) {
    if (!IsPostBack) {
      //txtStart.Text = DateTime.Now.ToString("yyyy/MM/dd");
      //txtEnd.Text = DateTime.Now.ToString("yyyy/MM/dd");
      //DataTable dt = new DataTable();
      //dt = FnMember.sp_Get_Account_List();
      //ddlSearch.DataTextField = "TrueName";
      //ddlSearch.DataValueField = "UserName";
      //ddlSearch.DataSource = dt;
      //ddlSearch.DataBind();
    }
  }

  //protected void btnSubmit_Click(object sender, EventArgs e) {
  //  Load_News();
  //}

  ///// <summary> 載入最新消息 </summary>
  //protected void Load_News() {
  //  string account = ddlSearch.SelectedValue;
  //  string startday = txtStart.Text;
  //  string endday = txtEnd.Text;

  //  if (!MCPUtilities.IsDay(startday)) { lbSearchMsg.Text = "起始日期格式錯誤！"; return; }
  //  if (!MCPUtilities.IsDay(endday)) { lbSearchMsg.Text = "終止日期格式錯誤！"; return; }
   
  //  //string where = "";
  //  //if (account != "none") {
  //  //  where = " WHERE [Company] = '" + account + "' ";
  //  //  where += " AND [NewsDate] BETWEEN '" + startday + "' AND '" + endday + "'";
  //  //} else { where = " WHERE 1=1 "; }

  //  ObjList.SelectParameters.Clear();
  //  ObjList.SelectParameters.Add("Startday", startday);
  //  ObjList.SelectParameters.Add("Endday", endday);
  //  ObjList.SelectParameters.Add("Company", account);
  //  ObjList.SelectParameters.Add("startRowIndex", DataPager1.StartRowIndex.ToString());
  //  ObjList.SelectParameters.Add("maximumRows", "10");    
   
  //  ListView1.DataSource = ObjList;
  //  ListView1.DataBind();
  //  UpdatePanel_Main.Update();
  //}

  //protected void ListView1_DataBound(object sender, EventArgs e) {
  //  DataPager1.Visible = (DataPager1.PageSize < DataPager1.TotalRowCount);
  //}

  /////<summary> 分頁功能 </summary>
  //protected void ListView1_PagePropertiesChanged(object sender, EventArgs e) {
  //  Load_News();
  //}

  //protected void ObjList_Selected(object sender, ObjectDataSourceStatusEventArgs e) {
  //  lbTotalRec.Text = "- - -  共 " + e.ReturnValue.ToString() + " 筆資料 - - - ";
  //}
}