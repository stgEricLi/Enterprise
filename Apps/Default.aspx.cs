using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page 
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //if (Convert.ToInt32(MCPUtilities.DateDiff(MCPUtilities.DateInterval.Day, Convert.ToDateTime(item.DOB), DateTime.Now)) <= 1095) { earlyDay = true; earlyPrice = 100; }

        //int i = Convert.ToInt32(MCPUtilities.DateDiff(MCPUtilities.DateInterval.Day, Convert.ToDateTime("2014/07/03"), DateTime.Now));
        //i = i + 0;

        HttpCookie cookie = new HttpCookie("MCPTest");
        cookie.Expires = DateTime.Now.AddDays(1);
        cookie.Value = String.Format("{0}|{1}|{2}", "eric", "1234", "5678");
        Response.Cookies.Add(cookie);
  }
    protected void Button1_Click(object sender, EventArgs e)
    {
        if (Request.Cookies["MCPTest"] != null)
        {
            Response.Cookies["MCPTest"].Expires = DateTime.Now.AddDays(-1);
        }
    }
}