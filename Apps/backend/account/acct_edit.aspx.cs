using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class backend_account_acct_edit : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected string GetVersion()
    {
        return Guid.NewGuid().ToString();
    }
    /// <summary> ListView 分頁 </summary>
    //protected void ListView1_PagePropertiesChanged(object sender, EventArgs e) {
    //  Load_Users();
    //}

    ///// <summary> 若無資料時隱藏分頁 </summary>
    //protected void ListView1_DataBound(object sender, EventArgs e) {
    //  DataPager1.Visible = (DataPager1.PageSize < DataPager1.TotalRowCount);
    //}

    //protected void ObjList_Selected(object sender, ObjectDataSourceStatusEventArgs e) {
    //  lbTotalRec.Text = "- - -  共 " + e.ReturnValue.ToString() + " 筆資料 - - - ";
    //}
    //protected void btnQuery_Click(object sender, EventArgs e) {
    //  Load_Users();
    //}

    ///// <summary> 載入帳號 </summary>
    //protected void Load_Users() {
    //string search = ddlSelector.SelectedValue;
    //string keyword = txtKeyword.Text.Trim();
    //switch (search) {
    //case "none" :
    //    ObjList.SelectParameters.Clear();
    //    ObjList.SelectParameters.Add("UserName", "");
    //break;
    //case "username":
    //ObjList.SelectParameters.Clear();
    //  ObjList.SelectParameters.Add("UserName", keyword);
    //break;
    //}
    //ObjList.SelectParameters.Add("startRowIndex", DataPager1.StartRowIndex.ToString());
    //ObjList.SelectParameters.Add("maximumRows", "10");
    //ListView1.DataSource = ObjList;
    //ListView1.DataBind();
    //UpdatePanel1.Update();
    //}
}