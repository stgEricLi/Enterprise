﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class backend_news_event_add : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    { }


    protected string GetVersion()
    {
        return Guid.NewGuid().ToString();
    }
}