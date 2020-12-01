using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class enterprise_wt123_fitenessReg : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            hidActid.Value = "F1060210001";
            hidActName.Value = "文曄減重競賽";
            hidCapacity.Value = "1000";           
            
        }
    }

    protected string GetVersion()
    {        
        return Guid.NewGuid().ToString();
    }
}