using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class enterprise_wt_hotel_checkup : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            //Load_Itinerary();
        }
    }

    protected string GetVersion()
    {
        return Guid.NewGuid().ToString();
    }

    public void Load_Itinerary()
    {
        //http://enterprise.mcpgo.com/enterprise/wt/order_one_day.aspx?aid=E2000000035
        try
        {
            string actid = Request.QueryString["aid"];
            if (!String.IsNullOrEmpty(actid))
            {
                ShowMessage("缺乏飯店資訊，目前無法進行查詢！");
            }

            hidActid.Value = Request.QueryString["aid"].ToString();

        }
        catch (Exception ex)
        {
            ShowMessage("缺乏飯店資訊，目前無法進行查詢！");
        }

    }

    private void ShowMessage(string msg)
    {
        ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alert", "alert('" + msg + "')", true);
    }
}