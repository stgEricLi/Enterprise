using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Web.Security;

public partial class enterprise_wt_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            
            //Response.Redirect("~/enterprise/wt/NotOpen.html");      
            //load_Data();
            //load_Mother();
            // int i = Convert.ToInt32(MCPUtilities.DateDiff(MCPUtilities.DateInterval.Day, Convert.ToDateTime("2014/07/01"), DateTime.Now));
            //int yr = Convert.ToDateTime("2014/07/01").Year;
            //int m = Convert.ToDateTime("2014/07/01").Month;

            //WBTONidqhcEfQmf62CVDsE2deyO2Vggp_kGmnQ2z9yVjA5mdJkCCZB_99NOrf_cKyHRn6ptnIhUop9zC3HH0KnYk2WoOgAecoMHV5MLbxuDQjvMO46g1Og55bEt4mZhxJpgr7nOMT9J_QDVV13_QEWAp6AaeV3Klq57XMXO9OrzCqVbhadC6DfciJM5trbYd1K46--HZXI8Oxn3DHzQxJiUyooIzdHphId61cf_htdj_X2FQvuBU5QOWzc50U2Z5PPACrLhJLqKNpb7rVvKtEzlVtksY1aMLl_Y5yj_67E3LORi1tmrLUjnC6lY9gut2Ql3RAgyXT-woHUUOgKrI23RY-puVIq2cmeXZsWsLvMT9jpGaAO_chmdCf0cJaONOhLULxPtgYvGh6YKziKN5JrimbXGLnmfcAYmb3IL42OZxeciU7t-hOBQwZr3QzYIBgsCpLLKFR9qrDld_UKF01j96Hqh8qYUK94FuCg2
            //0591E74B255C9DB087188E026374EC08E1C83EC58C254B76596FFB0FC59DE7391A217CAF392F2A0FB67559DE166398E62857DF9507CCDB1EA656368642F63E7690093F0FB0350517E1A4C3167EC7C2CE5A788BE469A090B2535631CE59DBCAAE6A15A0BEE42D58C8EAD9E1C4
            //FormsAuthenticationTicket tick = FormsAuthentication.Decrypt("384B9D0EA00F786486EADFED7C74DBD137873612FC5882CC2F75E9BAD3430D1964A512B7B40612624527905227A7DBA470B0B1FA082AB8F5DCAADD4FB58CA5E6A9E74F99A2B94515A8D57B0009E77ACB4975711C73528FCCBFA59FFC270C24919FD28F2B");
            //string str = "";
            //var ary = Roles.GetRolesForUser(tick.Name);
        }
    }

    protected string GetVersion()
    {
        return Guid.NewGuid().ToString();
    }


}