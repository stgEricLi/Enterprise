using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;

public partial class enterprise_wt_waiting_two_days : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
             Load_Itinerary();
            //Response.Redirect("~/enterprise/wt/Default.aspx");   

            
        }
    }

    protected string GetVersion()
    {
        return Guid.NewGuid().ToString();
    }

    private void ShowMessage(string msg)
    {
        ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alert", "alert('" + msg + "')", true);
    }

    public void Load_Itinerary()
    {
        try {
            if (!string.IsNullOrEmpty(Request.QueryString["aid"]))
            {

                string actid = Request.QueryString["aid"];
                StringBuilder sb = new StringBuilder();
                DataTable dt = new DataTable();
                dt = FnActivity.Get_Activity_withRoom(actid);
                if (dt.Rows.Count > 0)
                {
                    //[FieldInt1],[FieldInt2],[ActID],[Name],[StartDay],[RegExpDay],[Capacity],[Price],[Price2],[Company],[Enable] 
                    hidActid.Value = actid;
                    //hidCapacity.Value = dt.Rows[0]["Capacity"].ToString();
                    hidActName.Value = dt.Rows[0]["Name"].ToString();
                    //hidRoom2.Value = dt.Rows[0]["FieldInt1"].ToString();
                    //hidRoom4.Value = dt.Rows[0]["FieldInt2"].ToString();

                    sb.AppendFormat("<h4>您目前選擇的報名項目為「{0}」</h4>", dt.Rows[0]["Name"].ToString());
                    Literal1.Text = sb.ToString();
                }
                else {
                    ShowMessage("缺乏報名活動資訊之必要條件，目前無法進行報名！");
                }
            }
            else {
                ShowMessage("缺乏報名之活動與車次必要條件，目前無法進行報名！");
            }
        }
        catch (Exception) {
            ShowMessage("缺乏報名之活動與車次必要條件，目前無法進行報名！");
        }
    }
}