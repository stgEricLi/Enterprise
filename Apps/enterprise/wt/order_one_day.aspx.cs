using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class enterprise_wt_order_one_day : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            Load_Itinerary();
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
        try
        {
            string actid = Request.QueryString["aid"];
            StringBuilder sb = new StringBuilder();
            DataTable dt = new DataTable();
            //dt = FnActivity.Get_Activity(actid);
            dt = FnActivity.Get_Activity_Info("wt", "ActID", actid);

            if (dt.Rows.Count > 0)
            {
                hidActid.Value = Request.QueryString["aid"].ToString();
                hidCapacity.Value = dt.Rows[0]["Capacity"].ToString();
                hidActName.Value = dt.Rows[0]["Name"].ToString();
                //hidCart.Value = cart;       
                sb.AppendFormat("<h4>您目前選擇的報名項目為「{0}」</h4>", dt.Rows[0]["Name"].ToString());
                Literal1.Text = sb.ToString();
            }
            else
            {
                ShowMessage("缺乏報名活動資訊之必要條件，目前無法進行報名！");
            }
        }
        catch (Exception ex)
        {
            ShowMessage("缺乏報名活動資訊之必要條件，目前無法進行報名！");
        }

    }
}