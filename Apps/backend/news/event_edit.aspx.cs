using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
public partial class backend_news_event_edit : System.Web.UI.Page
{
    private void ShowMessage(string msg)
    {
        ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alert", "alert('" + msg + "')", true);
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            //txtStart.Text = DateTime.Now.ToString("yyyy/MM/dd");
            //txtEnd.Text = DateTime.Now.ToString("yyyy/MM/dd");
            //DataTable dt = new DataTable();
            //dt = FnMember.sp_Get_Account_List();
            //ddlSearch.DataTextField = "TrueName";
            //ddlSearch.DataValueField = "UserName";
            //ddlSearch.DataSource = dt;
            //ddlSearch.DataBind();
            //Load_News();
        }
    }

    protected string GetVersion()
    {
        return Guid.NewGuid().ToString();
    }

    //protected void btnSubmit_Click(object sender, EventArgs e)
    //{
    //    Load_News();
    //}

    /// <summary> 載入最新消息 </summary>
    //protected void Load_News()
    //{        
    //    ObjList.SelectParameters.Clear();     
    //    ObjList.SelectParameters.Add("startRowIndex", DataPager1.StartRowIndex.ToString());
    //    ObjList.SelectParameters.Add("maximumRows", "10");
    //    ListView1.DataSource = ObjList;
    //    ListView1.DataBind();
    //    UpdatePanel_Main.Update();
    //}

    //protected void ListView1_DataBound(object sender, EventArgs e)
    //{
    //    DataPager1.Visible = (DataPager1.PageSize < DataPager1.TotalRowCount);
    //}

    /////<summary> 分頁功能 </summary>
    //protected void ListView1_PagePropertiesChanged(object sender, EventArgs e)
    //{
    //    Load_News();
    //}

    //protected void ObjList_Selected(object sender, ObjectDataSourceStatusEventArgs e)
    //{
    //    lbTotalRec.Text = "- - -  共 " + e.ReturnValue.ToString() + " 筆資料 - - - ";
    //}
}