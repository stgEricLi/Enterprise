using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class backend_itinerary_act_edit : System.Web.UI.Page
{

  private void ShowMessage(string msg)
  {
    ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alert", "alert('" + msg + "')", true);
  }

  protected string GetVersion() {   
    return Guid.NewGuid().ToString();
  }

    protected void Page_Load(object sender, EventArgs e)
    {
      if(!IsPostBack){
        //DataTable dtCity = new DataTable();
        //dtCity =FnMember.sp_Get_Account_List();
        //ddlSearch.DataTextField = "TrueName";
        //ddlSearch.DataValueField = "UserName";
        //ddlSearch.DataSource = dtCity;
        //ddlSearch.DataBind();
      }
    }

    protected void btnSubmit_Click(object sender, EventArgs e)
    {
      Load_Activity();
    }

    /// <summary> 載入員工資訊 </summary>
    protected void Load_Activity()
    {
      //string account = ddlSearch.SelectedValue;
      //string where ="";
      //if (account != "none") {
      //  where = " WHERE [Company] = '" + account + "'";
      //} else { where = " WHERE 1=1 "; }
      //ObjList.SelectParameters.Clear();
      //ObjList.SelectParameters.Add("maximumRows", "10");
      //ObjList.SelectParameters.Add("startRowIndex", DataPager1.StartRowIndex.ToString());
      //ObjList.SelectParameters.Add("WhereSyntax", where);
      //ListView1.DataSource = ObjList;
      //ListView1.DataBind();
      //UpdatePanel_Main.Update();
    }

    //protected void ListView1_DataBound(object sender, EventArgs e)
    //{
    //  DataPager1.Visible = (DataPager1.PageSize < DataPager1.TotalRowCount);
    //}

    /////<summary> 分頁功能 </summary>
    //protected void ListView1_PagePropertiesChanged(object sender, EventArgs e)
    //{
    //  Load_Activity();
    //}

    //protected void ObjList_Selected(object sender, ObjectDataSourceStatusEventArgs e)
    //{
    //  lbTotalRec.Text = "- - -  共 " + e.ReturnValue.ToString() + " 筆資料 - - - ";
    //}

  
}