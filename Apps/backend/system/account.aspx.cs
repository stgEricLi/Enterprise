using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class backend_system_account : System.Web.UI.Page
{
  protected void Page_Load(object sender, EventArgs e) {

  }
  /// <summary> 載入帳號 </summary>
  protected void Load_Users() {
    var username = txtEmpID.Text.Trim();
    ObjList.SelectParameters.Clear();
    ObjList.SelectParameters.Add("UserName", username);
    ObjList.SelectParameters.Add("startRowIndex", DataPager1.StartRowIndex.ToString());
    ObjList.SelectParameters.Add("maximumRows", "15");
    ListView1.DataSource = ObjList;
    ListView1.DataBind();
    UpdatePanel1.Update();
  }

  protected void btnQuery_Click(object sender, EventArgs e) {
    Load_Users();
  }
  /// <summary> ListView 分頁 </summary>
  protected void ListView1_PagePropertiesChanged(object sender, EventArgs e) {
    Load_Users();
  }

  /// <summary> 若無資料時隱藏分頁 </summary>
  protected void ListView1_DataBound(object sender, EventArgs e) {
    DataPager1.Visible = (DataPager1.PageSize < DataPager1.TotalRowCount);
  }


  protected void ObjList_Selected(object sender, ObjectDataSourceStatusEventArgs e) {
    lbTotalRec.Text = "- - -  共 " + e.ReturnValue.ToString() + " 筆資料 - - - ";
  }
}