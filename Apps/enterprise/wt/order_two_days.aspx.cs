using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class enterprise_wt_order_two_days : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Load_Itinerary();
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
        try
        {
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
                    hidRoom2.Value = dt.Rows[0]["FieldInt1"].ToString();
                    hidRoom4.Value = dt.Rows[0]["FieldInt2"].ToString();
                    hidCapacity.Value = dt.Rows[0]["Capacity"].ToString();


                    //if (DateTime.Now > Convert.ToDateTime(Convert.ToDateTime(dt.Rows[0]["RegExpDay"].ToString()).ToString("yyyy/MM/dd") + " 23:59:59"))
                    //{
                    //    ShowMessage("此活動報名已截止，請勿報名！");
                    //    Response.Redirect("Default.aspx");
                    //    return;
                    //}
                    sb.AppendFormat("<h4>您目前選擇的報名項目為「{0}」</h4>", dt.Rows[0]["Name"].ToString());
                    Literal1.Text = sb.ToString();
                }
                else
                {
                    ShowMessage("缺乏報名活動資訊之必要條件，目前無法進行報名！");
                }
            }
            else
            {
                ShowMessage("缺乏報名之活動與車次必要條件，目前無法進行報名！");
            }
        }
        catch (Exception) {
            ShowMessage("缺乏報名之活動與車次必要條件，目前無法進行報名！");
        }
    }
}