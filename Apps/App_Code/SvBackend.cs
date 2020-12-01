using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Web;
using System.Web.Script.Services;
using System.Web.Security;
using System.Web.Services;
using System.Text;
using System.IO;
using System.Web.Script.Serialization;
using System.Net;

/// <summary>
/// Summary description for SvBackend
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class SvBackend : System.Web.Services.WebService {

    public SvBackend () {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
    public void TestWebMethod()
    {
        try
        {
            throw new HttpException((int)HttpStatusCode.BadRequest, "Error Message");
        }
        catch (HttpException ex)
        {
            Context.Response.StatusCode = ex.GetHttpCode();

            // See Markus comment
            // Context.Response.StatusDescription("Error Message");
            // Context.Response.StatusDescription(ex.Message); // exception message
            // Context.Response.StatusDescription(ex.ToString()); // full exception
        }
    }

    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public clsLogin Login(string username, string password)
    {
        bool isPersistent = false; //Persist.Checked; 
        int timeout=30; //30, 60 this is time out in minutes. 
        string userData = "";
        string encTicket = "none";
        clsLogin login = new clsLogin();
        try
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password)) { throw new HttpException((int)HttpStatusCode.Unauthorized, "Please Enter UserName & Password"); }

            //MembershipUser usr = Membership.GetUser(username);
            //usr.UnlockUser();
            //Membership.UpdateUser(usr);

            if (Membership.ValidateUser(username, password))
            {
                //var ary = Roles.GetRolesForUser(username);
                var ary = new[] {"Admin", "User"};
                var list = new List<string>(ary);

                FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, username, System.DateTime.Now, System.DateTime.Now.AddMinutes(timeout), isPersistent, userData, FormsAuthentication.FormsCookiePath);
                // Encrypt the ticket.
                encTicket = FormsAuthentication.Encrypt(ticket);
               
                login.authTicket = encTicket;
                login.Name = username;
                login.roles = list;
                login.expire = System.DateTime.Now.AddMinutes(timeout);

                // Create the cookie.
                //Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encTicket)); 
                // Redirect back to original URL.     
                //Response.Redirect(FormsAuthentication.GetRedirectUrl(email,isPersistent));
            }
            else {
                throw new HttpException((int)HttpStatusCode.Unauthorized, "Invalid UserName & Password");
            }
            
        }
        catch (HttpException ex)
        {
            Context.Response.StatusCode = ex.GetHttpCode();

            // See Markus comment
            //Context.Response.StatusDescription("Error Message");
            //Context.Response.StatusDescription(ex.Message); // exception message
            //Context.Response.StatusDescription(ex.ToString()); // full exception
        }
        return login;
    }

    [WebMethod]
    [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]    
    public string getItinerary()
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<clsActivity> tempList = new List<clsActivity>();
        clsActPageing actpage = new clsActPageing();
        try
        {
            

            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Act_Paging", null);

            cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = 1;
            cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = 100;
            cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = "wt2014";
            // Get TotalRows
            SqlParameter retValParam = cmd.Parameters.Add("@RETURN_VALUE", SqlDbType.Int);
            retValParam.Direction = ParameterDirection.ReturnValue;

            dt = db.ExecuteDataTable(cmd);
            totalRow = Convert.ToInt32(retValParam.Value);

            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsActivity item = new clsActivity();
                    item.ActID = row["ActID"].ToString();
                    item.Name = row["Name"].ToString();
                    item.StartDay = Convert.ToDateTime(row["StartDay"]).ToString("yyyy/MM/dd");
                    item.RegExpDay = Convert.ToDateTime(row["RegExpDay"]).ToString("yyyy/MM/dd");
                    item.Company = row["Company"].ToString();
                    item.Capacity = Convert.ToInt32(row["Capacity"]);
                    item.Price = Convert.ToInt32(row["Price"]);
                    item.Price2 = Convert.ToInt32(row["Price2"]);
                    item.Enable = Convert.ToBoolean(row["Enable"]);
                    tempList.Add(item);
                }
                dt.Dispose();
                actpage.TotalRows = totalRow;
                actpage.Acts = tempList;

            }
            else 
            {
                throw new HttpException((int)HttpStatusCode.ExpectationFailed, "Please Enter UserName & Password");
            }
        }
        catch (HttpException ex)
        {
            Context.Response.StatusCode = ex.GetHttpCode();
        }
        //return actpage;
        return new JavaScriptSerializer().Serialize(actpage);
    }
    
}
