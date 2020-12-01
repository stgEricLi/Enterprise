using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;

public partial class enterprise_wt123_fitOrder : System.Web.UI.Page
{

  private void ShowMessage(string msg) {
    ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alert", "alert('" + msg + "')", true);
  }

  protected void Page_Load(object sender, EventArgs e) {
    if (!Page.IsPostBack) {
      //hidActid.Value = "W1050301002";
      //hidActName.Value = "Fitness Class";
      //hidCapacity.Value = "10";           
      Load_Itinerary();
    }
  }

  public void Load_Itinerary() {
    if (!string.IsNullOrEmpty(Request.QueryString["aid"])) {
      //string cart = Request.QueryString["bs"];
      string actid = Request.QueryString["aid"];
      StringBuilder sb = new StringBuilder();
      DataTable dt = new DataTable();
      dt = FnActivity.Get_Act_By("ActID", actid, "wt123");
      if (dt.Rows.Count > 0) {
        hidActid.Value = Request.QueryString["aid"].ToString();
        hidCapacity.Value = dt.Rows[0]["Capacity"].ToString();
        hidActName.Value = dt.Rows[0]["Name"].ToString();
        // hidCart.Value = cart;
        //sb.AppendFormat("<h4>您目前選擇的報名項目為「{0}」（目前尚有{1}個名額），", dt.Rows[0]["Name"].ToString(), dt.Rows[0]["Capacity"].ToString());
        sb.AppendFormat("<h3>您目前選擇的報名項目為「{0}」</h3>", dt.Rows[0]["Name"].ToString());
        //sb.AppendFormat("車次為「第{0}車次」。</h4>", cart);
        Literal1.Text = sb.ToString();
      } else {
        ShowMessage("缺乏報名活動資訊之必要條件，目前無法進行報名！");
      }

    } else {
      ShowMessage("缺乏報名之活動必要條件，目前無法進行報名！");
    }
  }

    protected string GetVersion() {
      return Guid.NewGuid().ToString();
    }
}