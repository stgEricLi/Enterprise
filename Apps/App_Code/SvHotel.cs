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
/// Summary description for SvHotel
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class SvHotel : System.Web.Services.WebService
{

    public SvHotel()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    //-------------------------------------------------------------------------------------------
    //                                   文瞱訂房專案
    //-----------------------------------------------------------------------------------------
    [WebMethod]
    public string Check_Eligible(string eid, string sid)
    {
        sid = sid.Substring(6, 4);
        string name = "Empty";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_checkEligible", null);
            cmd.Parameters.Add("@EID", SqlDbType.NVarChar, 25).Value = eid;
            cmd.Parameters.Add("@SSID", SqlDbType.NVarChar, 4).Value = sid;
            name = db.ExecuteScalar<string>(cmd);
        }
        catch (Exception ex)
        {
            return name;
        }
        return name;
    }

    [WebMethod]
    public string Add_Wt_Hotel_Schedule(HotelScheduleAddModel model)
    {
        string result = "OK";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = null;
            cmd = db.GetSPCommand("enterprise_wt_Hotel_Add", null);
            cmd.Parameters.Add("@actID", SqlDbType.NVarChar, 20).Value = model.ActID;
            cmd.Parameters.Add("@r2", SqlDbType.Int).Value = model.R2;
            cmd.Parameters.Add("@r3", SqlDbType.Int).Value = model.R3;
            cmd.Parameters.Add("@r4", SqlDbType.Int).Value = model.R4;
            cmd.Parameters.Add("@date", SqlDbType.NVarChar, 10).Value = model.Date;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex)
        {
            return "資料庫連線異常，目前無法送出！" + ex.Message.ToString();
        }

        return result;
    }


    [WebMethod]
    public string Update_Wt_Hotel_Schedule(HotelScheduleUpdateModel model)
    {
        string result = "OK";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = null;
            cmd = db.GetSPCommand("enterprise_wt_Hotel_Update", null);
            cmd.Parameters.Add("@id", SqlDbType.Int).Value = model.ID;
            cmd.Parameters.Add("@qty", SqlDbType.Int).Value = model.Qty;
            cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 20).Value = model.Action;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex)
        {
            return "資料庫連線異常，目前無法送出！" + ex.Message.ToString();
        }

        return result;
    }

    [WebMethod]
    public List<clsHotelSchedule> Get_Wt_Hotel_Schedule(string ActId)
    {
        List<clsHotelSchedule> List = new List<clsHotelSchedule>();
        try
        {
            DataTable dt = new DataTable();
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Hotel_Schedule", null);
            cmd.Parameters.Add("@ActID", SqlDbType.NVarChar, 20).Value = ActId;
            dt = db.ExecuteDataTable(cmd);

            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsHotelSchedule item = new clsHotelSchedule();
                    item.ActID = row["ActID"].ToString();
                    item.ID = Convert.ToInt32(row["ID"]);
                    item.Name = row["Name"].ToString();
                    item.RoomType = Convert.ToInt32(row["RoomType"]);
                    item.OpenDay = Convert.ToDateTime(row["OpenDay"]).ToString("yyyy/MM/dd");
                    item.Qty = Convert.ToInt32(row["Qty"]);
                    List.Add(item);
                }
            }
        }
        catch (Exception ex) { }
        return List;
    }

    [WebMethod]
    public string Add_Wt_HotelWeekdayOrder(clsHotelWeekdayOrder order)
    {
        string result = "OK";

        StringBuilder sb = new StringBuilder();

        if (String.IsNullOrEmpty(order.EID)) { return "請重輸入工號！"; }
        if (String.IsNullOrEmpty(order.Name)) { return "請輸入姓名！"; }
        if (!MCPUtilities.IsPhoneNo(order.Tel, "tel")) { return "電話號碼格式錯誤！格式應為：02-8226-9088#分機！"; }
        if (!MCPUtilities.IsPhoneNo(order.Cell, "cell")) { return "手機號碼格式錯誤！格式應為：0933-666888！"; }
        if (!MCPUtilities.IsEmail(order.Email)) { return "Email格式錯誤，請重新輸入！"; }

       
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = null;
            cmd = db.GetSPCommand("enterprise_wt_Hotel_OdWeekday_Add", null);
            cmd.Parameters.Add("@actID", SqlDbType.NVarChar, 20).Value = order.ActID;
            cmd.Parameters.Add("@name", SqlDbType.NVarChar, 20).Value = order.Name;
            cmd.Parameters.Add("@eid", SqlDbType.NVarChar, 20).Value = order.EID;
            cmd.Parameters.Add("@sid", SqlDbType.NVarChar, 20).Value = order.SID;
            cmd.Parameters.Add("@dob", SqlDbType.NVarChar, 10).Value = order.DOB;
            cmd.Parameters.Add("@email", SqlDbType.NVarChar, 256).Value = order.Email;
            cmd.Parameters.Add("@tel", SqlDbType.NVarChar, 20).Value = order.Tel;
            cmd.Parameters.Add("@cell", SqlDbType.NVarChar, 20).Value = order.Cell;
            cmd.Parameters.Add("@cmt", SqlDbType.NVarChar, 255).Value = order.Comment;
            cmd.Parameters.Add("@price", SqlDbType.Int).Value = order.Price;
            cmd.Parameters.Add("@checkin", SqlDbType.NVarChar, 10).Value = order.CheckIn;
            cmd.Parameters.Add("@hotelID", SqlDbType.Int).Value = order.HotelID;
            cmd.Parameters.Add("@room", SqlDbType.Int).Value = order.RoomType;
            cmd.Parameters.Add("@accDate", SqlDbType.NVarChar, 10).Value = order.AccessDate;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();

            //if (result.Substring(0, 2) == "OK")
            //{
            //    string tempid = result.Replace("OK", "");
            //    send_hotel_confirm_mail(tempid, "customer");
            //}
        }
        catch (Exception ex)
        {
            return "資料庫連線異常，目前無法送出報名表！" + ex.Message.ToString();
        }

        return result;
    }

    [WebMethod]
    public string Add_Wt_HotelOrder(clsHotelOrder order)
    {
        string result = "OK";

        StringBuilder sb = new StringBuilder();

        if (String.IsNullOrEmpty(order.EID)) { return "請重輸入工號！"; }
        if (String.IsNullOrEmpty(order.Name)) { return "請輸入姓名！"; }
        if (!MCPUtilities.IsPhoneNo(order.Tel, "tel")) { return "電話號碼格式錯誤！格式應為：02-8226-9088#分機！"; }
        if (!MCPUtilities.IsPhoneNo(order.Cell, "cell")) { return "手機號碼格式錯誤！格式應為：0933-666888！"; }
        if (!MCPUtilities.IsEmail(order.Email)) { return "Email格式錯誤，請重新輸入！"; }        

        string yr = Convert.ToString(Convert.ToInt32(DateTime.Now.Year) - 1911);
        yr = "2" + yr.Substring(1, 2);

        order.OrderID = "H" + yr + DateTime.Now.ToString("MMdd");
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = null;
            cmd = db.GetSPCommand("enterprise_wt_Hotel_Od_Add", null);
            cmd.Parameters.Add("@preID", SqlDbType.NVarChar, 10).Value = order.OrderID;
            cmd.Parameters.Add("@name", SqlDbType.NVarChar, 20).Value = order.Name;
            cmd.Parameters.Add("@eid", SqlDbType.NVarChar, 20).Value = order.EID;
            cmd.Parameters.Add("@sid", SqlDbType.NVarChar, 20).Value = order.SID;
            cmd.Parameters.Add("@dob", SqlDbType.NVarChar, 10).Value = order.DOB;
            cmd.Parameters.Add("@email", SqlDbType.NVarChar, 256).Value = order.Email;
            cmd.Parameters.Add("@tel", SqlDbType.NVarChar, 20).Value = order.Tel;
            cmd.Parameters.Add("@cell", SqlDbType.NVarChar, 20).Value = order.Cell;
            cmd.Parameters.Add("@cmt", SqlDbType.NVarChar, 255).Value = order.Comment;
            cmd.Parameters.Add("@price", SqlDbType.Int).Value = order.Price;
            cmd.Parameters.Add("@chickin", SqlDbType.NVarChar, 10).Value = order.ChickIn;
            cmd.Parameters.Add("@hotelID", SqlDbType.Int).Value = order.HotelID;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();

            if (result.Substring(0, 2) == "OK")
            {
                string tempid = result.Replace("OK", "");
                send_hotel_confirm_mail(tempid, "customer");
            }
        }
        catch (Exception ex)
        {
            return "資料庫連線異常，目前無法送出報名表！" + ex.Message.ToString();
        }

        return result;
    }

    [WebMethod]
    public string Backup_Wt_HotelOrder(clsHotelOrder order)
    {
        string result = "OK";
        StringBuilder sb = new StringBuilder();
        if (String.IsNullOrEmpty(order.EID)) { return "請重輸入工號！"; }
        if (String.IsNullOrEmpty(order.Name)) { return "請輸入姓名！"; }
        if (!MCPUtilities.IsPhoneNo(order.Tel, "tel")) { return "電話號碼格式錯誤！格式應為：02-8226-9088#分機！"; }
        if (!MCPUtilities.IsPhoneNo(order.Cell, "cell")) { return "手機號碼格式錯誤！格式應為：0933-666888！"; }
        if (!MCPUtilities.IsEmail(order.Email)) { return "Email格式錯誤，請重新輸入！"; }
      
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = null;
            cmd = db.GetSPCommand("enterprise_wt_Hotel_Od_Backup", null);
            cmd.Parameters.Add("@name", SqlDbType.NVarChar, 20).Value = order.Name;
            cmd.Parameters.Add("@eid", SqlDbType.NVarChar, 20).Value = order.EID;
            cmd.Parameters.Add("@sid", SqlDbType.NVarChar, 20).Value = order.SID;
            cmd.Parameters.Add("@dob", SqlDbType.NVarChar, 10).Value = order.DOB;
            cmd.Parameters.Add("@email", SqlDbType.NVarChar, 256).Value = order.Email;
            cmd.Parameters.Add("@tel", SqlDbType.NVarChar, 20).Value = order.Tel;
            cmd.Parameters.Add("@cell", SqlDbType.NVarChar, 20).Value = order.Cell;
            cmd.Parameters.Add("@cmt", SqlDbType.NVarChar, 255).Value = order.Comment; ;
            cmd.Parameters.Add("@price", SqlDbType.NVarChar, 10).Value = order.Price;
            cmd.Parameters.Add("@chickin", SqlDbType.NVarChar, 10).Value = order.ChickIn;
            cmd.Parameters.Add("@hotelID", SqlDbType.Int).Value = order.HotelID;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex)
        {
            return "資料庫連線異常，目前無法送出候補！" + ex.Message.ToString();
        }

        return result;
    }

    [WebMethod]
    public string Create_Wt_HotelOrder(clsOrder order, clsOrderDetail[] detail)
    {
        string result = "OK", actname = "", actid = "", cmt = "";

        StringBuilder sb = new StringBuilder();

        if (String.IsNullOrEmpty(order.Name)) { return "請輸入姓名！"; }
        if (!MCPUtilities.IsPhoneNo(order.Tel1, "tel")) { return "電話號碼格式錯誤！格式應為：02-8226-9088#分機！"; }
        if (!MCPUtilities.IsPhoneNo(order.Cell1, "cell")) { return "手機號碼格式錯誤！格式應為：0933-666888！"; }
        if (!MCPUtilities.IsEmail(order.Email)) { return "Email格式錯誤，請重新輸入！"; }

        string yr = Convert.ToString(Convert.ToInt32(DateTime.Now.Year) - 1911);
        yr = "2" + yr.Substring(1, 2);

        order.OrderID = "M" + yr + DateTime.Now.ToString("MMdd");

        try
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("OrderID", typeof(string));
            dt.Columns.Add("Name", typeof(string));
            dt.Columns.Add("Tel1", typeof(string));
            dt.Columns.Add("Tel2", typeof(string)); // Room Info
            dt.Columns.Add("Cell1", typeof(string));
            dt.Columns.Add("Cell2", typeof(string));
            dt.Columns.Add("Fax", typeof(string));
            dt.Columns.Add("Address", typeof(string));
            dt.Columns.Add("Email", typeof(string));
            dt.Columns.Add("TotalPrice", typeof(int));
            dt.Columns.Add("IsPaid", typeof(Boolean));
            dt.Columns.Add("IsConfirm", typeof(Boolean));
            dt.Columns.Add("IsPromote", typeof(Boolean));
            dt.Columns.Add("Comment", typeof(string));
            dt.Columns.Add("Source", typeof(string));
            dt.Columns.Add("Company", typeof(string));
            dt.Columns.Add("CreateDay", typeof(DateTime));

            if (detail.Length > 0)
            {
                DataTable dtD = new DataTable();
                dtD.Columns.Add("SeqNo", typeof(int));
                dtD.Columns.Add("OrderID", typeof(string));
                dtD.Columns.Add("ActID", typeof(string));
                dtD.Columns.Add("ActName", typeof(string));
                dtD.Columns.Add("Name", typeof(string));
                dtD.Columns.Add("SID", typeof(string));
                dtD.Columns.Add("EmpID", typeof(string));
                dtD.Columns.Add("DOB", typeof(DateTime));
                dtD.Columns.Add("Sex", typeof(string));
                dtD.Columns.Add("Cell", typeof(string));
                dtD.Columns.Add("Email", typeof(string));
                dtD.Columns.Add("Size", typeof(string));
                dtD.Columns.Add("IsVeg", typeof(Boolean));
                dtD.Columns.Add("IsOld", typeof(Boolean));
                dtD.Columns.Add("IsEarly", typeof(Boolean));
                dtD.Columns.Add("IsDiscount", typeof(Boolean));
                dtD.Columns.Add("Price", typeof(int));
                dtD.Columns.Add("Comment", typeof(string));
                dtD.Columns.Add("Location", typeof(string));
                dtD.Columns.Add("TempField", typeof(string));

                List<String> lstEid = new List<string>();
                List<String> lstSid = new List<string>();

                foreach (clsOrderDetail item in detail)
                {
                    actname = item.ActName;
                    actid = item.ActID;
                    if (String.IsNullOrEmpty(actid)) { return "活動行程編號遺失，無法進行報名！"; }
                    if (String.IsNullOrEmpty(item.Name)) { return "請輸入姓名！"; }
                    //if (!MCPUtilities.IsValidSID(item.SID)) { return "身份證或護照號碼錯誤，請重新輸入！"; }
                    if (String.IsNullOrEmpty(item.EmpID)) { return "請輸入工號！"; }
                    if (!MCPUtilities.IsDay(item.DOB)) { return "生日日期不正確，請重新輸入！"; }
                    if (!MCPUtilities.IsPhoneNo(item.Cell, "cell")) { return "手機格式錯誤，請重新輸入！"; }
                    if (item.SID.Substring(1, 1) == "1") { item.Sex = "男"; } else { item.Sex = "女"; }
                }// End Loop


                foreach (clsOrderDetail d in detail)
                {
                    dtD.Rows.Add(d.SeqNo, order.OrderID, actid, actname, d.Name, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.Email, "", Convert.ToBoolean(d.IsVeg), false, false, false, 0, cmt, "", d.TempField);
                }

                dt.Rows.Add(order.OrderID, order.Name, order.Tel1, order.Tel2, order.Cell1, "", "", order.Address, order.Email, order.TotalPrice, false, false, false, order.Comment, order.Source, order.Company, order.CreateDay);
                //if (dt.Rows.Count <= 0) { return "請先輸入聯絡人相關資訊，然後再繼續！"; }
                DBManager db = new DBManager();
                SqlCommand cmd = null;
                cmd = db.GetSPCommand("enterprise_wt_Hotel_Od_Add", null);
                SqlParameter tvpOrder = cmd.Parameters.AddWithValue("@ORDERLIST", dt);
                tvpOrder.SqlDbType = SqlDbType.Structured;
                tvpOrder.Direction = ParameterDirection.Input;
                SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@DETAILLIST", dtD);
                tvpDetail.SqlDbType = SqlDbType.Structured;
                tvpDetail.Direction = ParameterDirection.Input;
                SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
                retValParam.Direction = ParameterDirection.Output;
                db.ExecuteNonQuery(cmd);
                result = retValParam.Value.ToString();
                dtD.Dispose();
                dt.Dispose();

                //if (result.Substring(0, 2) == "OK")
                //{
                //    string tempid = result.Replace("OK", "");
                //    //send_hotel_confirm_mail(tempid);
                //    result = tempid;
                //    //result = result + Convert.ToString(total);
                //    //if (waiting == "Y")
                //    //    send_waiting_confirm_mail(tempid.Substring(0, 11), "customer");
                //    //if (waiting == "N")
                //    //    send_oneday_confirm_mail(tempid.Substring(0, 11), "customer");
                //}

            }// End If
            else { return "資料不完全無法進行登錄！"; }
            dt.Dispose();
        }
        catch (Exception ex)
        {
            return "資料庫連線異常，目前無法送出報名表！" + ex.Message.ToString();
        }

        return result;


    }

    [WebMethod]
    public string Get_Hotel_Order_Paging(int pageindex, int pagesize, string filterby, string filtervalue)
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<HotelList> list = new List<HotelList>();
        HotelOrderPaging viewModel = new HotelOrderPaging();

        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_hotel_Od_Paging", null);
            cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = pageindex;
            cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pagesize;
            //cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = "wt";
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
                    HotelList item = new HotelList();
                    item.ActName = row["ActName"].ToString();
                    item.OpenDay = Convert.ToDateTime(row["OpenDay"]).ToString("yyyy/MM/dd");
                    item.OrderID = row["OrderID"].ToString();
                    item.Name = row["Name"].ToString();
                    item.Tel = row["Tel"].ToString();
                    item.Cell = row["Cell"].ToString();
                    item.Email = row["Email"].ToString();
                    item.EID = row["EID"].ToString();
                    item.SID = row["SID"].ToString();
                    item.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");
                    item.RoomType = Convert.ToInt32(row["RoomType"]);
                    item.Price = Convert.ToInt32(row["Price"]);
                    item.ChickIn = row["CheckIn"].ToString();
                    item.CreateDay = Convert.ToDateTime(row["CreateDay"]).ToString("yyyy/MM/dd");
                    item.Comment = row["Comment"].ToString();
                    list.Add(item);
                }
                dt.Dispose();
                viewModel.TotalRows = totalRow;
                viewModel.Orders = list;
            }
        }
        catch (Exception ex) { }
        //return actpage;
        return new JavaScriptSerializer().Serialize(viewModel);
    }

    [WebMethod]
    public string Get_Hotel_BkOrder_Paging(int pageindex, int pagesize, string filterby, string filtervalue)
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<HotelList> list = new List<HotelList>();
        HotelOrderPaging viewModel = new HotelOrderPaging();

        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_hotel_OdBK_Paging", null);
            cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = pageindex;
            cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pagesize;
            //cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = "wt";
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
                    HotelList item = new HotelList();
                    item.ActName = row["ActName"].ToString();
                    item.OpenDay = Convert.ToDateTime(row["OpenDay"]).ToString("yyyy/MM/dd");
                    item.OrderID = row["OrderID"].ToString();
                    item.Name = row["Name"].ToString();
                    item.Tel = row["Tel"].ToString();
                    item.Cell = row["Cell"].ToString();
                    item.Email = row["Email"].ToString();
                    item.EID = row["EID"].ToString();
                    item.SID = row["SID"].ToString();
                    item.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");
                    item.RoomType = Convert.ToInt32(row["RoomType"]);
                    item.Price = Convert.ToInt32(row["Price"]);
                    item.ChickIn = row["CheckIn"].ToString();
                    item.CreateDay = Convert.ToDateTime(row["CreateDay"]).ToString("yyyy/MM/dd");
                    item.Comment = row["Comment"].ToString();
                    list.Add(item);
                }
                dt.Dispose();
                viewModel.TotalRows = totalRow;
                viewModel.Orders = list;
            }
        }
        catch (Exception ex) { }
        //return actpage;
        return new JavaScriptSerializer().Serialize(viewModel);
    }

    [WebMethod]
    public string Get_Hotel_Weekday_Paging(int pageindex, int pagesize, string filterby, string filtervalue, string extravalue)
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<HotelWeekdayList> list = new List<HotelWeekdayList>();
        HotelWeekdayPaging viewModel = new HotelWeekdayPaging();

        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_hotel_Weekday_Paging", null);
            cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = pageindex;
            cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pagesize;
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = filterby;
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = filtervalue;
            cmd.Parameters.Add("@ExtraFilter", SqlDbType.NVarChar, 50).Value = extravalue;
            // Get TotalRows
            SqlParameter retValParam = cmd.Parameters.Add("@RETURN_VALUE", SqlDbType.Int);
            retValParam.Direction = ParameterDirection.ReturnValue;

            dt = db.ExecuteDataTable(cmd);
            totalRow = Convert.ToInt32(retValParam.Value);

            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    HotelWeekdayList item = new HotelWeekdayList();
                    // [ActName], [RoomType], [AccessDate], [OrderID], [Name], [EID], [SID], [Tel], [Cell], [Email], [Price], [DOB], [CheckIn], [Comment]
                    item.ActName = row["ActName"].ToString();
                    item.RoomType = Convert.ToInt32(row["RoomType"]);
                    item.AccessDate = Convert.ToDateTime(row["AccessDate"]).ToString("yyyy/MM/dd");
                    item.OrderID = row["OrderID"].ToString();
                    item.Name = row["Name"].ToString();
                    item.Tel = row["Tel"].ToString();
                    item.Cell = row["Cell"].ToString();
                    item.Email = row["Email"].ToString();
                    item.EID = row["EID"].ToString();
                    item.SID = row["SID"].ToString();
                    item.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");                   
                    item.Price = Convert.ToInt32(row["Price"]);
                    item.CheckIn = row["CheckIn"].ToString();               
                    item.Comment = row["Comment"].ToString();
                    list.Add(item);
                }
                dt.Dispose();
                viewModel.TotalRows = totalRow;
                viewModel.Orders = list;
            }
        }
        catch (Exception ex) { }
        //return actpage;
        return new JavaScriptSerializer().Serialize(viewModel);
    }

    [WebMethod]
    public string Update_Hotel_Order(HotelOrderUpdateModel model)
    {
        string result = "OK";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = null;
            cmd = db.GetSPCommand("enterprise_hotel_Od_Modify", null);
            cmd.Parameters.Add("@oid", SqlDbType.NVarChar, 20).Value = model.OrderID;
            cmd.Parameters.Add("@tel", SqlDbType.NVarChar, 20).Value = model.Tel;
            cmd.Parameters.Add("@cel", SqlDbType.NVarChar, 20).Value = model.Cell;
            cmd.Parameters.Add("@sid", SqlDbType.NVarChar, 20).Value = model.SID;
            cmd.Parameters.Add("@dob", SqlDbType.NVarChar, 10).Value = model.DOB;
            cmd.Parameters.Add("@email", SqlDbType.NVarChar, 256).Value = model.Email;
            cmd.Parameters.Add("@price", SqlDbType.Int).Value = model.Price;
            cmd.Parameters.Add("@chickin", SqlDbType.NVarChar, 10).Value = model.ChickIn;
            cmd.Parameters.Add("@cmt", SqlDbType.NVarChar, 256).Value = model.Comment;
            cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 20).Value = model.Action;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 150);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex)
        {
            return "資料庫連線異常，目前無法送出！" + ex.Message.ToString();
        }

        return result;
    }

    [WebMethod]
    public string Update_Hotel_BkOrder(HotelOrderUpdateModel model)
    {
        string result = "OK";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = null;
            cmd = db.GetSPCommand("enterprise_hotel_OdBK_Modify", null);
            cmd.Parameters.Add("@oid", SqlDbType.NVarChar, 20).Value = model.OrderID;
            cmd.Parameters.Add("@tel", SqlDbType.NVarChar, 20).Value = model.Tel;
            cmd.Parameters.Add("@cel", SqlDbType.NVarChar, 20).Value = model.Cell;
            cmd.Parameters.Add("@email", SqlDbType.NVarChar, 256).Value = model.Email;
            cmd.Parameters.Add("@price", SqlDbType.Int).Value = model.Price;
            cmd.Parameters.Add("@chickin", SqlDbType.NVarChar, 10).Value = model.ChickIn;
            cmd.Parameters.Add("@cmt", SqlDbType.NVarChar, 256).Value = model.Comment;
            cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 20).Value = model.Action;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 150);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();

            if(model.Action == "Trans")
            {
                if (result.Substring(0, 2) == "OK")
                {
                    string tempid = result.Replace("OK", "");
                    send_hotel_confirm_mail(tempid, "customer");
                }
            }
        }
        catch (Exception ex)
        {
            return "資料庫連線異常，目前無法送出！" + ex.Message.ToString();
        }

        return result;
    }

    [WebMethod]
    public string Update_Hotel_Weekday(HotelWeekdayUpdateModel model)
    {
        string result = "OK";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = null;
            cmd = db.GetSPCommand("enterprise_hotel_Weekday_Modify", null);
            cmd.Parameters.Add("@oid", SqlDbType.NVarChar, 20).Value = model.OrderID;
            cmd.Parameters.Add("@tel", SqlDbType.NVarChar, 20).Value = model.Tel;
            cmd.Parameters.Add("@cell", SqlDbType.NVarChar, 20).Value = model.Cell;
            cmd.Parameters.Add("@email", SqlDbType.NVarChar, 256).Value = model.Email;
            cmd.Parameters.Add("@sid", SqlDbType.NVarChar, 20).Value = model.SID;
            cmd.Parameters.Add("@dob", SqlDbType.NVarChar, 10).Value = model.DOB;
            cmd.Parameters.Add("@price", SqlDbType.Int).Value = model.Price;
            cmd.Parameters.Add("@checkin", SqlDbType.NVarChar, 10).Value = model.CheckIn;
            cmd.Parameters.Add("@accDate", SqlDbType.NVarChar, 10).Value = model.AccessDate;            
            cmd.Parameters.Add("@cmt", SqlDbType.NVarChar, 256).Value = model.Comment;
            cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 20).Value = model.Action;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 150);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();

            if (model.Action == "Trans")
            {
                if (result.Substring(0, 2) == "OK")
                {
                    string tempid = result.Replace("OK", "");
                    send_hotel_confirm_mail(tempid, "customer");
                }
            }
        }
        catch (Exception ex)
        {
            return "資料庫連線異常，目前無法送出！" + ex.Message.ToString();
        }

        return result;
    }


    [WebMethod]
    public string Load_Pay_Paging(int pageindex, int pagesize, string filterby, string filtervalue)
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<HotePaylList> tempList = new List<HotePaylList>();
        HotePayPaging newsPage = new HotePayPaging();

        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_HotelPay_Paging", null);
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
                    HotePaylList item = new HotePaylList();
                    item.ActName = row["ActName"].ToString();
                    item.RoomType = Convert.ToInt32(row["RoomType"]);
                    item.OrderID = row["OrderID"].ToString();
                    item.Name = row["Name"].ToString();
                    item.PayName = row["PayName"].ToString();
                    item.OpenDay = Convert.ToDateTime(row["OpenDay"]).ToString("yyyy/MM/dd");
                    item.EID = row["EID"].ToString();
                    item.SID = row["SID"].ToString();
                    item.Price = Convert.ToInt32(row["Price"]);
                    item.Comment = row["Comment"].ToString();
                    item.PayName = row["PayName"].ToString();
                    item.PayTel = row["PayTel"].ToString();
                    item.PayCell = row["PayCell"].ToString();                   
                    item.ActualPay = Convert.ToInt32(row["ActualPay"]);
                    item.PayType = row["PayType"].ToString();
                    item.Account = row["Account"].ToString();                   
                    item.PayCmt = row["PayCmt"].ToString();
                    item.PayDay = Convert.ToDateTime(row["PayDay"]).ToString("yyyy/MM/dd");
                    tempList.Add(item);                
                }
                dt.Dispose();
                newsPage.TotalRows = totalRow;
                newsPage.PayList = tempList;
            }
        }
        catch (Exception ex) { }
        return new JavaScriptSerializer().Serialize(newsPage);
    }

    [WebMethod]
    public string Add_Hotel_Pay(clsPayment pay)
    {
        string result = "OK";
        try
        {
            if (String.IsNullOrEmpty(pay.OrderID)) { return "請輸入報名編號！"; }
            if (String.IsNullOrEmpty(pay.Name)) { return "請輸入付款人名！"; }
            if (!MCPUtilities.IsNumeric(pay.Account)) { pay.Account = "0"; }
            if (!MCPUtilities.IsDay(pay.PayDay)) { return "日期不正確，請重新輸入！"; }

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
                pay.PayDay);

            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Hotel_Payment", null);
            SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@PayLIST", dt);
            tvpDetail.SqlDbType = SqlDbType.Structured;
            tvpDetail.Direction = ParameterDirection.Input;
            //cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 10).Value = action;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }
    /// <summary>付款更新</summary>
    [WebMethod(EnableSession = true)]
    public string Update_Hotel_Payment(HotelPayUpdateModel model)
    {
        string result = "OK";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = null;
            cmd = db.GetSPCommand("enterprise_hotel_Pay_Modify", null);
            cmd.Parameters.Add("@oid", SqlDbType.NVarChar, 20).Value = model.OrderID;
            cmd.Parameters.Add("@price", SqlDbType.Int).Value = model.Price;
            cmd.Parameters.Add("@acct", SqlDbType.NVarChar, 5).Value = model.Account;
            cmd.Parameters.Add("@cmt", SqlDbType.NVarChar, 256).Value = model.Comment;
            cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 20).Value = model.Action;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 150);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex)
        {
            return "資料庫連線異常，目前無法送出！" + ex.Message.ToString();
        }
        return result;
    }

    [WebMethod]
    public string Hotel_Order_Report(string filterby, string filtervalue)
    {
        DataTable dt = new DataTable();
        //List<HotelList> list = new List<HotelList>();
        //HotelOrderPaging viewModel = new HotelOrderPaging();

        List<HoteReportList> list = new List<HoteReportList>();
       
        try
        {
            DBManager db = new DBManager();       
            SqlCommand cmd = db.GetSPCommand("enterprise_hotel_Od_Rpt", null);
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = filterby;
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = filtervalue;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    //HotelList item = new HotelList();
                    //item.ActName = row["ActName"].ToString();
                    //item.OpenDay = Convert.ToDateTime(row["OpenDay"]).ToString("yyyy/MM/dd");
                    //item.OrderID = row["OrderID"].ToString();
                    //item.Name = row["Name"].ToString();
                    //item.Tel = row["Tel"].ToString();
                    //item.Cell = row["Cell"].ToString();
                    //item.Email = row["Email"].ToString();
                    //item.EID = row["EID"].ToString();
                    //item.SID = row["SID"].ToString();
                    //item.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");
                    //item.RoomType = Convert.ToInt32(row["RoomType"]);
                    //item.Price = Convert.ToInt32(row["Price"]);
                    //item.ChickIn = row["CheckIn"].ToString();
                    //item.CreateDay = Convert.ToDateTime(row["CreateDay"]).ToString("yyyy/MM/dd");
                    //item.Comment = row["Comment"].ToString();

                    HoteReportList item = new HoteReportList();
                    item.ActName = row["ActName"].ToString();
                    item.OpenDay = Convert.ToDateTime(row["OpenDay"]).ToString("yyyy/MM/dd");
                    item.OrderID = row["OrderID"].ToString();
                    item.Name = row["Name"].ToString();
                    item.Tel = row["Tel"].ToString();
                    item.Cell = row["Cell"].ToString();
                    item.Email = row["Email"].ToString();
                    item.EID = row["EID"].ToString();
                    item.SID = row["SID"].ToString();
                    item.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");
                    item.RoomType = Convert.ToInt32(row["RoomType"]);
                    item.Price = Convert.ToInt32(row["Price"]);
                    item.CheckIn = row["CheckIn"].ToString();
                    item.CreateDay = Convert.ToDateTime(row["CreateDay"]).ToString("yyyy/MM/dd");
                    item.Comment = row["Comment"].ToString();
                    item.PayName = row["PayName"].ToString();
                    item.PayTel = row["PayTel"].ToString();
                    item.PayCell = row["PayCell"].ToString();
                    item.ActualPay = Convert.ToInt32(row["ActualPay"]);
                    item.PayType = row["PayType"].ToString();
                    item.Account = row["Account"].ToString();
                    item.PayCmt = row["PayCmt"].ToString();
                    item.PayDay = Convert.ToDateTime(row["PayDay"]).ToString("yyyy/MM/dd");

                    list.Add(item);
                }
                //viewModel.TotalRows = 0;
                //viewModel.Orders = list;
            }
        }
        catch (Exception ex) { }
        finally { dt.Dispose(); }
        return new JavaScriptSerializer().Serialize(list);
        //return new JavaScriptSerializer().Serialize(viewModel);
    }

    [WebMethod]
    public string Hotel_BkOrder_Report()
    {
        DataTable dt = new DataTable();
        List<HotelList> list = new List<HotelList>();
        HotelOrderPaging viewModel = new HotelOrderPaging();
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_hotel_OdBK_Rpt", null);
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    HotelList item = new HotelList();
                    item.ActName = row["ActName"].ToString();
                    item.OpenDay = Convert.ToDateTime(row["OpenDay"]).ToString("yyyy/MM/dd");
                    item.OrderID = row["OrderID"].ToString();
                    item.Name = row["Name"].ToString();
                    item.Tel = row["Tel"].ToString();
                    item.Cell = row["Cell"].ToString();
                    item.Email = row["Email"].ToString();
                    item.EID = row["EID"].ToString();
                    item.SID = row["SID"].ToString();
                    item.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");
                    item.RoomType = Convert.ToInt32(row["RoomType"]);
                    item.Price = Convert.ToInt32(row["Price"]);
                    item.ChickIn = row["CheckIn"].ToString();
                    item.CreateDay = Convert.ToDateTime(row["CreateDay"]).ToString("yyyy/MM/dd");
                    item.Comment = row["Comment"].ToString();
                    list.Add(item);
                }
                viewModel.TotalRows = 0;
                viewModel.Orders = list;
            }
        }
        catch (Exception ex) { }
        finally { dt.Dispose(); }

        return new JavaScriptSerializer().Serialize(viewModel);
    }

    [WebMethod]
    public string Hotel_Weekday_Report(string filterby, string filtervalue, string extravalue)
    {
        DataTable dt = new DataTable();
      
        List<HotelWeekdayList> list = new List<HotelWeekdayList>();

        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_hotel_Weekday_Rpt", null);
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = filterby;
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = filtervalue;
            cmd.Parameters.Add("@ExtraFilter", SqlDbType.NVarChar, 50).Value = extravalue;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    HotelWeekdayList item = new HotelWeekdayList();
                    item.ActName = row["ActName"].ToString();
                    item.RoomType = Convert.ToInt32(row["RoomType"]);
                    item.AccessDate = Convert.ToDateTime(row["AccessDate"]).ToString("yyyy/MM/dd");
                    item.OrderID = row["OrderID"].ToString();
                    item.Name = row["Name"].ToString();
                    item.Tel = row["Tel"].ToString();
                    item.Cell = row["Cell"].ToString();
                    item.Email = row["Email"].ToString();
                    item.EID = row["EID"].ToString();
                    item.SID = row["SID"].ToString();
                    item.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");
                    item.Price = Convert.ToInt32(row["Price"]);
                    item.CheckIn = row["CheckIn"].ToString();
                    item.Comment = row["Comment"].ToString();
                    list.Add(item);
                }              
            }
        }
        catch (Exception ex) { }
        finally { dt.Dispose(); }
        return new JavaScriptSerializer().Serialize(list);
        //return new JavaScriptSerializer().Serialize(viewModel);
    }

    [WebMethod]
    public string send_hotel_confirm_mail(string orderid, string sentto)
    {
        string result = "OK";
        StringBuilder sb = new StringBuilder();
        DataTable dt = new DataTable();
        List<HotelList> list = new List<HotelList>();
        HotelOrderPaging viewModel = new HotelOrderPaging();

        int count = 0, total = 0;
        string actName = "", email = "", content = "", commt = "", actDay = "", room = "", chickin="";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_hotel_Od_Paging", null);
            cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = 1;
            cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = 10;
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = "OID";
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = orderid;
            SqlParameter retValParam = cmd.Parameters.Add("@RETURN_VALUE", SqlDbType.Int);
            retValParam.Direction = ParameterDirection.ReturnValue;
            dt = db.ExecuteDataTable(cmd);           

            if (dt.Rows.Count > 0)
            {
                sb.Append("<table style='border-collapse:collapse;'>");
                sb.Append("<tr>");       
                //sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>飯店</th>");
                //sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>訂房日</th>");
                //sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>房型</th>");
                //sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>編號</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>姓名</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>身分證</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>工號</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>手機</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>email</th>");
                //sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>應付金額</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>報名日</th>");
                sb.Append("</tr>");
                foreach (DataRow row in dt.Rows)
                {
                    if (count == 0)
                    {
                        email = row["Email"].ToString();
                        actName = row["ActName"].ToString();
                        total = Convert.ToInt32(row["Price"]);
                        actDay = Convert.ToDateTime(row["OpenDay"].ToString()).ToString("yyyy/MM/dd");
                        commt = row["Comment"].ToString();
                        room = row["RoomType"].ToString();
                        chickin = row["CheckIn"].ToString();
                    }

                    sb.Append("<tr>");
                    //sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["ActName"].ToString());
                    //sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", Convert.ToDateTime(row["OpenDay"].ToString()).ToString("yyyy/MM/dd"));
                    //sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}人房</td>", row["RoomType"].ToString());
                    //sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["OrderID"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Name"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>******{0}</td>", row["SID"].ToString().Substring(6, 4));
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["EID"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Cell"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Email"].ToString());
                    //sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Price"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", Convert.ToDateTime(row["CreateDay"].ToString()).ToString("yyyy/MM/dd"));
                    sb.Append("</tr>");
                    count += 1;
                }                
                sb.Append("</table>");

                           

                content = sb.ToString();
                sb.Remove(0, sb.Length);

                sb.AppendFormat("<p>親愛的同仁您好！您已經在 MCP海天青企業專區網站上預定<span style='font-weight:bold;color:blue;'>{0}</span>", actName);
                sb.AppendFormat(", 一間 {0} 人房，入住日期為 {1} ，CHICK IN 時間為: {2} ", room, actDay, chickin);
                sb.AppendFormat("您的編號為：<span style='font-weight:bold;color:red;'>{0}</span></P>", orderid);
                if(total > 0)
                {
                    sb.AppendFormat("<p>您此次報名自費金額為：<span style='font-weight:bold;color:red;'>{0}</span><br/>", total);
                    sb.Append("煩請於報名後三日內，以 ATM 轉帳、匯款或期他現金存入方式，將您的款項匯至：<br/><br/>");
                    sb.Append("銀行：<span style='color:blue; font-weight:bold;'>新光銀行---新板分行 103</span><br/>");
                    sb.Append("戶名：<span style='color:blue; font-weight:bold;'>海天青旅行社股份有限公司</span><br/>");
                    sb.Append("帳號：<span style='color:blue; font-weight:bold;'>0462-10-100-2861</span><br/>");
                    sb.Append("付款完畢者請連結下列網址進行付款登錄，以利後續查帳作業，謝謝配合。<br/>");
                    sb.Append("<a href='http://enterprise.mcpgo.com/enterprise/wt/payment.aspx'>http://enterprise.mcpgo.com/enterprise/wt/payment.aspx</a>");
                    sb.Append("</p>");
                }
                sb.Append("<p style='margin-top:12px;'>");
                sb.Append("文曄集團福委會福委及海天青旅行社感謝您的參加與支持！我們將會於活動出發前 3 天寄發行前通知單給予參加同仁，再煩請注意郵件信箱。");               
                sb.Append("如有任何問題請洽海天青旅行社訂房負責人員：02-29527535#36周小姐 #38曹先生");
                sb.Append("</p>");

                content = sb.ToString() + content;
                MCPUtilities.send_single_mail(email, "MCP海天青文瞱集團線上報名確認信", content, "mcp.otherstw@gmail.com", "");

                

                //if (sentto == "customer")
                //{
                //    MCPUtilities.send_single_mail(email, "MCP海天青文瞱集團線上報名確認信", content, "mcpricky@gmail.com", "");
                //}
                //else
                //{
                //    //MCPUtilities.send_single_mail("chiahunhsu@gmail.com", "重發確認信", content, "mcpricky@gmail.com", ""); 
                //    MCPUtilities.send_single_mail(email, "MCP海天青文瞱集團線上報名確認信", content, "chiahunhsu@gmail.com", "");
                //}

            }
        }
        catch (Exception ex)
        {
            result = ex.Message.ToString();
        }
        return result;
    }
}
