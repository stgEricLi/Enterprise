using System;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Text;
using System.Data;
using System.Text.RegularExpressions;
using System.Web.Script.Services;
using System.Web.Security;
using System.Collections.Generic;
using System.Web.Configuration;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Script.Serialization;
using System.Diagnostics;

/// <summary>
/// Summary description for SvPayment
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class SvPayment : System.Web.Services.WebService
{

    public SvPayment()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    public string Load_Pay_Paging(int pageindex, int pagesize, string filterby, string filtervalue)
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<clsPayment> tempList = new List<clsPayment>();
        clsSwPayPageing newsPage = new clsSwPayPageing();

        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Pay_Paging", null);
            cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = pageindex;
            cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pagesize;
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = filterby;
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = filtervalue;

            // Get TotalRows
            SqlParameter retValParam = cmd.Parameters.Add("@RETURN_VALUE", SqlDbType.Int);
            retValParam.Direction = ParameterDirection.ReturnValue;

            dt = db.ExecuteDataTable(cmd);
            totalRow = Convert.ToInt32(retValParam.Value);

            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsPayment item = new clsPayment();
                    item.ActName = row["ActName"].ToString();
                    item.ActID = row["ActID"].ToString();
                    item.OrderID = row["OrderID"].ToString();
                    item.Name = row["Name"].ToString();
                    item.PayName = row["PayName"].ToString();
                    item.Tel = row["Tel"].ToString();
                    item.Cell = row["Cell"].ToString();
                    item.Payable = Convert.ToInt32(row["Payable"]);
                    item.ActualPay = Convert.ToInt32(row["ActualPay"]);
                    item.PayType = row["PayType"].ToString();
                    item.Account = row["Account"].ToString();
                    item.Comment = row["Comment"].ToString();
                    item.MainComment = row["MainCmt"].ToString();
                    item.PayDay = Convert.ToDateTime(row["PayDay"]).ToString("yyyy/MM/dd");
                    tempList.Add(item);
                }
                dt.Dispose();
                newsPage.TotalRows = totalRow;
                newsPage.SwPay = tempList;
            }
        }
        catch (Exception ex) { }
        return new JavaScriptSerializer().Serialize(newsPage);
    }

    //<summary>取得報名清單</summary>
    [WebMethod]
    public List<clsPayment> Get_Pay_Report()
    {
        List<clsPayment> tempList = new List<clsPayment>();
        DataTable dt = new DataTable();
        DBManager db = new DBManager();
        try
        {
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Pay_Report", null);
            //cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = filterby;
            //cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = filtervalue;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsPayment item = new clsPayment();
                    item.ActName = row["ActName"].ToString();
                    item.ActID = row["ActID"].ToString();
                    item.OrderID = row["OrderID"].ToString();
                    item.Name = row["Name"].ToString();
                    item.PayName = row["PayName"].ToString();
                    item.Tel = row["Tel"].ToString();
                    item.Cell = row["Cell"].ToString();
                    item.Payable = Convert.ToInt32(row["Payable"]);
                    item.ActualPay = Convert.ToInt32(row["ActualPay"]);
                    item.PayType = row["PayType"].ToString();
                    item.Account = row["Account"].ToString();
                    item.Comment = row["Comment"].ToString();
                    item.MainComment = row["MainCmt"].ToString();
                    item.PayDay = Convert.ToDateTime(row["PayDay"]).ToString("yyyy/MM/dd");
                    tempList.Add(item);
                }
            }
        }
        catch (Exception ex) { }
        finally { dt.Dispose(); }
        return tempList;
    }


    /// <summary>付款更新</summary>
    [WebMethod(EnableSession = true)]
    public string wtPayment(clsPayment pay, string action)
    {
        string result = "OK";
        try
        {
            if (String.IsNullOrEmpty(pay.OrderID)) { return "請輸入報名編號！"; }
            if (String.IsNullOrEmpty(pay.Name)) { return "請輸入付款人名！"; }
            if (!MCPUtilities.IsNumeric(pay.Account)) { pay.Account = "0"; }


            DataTable dt = new DataTable();
            dt.Columns.Add("OrderID", typeof(string));
            dt.Columns.Add("Name", typeof(string));
            dt.Columns.Add("Tel", typeof(string));
            dt.Columns.Add("Cell", typeof(string));
            dt.Columns.Add("ActualPay", typeof(int));
            dt.Columns.Add("PayType", typeof(string));
            dt.Columns.Add("Comment", typeof(string));
            dt.Columns.Add("Account", typeof(int));
            dt.Columns.Add("PostDay", typeof(DateTime));
            dt.Columns.Add("PayDay", typeof(DateTime));
            /*
             	[OrderID] [nvarchar](12) NOT NULL,
	            [Name] [nvarchar](50) NOT NULL,
	            [Tel] [nvarchar](20) NULL,
	            [Cell] [varchar](20) NULL,
	            [TotalPrice] [smallint] NULL,
	            [PayType] [varchar](50) NULL,
	            [Comment] [nvarchar](250) NULL,
	            [Account] [smallint] NULL,
	            [PostDay] [datetime] NOT NULL,
	            [PayDay] [datetime] NOT NULL
             */

            dt.Rows.Add(
                pay.OrderID, 
                pay.Name, 
                pay.Tel, 
                pay.Cell, 
                pay.ActualPay, 
                pay.PayType, 
                pay.Comment, 
                Convert.ToInt32(pay.Account),
                DateTime.Now, 
                DateTime.Now);

            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Payment", null);
            SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@PayLIST", dt);
            tvpDetail.SqlDbType = SqlDbType.Structured;
            tvpDetail.Direction = ParameterDirection.Input;
            cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 10).Value = action;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }

}
