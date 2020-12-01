using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class enterprise_wt_hotel_weekday : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                string username = HttpContext.Current.User.Identity.Name;

                if (Roles.IsUserInRole(username, "admin"))
                {
                    hidMaster.Value = "Pass";
                }
                else
                {
                    hidMaster.Value = "Failed";
                }
            }
        }
    }
    protected string GetVersion()
    {
        return Guid.NewGuid().ToString();
    }
}