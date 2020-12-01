using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using NPOI;
using NPOI.HPSF;
using NPOI.HSSF;
using NPOI.HSSF.UserModel;
using NPOI.POIFS;
using NPOI.Util;
using NPOI.HSSF.Util;
using System.IO;
public partial class wating_edit_wt : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
     //if(!IsPostBack){load_activities();}
    }

    protected string GetVersion()
    {
        return Guid.NewGuid().ToString();
    }
}