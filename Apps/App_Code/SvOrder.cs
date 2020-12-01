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
/// Summary description for SvOrder
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class SvOrder : System.Web.Services.WebService
{

    public SvOrder() { }

 
    //-------------------------------------------------------------------------------------------
    //                                   文瞱個人報名清單
    //-----------------------------------------------------------------------------------------

    private bool isKid(string dob)
    {
        bool result = false;
        int y = Convert.ToDateTime(dob).Year;
        int m = Convert.ToDateTime(dob).Month;

        if (y > 2014)
            result = true;

        if (y == 2014)
        {
            if (m >= 7) { result = true; } else { result = false; }
        }

        if (y < 2014)
            result = false;

        return result;
    }

    [WebMethod]
    public string Check_Employee(string eid, string sid, string aid)
    {
        sid = sid.Substring(6, 4);
        string name = "Empty";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_Employee_Get", null);
            cmd.Parameters.Add("@EID", SqlDbType.NVarChar, 25).Value = eid;
            cmd.Parameters.Add("@SSID", SqlDbType.NVarChar, 4).Value = sid;
            cmd.Parameters.Add("@AID", SqlDbType.NVarChar, 11).Value = aid;
            name = db.ExecuteScalar<string>(cmd);
        }
        catch (Exception ex)
        {
            return name;
        }
        return name;
    }

    [WebMethod]
    public List<clsMyOrder> load_MyOrder(string eid, string sid)
    {
        DataTable dt = new DataTable();
        List<clsMyOrder> odList = new List<clsMyOrder>();
        //clsOrderPageing newsPage = new clsOrderPageing();
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Personal_Od_Get", null);
            cmd.Parameters.Add("@EID", SqlDbType.NVarChar, 10).Value = eid;
            cmd.Parameters.Add("@SSID", SqlDbType.NVarChar, 10).Value = sid;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                DateTime starDate = DateTime.Now;

                // 二日遊出發前35天停止修改跟取消
                DateTime twoDay_stop_modify_date = DateTime.Now;
                DateTime oneDay_stop_modify_date = DateTime.Now;
                int dateDiff = 0;
                //出發30天之前可以取消報名
                //DateTime cancelDate = Convert.ToDateTime(starDate.AddDays(-30).ToString("yyyy/MM/dd") + " 23:59:59");
                //DateTime editDate = Convert.ToDateTime(starDate.AddDays(-15).ToString("yyyy/MM/dd") + " 23:59:59");
                //int cancelCount = Convert.ToInt32(MCPUtilities.DateDiff(MCPUtilities.DateInterval.Minute, DateTime.Now, cancelDate));
                //int editCount = Convert.ToInt32(MCPUtilities.DateDiff(MCPUtilities.DateInterval.Minute, DateTime.Now, editDate));

          
                // 第一次迴圈找出停止修改日期
                foreach (DataRow row in dt.Rows)
                {
                    if( row["ActID"].ToString().Substring(0, 2) == "E1")
                        oneDay_stop_modify_date = Convert.ToDateTime(Convert.ToDateTime(row["StartDay"]).AddDays(-6).ToString("yyyy/MM/dd") + " 23:59:59");

                    if (row["ActID"].ToString().Substring(0, 2) == "E2")
                        twoDay_stop_modify_date = Convert.ToDateTime(Convert.ToDateTime(row["StartDay"]).AddDays(-36).ToString("yyyy/MM/dd") + " 23:59:59");
                }

                // 第二次迴圈建立資料清單
                foreach (DataRow row in dt.Rows)
                {
                    clsMyOrder item = new clsMyOrder();
                    item.Seqno = Convert.ToInt32(row["Seqno"]);
                    item.OrderID = row["OrderID"].ToString();
                    item.Leader = row["Leader"].ToString();
                    item.Phone = row["Phone"].ToString();
                    item.Room = row["Room"].ToString();
                    item.Email = row["Email"].ToString();
                    item.Comment = row["Comment"].ToString();
                    item.ActID = row["ActID"].ToString();
                    item.ActName = row["ActName"].ToString();
                    item.Joiner = row["Joiner"].ToString();
                    item.SID = row["SID"].ToString();
                    item.EmpID = row["EmpID"].ToString();
                    item.Comment = row["EmpID"].ToString();
                    item.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");
                    item.Sex = row["Sex"].ToString();
                    item.Cell = row["Cell"].ToString();
                    item.PersonMail = row["PersonMail"].ToString();
                    item.Size = row["Size"].ToString();
                    item.Summary = row["Summary"].ToString();
                    item.TotalPrice = Convert.ToInt32(row["TotalPrice"]);
                    item.price = Convert.ToInt32(row["price"]);
                    item.IsVeg = Convert.ToBoolean(row["IsVeg"]);
                    item.StartDay = Convert.ToDateTime(row["StartDay"]).ToString("yyyy/MM/dd");
                    //item.RegExpDay = Convert.ToDateTime(row["RegExpDay"]).ToString("yyyy/MM/dd");

                    if (item.OrderID.Substring(0, 2) == "M1")
                    {
                        dateDiff = Convert.ToInt32(MCPUtilities.DateDiff(MCPUtilities.DateInterval.Minute, DateTime.Now, oneDay_stop_modify_date));
                        if (dateDiff > 0) { item.Switch = "Y"; } else { item.Switch = "N"; }
                    }

                    if (item.OrderID.Substring(0, 2) == "M2") {
                        dateDiff = Convert.ToInt32(MCPUtilities.DateDiff(MCPUtilities.DateInterval.Minute, DateTime.Now, twoDay_stop_modify_date));
                        if (dateDiff > 0) { item.Switch = "Y"; } else { item.Switch = "N"; }
                    }
                                        
                    //if (cancelCount > 0) { item.StartDay = "Y"; } else { item.StartDay = "N"; }
                    //if (editCount > 0) { item.RegExpDay = "Y"; } else { item.RegExpDay = "N"; }
                    odList.Add(item);
                }
                dt.Dispose();
            }
        }
        catch (Exception ex) { }
        return odList;
        //return new JavaScriptSerializer().Serialize(odList);
    }

    [WebMethod]
    public string Update_My_Order(clsMyOrder[] detail)
    {
        string result = "OK";
        string roomCode = "", orderid = "";
        int y = 0, age = 0, price = 0, adult = 0, threeyr = 0, sixyr = 0, joinAmt = 0, empidCount = 0, freeAmt = 0, total = 0;
        var roomList = new Dictionary<string, object>();
        //clsRoom(capacity, roomtype, adult, three, six, desc, cmd)
        roomList.Add("2A", new clsRoom(2, 2, 2, 0, 0, "2位成人。", ""));
        roomList.Add("2B", new clsRoom(3, 2, 2, 1, 0, "2位成人加1位三歲以下兒童", "3歲以下兒童1位"));
        roomList.Add("2C", new clsRoom(4, 2, 2, 1, 1, "2位成人加1位四至六歲兒童及1位三歲以下兒童", "4-6歲兒童(不佔床餐)、3歲以下兒童各1位"));
        roomList.Add("2D", new clsRoom(2, 2, 1, 0, 1, "1位成人加1位四至六歲兒童", "4-6歲兒童佔床餐1位"));
        roomList.Add("2F", new clsRoom(3, 2, 2, 0, 1, "2位成人加1位四至六歲兒童", "4-6歲兒童佔床餐1位"));
        roomList.Add("2G", new clsRoom(4, 2, 2, 2, 0, "2位成人加2位三歲以下兒童", "3歲以下兒童1位"));
        roomList.Add("2H", new clsRoom(4, 2, 2, 0, 2, "2位成人加2位四至六歲兒童", "4-6歲兒童佔床餐2位"));
        roomList.Add("4A", new clsRoom(4, 4, 4, 0, 0, "4位成人。", ""));
        roomList.Add("4B", new clsRoom(5, 4, 4, 1, 0, "4位成人加1位三歲以下兒童", "3歲以下兒童1位"));
        roomList.Add("4C", new clsRoom(6, 4, 4, 1, 1, "4位成人加1位四至六歲兒童及1位三歲以下兒童", "4-6歲兒童(不佔床餐)、3歲以下兒童各1位"));
        roomList.Add("4D", new clsRoom(4, 4, 3, 0, 1, "3位成人加1位四至六歲兒童", "4-6歲兒童佔床餐1位"));
        roomList.Add("4F", new clsRoom(5, 4, 4, 0, 1, "4位成人加1位四至六歲兒童", "4-6歲兒童佔床餐1位"));
        roomList.Add("4G", new clsRoom(6, 4, 4, 2, 0, "4位成人加2位三歲以下兒童", "三歲以下兒童2位"));
        roomList.Add("4H", new clsRoom(6, 4, 4, 0, 2, "4位成人加2位四至六歲兒童", "4-6歲兒童佔床餐2位"));

        try
        {
            if (detail.Length > 0)
            {
                DataTable dtD = new DataTable();
                dtD.Columns.Add("Seqno", typeof(int));
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

                //第一次回圈先驗證資料
                foreach (clsMyOrder item in detail)
                {
                    roomCode = item.Room;
                    orderid = item.OrderID;
                    if (!String.IsNullOrEmpty(item.EmpID))
                    {
                        if (!MCPUtilities.IsWtEmployId(item.EmpID)) { return "第" + (joinAmt + 1).ToString() + "列：工號格式錯誤！"; }
                    }
                    if (String.IsNullOrEmpty(item.Joiner)) { return "第" + (joinAmt + 1).ToString() + "列：請輸入參加人姓名！"; }
                    if (!MCPUtilities.IsValidSID(item.SID)) { return "第" + (joinAmt + 1).ToString() + "列：身份證或護照號碼錯誤，請重新輸入！"; }
                    if (!MCPUtilities.IsDay(item.DOB)) { return "第" + (joinAmt + 1).ToString() + "列：生日日期不正確，請重新輸入！"; }
                    if (!MCPUtilities.IsPhoneNo(item.Cell, "cell")) { return "第" + (joinAmt + 1).ToString() + "列：手機格式錯誤，請重新輸入！"; }
                    if (item.SID.Substring(1, 1) == "1") { item.Sex = "男"; } else { item.Sex = "女"; }

                    //==== 計算年齡 ====
                    y = Convert.ToInt32(item.DOB.ToString().Substring(0, 4));
                    age = 18;
                    if (y >= 2012)
                        age = 6;
                    if (y >= 2015)
                        age = 3;

                    switch (age)
                    {
                        case 3:
                        threeyr += 1;
                        break;
                        case 6:
                        sixyr += 1;
                        break;
                        default:
                        adult += 1;
                        break;
                    }

                    //==== 檢查重複工號 ====
                    if (!String.IsNullOrEmpty(item.EmpID))
                    {
                        if (age < 18) { return "第" + (joinAmt + 1).ToString() + "行：員工須為成人，請重新輸入！"; }
                        if (!lstEid.Exists(x => x == item.EmpID))
                        {
                            lstEid.Add(item.EmpID);
                            empidCount += 1;
                            freeAmt += 2;
                        }
                        else
                        {
                            return "第" + (joinAmt + 1).ToString() + "行：有重覆工號，請重新輸入！";
                        }
                    }

                    //====  檢查重複身份證號 ==== 
                    if (!lstSid.Exists(x => x == item.SID))
                    {
                        lstSid.Add(item.SID);
                    }
                    else
                    {
                        return "第" + (joinAmt + 1).ToString() + "行：有重覆身份證號，請重新輸入！";
                    }

                    joinAmt += 1;

                }//第一次回圈 End

                //if (empidCount > 2) { return "員工攜伴者，不可為公司同仁！"; }
                //// 每位同仁最多攜伴3人
                //if (empidCount == 2 && adult > 8) { return "每位同仁最多攜伴3人！"; }
                //if (empidCount == 1 && adult > 4) { return "每位同仁最多攜伴3人！"; }

                //====  檢查人數與房型 ==== 
                if (orderid.Substring(0, 2) == "M2")
                {
                    clsRoom roomObj = (clsRoom)roomList[roomCode];
                    if (roomObj.AdultAmt != adult || roomObj.threeYrAmt != threeyr || roomObj.sixYrAmt != sixyr)
                    {
                        return "住房人員不符合房型: " + roomObj.Desc;
                    }
                }


                //====  第二次迴圈先計算成人折扣並將資料加入 DataTable 並計算金額 ====  
                foreach (clsMyOrder d in detail)
                {
                    y = Convert.ToInt32(d.DOB.ToString().Substring(0, 4));
                    if (y < 2012)
                    {
                        price = 5000;
                        if (freeAmt > 0) { price = 0; freeAmt -= 1; }
                        total += price;
                        dtD.Rows.Add(d.Seqno, d.OrderID, d.ActID, d.ActName, d.Joiner, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.PersonMail, "", Convert.ToBoolean(d.IsVeg), false, false, false, price, "", "", "");
                    }
                }

                //====  第三次迴圈先計算4-6歲兒童則扣並將資料加入 DataTable 並計算金額 ====  
                foreach (clsMyOrder d in detail)
                {
                    y = Convert.ToInt32(d.DOB.ToString().Substring(0, 4));
                    if (y >= 2012 && y < 2015)
                    {
                        price = 1000;
                        if (freeAmt > 0) { price = 0; freeAmt -= 1; }
                        //cmt = "4-6歲不佔床餐";
                        total += price;
                        dtD.Rows.Add(d.Seqno, d.OrderID, d.ActID, d.ActName, d.Joiner, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.PersonMail, "", Convert.ToBoolean(d.IsVeg), false, false, false, price, "", "", "");
                    }
                }

                //====  第四次迴圈先計算0-3歲兒童則扣並將資料加入 DataTable 並計算金額 ====  
                foreach (clsMyOrder d in detail)
                {
                    y = Convert.ToInt32(d.DOB.ToString().Substring(0, 4));
                    if (y >= 2015)
                    {
                        price = 500;
                        if (freeAmt > 0) { price = 0; freeAmt -= 1; }
                        //cmt = "3歲以下";
                        total += price;
                        dtD.Rows.Add(d.Seqno, d.OrderID, d.ActID, d.ActName, d.Joiner, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.PersonMail, "", Convert.ToBoolean(d.IsVeg), false, false, false, price, "", "", "");
                    }
                }// 第四次迴圈(0-3歲兒童) End

                //====  寫入資料庫中 ====
                DBManager db = new DBManager();
                SqlCommand cmd = db.GetSPCommand("enterprise_wt_Personal_Odt_Update", null);
                SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@DETAILLIST", dtD);
                tvpDetail.SqlDbType = SqlDbType.Structured;
                tvpDetail.Direction = ParameterDirection.Input;
                SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
                retValParam.Direction = ParameterDirection.Output;
                db.ExecuteNonQuery(cmd);
                result = retValParam.Value.ToString();
                //result = "OKM1070626020" + Convert.ToString(total);
                dtD.Dispose();
                //if (result.Substring(0, 2) == "OK")
                //{
                //    string tempid = result.Replace("OK", "");
                //    send_twodays_confirm_mail(tempid.Substring(0, 11), "customer");
                //}
            }
            else
            {
                return "無資料無法更新！";
            }
        }
        catch (Exception ex)
        {
            return "服務器錯誤，目前無進行更新，請稍後再嘗試！" + ex.Message.ToString();
        }
        return result;
    }

    [WebMethod]
    public string Cancel_My_Order(clsOrder order)
    {
        string result = "OK";
        try
        {            
            string orderid = order.OrderID;
            string email = order.Email;
            string content = "您已取消 " + order.Name + " 行程報名，特此通知！";
            string actid = order.Tel2; //E1000000004
            int peopleAmount = Convert.ToInt32(order.TotalPrice); //2
            string roomType = order.Tel1; //4A or ""


            if (String.IsNullOrEmpty(orderid)) { return "報名編號遺失，無法進行取消！"; }
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Personal_Order_Cancel", null);
            cmd.Parameters.Add("@OrderID", SqlDbType.NVarChar, 12).Value = orderid;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();

            if (result == "OK")
            {
                MCPUtilities.send_single_mail(email, "MCP海天青文瞱科技線上報名取消確認信", content, "chiahunhsu@gmail.com", "");
                Waiting_to_Order_Auto(actid, peopleAmount, roomType);
            }
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }

    /// <summary>自動候補轉正</summary>
    [WebMethod]
    public string Waiting_to_Order_Auto(string actid, int peopleAmount, string roomType)
    {
        string result = "OK";
        string oid = "";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Waiting_to_Order_Auto", null);
            cmd.Parameters.Add("@actid", SqlDbType.NVarChar, 12).Value = actid;
            cmd.Parameters.Add("@joinAmt", SqlDbType.Int).Value = peopleAmount;
            cmd.Parameters.Add("@roomType", SqlDbType.NVarChar, 2).Value = roomType;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 150);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
            if (result.Substring(0, 2) == "OK")
            {
                oid = result.Replace("OK", "");
                if (!String.IsNullOrEmpty(oid))
                {
                    if (oid.Substring(0, 2) == "M1") { send_oneday_confirm_mail(oid, "customer"); }
                    if (oid.Substring(0, 2) == "M2") { send_twodays_confirm_mail(oid, "customer"); }
                }
            }
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }

    [WebMethod]
    public string Cancel_Waiting_Order(string orderid)
    {
        string result = "OK";
        try
        {
            if (String.IsNullOrEmpty(orderid)) { return "報名編號遺失，無法進行取消！"; }
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Waiting_Order_Cancel", null);
            cmd.Parameters.Add("@OrderID", SqlDbType.NVarChar, 12).Value = orderid;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }

    [WebMethod]
    public int Get_ActRegister_Amount(string actid)
    {
        int result = 0;
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_Od_ActRegister_Amount", null);
            cmd.Parameters.Add("@ActID", SqlDbType.NVarChar, 50).Value = actid;
            result = db.ExecuteScalar<int>(cmd);
        }
        catch (Exception ex)
        {
            result = 0;
        }
        return result;
    }

    [WebMethod]
    public int Get_Waiting_ActRegister_Amount(string actid)
    {
        int result = 0;
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Waiting_ActRegister_Amount", null);
            cmd.Parameters.Add("@ActID", SqlDbType.NVarChar, 50).Value = actid;
            result = db.ExecuteScalar<int>(cmd);
        }
        catch (Exception ex)
        {
            result = 0;
        }
        return result;
    }
    //-------------------------------------------------------------------------------------------
    //                                   文瞱報名候補清單
    //-----------------------------------------------------------------------------------------
    [WebMethod]
    public string Create_Wt_TwoDaysWaiting(clsOrder order, clsOrderDetail[] detail, string waiting)
    {
        string result = "OK", actname = "", actid = "", cmt = "";

        StringBuilder sb = new StringBuilder();

        if (waiting != "A" && waiting != "B") 
        {
            if (String.IsNullOrEmpty(order.Name)) { return "請輸入聯絡人姓名！"; }
            if (!MCPUtilities.IsPhoneNo(order.Tel1, "tel")) { return "聯絡人電話號碼格式錯誤！格式應為：02-8226-9088#分機！"; }
            if (!MCPUtilities.IsPhoneNo(order.Cell1, "cell")) { return "聯絡人手機號碼格式錯誤！格式應為：0933-666888！"; }
            if (!MCPUtilities.IsEmail(order.Email)) { return "聯絡人 Email格式錯誤，請重新輸入！"; }            
        }

        string yr = Convert.ToString(Convert.ToInt32(DateTime.Now.Year) - 1911);
        yr = "2" + yr.Substring(1, 2);


        switch (waiting)
        {
            case "Y":
            order.OrderID = "W" + yr + DateTime.Now.ToString("MMdd"); //W2070809 候補
            break;
            case "N":
            order.OrderID = "M" + yr + DateTime.Now.ToString("MMdd"); //M2070809 報名
            break;
            case "A":
            //更新報名
            break;
            case "B":
            //更新候補
            break;
        }

        order.Company = "wt";

        string room = "";
        int y = 1970, price = 0, joinAmt = 0, empidCount = 0, freeAmt = 0, adult = 0, threeyr = 0, sixyr = 0, total = 0, age = 18;

        var roomList = new Dictionary<string, object>();
        roomList.Add("2A", new clsRoom(2, 2, 2, 0, 0, "2位成人。", ""));
        roomList.Add("2B", new clsRoom(3, 2, 2, 1, 0, "2位成人加1位三歲以下兒童", "3歲以下兒童1位"));
        roomList.Add("2C", new clsRoom(4, 2, 2, 1, 1, "2位成人加1位四至六歲兒童及1位三歲以下兒童", "4-6歲兒童(不佔床餐)、3歲以下兒童各1位"));
        roomList.Add("2D", new clsRoom(2, 2, 1, 0, 1, "1位成人加1位四至六歲兒童", "4-6歲兒童佔床餐1位"));
        roomList.Add("2F", new clsRoom(3, 2, 2, 0, 1, "2位成人加1位四至六歲兒童", "4-6歲兒童佔床餐1位"));
        roomList.Add("2G", new clsRoom(4, 2, 2, 2, 0, "2位成人加2位三歲以下兒童", "3歲以下兒童1位"));
        roomList.Add("2H", new clsRoom(4, 2, 2, 0, 2, "2位成人加2位四至六歲兒童", "4-6歲兒童佔床餐2位"));
        roomList.Add("4A", new clsRoom(4, 4, 4, 0, 0, "4位成人。", ""));
        roomList.Add("4B", new clsRoom(5, 4, 4, 1, 0, "4位成人加1位三歲以下兒童", "3歲以下兒童1位"));
        roomList.Add("4C", new clsRoom(6, 4, 4, 1, 1, "4位成人加1位四至六歲兒童及1位三歲以下兒童", "4-6歲兒童(不佔床餐)、3歲以下兒童各1位"));
        roomList.Add("4D", new clsRoom(4, 4, 3, 0, 1, "3位成人加1位四至六歲兒童", "4-6歲兒童佔床餐1位"));
        roomList.Add("4F", new clsRoom(5, 4, 4, 0, 1, "4位成人加1位四至六歲兒童", "4-6歲兒童佔床餐1位"));
        roomList.Add("4G", new clsRoom(6, 4, 4, 2, 0, "4位成人加2位三歲以下兒童", "三歲以下兒童2位"));
        roomList.Add("4H", new clsRoom(6, 4, 4, 0, 2, "4位成人加2位四至六歲兒童", "4-6歲兒童佔床餐2位"));

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

        try
        {
            room = order.Tel2;
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

                //第一次回圈先驗證資料
                foreach (clsOrderDetail item in detail)
                {
                    if (joinAmt == 0) { actname = item.ActName; actid = item.ActID; } // 取得活動 ID 及 名稱
                    if (String.IsNullOrEmpty(item.ActID)) { return "活動行程編號遺失，無法進行報名！"; }
                    if (String.IsNullOrEmpty(item.Name)) { return "第" + (joinAmt + 1).ToString() + "行：請輸入參加人姓名！"; }
                    if (!MCPUtilities.IsValidSID(item.SID)) { return "第" + (joinAmt + 1).ToString() + "行：身份證或護照號碼錯誤，請重新輸入！"; }
                    if (!MCPUtilities.IsDay(item.DOB)) { return "第" + (joinAmt + 1).ToString() + "行：生日日期不正確，請重新輸入！"; }
                    if (!MCPUtilities.IsPhoneNo(item.Cell, "cell")) { return "第" + (joinAmt + 1).ToString() + "行：手機格式錯誤，請重新輸入！"; }
                    if (item.SID.Substring(1, 1) == "1") { item.Sex = "男"; } else { item.Sex = "女"; }

                    y = Convert.ToInt32(item.DOB.ToString().Substring(0, 4));
                    age = 18;
                    if (y >= 2013)
                        age = 6;
                    if (y >= 2016)
                        age = 3;

                    switch (age)
                    {
                        case 3:
                        threeyr += 1;
                        break;
                        case 6:
                        sixyr += 1;
                        break;
                        default:
                        adult += 1;
                        break;
                    }

                    if (!String.IsNullOrEmpty(item.EmpID))
                    {
                        if (age < 18) { return "第" + (joinAmt + 1).ToString() + "行：兒童不可為員工，請重新輸入！"; }
                        if (!lstEid.Exists(x => x == item.EmpID))
                        {
                            // 判斷是否有重複的工號
                            lstEid.Add(item.EmpID);
                            empidCount += 1;
                            freeAmt += 2;
                        }
                        else
                        {
                            return "第" + (joinAmt + 1).ToString() + "行：有重覆工號，請重新輸入！";
                        }
                    }

                    // 判斷是否有重複的身份證號
                    if (!lstSid.Exists(x => x == item.SID))
                    {
                        lstSid.Add(item.SID);
                    }
                    else {
                        return "第" + (joinAmt + 1).ToString() + "行：有重覆身份證，請重新輸入！";
                    }
                    joinAmt += 1;
                } // 第一次回圈結束

                if (empidCount <= 0) { return "請至少輸入一組員工工號！請重新輸入！"; }

                //if (empidCount > 2) { return "員工攜伴者不可以為員工同仁(夫妻不在此限制內)！"; }

                clsRoom roomObj = (clsRoom)roomList[room];
                if (roomObj.AdultAmt != adult || roomObj.threeYrAmt != threeyr || roomObj.sixYrAmt != sixyr)
                {
                    return "住房人員不符合房型: " + roomObj.Desc;
                }


                order.Comment = "預定 " + room.Substring(0, 1) + " 入房一間，共 " + Convert.ToString(joinAmt) + " 人" + cmt;


                //第二次迴圈先計算成人 discount 並將資料加入 DataTable 並計算金額
                foreach (clsOrderDetail d in detail)
                {
                    y = Convert.ToInt32(d.DOB.ToString().Substring(0, 4));
                    if (y < 2013)
                    {
                        price = 5000;
                        if (freeAmt > 0) { price = 0; freeAmt -= 1; }
                        cmt = "";
                        total += price;
                        dtD.Rows.Add(d.SeqNo, order.OrderID, d.ActID, d.ActName, d.Name, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.Email, "", Convert.ToBoolean(d.IsVeg), false, false, false, price, cmt, "", d.TempField);
                    }
                }

                //第三次迴圈先計算4-6歲兒童〈2013年01月~2015年12月間$1000〉則扣並將資料加入 DataTable 並計算金額 
                foreach (clsOrderDetail d in detail)
                {
                    y = Convert.ToInt32(d.DOB.ToString().Substring(0, 4));
                    if (y >= 2013 && y < 2016)
                    {
                        price = 1000;
                        cmt = "4-6歲不佔床餐";
                        if (room == "4D") { price = 5000; cmt = "4-6歲佔床餐"; }
                        if (freeAmt > 0) { price = 0; freeAmt -= 1; }
                        
                        total += price;
                        dtD.Rows.Add(d.SeqNo, order.OrderID, d.ActID, d.ActName, d.Name, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.Email, "", Convert.ToBoolean(d.IsVeg), false, false, false, price, cmt, "", d.TempField);
                    }
                }

                //第四次迴圈先計算0-3歲兒童〈2016年01月以後出生$500〉則扣並將資料加入 DataTable 並計算金額
                foreach (clsOrderDetail d in detail)
                {
                    y = Convert.ToInt32(d.DOB.ToString().Substring(0, 4));
                    if (y >= 2016)
                    {
                        price = 500;
                        if (freeAmt > 0) { price = 0; freeAmt -= 1; }
                        cmt = "3歲以下";
                        total += price;
                        dtD.Rows.Add(d.SeqNo, order.OrderID, d.ActID, d.ActName, d.Name, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.Email, "", Convert.ToBoolean(d.IsVeg), false, false, false, price, cmt, "", d.TempField);
                    }
                }

                dt.Rows.Add(order.OrderID, order.Name, order.Tel1, order.Tel2, order.Cell1, "", "", order.Address, order.Email, total, false, false, Convert.ToBoolean(order.IsPromote), order.Comment, "", order.Company, DateTime.Now);

                DBManager db = new DBManager();
                SqlCommand cmd = null;

                switch (waiting)
                {
                    case "Y":
                    cmd = db.GetSPCommand("enterprise_wt_TwoDays_Od_Waiting_Add", null); // 候補
                    break;
                    case "N":
                    cmd = db.GetSPCommand("enterprise_wt_TwoDays_Od_Add", null); // 報名
                    break;
                    case "A":
                    cmd = db.GetSPCommand("enterprise_wt_Personal_Odt_Update", null); // 更新報名
                    break;
                    case "B":
                    cmd = db.GetSPCommand("enterprise_wt_Personal_Waiting_Update", null); //更新候補
                    break;
                }

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

                //result = "OKW2121502002800";
                //result = "119";
                dtD.Dispose();


                if (result.Substring(0, 2) == "OK")
                {                    
                    string tempid = result.Replace("OK", "");                   
                    result = result + Convert.ToString(total);

                    if(waiting == "Y")
                        send_waiting_confirm_mail(tempid.Substring(0, 11), "customer");
                    if (waiting == "N")
                        send_twodays_confirm_mail(tempid.Substring(0, 11), "customer");

                }
            }
            else { return "您尚未加入參加人，請先加入參加人再繼續！"; }
            dt.Dispose();
        }
        catch (Exception ex) { return "資料庫連線異常，目前無法送出報名表！" + ex.Message.ToString(); }

        return result;
    }

    /// <summary>發送確認信</summary>  
    [WebMethod]
    public string send_twodays_confirm_mail(string orderid, string sentto)
    {
        string result = "OK";
        StringBuilder sb = new StringBuilder();
        DataTable dt = new DataTable();
        int count = 0, total = 0;
        string actName = "", email = "", content = "", cmt = "", actDay="", room="";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Od_Report", null);
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = "Oid";
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = orderid;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                sb.Append("<table style='border-collapse:collapse;'>");
                sb.Append("<tr>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>姓名</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>工號</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>身分證</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>生日</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>性別</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>手機</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>email</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>素食</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>金額</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>備註</th>");
                sb.Append("</tr>");
                foreach (DataRow row in dt.Rows)
                {
                    //產生明細列
                    if (count == 0)
                    {
                        email = row["MainEmail"].ToString();
                        actName = row["ActName"].ToString();
                        actDay = Convert.ToDateTime(row["StartDay"].ToString()).ToString("yyyy/MM/dd");
                        total = Convert.ToInt32(row["TotalPrice"]);
                        cmt = row["Comment"].ToString();
                        if (!String.IsNullOrEmpty(row["Room"].ToString()))
                            room = row["Room"].ToString().Substring(0, 1);
                    }

                    sb.Append("<tr>");

                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Name"].ToString());
                    if (row["EmpID"].ToString() == "000" || String.IsNullOrEmpty(row["EmpID"].ToString()))
                    {
                        sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>---</td>");
                    }
                    else
                    {
                        sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["EmpID"].ToString());
                    }
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>******{0}</td>", row["SID"].ToString().Substring(6, 4));
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", Convert.ToDateTime(row["DOB"].ToString()).ToString("yyyy/MM/dd"));
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Sex"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Cell"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Email"].ToString());
                    if (Convert.ToBoolean(row["IsVeg"].ToString()))
                    {
                        sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>素食</td>");
                    }
                    else
                    {
                        sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>X</td>");
                    }
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Price"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Cmt"].ToString());
                    sb.Append("</tr>");
                    count += 1;
                } // End Loop

                //應付總金額資訊
                sb.Append("<tr><th colspan='10' style='text-align:right; padding:6px; border:solid 1px #c0c0c0;'>");
                sb.AppendFormat("<p>應付總金額：<span style='font-weight:bold;color:red;'>{0}</span></p>", total);
                if (!String.IsNullOrEmpty(room))
                {
                    sb.AppendFormat("<p>預定 {0} 入房一間，共 {1} 位參加人</p>", room, count);
                }
                else {
                    sb.AppendFormat("<p>一共 {0} 位參加人</p>", count);
                }               
                sb.Append("</th></tr>");
                sb.Append("</table>");
                //表尾注意事項
                //sb.Append(confirmation_Notes("TwoDays"));
                sb.Append("<p style='margin-top:12px;'>");
                sb.Append("若有額外的自費金額請於報名後三日內，將自費金額以ATM轉帳、匯款或期他現金存入方式，將您的款項匯至：<br/><br/>");
                sb.Append("銀行：<span style='color:blue; font-weight:bold;'>新光銀行---新板分行 103</span><br/>");
                sb.Append("戶名：<span style='color:blue; font-weight:bold;'>海天青旅行社股份有限公司</span><br/>");
                sb.Append("帳號：<span style='color:blue; font-weight:bold;'>0462-10-100-2861</span><br/>");
                sb.Append("</p>");
                sb.Append("<p style='margin-top:12px;'>");
                sb.Append("補助辦法：");
                sb.Append("<ol>");
                sb.Append("<li>每位同仁最多可攜伴3人(不含未足6歲不佔床不占餐兒童)。</li> ");
                sb.Append("<li>員工本人全額補助（每人限補助一次）。</li> ");
                sb.Append("<li>員工攜伴第1人免費。</li> ");
                sb.Append("<li>員工攜伴第2人需自費新台幣 $5,000元。</li> ");
                sb.Append("<li>員工攜伴第3人需自費新台幣 $5,000元。</li> ");
                sb.Append("<li>員工攜伴者，不可為公司同仁(夫妻不在此限制內)。</li> ");
                sb.Append("<li>4-6歲兒童定義<span style='color: red'>〈2013年01月~2015年12月間〉</span>，每人酌收1000元〈含保險/車資/活動門票費用等行政代辦費用〉。</li> ");
                sb.Append("<li>0-3歲幼童定義<span style='color: red'>〈2016年01月以後出生〉</span>，每人酌收500元〈含保險/車資等行政代辦費用〉。</li> ");
                sb.Append("<li>4-6歲小朋友身高如有超過收費規定，衍伸火車票或是飯店住宿早餐等其他費用，則依當日實際支付之費用另收。</li> ");
                sb.Append("</ol>");
                sb.Append("</p>");
                sb.Append("<p style='margin-top:12px;'>");
                sb.Append("活動注意事項：");
                sb.Append("<ol>");
                sb.Append("<li>每梯次旅遊，每車人數需滿 30 人才可開梯，如未達 30 人則取消該車活動。</li> ");
                sb.Append("<li>報名成功後如不克前往，最晚需於出發前35日下午5:00前，自行登入取消，未提前取消者則無法退費，並喪失公司補助權益。 (公司仍需支付此筆費用予旅行社) 。</li> ");
                sb.Append("<li>已報名旅遊行程之參加者不可無故不到，亦不可員工本人未到僅眷屬自行參與，未到者即視同棄權需自行負擔全額旅費，且由當月薪資扣除。</li> ");
                sb.Append("<li>請勿冒名頂替他人參與活動，違者須自行負擔全額旅費，且由當月薪資扣除。</li> ");
                sb.Append("<li>每位參加同仁及親友皆有投保旅遊責任險 (無法提供當日臨時加保服務)。</li> ");
                sb.Append("<li>報到當日請務必攜帶有照片之「身份證件」(如:身分證、駕照、健保卡)。查驗不符者將無法參與活動，敬請同仁配合。</li> ");
                sb.Append("<li>請於行前通知單規定時間內準時集合，如遲到超過規定集合時間五分鐘以上，則視同放棄此活動，無法退回任何費用，並喪失公司補助權益，且該員工需付全額旅費費用，由當月薪資扣除。</li> ");
                sb.Append("<li>公司員工旅遊需團體同進同出，故皆不開放同仁自行開車前往及提早離開，請同仁們多加留意，違者須自行負擔全額旅費，且由當月薪資扣除。</li> ");
                sb.Append("<li>活動報名成功後，會於活動出發前三日統一寄發行前通知單，在煩請同仁特別注意信箱資訊及當日報到時間和集合地點，並煩請告知同行親友。</li> ");
                sb.Append("<li>如活動當天臨時生病或發燒，煩請先聯絡當日主辦人員，並提供當日就醫證明給福委會，則免扣除員工薪資。</li> ");
                sb.Append("<li>補助期限至2019年12月底，依網站公告的最後一次旅遊活動行程為止。</li> ");
                sb.Append("<li>如於補助期限內未參加任何活動，則視同放棄權利，不另轉發現金。</li> ");
                sb.Append("<li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li> ");
                sb.Append("<li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將於現場補足實際產生之費用。</li> ");
                sb.Append("<li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液.等。本單位不提供任何口服藥物。</li> ");
                sb.Append("<li>遊覽車上請勿攜帶寵物及危險物品參與行程，感謝您的配合。</li> ");
                sb.Append("<li>以上行程載明之車行時間僅供參考，如因路況或假日遊客眾多行程順序將視情況做更動調整。</li> ");
                sb.Append("<li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li> ");
                sb.Append("</ol>");
                sb.Append("</p>");

                content = sb.ToString();
                sb.Remove(0, sb.Length);

                sb.Append("<div style='marging-top:12px;margin-bottom:12px;'>");
                sb.AppendFormat("親愛的同仁您好！您已經在 MCP海天青企業專區網站上報名<span style='font-weight:bold;color:blue; padding-left:4px; padding-right:4px'>{0} ({1})</span>的活動行程，其他詳細資訊如下：", actName, actDay);
                sb.AppendFormat("您的報名編號為：<span style='font-weight:bold;color:red;'>{0}</span>，其他詳細資訊如下：", orderid);
                sb.Append("</div>");

                content = sb.ToString() + content;
                if (sentto == "customer")
                {                   
                    MCPUtilities.send_single_mail(email, "MCP海天青文瞱集團線上報名確認信", content, "chiahunhsu@gmail.com", "");
                } else {
                    //MCPUtilities.send_single_mail("chiahunhsu@gmail.com", "重發確認信", content, "mcpricky@gmail.com", ""); 

                    MCPUtilities.send_single_mail(email, "MCP海天青文瞱集團線上報名確認信", content, "chiahunhsu@gmail.com", "");
                }

            }
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }

    [WebMethod]
    public string Create_Wt_OneDayWaiting(clsOrder order, clsOrderDetail[] detail, string waiting)
    {
        string result = "OK", actname = "", actid = "", cmt = "";

        StringBuilder sb = new StringBuilder();

        if (waiting != "A" && waiting != "B")
        {
            if (String.IsNullOrEmpty(order.Name)) { return "請輸入聯絡人姓名！"; }
            if (!MCPUtilities.IsPhoneNo(order.Tel1, "tel")) { return "聯絡人電話號碼格式錯誤！格式應為：02-8226-9088#分機！"; }
            if (!MCPUtilities.IsPhoneNo(order.Cell1, "cell")) { return "聯絡人手機號碼格式錯誤！格式應為：0933-666888！"; }
            if (!MCPUtilities.IsEmail(order.Email)) { return "聯絡人 Email格式錯誤，請重新輸入！"; }
        }

        int kidYr = Convert.ToInt32(DateTime.Now.Year) - 3;
        string yr = Convert.ToString(Convert.ToInt32(DateTime.Now.Year) - 1911);
        yr = "1" + yr.Substring(1, 2);

        switch (waiting)
        {
            case "Y":
            order.OrderID = "W" + yr + DateTime.Now.ToString("MMdd"); //W1070809 候補
            break;
            case "N":
            order.OrderID = "M" + yr + DateTime.Now.ToString("MMdd"); //M1070809 報名
            break;
            case "A":
            //更新報名
            break;
            case "B":
            //更新候補
            break;
        }

        order.Company = "wt";

        int y = 1970, price = 0, joinAmt = 0, empidCount = 0, freeAmt = 0, adult = 0, threeyr = 0, total = 0, discount1000 = 0, discount2300 = 0;

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

        try
        {

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

                //第一次回圈先驗證資料
                foreach (clsOrderDetail item in detail)
                {
                    if (joinAmt == 0) { actname = item.ActName; actid = item.ActID; } // 取得活動 ID 及 名稱
                    if (String.IsNullOrEmpty(item.ActID)) { return "活動行程編號遺失，無法進行報名！"; }
                    if (String.IsNullOrEmpty(item.Name)) { return "第" + (joinAmt + 1).ToString() + "行：請輸入參加人姓名！"; }
                    if (!MCPUtilities.IsValidSID(item.SID)) { return "第" + (joinAmt + 1).ToString() + "行：身份證或護照號碼錯誤，請重新輸入！"; }
                    if (!MCPUtilities.IsDay(item.DOB)) { return "第" + (joinAmt + 1).ToString() + "行：生日日期不正確，請重新輸入！"; }
                    if (!MCPUtilities.IsPhoneNo(item.Cell, "cell")) { return "第" + (joinAmt + 1).ToString() + "行：手機格式錯誤，請重新輸入！"; }
                    if (item.SID.Substring(1, 1) == "1") { item.Sex = "男"; } else { item.Sex = "女"; }

                    y = Convert.ToInt32(item.DOB.ToString().Substring(0, 4));
                    if (y >= kidYr) { threeyr += 1; } else { adult += 1; } //計算年齡                   

                    if (!String.IsNullOrEmpty(item.EmpID))
                    {
                        // 判斷是否有重複的工號
                        if (!lstEid.Exists(x => x == item.EmpID))
                        {
                            // 本人0 第1人0 第2人1000 第3人2300 三歲以下200
                            lstEid.Add(item.EmpID);
                            empidCount += 1;
                            freeAmt += 2;
                            discount1000 += 1;
                        }
                        else {
                            return "第" + (joinAmt + 1).ToString() + "行：有重覆工號，請重新輸入！";
                        }
                    }

                    // 判斷是否有重複的身份證號
                    if (!lstSid.Exists(x => x == item.SID)) { lstSid.Add(item.SID); } else { return "第" + (joinAmt + 1).ToString() + "行：有重覆身份證，請重新輸入！"; }
                    joinAmt += 1;
                } // 第一次回圈結束



                if (empidCount <= 0) { return "請至少輸入一組員工工號！請重新輸入！"; }

                // 員工攜伴者，不可為公司同仁(夫妻不在此限制內，但每人限參加一次活動) 
                if (empidCount > 2) { return "員工攜伴者，不可為公司同仁！"; }

                // 每位同仁最多攜伴3人
                //if (empidCount == 2 && adult > 8) { return "每位同仁最多攜伴3人！"; }
                if (empidCount == 1 && adult > 4) { return "每位同仁最多攜伴3人！"; }

                order.Comment = "共 " + joinAmt.ToString() + " 位參加人〈" + threeyr.ToString() + " 位 0-3 歲兒童〉";

                //第二次迴圈先算員工金額
                foreach (clsOrderDetail d in detail)
                {
                    if (!String.IsNullOrEmpty(d.EmpID)) {
                        price = 0;
                        freeAmt -= 1;
                        dtD.Rows.Add(d.SeqNo, order.OrderID, d.ActID, d.ActName, d.Name, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.Email, "", Convert.ToBoolean(d.IsVeg), false, false, false, price, cmt, "", d.TempField);
                    }
                } // 第二次回圈結束

                //第三次迴圈算成人眷屬金額
                foreach (clsOrderDetail d in detail)
                {
                    y = Convert.ToInt32(d.DOB.ToString().Substring(0, 4));
                    if (String.IsNullOrEmpty(d.EmpID) && y < kidYr)
                    {
                        price = 2300;
                        if (freeAmt > 0){
                            price = 0;
                            freeAmt -= 1;
                        } else {
                            if (discount1000 > 0){
                                price = 1000;
                                discount1000 -= 1;
                            }
                        }
                        total += price;
                        dtD.Rows.Add(d.SeqNo, order.OrderID, d.ActID, d.ActName, d.Name, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.Email, "", Convert.ToBoolean(d.IsVeg), false, false, false, price, cmt, "", d.TempField);
                    }
                } // 第三次回圈結束

                //第四次迴圈算3歲小孩眷屬金額
                foreach (clsOrderDetail d in detail)
                {
                    y = Convert.ToInt32(d.DOB.ToString().Substring(0, 4));
                    if (y >= kidYr)
                    {
                        price = 200;
                        cmt = "3歲以下";
                        if (freeAmt > 0)
                        {
                            price = 0;
                            freeAmt -= 1;
                        }                       
                        total += price;
                        dtD.Rows.Add(d.SeqNo, order.OrderID, d.ActID, d.ActName, d.Name, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.Email, "", Convert.ToBoolean(d.IsVeg), false, false, false, price, cmt, "", d.TempField);
                    }                    
                } //End Loop

                dt.Rows.Add(order.OrderID, order.Name, order.Tel1, order.Tel2, order.Cell1, "", "", order.Address, order.Email, total, false, false, Convert.ToBoolean(order.IsPromote), order.Comment, "", order.Company, DateTime.Now);
                if (dt.Rows.Count <= 0) { return "請先輸入聯絡人相關資訊，然後再繼續！"; }

                DBManager db = new DBManager();
                SqlCommand cmd = null;

                switch (waiting)
                {
                    case "Y":
                    cmd = db.GetSPCommand("enterprise_wt_OneDay_Od_Waiting_Add", null);  //候補
                    break;
                    case "N":
                    cmd = db.GetSPCommand("enterprise_wt_OneDay_Od_Add", null); //報名
                    break;
                    case "A":
                    cmd = db.GetSPCommand("enterprise_wt_Personal_Odt_Update", null); //更新報名
                    break;
                    case "B":
                    cmd = db.GetSPCommand("enterprise_wt_Personal_Waiting_Update", null); //更新候補
                    break;
                }

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

                if (result.Substring(0, 2) == "OK")
                {
                    string tempid = result.Replace("OK", "");
                    result = result + Convert.ToString(total);
                    if (waiting == "Y")
                        send_waiting_confirm_mail(tempid.Substring(0, 11), "customer");
                    if (waiting == "N")
                        send_oneday_confirm_mail(tempid.Substring(0, 11), "customer");
                }
            }
            else { return "您尚未加入參加人，請先加入參加人再繼續！"; }
            dt.Dispose();
        }
        catch (Exception ex) { return "資料庫連線異常，目前無法送出報名表！" + ex.Message.ToString(); }

        return result;
    }

    /// <summary>發送一日遊確認 Email</summary>   
    [WebMethod]
    public string send_oneday_confirm_mail(string orderid, string sentto)
    {
        string result = "OK";
        StringBuilder sb = new StringBuilder();
        DataTable dt = new DataTable();
        int count = 0, total = 0;
        string actName = "", email = "", content = "", actDay = "";
        try
        {
            DBManager db = new DBManager();
            //SqlCommand cmd = db.GetSPCommand("enterprise_Order_wtExport", null);
            //cmd.Parameters.Add("@ActID", SqlDbType.NVarChar, 15).Value = "";
            //cmd.Parameters.Add("@OrderID", SqlDbType.NVarChar, 15).Value = orderid;
            //cmd.Parameters.Add("@method", SqlDbType.NVarChar, 15).Value = "email";
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Od_Report", null);
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = "Oid";
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = orderid;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                sb.Append("<table style='border-collapse:collapse;'>");
                sb.Append("<tr>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>姓名</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>工號</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>身分證</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>生日</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>性別</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>手機</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>email</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>素食</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>金額</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>備註</th>");
                sb.Append("</tr>");
                foreach (DataRow row in dt.Rows)
                {
                    //產生明細列
                    if (count == 0)
                    {
                        email = row["MainEmail"].ToString();
                        actName = row["ActName"].ToString();
                        total = Convert.ToInt32(row["TotalPrice"]);
                        actDay = Convert.ToDateTime(row["StartDay"].ToString()).ToString("yyyy/MM/dd");
                    }

                    sb.Append("<tr>");
                    //total += Convert.ToInt32(row["Price"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Name"].ToString());
                    if (row["EmpID"].ToString() == "000" || String.IsNullOrEmpty(row["EmpID"].ToString()))
                    {
                        sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>---</td>");
                    }
                    else {
                        sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["EmpID"].ToString());
                    }
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>******{0}</td>", row["SID"].ToString().Substring(6, 4));
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", Convert.ToDateTime(row["DOB"].ToString()).ToString("yyyy/MM/dd"));
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Sex"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Cell"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Email"].ToString());
                    if (Convert.ToBoolean(row["IsVeg"]))
                    {
                        sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>素食</td>");
                    }
                    else
                    {
                        sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>X</td>");
                    }
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Price"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Cmt"].ToString());
                    //if (Math.Floor(new TimeSpan(DateTime.Now.Ticks - Convert.ToDateTime(row["DOB"].ToString()).Ticks).TotalDays) > 1095) {
                    //  adult +=1;
                    //}

                    sb.Append("</tr>");
                    count += 1;
                }
                //應付總金額資訊
                sb.Append("<tr><th colspan='10' style='text-align:right; padding:6px; border:solid 1px #c0c0c0;'>");
                sb.AppendFormat("應付總金額：<span style='font-weight:bold;color:red;'>{0}</span></th></tr>", total);
                sb.AppendFormat("<p>一共 {0} 位參加人</p>", count);
                sb.Append("</table>");

                //表尾注意事項
                sb.Append("<p style='margin-top:12px;'>");
                sb.Append("若有額外的自費金額請於報名後三日內，將自費金額以ATM轉帳、匯款或期他現金存入方式，將您的款項匯至：<br/><br/>");
                sb.Append("銀行：<span style='color:blue; font-weight:bold;'>新光銀行---新板分行 103</span><br/>");
                sb.Append("戶名：<span style='color:blue; font-weight:bold;'>海天青旅行社股份有限公司</span><br/>");
                sb.Append("帳號：<span style='color:blue; font-weight:bold;'>0462-10-100-2861</span><br/>");                
                sb.Append("</p>");

                //sb.Append("<p style='margin-top:12px;'>");
                //sb.Append("最後，文曄科技福委及海天青旅行社感謝您的參加與支持！");
                //sb.Append("我們將會於活動出發前 3 天寄發行前通知單給予參加同仁，在煩請注意郵件信箱。");
                //sb.Append("如有任何問題請洽海天青旅行社活動負責人員 02-2952-7535 #32 徐小姐");
                //sb.Append("</p>");

                sb.Append("<p style='margin-top:12px;'>文瞱科技一日遊補助辦法補助辦法</p>");
                sb.Append("<ol>");
                sb.Append("<li>每位同仁最多可攜伴3人(不含3歲以下孩童)。</li>");
                sb.Append("<li>員工本人全額補助〈每人限參加及補助一次〉。</li>");
                sb.Append("<li>員工攜伴第1人免費。</li>");
                sb.Append("<li>員工攜伴第2人需自費新台幣 $1,000元。</li>");
                sb.Append("<li>員工攜伴第3人需自費新台幣 $2,300元。</li>");
                sb.Append("<li>員工攜伴者，不可為公司同仁(夫妻不在此限制內，但每人限參加一次活動)。</li>");
                sb.Append("<li>0-3歲兒童定義<span style='color: red'>〈2016年1月以後出生〉</span>，每人酌收200元〈含保險/車資等行政代辦費用〉。</li>");
                sb.Append("</ol>");

                sb.Append("<p style='margin-top:12px;'>文瞱科技一日遊活動注意事項</p>");
                sb.Append("<ol>");
                sb.Append("<li>每梯次旅遊，<span style='color:red;'>每車人數需滿30人才可開梯</span>，如未達30人則取消該車活動。</li>");
                sb.Append("<li>報名成功後如不克前往，最晚需於出發前<span style='color:red;'>5日</span>下午5:00前，自行登入取消，未提前取消者則無法退費，並喪失公司補助權益。 (公司仍需支付此筆費用予旅行社) 。</li>");
                sb.Append("<li>已報名旅遊行程之參加者<span style='color:red;'>不可無故不到，亦不可員工本人未到僅眷屬自行參與，未到者即視同棄權需自行負擔全額旅費，且由當月薪資扣除</span>。</li>");
                sb.Append("<li>請勿冒名頂替他人參與活動，違者須自行負擔全額旅費，且由當月薪資扣除。</li>");
                sb.Append("<li>每位參加同仁及親友皆有投保旅遊責任險 (無法提供當日臨時加保服務)。</li>");
                sb.Append("<li>報到當日請務必攜帶有<span style='color:red;'>照片</span>之「身份證件」(如:身分證、駕照、健保卡)。查驗不符者將無法參與活動，敬請同仁配合。</li>");
                sb.Append("<li>請於行前通知單規定時間內準時集合，如遲到<span style='color:red;'>超過規定集合時間五分鐘以上</span>，則視同放棄此活動，則無法退任何費用，並喪失公司補助權益，且該員工需付全額旅費費用，由當月薪資扣除。</li>");
                sb.Append("<li>公司員工旅遊需團體同進同出，故皆不開放同仁自行開車前往及提早離開，請同仁們多加留意，違者須自行負擔全額旅費，且由當月薪資扣除。</li>");
                sb.Append("<li>活動報名成功後，會於活動出發前<span style='color:red;'>三日</span>統一寄發行前通知單，在煩請同仁特別注意信箱資訊及當日報到時間和集合地點，並煩請告知同行親友。</li>");
                sb.Append("<li>如活動當天臨時生病或發燒，煩請先聯絡當日主辦人員，並提供當日就醫證明給福委會，則免扣除員工薪資。</li>");
                sb.Append("<li>補助期限至2019年12月，依網站公告的最後一次旅遊活動行程為止。</li>");
                sb.Append("<li>如於補助期限內未參加任何活動，則視同放棄權利，不另轉發現金。</li>");
                sb.Append("<li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li>");
                sb.Append("<li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將於現場補足實際產生之費用。</li>");
                sb.Append("<li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液.等。本單位不提供任何口服藥物。</li>");
                sb.Append("<li>遊覽車上請勿攜帶寵物及危險物品參與行程，感謝您的配合。</li>");
                sb.Append("<li>以上行程載明之車行時間僅供參考，如因路況或假日遊客眾多行程順序將視情況做更動調整。</li>");
                sb.Append("<li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li>");
                sb.Append("<li>旅遊活動諮詢專線：02-29527535  #32 徐小姐 。</li>");
                sb.Append("</ol>");

                content = sb.ToString();
                sb.Remove(0, sb.Length);

                sb.Append("<div style='marging-top:12px;margin-bottom:12px;'>");
                sb.AppendFormat("親愛的同仁您好！您已經在 MCP海天青企業專區網站上報名<span style='font-weight:bold;color:blue;'>{0} ({1})</span>，", actName, actDay);
                sb.AppendFormat("您的報名編號為：<span style='font-weight:bold;color:red;'>{0}</span>，其他詳細資訊如下：", orderid);
                sb.Append("</div>");

                content = sb.ToString() + content;

                if (sentto == "customer")
                {
                    MCPUtilities.send_single_mail(email, "MCP海天青文瞱集團線上報名確認信", content, "chiahunhsu@gmail.com", "");
                }
                else {
                    //MCPUtilities.send_single_mail("chiahunhsu@gmail.com", "重發確認信", content, "mcpricky@gmail.com", ""); 
                    MCPUtilities.send_single_mail(email, "MCP海天青文瞱集團線上報名確認信", content, "chiahunhsu@gmail.com", "");
                }

            }
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }

    /// <summary>發送一日或二日候補確認信</summary>  
    [WebMethod]
    public string send_waiting_confirm_mail(string orderid, string sentto)
    {
        string result = "OK";
        StringBuilder sb = new StringBuilder();
        DataTable dt = new DataTable();
        int count = 0, total = 0;
        string actName = "", email = "", content = "", cmt = "", actDay = "", room = "";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Waiting_Report", null);
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = "Oid";
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = orderid;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                sb.Append("<table style='border-collapse:collapse;'>");
                sb.Append("<tr>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>姓名</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>工號</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>身分證</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>生日</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>性別</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>手機</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>email</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>素食</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>金額</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>備註</th>");
                sb.Append("</tr>");
                foreach (DataRow row in dt.Rows)
                {
                    //產生明細列
                    if (count == 0)
                    {
                        email = row["MainEmail"].ToString();
                        actName = row["ActName"].ToString();
                        total = Convert.ToInt32(row["TotalPrice"]);
                        cmt = row["Comment"].ToString();
                        actDay = Convert.ToDateTime(row["StartDay"].ToString()).ToString("yyyy/MM/dd");

                        if (!String.IsNullOrEmpty(row["Room"].ToString()))
                            room = row["Room"].ToString().Substring(0, 1);
                    }

                    sb.Append("<tr>");

                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Name"].ToString());
                    if (row["EmpID"].ToString() == "000" || String.IsNullOrEmpty(row["EmpID"].ToString()))
                    {
                        sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>---</td>");
                    }
                    else
                    {
                        sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["EmpID"].ToString());
                    }
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>******{0}</td>", row["SID"].ToString().Substring(6, 4));
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", Convert.ToDateTime(row["DOB"].ToString()).ToString("yyyy/MM/dd"));
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Sex"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Cell"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Email"].ToString());
                    if (Convert.ToBoolean(row["IsVeg"].ToString()))
                    {
                        sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>素食</td>");
                    }
                    else
                    {
                        sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>X</td>");
                    }
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Price"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Cmt"].ToString());
                    sb.Append("</tr>");
                    count += 1;
                }
                //應付總金額資訊
                sb.Append("<tr><th colspan='10' style='text-align:right; padding:6px; border:solid 1px #c0c0c0;'>");
                sb.AppendFormat("<p>應付總金額：<span style='font-weight:bold;color:red;'>{0}</span></p>", total);               

                if (orderid.Substring(0, 2) == "W2")
                {
                    if (!String.IsNullOrEmpty(room))
                    {
                        sb.AppendFormat("<p>預定 {0} 入房一間，共 {1} 位參加人</p>", room, count);
                    }
                    else {
                        sb.AppendFormat("<p>一共 {0} 位參加人</p>", count);
                    }
                }
                else {
                    sb.AppendFormat("<p>一共 {0} 位參加人</p>", count);
                }
                                    
                sb.Append("</th></tr>");
                sb.Append("</table>");

                //表尾注意事項               
                sb.Append("<p style='margin-top:12px;'>該梯次若有同仁取消，將依照您候補的先後順序遞補，謝謝您耐心等候！</p>");
                content = sb.ToString();
                sb.Remove(0, sb.Length);

                sb.Append("<div style='marging-top:12px;margin-bottom:12px;'>");
                sb.AppendFormat("親愛的同仁您好！您已經在 MCP海天青企業專區網站上候補<span style='font-weight:bold;color:blue; padding-left:4px; padding-right:4px'>{0} ({1})</span>的活動行程，其他詳細資訊如下：", actName, actDay);
                //sb.AppendFormat("您的報名編號為：<span style='font-weight:bold;color:red;'>{0}</span>，其他詳細資訊如下：", orderid);
                sb.Append("</div>");

                content = sb.ToString() + content;
                MCPUtilities.send_single_mail(email, "MCP海天青文瞱集團線上候補確認信", content, "chiahunhsu@gmail.com", "");
            }
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }

    /// <summary>取得候補清單(分頁)</summary>
    [WebMethod]
    public string load_Waiting_Paging(int pageindex, int pagesize, string filterby, string filtervalue)
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<clsOrderWithStartDay> tempList = new List<clsOrderWithStartDay>();
        clsOrderWithStartDayPageing newsPage = new clsOrderWithStartDayPageing();

        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Waiting_Paging", null);
            cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = pageindex;
            cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pagesize;
            cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = "wt";
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
                    clsOrderWithStartDay item = new clsOrderWithStartDay();
                    item.ActName = row["ActName"].ToString();
                    item.StartDay = Convert.ToDateTime(row["StartDay"]).ToString("yyyy/MM/dd");
                    item.OrderID = row["OrderID"].ToString();
                    item.Name = row["Name"].ToString();
                    item.Tel1 = row["Tel1"].ToString();
                    item.Cell1 = row["Cell1"].ToString();
                    item.Email = row["Email"].ToString();
                    item.TotalPrice = Convert.ToInt32(row["TotalPrice"]);
                    item.CreateDay = Convert.ToDateTime(row["CreateDay"]).ToString("yyyy/MM/dd");
                    item.Comment = row["Comment"].ToString();
                    tempList.Add(item);
                }
                dt.Dispose();
                newsPage.TotalRows = totalRow;
                newsPage.Orders = tempList;

            }
        }
        catch (Exception ex) { }
        //return actpage;
        return new JavaScriptSerializer().Serialize(newsPage);
    }

    /// <summary>取得候補明細表</summary>
    [WebMethod]
    public List<clsOrderDetail> load_Waiting_Details(string orderid)
    {
        List<clsOrderDetail> tempList = new List<clsOrderDetail>();
        DataTable dt = new DataTable();
        DBManager db = new DBManager();
        try
        {
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Waiting_Details", null);
            cmd.Parameters.Add("@id", SqlDbType.NVarChar, 12).Value = orderid;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsOrderDetail v = new clsOrderDetail();
                    v.SeqNo = Convert.ToInt32(row["SeqNo"]);
                    v.ActID = row["ActID"].ToString();
                    v.ActName = row["ActName"].ToString();
                    v.Name = row["Name"].ToString();
                    v.SID = row["SID"].ToString();
                    v.EmpID = row["EmpID"].ToString();
                    v.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");
                    v.Cell = row["Cell"].ToString();
                    v.Price = Convert.ToInt32(row["Price"]);
                    v.IsVeg = Convert.ToBoolean(row["IsVeg"]);
                    v.Comment = row["Comment"].ToString();
                    v.TempField = row["TempField"].ToString();
                    v.Email = row["Email"].ToString();
                    tempList.Add(v);
                }
            }
        }
        catch (Exception ex) { }
        finally { dt.Dispose(); }
        return tempList;
    }

    /// <summary>候補轉正</summary>
    [WebMethod]
    public string Waiting_to_Order(string orderid)
    {
        string result = "OK";
        string oid = "";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Waiting_to_Order", null);
            cmd.Parameters.Add("@oid", SqlDbType.NVarChar, 12).Value = orderid;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 150);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
            if (result.Substring(0, 2) == "OK")
            {                
                oid = result.Replace("OK", "");
                if (oid.Substring(0, 2) == "M1") { send_oneday_confirm_mail(oid, "customer"); }
                if (oid.Substring(0, 2) == "M2") { send_twodays_confirm_mail(oid, "customer"); }
            }
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }

    /// <summary>候補轉換活動</summary>
    [WebMethod]
    public string Waiting_Transfer(string orderid, string actid)
    {
        string result = "OK";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Waiting_Transfer", null);
            cmd.Parameters.Add("@OrderID", SqlDbType.NVarChar, 20).Value = orderid;
            cmd.Parameters.Add("@ActIDToTran", SqlDbType.NVarChar, 20).Value = actid;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 150);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }

    // <summary>更新候補主表資料</summary>
    [WebMethod]
    public string Update_Waiting_Main(clsOrder order, string action)
    {
        string result = "OK";
        DataTable dt = new DataTable();
        dt.Columns.Add("OrderID", typeof(string));
        dt.Columns.Add("Name", typeof(string));
        dt.Columns.Add("Tel1", typeof(string));
        dt.Columns.Add("Tel2", typeof(string));
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
        try
        {
            if (String.IsNullOrEmpty(order.OrderID)) { return "報名編號遺失，無法進行更新！"; }
            if (action == "Update")
            {
                string strValid = "OK";
                //Check_Data_Valid(string name, string dob, string sid, string eid, string cell, string phone, string email)
                strValid = Check_Data_Valid(order.Name, "1990/12/12", "Y117094843", "1234567", order.Cell1, order.Tel1, order.Email);
                if (strValid != "OK") { return strValid; }
            }
            if (!MCPUtilities.IsNumeric(Convert.ToString(order.TotalPrice))) { return "金額不正確，請重新輸入！"; }

            dt.Rows.Add(order.OrderID, order.Name, order.Tel1, order.Tel2, order.Cell1, order.Cell2, order.Fax, order.Address,
              order.Email, order.TotalPrice, order.IsPaid, order.IsConfirm, order.IsPromote, order.Comment, order.Source, order.Company, DateTime.Now);

            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Waiting_Od_Modify", null);
            SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@ORDERLIST", dt);
            tvpDetail.SqlDbType = SqlDbType.Structured;
            tvpDetail.Direction = ParameterDirection.Input;
            cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 20).Value = action;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        finally { dt.Dispose(); }
        return result;
    }

    /// <summary>更新候補明細表</summary>
    [WebMethod]
    public string Update_Waiting_Detail(clsOrderDetail details, string action)
    {
        string result = "OK";
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
        try
        {

            if (!MCPUtilities.IsNumeric(Convert.ToString(details.SeqNo))) { return "序列號遺失，無法執行！"; }
            if (String.IsNullOrEmpty(details.ActID)) { return "活動編號遺失，無法執行！"; }
            if (String.IsNullOrEmpty(details.OrderID)) { return "單號遺失，無法執行！"; }
            if (action == "Update")
            {
                string strValid = Check_Data_Valid(details.Name, details.DOB, details.SID, "12345678", details.Cell, "02-8226-9088", details.Email);
                if (strValid != "OK")
                    return strValid;
            }
            dtD.Rows.Add(details.SeqNo, details.OrderID, details.ActID, details.ActName,
                         details.Name, details.SID, details.EmpID, Convert.ToDateTime(details.DOB),
                         "", details.Cell, details.Email, "N", false, false, false, false, details.Price, details.Comment, "", "");
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Waiting_Odt_Modify", null);
            SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@DETAILLIST", dtD);
            tvpDetail.SqlDbType = SqlDbType.Structured;
            tvpDetail.Direction = ParameterDirection.Input;
            cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 20).Value = action;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();

        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        finally { dtD.Dispose(); }
        return result;
    }

    //<summary>取得候補清單</summary>
    [WebMethod]
    public List<clsOrderReportWithPay> Get_Waiting_Report(string filterby, string filtervalue)
    {
        List<clsOrderReportWithPay> tempList = new List<clsOrderReportWithPay>();
        DataTable dt = new DataTable();
        DBManager db = new DBManager();
        try
        {
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Waiting_Report", null);
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = filterby;
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = filtervalue;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsOrderReportWithPay v = new clsOrderReportWithPay();
                    v.OrderID = row["OrderID"].ToString();
                    v.ActID = row["ActID"].ToString();
                    v.ActName = row["ActName"].ToString();
                    v.Name = row["Name"].ToString();
                    v.SID = row["SID"].ToString();
                    v.EmpID = row["EmpID"].ToString();
                    v.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");
                    v.Sex = row["Sex"].ToString();
                    v.Cell = row["Cell"].ToString();
                    v.Email = row["Email"].ToString();
                    v.Price = Convert.ToInt32(row["Price"]);
                    v.Comment = row["Cmt"].ToString();
                    v.IsVeg = Convert.ToBoolean(row["IsVeg"].ToString());
                    v.mainName = row["MainName"].ToString();
                    v.mainTel = row["MainTel"].ToString();
                    v.mainCell = row["MainCell"].ToString();                     
                    v.TotalPrice = Convert.ToInt32(row["TotalPrice"]);
                    v.mainCmt = row["Comment"].ToString();
                    v.StartDay = Convert.ToDateTime(row["StartDay"]).ToString("yyyy/MM/dd");
                    tempList.Add(v);
                }
            }
        }
        catch (Exception ex) {
            var str = ex.Message;
        }
        finally { dt.Dispose(); }
        return tempList;
    }

    //<summary>取得個人候補清單</summary>
    [WebMethod]
    public List<clsMyOrder> Load_My_WaitingList(string eid, string sid)
    {
        List<clsMyOrder> tempList = new List<clsMyOrder>();
        DataTable dt = new DataTable();
        DBManager db = new DBManager();
        try
        {
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Personal_Waiting_Get", null);
            cmd.Parameters.Add("@EID", SqlDbType.NVarChar, 10).Value = eid;
            cmd.Parameters.Add("@SSID", SqlDbType.NVarChar, 10).Value = sid;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                // 二日遊出發前35天停止修改跟取消
                //DateTime starDate = Convert.ToDateTime(dt.Rows[0]["StartDay"]);                
                //DateTime twoDay_stop_modify_date = Convert.ToDateTime(starDate.AddDays(-35).ToString("yyyy/MM/dd") + " 16:59:59");
                //DateTime oneDay_stop_modify_date = Convert.ToDateTime(starDate.AddDays(-5).ToString("yyyy/MM/dd") + " 16:59:59");
                int dateDiff = 0;

                foreach (DataRow row in dt.Rows)
                {
                    clsMyOrder item = new clsMyOrder();
                    item.Seqno = Convert.ToInt32(row["Seqno"]);
                    item.OrderID = row["OrderID"].ToString();
                    item.Leader = row["Leader"].ToString();
                    item.Phone = row["Phone"].ToString();
                    item.Room = row["Room"].ToString();
                    item.Email = row["Email"].ToString();
                    item.Comment = row["Comment"].ToString();
                    item.ActID = row["ActID"].ToString();
                    item.ActName = row["ActName"].ToString();
                    item.Joiner = row["Joiner"].ToString();
                    item.SID = row["SID"].ToString();
                    item.EmpID = row["EmpID"].ToString();
                    item.Comment = row["EmpID"].ToString();
                    item.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");
                    item.Sex = row["Sex"].ToString();
                    item.Cell = row["Cell"].ToString();
                    item.PersonMail = row["PersonMail"].ToString();
                    item.Size = row["Size"].ToString();
                    item.Summary = row["Summary"].ToString();
                    item.TotalPrice = Convert.ToInt32(row["TotalPrice"]);
                    item.price = Convert.ToInt32(row["price"]);
                    item.IsVeg = Convert.ToBoolean(row["IsVeg"]);
                    DateTime starDate = Convert.ToDateTime(row["StartDay"]);
                    item.StartDay = starDate.ToString("yyyy/MM/dd");

                    if (item.OrderID.Substring(0, 2) == "W1")
                    {
                        dateDiff = Convert.ToInt32(MCPUtilities.DateDiff(MCPUtilities.DateInterval.Minute, DateTime.Now, Convert.ToDateTime(starDate.AddDays(-5).ToString("yyyy/MM/dd") + " 16:59:59")));
                        if (dateDiff > 0) { item.Switch = "Y"; } else { item.Switch = "N"; }
                    }

                    if (item.OrderID.Substring(0, 2) == "W2")
                    {
                        dateDiff = Convert.ToInt32(MCPUtilities.DateDiff(MCPUtilities.DateInterval.Minute, DateTime.Now, Convert.ToDateTime(starDate.AddDays(-35).ToString("yyyy/MM/dd") + " 16:59:59")));
                        if (dateDiff > 0) { item.Switch = "Y"; } else { item.Switch = "N"; }
                    }
                    
                    tempList.Add(item);
                }
            }
        }
        catch (Exception ex) { }
        finally { dt.Dispose(); }
        return tempList;
    }
       

    //-------------------------------------------------------------------------------------------
    //                                   報名清單
    //-----------------------------------------------------------------------------------------
    /// <summary>新增文瞱線上報名訂單</summary>
    /// <returns>成功時回傳OK</returns>
    [WebMethod]
    public string Create_Wt_Order(clsOrder order, clsOrderDetail[] detail)
    {

        string result = "OK", confirmText = "", cmt = "", actid = "", actname = "wt";
        //string total = "0";    // 應付總金額   

        int price = 0, joinAmt = 0, empidCount = 0, freeAmt = 0, adult = 0, threeyr = 0, total = 0, age = 0, discount1000 = 0;

        StringBuilder sb = new StringBuilder();

        //if (HttpContext.Current.User.Identity.IsAuthenticated) {
        //  username = HttpContext.Current.User.Identity.Name;
        //} else {
        //  return "請先登入再繼續報名！";
        //}

        if (String.IsNullOrEmpty(order.Name)) { return "請輸入聯絡人姓名！"; }
        if (!MCPUtilities.IsPhoneNo(order.Tel1, "tel")) { return "聯絡人電話號碼格式錯誤！格式應為：02-8226-9088#分機！"; }
        if (!MCPUtilities.IsPhoneNo(order.Cell1, "cell")) { return "聯絡人手機號碼格式錯誤！格式應為：0933-666888！"; }
        if (!MCPUtilities.IsEmail(order.Email)) { return "聯絡人 Email格式錯誤，請重新輸入！"; }
        if (String.IsNullOrEmpty(order.Address)) { return "請輸入聯絡地址！"; }
        int yr = Convert.ToInt32(DateTime.Now.Year) - 1911;
        //int count=1;
        order.OrderID = "E" + Convert.ToString(yr) + DateTime.Now.ToString("MMdd"); //E1040703
        order.Company = "wt";

        DataTable dt = new DataTable();
        dt.Columns.Add("OrderID", typeof(string));
        dt.Columns.Add("Name", typeof(string));
        dt.Columns.Add("Tel1", typeof(string));
        dt.Columns.Add("Tel2", typeof(string));
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


        try
        {
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

                //sb.Append(generate_wt_table_Header()); //產生 <th>

                List<String> lstEid = new List<string>();

                //第一次回圈先驗證資料
                foreach (clsOrderDetail item in detail)
                {
                    if (joinAmt == 0) { actname = item.ActName; actid = item.ActID; } // 取得活動 ID 及 名稱              
                    if (String.IsNullOrEmpty(item.ActID)) { return "活動行程編號遺失，無法進行報名！"; }
                    if (!String.IsNullOrEmpty(item.EmpID))
                    {
                        if (!MCPUtilities.IsWtEmployId(item.EmpID)) { return "第" + (joinAmt + 1).ToString() + "列：工號格式錯誤！"; }
                    }
                    if (String.IsNullOrEmpty(item.Name)) { return "第" + (joinAmt + 1).ToString() + "列：請輸入參加人姓名！"; }
                    if (!MCPUtilities.IsValidSID(item.SID)) { return "第" + (joinAmt + 1).ToString() + "列：身份證或護照號碼錯誤，請重新輸入！"; }
                    if (!MCPUtilities.IsDay(item.DOB)) { return "第" + (joinAmt + 1).ToString() + "列：生日日期不正確，請重新輸入！"; }
                    if (!MCPUtilities.IsPhoneNo(item.Cell, "cell")) { return "第" + (joinAmt + 1).ToString() + "列：手機格式錯誤，請重新輸入！"; }
                    if (item.SID.Substring(1, 1) == "1") { item.Sex = "男"; } else { item.Sex = "女"; }

                    //計算年齡
                    // age = get_Age(Convert.ToInt32(MCPUtilities.DateDiff(MCPUtilities.DateInterval.Day, Convert.ToDateTime(item.DOB), DateTime.Now)));
                    //if (age <= 3) { threeyr += 1; } else { adult += 1; }
                    if (isKid(item.DOB)) { threeyr += 1; } else { adult += 1; }


                    if (!String.IsNullOrEmpty(item.EmpID))
                    {
                        //if (isKid(item.DOB)) { return "第" + (joinAmt + 1).ToString() + "列：兒童不可為員工，請重新輸入！"; }
                        // 判斷是否有重複的工號
                        if (!lstEid.Exists(x => x == item.EmpID))
                        {
                            // 本人0 第1人0 第2人1000 第3人2300 三歲以下200
                            lstEid.Add(item.EmpID);
                            empidCount += 1;
                            freeAmt += 2;
                            discount1000 += 1;
                        }
                        else {
                            return "第" + (joinAmt + 1).ToString() + "列：有重覆工號，請重新輸入！";
                        }
                    }
                    joinAmt += 1;
                }

                if (empidCount <= 0) { return "請至少輸入一組員工工號！請重新輸入！"; }

                // 員工攜伴者，不可為公司同仁(夫妻不在此限制內，但每人限參加一次活動) 
                if (empidCount > 2) { return "員工攜伴者，不可為公司同仁！"; }

                // 每位同仁最多攜伴3人
                if (empidCount == 2 && adult > 8) { return "每位同仁最多攜伴3人！"; }
                if (empidCount == 1 && adult > 4) { return "每位同仁最多攜伴3人！"; }

                confirmText += "共 " + joinAmt.ToString() + " 位參加人〈" + threeyr.ToString() + " 位 0-3 歲兒童〉";


                //第二次迴圈將資料加入 DataTable 並計算金額（必須要先知道有多少免費名額才能正確算出個人金額）
                foreach (clsOrderDetail d in detail)
                {
                    // age = get_Age(Convert.ToInt32(MCPUtilities.DateDiff(MCPUtilities.DateInterval.Day, Convert.ToDateTime(d.DOB), DateTime.Now)));

                    if (isKid(d.DOB))
                    {
                        price = 200;
                        cmt = "3歲以下";
                    }
                    else {
                        price = 2300;
                        if (freeAmt > 0)
                        {
                            price = 0;
                            freeAmt -= 1;
                        }
                        else {
                            if (discount1000 > 0)
                            {
                                price = 1000;
                                discount1000 -= 1;
                            }
                        }
                        cmt = "";
                    }
                    total += price;
                    adult -= 1;
                    dtD.Rows.Add(0, order.OrderID, d.ActID, d.ActName, d.Name, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.Email, "", Convert.ToBoolean(d.IsVeg), false, false, false, price, cmt, "", d.TempField);
                }

                dt.Rows.Add(order.OrderID, order.Name, order.Tel1, order.Tel2, order.Cell1, "", "", order.Address, order.Email, total, false, false, Convert.ToBoolean(order.IsPromote), confirmText, "", order.Company, DateTime.Now);
                if (dt.Rows.Count <= 0) { return "請先輸入聯絡人相關資訊，然後再繼續！"; }

                DBManager db = new DBManager();
                SqlCommand cmd = db.GetSPCommand("enterprise_all_Od_Add", null);
                SqlParameter tvpOrder = cmd.Parameters.AddWithValue("@ORDERLIST", dt);
                tvpOrder.SqlDbType = SqlDbType.Structured;
                tvpOrder.Direction = ParameterDirection.Input;
                SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@DETAILLIST", dtD);
                tvpDetail.SqlDbType = SqlDbType.Structured;
                tvpDetail.Direction = ParameterDirection.Input;
                SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
                retValParam.Direction = ParameterDirection.Output;
                db.ExecuteNonQuery(cmd);
                result = retValParam.Value.ToString() + Convert.ToString(total);
                dtD.Dispose();
                dt.Dispose();

                if (result.Substring(0, 2) == "OK")
                {
                    string tempid = result.Replace("OK", "");
                    send_confirm_mail(tempid.Substring(0, 11), "customer");
                }
            }
            else {
                return "您尚未加入參加人，請先加入參加人再繼續！";
            }
        }
        catch (Exception ex) { return "資料庫連線異常，目前無法送出報名表！" + ex.Message.ToString(); }
        return result;
    }

    /// <summary>發送一日遊確認 Email</summary>   
    [WebMethod]
    public string send_confirm_mail(string orderid, string sentto)
    {
        string result = "OK";
        StringBuilder sb = new StringBuilder();
        DataTable dt = new DataTable();
        int count = 0, total = 0;
        string actName = "", email = "", content = "";
        try
        {
            DBManager db = new DBManager();
            //SqlCommand cmd = db.GetSPCommand("enterprise_Order_wtExport", null);
            //cmd.Parameters.Add("@ActID", SqlDbType.NVarChar, 15).Value = "";
            //cmd.Parameters.Add("@OrderID", SqlDbType.NVarChar, 15).Value = orderid;
            //cmd.Parameters.Add("@method", SqlDbType.NVarChar, 15).Value = "email";
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Od_Report", null);
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = "Oid";
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = orderid;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                sb.Append("<table style='border-collapse:collapse;'>");
                sb.Append("<tr>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>姓名</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>工號</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>身分證</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>生日</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>性別</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>手機</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>email</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>素食</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>金額</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>備註</th>");
                sb.Append("</tr>");
                foreach (DataRow row in dt.Rows)
                {
                    //產生明細列
                    if (count == 0)
                    {
                        email = row["MainEmail"].ToString();
                        actName = row["ActName"].ToString();
                        total = Convert.ToInt32(row["TotalPrice"]);
                    }

                    sb.Append("<tr>");
                    //total += Convert.ToInt32(row["Price"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Name"].ToString());
                    if (row["EmpID"].ToString() == "000" || String.IsNullOrEmpty(row["EmpID"].ToString()))
                    {
                        sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>---</td>");
                    }
                    else {
                        sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["EmpID"].ToString());
                    }
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>******{0}</td>", row["SID"].ToString().Substring(6, 4));
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", Convert.ToDateTime(row["DOB"].ToString()).ToString("yyyy/MM/dd"));
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Sex"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Cell"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Email"].ToString());
                    if (Convert.ToBoolean(row["IsVeg"]))
                    {
                        sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>素食</td>");
                    }
                    else
                    {
                        sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>X</td>");
                    }
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Price"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Cmt"].ToString());
                    //if (Math.Floor(new TimeSpan(DateTime.Now.Ticks - Convert.ToDateTime(row["DOB"].ToString()).Ticks).TotalDays) > 1095) {
                    //  adult +=1;
                    //}

                    sb.Append("</tr>");
                    count += 1;
                }
                //應付總金額資訊
                sb.Append("<tr><th colspan='10' style='text-align:right; padding:6px; border:solid 1px #c0c0c0;'>");
                sb.AppendFormat("應付總金額：<span style='font-weight:bold;color:red;'>{0}</span></th></tr>", total);
                sb.AppendFormat("<p>一共 {0} 位參加人</p>", count);
                sb.Append("</table>");

                //表尾注意事項
                sb.Append("<p style='margin-top:12px;'>");
                sb.Append("若有額外的自費金額請於報名截止後(30天會有專人信件通知)，將自費金額以ATM轉帳、匯款或期他現金存入方式，將您的款項匯至：<br/><br/>");
                sb.Append("銀行：<span style='color:blue; font-weight:bold;'>新光銀行---新板分行 103</span><br/>");
                sb.Append("戶名：<span style='color:blue; font-weight:bold;'>海天青旅行社股份有限公司</span><br/>");
                sb.Append("帳號：<span style='color:blue; font-weight:bold;'>0462-10-100-2861</span><br/><br/>");
                sb.Append("匯款完成後請Email: mcp.otherstw@gmail.com 告知參加行程、員工姓名、匯款帳號後五碼，代會計確認入帳後，將回信通知您。");
                sb.Append("</p>");

                sb.Append("<p style='margin-top:12px;'>");
                sb.Append("最後，文曄科技福委及海天青旅行社感謝您的參加與支持！");
                sb.Append("我們將會於活動出發前 3 天寄發行前通知單給予參加同仁，在煩請注意郵件信箱。");
                sb.Append("如有任何問題請洽海天青旅行社活動負責人員 02-2952-7535 #32 徐小姐");
                sb.Append("</p>");

                sb.Append("<p style='margin-top:12px;'>文瞱科技一日遊補助辦法補助辦法</p>");
                sb.Append("<ol>");
                sb.Append("<li>每位同仁最多攜伴3人〈不含3歲以下孩童〉。</li>");
                sb.Append("<li>員工本人全額補助〈每人限參加及補助一次〉。</li>");
                sb.Append("<li>員工攜伴第1人免費。</li>");
                sb.Append("<li>員工攜伴第2人需自費新台幣 $1,000元。</li>");
                sb.Append("<li>員工攜伴第3人需自費新台幣 $2,300元。</li>");
                sb.Append("<li>員工攜伴者，不可為公司同仁(夫妻不在此限制內，但每人限參加一次活動) 。</li>");
                sb.Append("<li>0-3歲兒童定義〈2014年7月以後出生〉，每人酌收200元〈含保險/車資等行政代辦費用〉。</li>");
                sb.Append("</ol>");

                sb.Append("<p style='margin-top:12px;'>文瞱科技一日遊活動注意事項</p>");
                sb.Append("<ol>");
                sb.Append("<li>每梯次旅遊，<span style='color: red;'>每車人數需滿30人才可開梯</span>，如未達30人則取消該車活動。</li>");
                sb.Append("<li>報名成功後如不克前往，最晚需於出發前5日下午5:00前，自行登入取消，未提前取消者則無法退費，並喪失公司補助權益。 (公司仍需支付此筆費用予旅行社) 。</li>");
                sb.Append("<li>已報名旅遊行程之參加者<span style='color: red;'>不可無故不到，亦不可員工本人未到僅眷屬自行參與，未到者即視同棄權需自行負擔全額旅費，且由當月薪資扣除</span>。</li>");
                sb.Append("<li>請勿冒名頂替他人參與活動，違者須自行負擔全額旅費，且由當月薪資扣除。</li>");
                sb.Append("<li>每位參加同仁及親友皆有投保旅遊責任險 (無法提供當日臨時加保服務)。</li>");
                sb.Append("<li>報到當日請務必攜帶有<span style='color: red;'>照片</span>之「身份證件」(如:身分證、駕照、健保卡)。查驗不符者將無法參與活動，敬請同仁配合。</li>");
                sb.Append("<li>請於行前通知單規定時間內準時集合，如<span style='color: red;'>遲到超過規定集合時間五分鐘以上</span>，則視同放棄此活動，無法退回任何費用，並喪失公司補助權益，且該員工需付全額旅費費用，由當月薪資扣除。</li>");
                sb.Append("<li>公司員工旅遊需團體同進同出，故皆不開放同仁自行開車前往及提早離開，請同仁們多加留意，違者須自行負擔全額旅費，且由當月薪資扣除。</li>");
                sb.Append("<li>活動報名成功後，會於活動出發前<span style='color: red;'>三日</span>統一寄發行前通知單，在煩請同仁特別注意信箱資訊及當日報到時間和集合地點，並煩請告知同行親友。</li>");
                sb.Append("<li>如活動當天臨時生病或發燒，煩請先聯絡當日主辦人員，並提供當日就醫證明給福委會，則免扣除員工薪資。</li>");
                sb.Append("<li>補助期限至2018年7月，依網站公告的最後一次旅遊活動行程為止。</li>");
                sb.Append("<li>如於補助期限內未參加任何活動，則視同放棄權利，不另轉發現金。</li>");
                sb.Append("<li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li>");
                sb.Append("<li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將於現場補足實際產生之費用。</li>");
                sb.Append("<li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液.等。本單位不提供任何口服藥物。</li>");
                sb.Append("<li>遊覽車上請勿攜帶寵物及危險物品參與行程，感謝您的配合。</li>");
                sb.Append("<li>以上行程載明之車行時間僅供參考，如因路況或假日遊客眾多行程順序將視情況做更動調整。</li>");
                sb.Append("<li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li>");
                sb.Append("<li>旅遊活動諮詢專線：02-29527535  #32 徐小姐 #40 顏小姐。</li>");
                sb.Append("</ol>");

                content = sb.ToString();
                sb.Remove(0, sb.Length);

                sb.Append("<div style='marging-top:12px;margin-bottom:12px;'>");
                sb.AppendFormat("親愛的同仁您好！您已經在 MCP海天青企業專區網站上報名<span style='font-weight:bold;color:blue;'>「{0}」</span>的活動行程，", actName);
                sb.AppendFormat("您的報名編號為：<span style='font-weight:bold;color:red;'>{0}</span>，其他詳細資訊如下：", orderid);
                sb.Append("</div>");

                content = sb.ToString() + content;

                if (sentto == "customer")
                {
                    MCPUtilities.send_single_mail(email, "MCP海天青線上文瞱科集團上報名確認信", content, "mcp.otherstw@gmail.com", "apple@mcpgo.com");
                    ////MCPUtilities.send_single_mail("lee13079@gmail.com", "MCP海天青線上文瞱科技線上報名確認信", content, "apple@mcpgo.com", "winnie@mcpgo.com");                   
                }
                else
                {
                    MCPUtilities.send_single_mail("mcp.otherstw@gmail.com", "重發確認信", content, "winnie@mcpgo.com", "apple@mcpgo.com");
                }

            }
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }

    // <summary>產生確認信說明表頭</summary>
    protected string generate_wt_Info_Header(string actname, string orderid, string method)
    {
        StringBuilder sb = new StringBuilder();
        if (method == "email")
        {
            sb.Append("<div style='marging-top:12px;margin-bottom:12px;'>");
            sb.Append("<p>MCP海天青旅行社已按照您的要求變更了您的報名清單，詳細資訊如下：</p>");
            sb.AppendFormat("目前報名的活動行程為：<span style='font-weight:bold;color:blue;'>「{0}」</span>", actname);
            sb.AppendFormat("報名編號為：<span style='font-weight:bold;color:red;'>{0}</span>。", orderid);
            sb.Append("</div>");
        }
        else {
            sb.Append("<div style='marging-top:12px;margin-bottom:12px;'>");
            sb.AppendFormat("親愛的同仁您好！您已經在 MCP海天青企業專區網站上報名<span style='font-weight:bold;color:blue;'>「{0}」</span>的活動行程，", actname);
            sb.AppendFormat("您的報名編號為：<span style='font-weight:bold;color:red;'>{0}</span>，其他詳細資訊如下：", orderid);
            sb.Append("</div>");
        }
        return sb.ToString();
    }

    // <summary>產生確認信件底部說明事項</summary>
    protected string generate_wt_Info_Footer()
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("<p style='margin-top:12px;'>");
        sb.Append("若有額外的自費金額請於報名截止後，將自費金額以ATM轉帳、匯款或期他現金存入方式，將您的款項匯至：<br/><br/>");
        sb.Append("銀行：<span style='color:blue; font-weight:bold;'>新光銀行---新板分行 103</span><br/>");
        sb.Append("戶名：<span style='color:blue; font-weight:bold;'>海天青旅行社股份有限公司</span><br/>");
        sb.Append("帳號：<span style='color:blue; font-weight:bold;'>0462-10-100-2861</span><br/><br/>");
        sb.Append("最後，文曄科技福委及海天青旅行社感謝您的參加與支持！");
        sb.Append("我們將會於活動出發前兩天寄發行前通知單給予參加同仁，在煩請注意郵件信箱。");
        sb.Append("如有任何問題請洽海天青旅行社活動負責人員 02-2952-7535 #32、38  徐小姐or曹先生");
        sb.Append("</p>");

        sb.Append("<p style='margin-top:12px;'>文瞱科技一日遊補助辦法補助辦法</p>");
        sb.Append("<ol>");
        sb.Append("<li>每位同仁最多攜伴3人〈不含3歲以下孩童〉。</li>");
        sb.Append("<li>員工本人全額補助〈每人限參加及補助一次〉。</li>");
        sb.Append("<li>員工攜伴第1人免費。</li>");
        sb.Append("<li>員工攜伴第2人需自費新台幣 $1,000元。</li>");
        sb.Append("<li>員工攜伴第3人需自費新台幣 $2,300元。</li>");
        sb.Append("<li>員工攜伴者，不可為公司同仁(夫妻不在此限制內，但每人限參加一次活動) 。</li>");
        sb.Append("<li>0-3歲兒童定義〈2014年7月以後出生〉，每人酌收200元〈含保險/車資等行政代辦費用〉。</li>");
        sb.Append("</ol>");

        sb.Append("<p style='margin-top:12px;'>文瞱科技一日遊活動注意事項</p>");
        sb.Append("<ol>");
        sb.Append("<li>每梯次旅遊，<span style='color: red;'>每車人數需滿30人才可開梯</span>，如未達30人則取消該車活動。</li>");
        sb.Append("<li>報名成功後如不克前往，最晚需於出發前3日下午5:00前，以電話告知旅行社，未提前告知者則無法退費，並喪失公司補助權益。 (公司仍需支付此筆費用予旅行社) 。</li>");
        sb.Append("<li>已報名旅遊行程之參加者<span style='color: red;'>不可無故不到，亦不可員工本人未到僅眷屬自行參與，未到者即視同棄權需自行負擔全額旅費，且由當月薪資扣除</span>。</li>");
        sb.Append("<li>請勿冒名頂替他人參與活動，違者須自行負擔全額旅費，且由當月薪資扣除。</li>");
        sb.Append("<li>每位參加同仁及親友皆有投保旅遊責任險 (無法提供當日臨時加保服務)。</li>");
        sb.Append("<li>報到當日請務必攜帶有<span style='color: red;'>照片</span>之「身份證件」(如:身分證、駕照、健保卡)。查驗不符者將無法參與活動，敬請同仁配合。</li>");
        sb.Append("<li>請於行前通知單規定時間內準時集合，如<span style='color: red;'>遲到超過規定集合時間五分鐘以上</span>，則視同放棄此活動，則無法退任何費用，並喪失公司補助權益，且該員工需付全額旅費費用，由當月薪資扣除。</li>");
        sb.Append("<li>公司員工旅遊需團體同進同出，故皆不開放同仁自行開車前往及提早離開，請同仁們多加留意，違者須自行負擔全額旅費，且由當月薪資扣除。</li>");
        sb.Append("<li>活動報名成功後，會於活動出發前<span style='color: red;'>三日</span>統一寄發行前通知單，在煩請同仁特別注意信箱資訊及當日報到時間和集合地點，並煩請告知同行親友。</li>");
        sb.Append("<li>如活動當天臨時生病或發燒，煩請先聯絡當日主辦人員，並提供當日就醫證明給福委會，則免扣除員工薪資。</li>");
        sb.Append("<li>補助期限至2018年7月，依網站公告的最後一次旅遊活動行程為止。</li>");
        sb.Append("<li>如於補助期限內未參加任何活動，則視同放棄權利，不另轉發現金。</li>");
        sb.Append("<li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li>");
        sb.Append("<li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將於現場補足實際產生之費用。</li>");
        sb.Append("<li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液.等。本單位不提供任何口服藥物。</li>");
        sb.Append("<li>遊覽車上請勿攜帶寵物及危險物品參與行程，感謝您的配合。</li>");
        sb.Append("<li>以上行程載明之車行時間僅供參考，如因路況或假日遊客眾多行程順序將視情況做更動調整。</li>");
        sb.Append("<li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li>");
        sb.Append("<li>旅遊活動諮詢專線：02-29527535  #32-徐小姐 #40-顏小姐。</li>");
        sb.Append("</ol>");
        return sb.ToString();
    }

    // <summary>產生確認信Table <th> 表頭</summary>
    protected string generate_wt_table_Header()
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("<tr>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>姓名</th>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>生日</th>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>身分證</th>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>工號</th>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>電話</th>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>email</th>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>素食</th>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>車次</th>");
        sb.Append("</tr>");
        return sb.ToString();
    }

    // <summary>產生確認信件明細內容資訊</summary>
    protected string generate_wt_table_content(string name, string dob, string sid, string eid, string cell, string mail, bool veg, string bus)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("<tr>");
        sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", name);
        sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", Convert.ToDateTime(dob).ToString("yyyy/MM/dd"));
        sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", sid);
        if (eid == "000")
        {
            sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>---</td>");
        }
        else {
            sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", eid);
        }

        sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", cell);
        sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", mail);
        if (veg)
        {
            sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>素食</td>");
        }
        else {
            sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>X</td>");
        }
        sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", bus);
        sb.Append("</tr>");
        return sb.ToString();
    }

    // <summary>產生確認信件表尾金額資訊</summary>
    protected string generate_wt_TotalPriceInfo(string total)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("<tr><th colspan='8' style='text-align:right; padding:6px; border:solid 1px #c0c0c0;'>");
        sb.AppendFormat("應付總金額：<span style='font-weight:bold;color:red;'>{0}</span></th></tr>", total);
        return sb.ToString();
    }


    /// <summary>取得文瞱旅遊一般活動報名資料(分頁)</summary>
    [WebMethod]
    public string load_WtOrder_Paging(int pageindex, int pagesize, string filterby, string filtervalue)
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<clsOrderWithStartDay> tempList = new List<clsOrderWithStartDay>();
        clsOrderWithStartDayPageing newsPage = new clsOrderWithStartDayPageing();

        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Od_Paging", null);
            cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = pageindex;
            cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pagesize;
            cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = "wt";
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
                    clsOrderWithStartDay item = new clsOrderWithStartDay();
                    item.ActName = row["ActName"].ToString();
                    item.StartDay = Convert.ToDateTime(row["StartDay"]).ToString("yyyy/MM/dd");
                    item.OrderID = row["OrderID"].ToString();
                    item.Name = row["Name"].ToString();
                    item.Tel1 = row["Tel1"].ToString();
                    item.Cell1 = row["Cell1"].ToString();
                    item.Email = row["Email"].ToString();
                    item.TotalPrice = Convert.ToInt32(row["TotalPrice"]);
                    item.CreateDay = Convert.ToDateTime(row["CreateDay"]).ToString("yyyy/MM/dd");
                    item.Comment = row["Comment"].ToString();
                    if (Convert.ToInt32(row["TotalPrice"]) > 0)
                    {
                        item.IsPaid = Convert.ToBoolean(row["IsPaid"]);
                    }
                    else {
                        item.IsPaid = true;
                    }

                    tempList.Add(item);
                }
                dt.Dispose();
                newsPage.TotalRows = totalRow;
                newsPage.Orders = tempList;

            }
        }
        catch (Exception ex) { }
        //return actpage;
        return new JavaScriptSerializer().Serialize(newsPage);
    }

    //<summary>取得報名清單</summary>
    [WebMethod]
    public List<clsOrderReportWithPay> Get_WtOrder_Report(string filterby, string filtervalue)
    {

        List<clsOrderReportWithPay> tempList = new List<clsOrderReportWithPay>();
        DataTable dt = new DataTable();
        DBManager db = new DBManager();
        try
        {
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Od_Rpt_WithPay", null);
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = filterby;
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = filtervalue;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsOrderReportWithPay v = new clsOrderReportWithPay();
                    v.OrderID = row["OrderID"].ToString();
                    v.ActID = row["ActID"].ToString();
                    v.ActName = row["ActName"].ToString();
                    v.Name = row["Name"].ToString();
                    v.SID = row["SID"].ToString();
                    v.EmpID = row["EmpID"].ToString();
                    v.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");
                    v.Sex = row["Sex"].ToString();
                    v.Cell = row["Cell"].ToString();
                    v.Email = row["Email"].ToString();
                    v.Price = Convert.ToInt32(row["Price"]);
                    v.Comment = row["Cmt"].ToString();
                    v.IsVeg = Convert.ToBoolean(row["IsVeg"].ToString());
                    v.mainName = row["MainName"].ToString();
                    v.mainTel = row["MainTel"].ToString();
                    v.mainCell = row["MainCell"].ToString();
                    //v.mainEmail = row["MainEmail"].ToString();                    
                    v.TotalPrice = Convert.ToInt32(row["TotalPrice"]);
                    v.mainCmt = row["Comment"].ToString();

                    v.PayName = row["PayName"].ToString();
                    v.ActualPay = Convert.ToInt32(row["ActualPay"]);
                    v.PayType = row["PayType"].ToString();
                    v.Account = row["Account"].ToString();
                    v.PayCmt = row["PayCmt"].ToString();

                    if (String.IsNullOrEmpty(row["PayDay"].ToString()))
                    {
                        v.PayDay = "";
                    }
                    else {
                        v.PayDay = Convert.ToDateTime(row["PayDay"]).ToString("yyyy/MM/dd");
                    }
                    v.StartDay = Convert.ToDateTime(row["StartDay"]).ToString("yyyy/MM/dd");
                    tempList.Add(v);
                }
            }
        }
        catch (Exception ex) { }
        finally { dt.Dispose(); }
        /*List<clsOrderReport> tempList = new List<clsOrderReport>();
        DataTable dt = new DataTable();
        DBManager db = new DBManager();
        try
        {
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Od_Report", null);
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = filterby;
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = filtervalue;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsOrderReport v = new clsOrderReport();
                    v.OrderID = row["OrderID"].ToString();
                    v.ActID = row["ActID"].ToString();
                    v.ActName = row["ActName"].ToString();
                    v.Name = row["Name"].ToString();
                    v.SID = row["SID"].ToString();
                    v.EmpID = row["EmpID"].ToString();
                    v.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");
                    v.Cell = row["Cell"].ToString();
                    v.Sex = row["Sex"].ToString();
                    v.Price = Convert.ToInt32(row["Price"]);
                    v.Comment = row["Cmt"].ToString();
                    v.Email = row["Email"].ToString();
                    v.mainName = row["MainName"].ToString();
                    v.mainTel = row["MainTel"].ToString();
                    v.mainCell = row["MainCell"].ToString();
                    //v.mainEmail = row["MainEmail"].ToString();
                    v.IsVeg = Convert.ToBoolean(row["IsVeg"].ToString());
                    v.TotalPrice = Convert.ToInt32(row["TotalPrice"]);
                    v.mainCmt = row["Comment"].ToString();
                    tempList.Add(v);
                }
            }
        }
        catch (Exception ex) { }
        finally { dt.Dispose(); }*/
        return tempList;
    }

    // <summary>更新一筆文瞱科技訂單主表資料</summary>
    [WebMethod]
    public string Update_wt_Order(clsOrder order, string action)
    {
        string result = "OK";
        DataTable dt = new DataTable();
        dt.Columns.Add("OrderID", typeof(string));
        dt.Columns.Add("Name", typeof(string));
        dt.Columns.Add("Tel1", typeof(string));
        dt.Columns.Add("Tel2", typeof(string));
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
        try
        {
            if (String.IsNullOrEmpty(order.OrderID)) { return "報名編號遺失，無法進行更新！"; }
            if (action == "Update")
            {
                string strValid = "OK";
                //Check_Data_Valid(string name, string dob, string sid, string eid, string cell, string phone, string email)
                strValid = Check_Data_Valid(order.Name, "1990/12/12", "Y117094843", "1234567", order.Cell1, order.Tel1, order.Email);
                if (strValid != "OK") { return strValid; }
            }
            if (!MCPUtilities.IsNumeric(Convert.ToString(order.TotalPrice))) { return "金額不正確，請重新輸入！"; }

            dt.Rows.Add(order.OrderID, order.Name, order.Tel1, order.Tel2, order.Cell1, order.Cell2, order.Fax, order.Address,
              order.Email, order.TotalPrice, order.IsPaid, order.IsConfirm, order.IsPromote, order.Comment, order.Source, order.Company, DateTime.Now);

            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Od_Modify", null);
            SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@ORDERLIST", dt);
            tvpDetail.SqlDbType = SqlDbType.Structured;
            tvpDetail.Direction = ParameterDirection.Input;
            cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 20).Value = action;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        finally { dt.Dispose(); }
        return result;
    }

    /// <summary>刪除一筆文瞱科技訂單資料</summary>
    [WebMethod]
    public string Delete_wt_Order(string orderid)
    {
        string result = "OK";
        try
        {
            if (String.IsNullOrEmpty(orderid)) { return "報名編號遺失，無法進行刪除！"; }
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_Order_Delete_wtOrder", null);
            cmd.Parameters.Add("@OrderID", SqlDbType.NVarChar, 15).Value = orderid;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }


    /// <summary>取得文瞱科技訂單明細表</summary>
    [WebMethod]
    public List<clsOrderDetail> Get_Wt_OrderDetail(string orderid)
    {
        List<clsOrderDetail> tempList = new List<clsOrderDetail>();
        DataTable dt = new DataTable();
        DBManager db = new DBManager();
        try
        {
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Odt_Get", null);
            cmd.Parameters.Add("@id", SqlDbType.NVarChar, 12).Value = orderid;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsOrderDetail v = new clsOrderDetail();
                    v.SeqNo = Convert.ToInt32(row["SeqNo"]);
                    v.ActID = row["ActID"].ToString();
                    v.ActName = row["ActName"].ToString();
                    v.Name = row["Name"].ToString();
                    v.SID = row["SID"].ToString();
                    v.EmpID = row["EmpID"].ToString();
                    v.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");
                    v.Cell = row["Cell"].ToString();
                    v.Price = Convert.ToInt32(row["Price"]);
                    v.IsVeg = Convert.ToBoolean(row["IsVeg"]);
                    v.Comment = row["Comment"].ToString();
                    v.TempField = row["TempField"].ToString();
                    v.Email = row["Email"].ToString();
                    tempList.Add(v);
                }
            }
        }
        catch (Exception ex) { }
        finally { dt.Dispose(); }
        return tempList;
    }

    /// <summary>新增一筆資料至文瞱科技訂單明細表</summary>
    [WebMethod]
    public string Add_wt_OrderDetail(clsOrderDetail detail)
    {
        string seqno = "0";
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
        try
        {
            if (String.IsNullOrEmpty(detail.OrderID)) { return "報名編號遺失，無法進行更新！"; }
            if (String.IsNullOrEmpty(detail.ActID)) { return "活動行程編號遺失，無法進行更新！"; }
            if (String.IsNullOrEmpty(detail.EmpID)) { detail.EmpID = "000"; }
            if (String.IsNullOrEmpty(detail.Name)) { return "請輸入參加人姓名！"; }
            if (!MCPUtilities.IsValidSID(detail.SID)) { return "身份證或或護照號碼錯誤，請重新輸入！"; }
            if (!MCPUtilities.IsDay(detail.DOB)) { return "生日日期不正確，請重新輸入！"; }
            //if (!MCPUtilities.IsEmail(detail.Email)) { return "Email格式錯誤，請重新輸入！"; }
            //if (!MCPUtilities.IsPhoneNo(detail.Cell, "cell")) { return "手機格式錯誤，請重新輸入！"; }
            if (!MCPUtilities.IsNumeric(Convert.ToString(detail.Price))) { return "金額不正確，請重新輸入！"; }
            if (!MCPUtilities.IsNumeric(Convert.ToString(detail.TempField))) { return "車次不正確，請重新輸入！"; }

            dtD.Rows.Add(detail.SeqNo, detail.OrderID, detail.ActID, "", detail.Name, detail.SID, detail.EmpID, Convert.ToDateTime(detail.DOB), "男", detail.Cell,
            detail.Email, "", Convert.ToBoolean(detail.IsVeg), false, false, false, Convert.ToInt32(detail.Price), detail.Comment, "", detail.TempField);
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_Order_Add_wtDetail", null);
            SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@details", dtD);
            tvpDetail.SqlDbType = SqlDbType.Structured;
            tvpDetail.Direction = ParameterDirection.Input;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            seqno = retValParam.Value.ToString();
        }
        catch (Exception ex) { seqno = ex.Message.ToString(); }
        finally { dtD.Dispose(); }
        return seqno;
    }

    /// <summary>更新一筆文瞱科技訂單明細表資料</summary>
    [WebMethod]
    public string Update_wt_OrderDetail(clsOrderDetail details, string action)
    {
        string result = "OK";
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
        try
        {

            if (!MCPUtilities.IsNumeric(Convert.ToString(details.SeqNo))) { return "序列號遺失，無法執行！"; }
            if (String.IsNullOrEmpty(details.ActID)) { return "活動編號遺失，無法執行！"; }
            if (String.IsNullOrEmpty(details.OrderID)) { return "單號遺失，無法執行！"; }
            if (action == "Update")
            {
                string strValid = Check_Data_Valid(details.Name, details.DOB, details.SID, "12345678", details.Cell, "02-8226-9088", details.Email);
                if (strValid != "OK")
                    return strValid;
            }

            dtD.Rows.Add(
                details.SeqNo, 
                details.OrderID, 
                details.ActID, 
                details.ActName,
                details.Name, 
                details.SID, 
                details.EmpID, 
                Convert.ToDateTime(details.DOB),
                "", 
                details.Cell, 
                details.Email,
                "N", false, false, false, false, 
                details.Price,
                details.Comment, "", "");

            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Odt_Modify", null);
            SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@DETAILLIST", dtD);
            tvpDetail.SqlDbType = SqlDbType.Structured;
            tvpDetail.Direction = ParameterDirection.Input;
            cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 20).Value = action;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();

        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        finally { dtD.Dispose(); }
        return result;
    }

    /// <summary>刪除一筆文瞱科技訂單明細表資料</summary>
    //[WebMethod]
    //public string Delete_wt_OrderDetail(string seqno){
    //  string result = "OK";
    //  try {
    //    if (String.IsNullOrEmpty(seqno)) { return "報名流水號遺失，無法進行刪除！"; }        
    //    DBManager db = new DBManager();
    //    SqlCommand cmd = db.GetSPCommand("enterprise_Order_Delete_wtDetail", null);
    //    cmd.Parameters.Add("@SeqNo", SqlDbType.Int).Value = seqno;       
    //    SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
    //    retValParam.Direction = ParameterDirection.Output;
    //    db.ExecuteNonQuery(cmd);
    //    result = retValParam.Value.ToString();
    //  } catch (Exception ex) { result = ex.Message.ToString(); } 
    //  return result;
    //}

    /// <summary>重新發送確認 Email</summary>
    [WebMethod]
    public string Send_wtOrder_Confirmation(string orderid)
    {
        string result = "OK";
        //List<clsOrderReport> tempList = new List<clsOrderReport>();
        DataTable dt = new DataTable();
        DBManager db = new DBManager();
        StringBuilder sb = new StringBuilder();
        int total = 0;
        string act = "", content = "", cmt = "", sday="";
        try
        {
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Od_Report", null);
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = "Oid";
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = orderid;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                /*
                 --- Order Details ---
                    [OrderID],[ActID],[ActName],[Name],[SID],[EmpID],[DOB],[Sex],[Cell],[Email],[Price],[Cmt],[IsVeg]
                 --- Main Order ---
                     [MainName],[MainCell],[MainTel],[MainEmail],[TotalPrice],[Comment] 
                 */
                sb.Append("<table style='border-collapse:collapse;'>");
                sb.Append("<tr>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>姓名</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>工號</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>身分證</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>生日</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>性別</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>手機</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>email</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>素食</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>金額</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>備註</th>");
                sb.Append("</tr>");
                foreach (DataRow row in dt.Rows)
                {
                    sb.Append("<tr>");
                    //oid = row["OrderID"].ToString();                    
                    act = row["ActName"].ToString();
                    sday = Convert.ToDateTime(row["StartDay"].ToString()).ToString("yyyy/MM/dd");
                    cmt = row["Comment"].ToString();
                    total += Convert.ToInt32(row["Price"].ToString());
                    sb.AppendFormat("<td>{0}</td>", row["Name"].ToString());
                    sb.AppendFormat("<td>{0}</td>", row["EmpID"].ToString());
                    sb.AppendFormat("<td>******{0}</td>", row["SID"].ToString().Substring(6, 4));
                    sb.AppendFormat("<td>{0}</td>", Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd"));
                    sb.AppendFormat("<td>{0}</td>", row["Sex"].ToString());
                    sb.AppendFormat("<td>{0}</td>", row["Cell"].ToString());
                    sb.AppendFormat("<td>{0}</td>", row["Email"].ToString());
                    if (Convert.ToBoolean(row["IsVeg"].ToString()))
                    {
                        sb.Append("<td>素食</td>");
                    }
                    else {
                        sb.AppendFormat("<td>X</td>");
                    }
                    sb.AppendFormat("<td>{0}</td>", row["Price"].ToString());
                    sb.AppendFormat("<td>{0}</td>", row["Cmt"].ToString());
                    sb.Append("</tr>");
                }

                //應付總金額資訊
                sb.Append("<tr><th colspan='10' style='text-align:right; padding:6px; border:solid 1px #c0c0c0;'>");
                sb.AppendFormat("<p>應付總金額：<span style='font-weight:bold;color:red;'>{0}</span></p>", total);
                sb.AppendFormat("<p>{0}</p>", cmt);
                sb.Append("</th></tr>");
                sb.Append("</table>");

                if (orderid.Substring(0, 1) == "")
                {

                }

                switch (orderid.Substring(0, 1))
                {
                    case "C":
                    sb.Append(confirmation_Notes("Camping"));
                    break;
                    case "M":
                    sb.Append(confirmation_Notes("TwoDays"));
                    break;
                }


                content = sb.ToString();
                sb.Remove(0, sb.Length);

                sb.Append("<div style='marging-top:12px;margin-bottom:12px;'>");
                sb.Append("<p>MCP海天青旅行社已按照您的要求變更了您的報名清單，詳細資訊如下：</p>");
                sb.AppendFormat("目前報名的活動行程為：<span style='font-weight:bold;color:blue;'>{0} ({1})</span>", act, sday);
                sb.AppendFormat("報名編號為：<span style='font-weight:bold;color:red;'>{0}</span>。", orderid);
                sb.Append("</div>");

                content = sb.ToString() + content;
                // confirm = generate_wt_Info_Header(actName, orderid, "email");
                // string[] toEmail = { "apple@mcpgo.com", "mcpwinnie@gmail.com" };
                //MCPUtilities.send_multiple_mail(toEmail, "MCP-海天青線上報名變更通知", confirm, "mcpricky@gmail.com", "mcp@mcpgo.com");
                MCPUtilities.send_single_mail("apple@mcpgo.com", "MCP-海天青線上報名變更通知", content, "mcpwinnie@gmail.com", "apple@mcpgo.com");
            }
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }

    // <summary>產生確認信件說明事項</summary>
    protected string confirmation_Notes(string type)
    {
        StringBuilder sb = new StringBuilder();
        switch (type)
        {
            case "Camping":
            sb.Append("<p style='margin-top:12px;'>");
            sb.Append("此專案行程每人原價費用<b><span style='color:red;'>2800元</span></b>，員工實際負擔如下所示：");
            sb.Append("</p>");
            sb.Append("<ol style='border:solid 1px #c0c0c0; list-style-position:inside; padding:4px; margin-left:0px; line-height:24px;'>");

            sb.Append("<li>每位同仁最多攜伴3人〈不含3歲以下孩童〉。</li>");
            sb.Append("<li>員工本人全額補助〈每人限參加及補助一次〉。</li>");
            sb.Append("<li>員工攜伴第1人免費。</li>");
            sb.Append("<li>員工攜伴第2人需自費新台幣 $1,000元。</li>");
            sb.Append("<li>員工攜伴第3人需自費新台幣 $2,300元。</li>");
            sb.Append("<li>員工攜伴者，不可為公司同仁(夫妻不在此限制內，但每人限參加一次活動) 。</li>");
            sb.Append("<li>0-3歲兒童定義〈2014年7月以後出生〉，每人酌收200元〈含保險/車資等行政代辦費用〉。</li>");
            sb.Append("</ol>");

            sb.Append("<p style='margin-top:12px; color:red;'>");
            sb.Append("※如第一梯次未於2017/08/04(五)下午5:00前，第二梯次未於2017/08/11(五)下午5:00前進行取消，或是因故不到者則無法退費，並喪失公司補助權益(此活動費用全額需由同仁自行負擔，並由員工薪資中扣除)。");
            sb.Append("</p>");

            sb.Append("<p style='margin-top:12px;'>");
            sb.Append("<span style='color:blue;'>扣除方式舉例：王志明(員工)、眷屬-何春嬌(妻-自費300元)、王老明(父-自費1000元)、王張金枝(母-自費1000元)，</span>");
            sb.Append("<span style='color:red;'>如因故不到，則將於薪資內扣除員工本人2800元＋妻2500元＋父1800元＋母1800元＝8900元 (三歲以下幼童不再扣除費用)。</span>");
            sb.Append("</p>");

            sb.Append("<p style='margin-top:12px;'>");
            sb.Append("若有額外的自費金額請於報名截止後，將自費金額以ATM轉帳、匯款或期他現金存入方式，將您的款項匯至：<br/><br/>");
            sb.Append("銀行：<span style='color:blue; font-weight:bold;'>新光銀行---新板分行 103</span><br/>");
            sb.Append("戶名：<span style='color:blue; font-weight:bold;'>海天青旅行社股份有限公司</span><br/>");
            sb.Append("帳號：<span style='color:blue; font-weight:bold;'>0462-10-100-2861</span><br/><br/>");
            sb.Append("最後，文曄科技福委及海天青旅行社感謝您的參加與支持！我們將會於活動出發前兩天寄發行前通知單給予參加同仁，再煩請注意郵件信箱。");
            sb.Append("我們將會於活動出發前兩天寄發行前通知單給予參加同仁，在煩請注意郵件信箱。");
            sb.Append("如有任何問題請洽海天青旅行社活動負責人員 02-2952-7535 #32、38  徐小姐、曹先生");
            sb.Append("</p>");
            sb.Append("<p style='margin-top:12px;'>");
            sb.Append("活動注意事項：");
            sb.Append("<ol style='border:solid 1px #c0c0c0; list-style-position:inside; padding:4px; margin-left:0px; line-height:24px;'>");
            sb.Append("<li style='color: red'>每梯次露營活動需滿100人才可開梯，每位員工最多僅能佔用一營位。若每一營位僅有3人(成人)報名時，須另補新台幣800元的營位場地費用。</li> ");
            sb.Append("<li style='color: red'>報名成功後本人如不克前往，最晚需於<b>出發前一周下午5:00前</b>，以電話告知旅行社(本人不可找人替代)，未提前告知者則無法退費，並喪失公司補助權益(此活動費用全額需由同仁自行負擔，並由員工薪資中扣除)。</li> ");
            sb.Append("<li style='color: red'>已報名旅遊行程之參加者，不可無故不到亦不可員工本人不到僅攜伴者參加之情況，不到者即視同棄權且需自行負擔員工本人及眷屬全額旅費並由員工薪資中扣除。</li>");
            sb.Append("<li style='color: red'>如於出發前一周內或活動當天因病臨時請假者，請檢附就醫證明，未檢附證明者將視為無故不到則無法退費，並喪失公司補助權益(此活動費用全額需由同仁自行負擔，並由員工薪資中扣除)。</li>");
            sb.Append("<li>攜帶之家屬不得為公司同仁。</li>");
            sb.Append("<li>每位參加同仁及親友皆有投保旅遊責任險 (無法提供當日臨時加保服務)。</li>");
            sb.Append("<li>報到當日請務必攜帶「身份証件」(如:身分證、駕照、健保卡)辦理報到事宜。查驗不符將無法參與活動，敬請同仁配合。</li>");
            sb.Append("<li>報名成功後，如需報名匯款，待活動報名截止確認成行後，再將款項匯至本公司。</li>");
            sb.Append("<li>活動報名成功後，會於活動出發前三日統一寄發行前通知單，再煩請同仁特別注意信箱資訊及當日報到時間集合地點，並煩請告知同行親友。</li>");
            sb.Append("<li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li>");
            sb.Append("<li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將於現場補足實際產生之費用。</li>");
            sb.Append("<li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液.等。本單位不提供任何口服藥物。</li>");
            sb.Append("<li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li>");
            sb.Append("<li>如於補助期限內未參加任何活動，則視同放棄權利，不另轉發現金。</li>");
            sb.Append("</ol>");
            sb.Append("</p>");
            break;
            case "TwoDays":
            sb.Append("<p style='margin-top:12px;'>");
            sb.Append("補助辦法：");
            sb.Append("<ol>");
            sb.Append("<li>每位同仁最多可攜伴3人(不含未足6歲不佔床不占餐兒童)。</li> ");
            sb.Append("<li>員工本人全額補助（每人限補助一次）。</li> ");
            sb.Append("<li>員工攜伴第1人免費。</li> ");
            sb.Append("<li>員工攜伴第2人需自費新台幣 $5,000元。</li> ");
            sb.Append("<li>員工攜伴第3人需自費新台幣 $5,000元。</li> ");
            sb.Append("<li>員工攜伴者，不可為公司同仁(夫妻不在此限制內)。</li> ");
            sb.Append("<li>4-6歲兒童定義<span style='color: red'>〈2013年01月~2015年12月間〉</span>，每人酌收1000元〈含保險/車資/活動門票費用等行政代辦費用〉。</li> ");
            sb.Append("<li>0-3歲幼童定義<span style='color: red'>〈2016年01月以後出生〉</span>，每人酌收500元〈含保險/車資等行政代辦費用〉。</li> ");
            sb.Append("<li>4-6歲小朋友身高如有超過收費規定，衍伸火車票或是飯店住宿早餐等其他費用，則依當日實際支付之費用另收。</li> ");
            sb.Append("</ol>");
            sb.Append("</p>");
            sb.Append("<p style='margin-top:12px;'>");
            sb.Append("活動注意事項：");
            sb.Append("<ol>");
            sb.Append("<li>每梯次旅遊，每車人數需滿 30 人才可開梯，如未達 30 人則取消該車活動。</li> ");
            sb.Append("<li>報名成功後如不克前往，最晚需於出發前35日下午5:00前，以E-MAIL告知旅行社，未提前告知者則無法退費，並喪失公司補助權益。 (公司仍需支付此筆費用予旅行社) 。</li> ");
            sb.Append("<li>已報名旅遊行程之參加者不可無故不到，亦不可員工本人未到僅眷屬自行參與，未到者即視同棄權需自行負擔全額旅費，且由當月薪資扣除。</li> ");
            sb.Append("<li>請勿冒名頂替他人參與活動，違者須自行負擔全額旅費，且由當月薪資扣除。</li> ");
            sb.Append("<li>每位參加同仁及親友皆有投保旅遊責任險 (無法提供當日臨時加保服務)。</li> ");
            sb.Append("<li>報到當日請務必攜帶有照片之「身份證件」(如:身分證、駕照、健保卡)。查驗不符者將無法參與活動，敬請同仁配合。</li> ");
            sb.Append("<li>請於行前通知單規定時間內準時集合，如遲到超過規定集合時間五分鐘以上，則視同放棄此活動，無法退回任何費用，並喪失公司補助權益，且該員工需付全額旅費費用，由當月薪資扣除。</li> ");
            sb.Append("<li>公司員工旅遊需團體同進同出，故皆不開放同仁自行開車前往及提早離開，請同仁們多加留意，違者須自行負擔全額旅費，且由當月薪資扣除。</li> ");
            sb.Append("<li>活動報名成功後，會於活動出發前三日統一寄發行前通知單，在煩請同仁特別注意信箱資訊及當日報到時間和集合地點，並煩請告知同行親友。</li> ");
            sb.Append("<li>如活動當天臨時生病或發燒，煩請先聯絡當日主辦人員，並提供當日就醫證明給福委會，則免扣除員工薪資。</li> ");
            sb.Append("<li>補助期限至2019年12月底，依網站公告的最後一次旅遊活動行程為止。</li> ");
            sb.Append("<li>如於補助期限內未參加任何活動，則視同放棄權利，不另轉發現金。</li> ");
            sb.Append("<li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li> ");
            sb.Append("<li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將於現場補足實際產生之費用。</li> ");
            sb.Append("<li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液.等。本單位不提供任何口服藥物。</li> ");
            sb.Append("<li>遊覽車上請勿攜帶寵物及危險物品參與行程，感謝您的配合。</li> ");
            sb.Append("<li>以上行程載明之車行時間僅供參考，如因路況或假日遊客眾多行程順序將視情況做更動調整。</li> ");
            sb.Append("<li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li> ");
            sb.Append("</ol>");
            sb.Append("</p>");
            break;
            default:
            break;
        }


        return sb.ToString();
    }

    /// <summary>重新發送確認 Email</summary>
    [WebMethod]
    public string Re_Send_wt_Email(string orderid)
    {
        string result = "OK";
        string orderType = orderid.Substring(0, 1); ;
        StringBuilder sb = new StringBuilder();
        DataTable dt = new DataTable();
        string confirm = "";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_Order_wtExport", null);
            cmd.Parameters.Add("@ActID", SqlDbType.NVarChar, 15).Value = "";
            cmd.Parameters.Add("@OrderID", SqlDbType.NVarChar, 15).Value = orderid;
            cmd.Parameters.Add("@method", SqlDbType.NVarChar, 15).Value = "email";

            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                int count = 0;
                string total = "", actName = "", email = "";
                sb.Append("<table style='border-collapse:collapse;'>");

                switch (orderType)
                {
                    case "M":
                    sb.Append(generate_wt_table_Header()); //產生二日遊專案 <th> 
                    break;
                    case "E":
                    sb.Append(generate_wt_table_Header()); //產生 <th>
                    break;
                }


                foreach (DataRow row in dt.Rows)
                {
                    if (count == 0)
                    {
                        total = Convert.ToString(row["TotalPrice"]);
                        actName = row["ActName"].ToString();
                        email = row["ContactMail"].ToString();
                    }
                    //產生明細列<td>
                    sb.Append(generate_wt_table_content(row["Name"].ToString(), row["DOB"].ToString(),
                          row["SID"].ToString(), row["EmpID"].ToString(), row["Cell"].ToString(), row["Email"].ToString(),
                          Convert.ToBoolean(row["IsVeg"]), row["TempField"].ToString()));
                    count += 1;
                }
                sb.Append(generate_wt_TotalPriceInfo(total)); //應付總金額資訊
                sb.Append("</table>");

                switch (orderType)
                {
                    case "E":
                    sb.Append(generate_wt_Info_Footer()); //其他注意事項 
                    break;
                    case "M":
                    // sb.Append(generate_wt_TwoDays_Footer()); //二日遊專案 
                    break;
                }
                confirm = generate_wt_Info_Header(actName, orderid, "email");
                string[] toEmail = { "apple@mcpgo.com", "mcpwinnie@gmail.com" };
                //MCPUtilities.send_multiple_mail(toEmail, "MCP-海天青線上報名變更通知", confirm, "mcpricky@gmail.com", "mcp@mcpgo.com");
                MCPUtilities.send_single_mail("apple@mcpgo.com", "MCP-海天青線上報名變更通知", confirm + sb.ToString(), "mcpwinnie@gmail.com", "apple@mcpgo.com");
                /*
                 o.[OrderID], Contact, o.[Tel1], o.[Cell1], ContactMail, row[TotalPrice], Cmt, o.[CreateDay],
                 d.[ActName],d.[Name],d.[SID],d.[EmpID],d.[Cell],d.[Email],d.[IsVeg],d.[Price],d.[Comment],d.[TempField]
                */
            }
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }

    /// <summary>文瞱企業報名轉換活動</summary>
    [WebMethod]
    public string Transfer_wtOrder(string orderid, string actid)
    {
        string result = "OK";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Od_Transfer", null);
            cmd.Parameters.Add("@OrderID", SqlDbType.NVarChar, 20).Value = orderid;
            cmd.Parameters.Add("@ActIDToTran", SqlDbType.NVarChar, 20).Value = actid;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 150);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }


    /// <summary>根據活動編號取得目前報名總數</summary>
    [WebMethod]
    public string Get_wt_OrderAmount_ById(string actid)
    {
        string result = "";
        try
        {
            if (String.IsNullOrEmpty(actid)) { return "0"; }
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_order_wtCount", null);
            cmd.Parameters.Add("@actid", SqlDbType.NVarChar, 12).Value = actid;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }
    /********************************** 文瞱專案青年專案 **********************************************/
    /// <summary>新增文瞱青年專案報名訂單 僅能一個人參加</summary>
    /// <returns>成功時回傳OK</returns>
    [WebMethod]
    public string Create_Wt_YoungOrder(clsOrder order, clsOrderDetail[] detail)
    {
        string result = "OK";
        string confirmText = "";
        string actname = "";
        StringBuilder sb = new StringBuilder();

        if (String.IsNullOrEmpty(order.Name)) { return "請輸入聯絡人姓名！"; }
        if (!MCPUtilities.IsPhoneNo(order.Tel1, "tel")) { return "聯絡人電話號碼格式錯誤！格式應為：02-8226-9088#分機！"; }
        if (!MCPUtilities.IsPhoneNo(order.Cell1, "cell")) { return "聯絡人手機號碼格式錯誤！格式應為：0933-666888！"; }
        if (!MCPUtilities.IsEmail(order.Email)) { return "聯絡人 Email格式錯誤，請重新輸入！"; }
        if (String.IsNullOrEmpty(order.Address)) { return "請輸入聯絡地址！"; }
        int yr = Convert.ToInt32(DateTime.Now.Year) - 1911;

        order.OrderID = "Y" + Convert.ToString(yr) + DateTime.Now.ToString("MMdd"); //E1040703
        order.Company = "wt";

        DataTable dt = new DataTable();
        dt.Columns.Add("OrderID", typeof(string));
        dt.Columns.Add("Name", typeof(string));
        dt.Columns.Add("Tel1", typeof(string));
        dt.Columns.Add("Tel2", typeof(string));
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


        try
        {
            dt.Rows.Add(order.OrderID, order.Name, order.Tel1, "", order.Cell1, "", "", order.Address, order.Email, 0, false, false,
                        Convert.ToBoolean(order.IsPromote), "", "", order.Company, DateTime.Now);
            if (dt.Rows.Count <= 0) { return "請先輸入員工個人相關資訊，然後再繼續！"; }

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


                sb.Append("<table style='border-collapse:collapse;'>");
                sb.Append(generate_wt_table_Header()); //產生 <th>

                foreach (clsOrderDetail item in detail)
                {
                    //先驗證資料再加入
                    if (String.IsNullOrEmpty(item.ActID)) { return "活動行程編號遺失，無法進行報名！"; }
                    if (String.IsNullOrEmpty(item.EmpID)) { return "請輸入工號後再繼續！"; }
                    if (String.IsNullOrEmpty(item.Name)) { return "請輸入參加人姓名後再繼續！"; }
                    if (!MCPUtilities.IsValidSID(item.SID)) { return "身份證或護照號碼錯誤，請重新輸入！"; }
                    if (!MCPUtilities.IsDay(item.DOB)) { return "生日日期不正確，請重新輸入！"; }
                    if (!MCPUtilities.IsPhoneNo(item.Cell, "cell")) { return "手機格式錯誤，請重新輸入！"; }
                    actname = item.ActName;
                    dtD.Rows.Add(0, order.OrderID, item.ActID, item.ActName, item.Name, item.SID, item.EmpID, Convert.ToDateTime(item.DOB), "男", item.Cell,
                                 item.Email, "", Convert.ToBoolean(item.IsVeg), false, false, false, 1000, "", "", item.TempField);
                    //產生明細列<td>
                    sb.Append(generate_wt_table_content(item.Name, item.DOB, item.SID, item.EmpID, item.Cell, item.Email, Convert.ToBoolean(item.IsVeg), "1"));
                }

                DBManager db = new DBManager();
                SqlCommand cmd = db.GetSPCommand("enterprise_order_wtYoung_Create", null);
                SqlParameter tvpOrder = cmd.Parameters.AddWithValue("@order", dt);
                tvpOrder.SqlDbType = SqlDbType.Structured;
                tvpOrder.Direction = ParameterDirection.Input;
                SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@details", dtD);
                tvpDetail.SqlDbType = SqlDbType.Structured;
                tvpDetail.Direction = ParameterDirection.Input;
                SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
                retValParam.Direction = ParameterDirection.Output;
                db.ExecuteNonQuery(cmd);
                result = retValParam.Value.ToString();
                dtD.Dispose();

                if (result.Substring(0, 2) == "OK")
                {
                    string tempid = result.Replace("OK", "");
                    sb.Append(generate_wt_TotalPriceInfo("1000"));
                    sb.Append("</table>");

                    sb.Append(generate_wt_Young_Footer());

                    confirmText = generate_wt_Info_Header(actname, tempid.Substring(0, 11), "initial") + sb.ToString();

                    MCPUtilities.send_single_mail(order.Email, "MCP-海天青線上報名通知", confirmText, "mcpwinnie@gmail.com", "");

                    //MCPUtilities.send_single_mail(order.Email, "MCP-海天青線上報名通知", confirmText, "lee13079@gmail.com", "");          
                    //MCPUtilities.SendMultipleMail("mcp@mcpgo.com", aryEmail, "MCP海天青線上報名通知", sb2.ToString, "s9340309@msn.com")
                }

            }
            else { return "參加人資料遺失，請重新輸入後再繼續！"; }
            dt.Dispose();
        }
        catch (Exception ex) { return "資料庫連線異常，目前無法送出報名表！" + ex.Message.ToString(); }
        return result;
    }

    // <summary>產生確認信件底部說明事項</summary>
    protected string generate_wt_Young_Footer()
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("<p style='margin-top:12px;'>");
        sb.Append("員工本人每人自費負擔新台幣&nbsp;$1,000&nbsp;元<span style='color: red'>（每人限補助一次旅遊）</span>。<br/><br/>");
        sb.Append("應付金額請於報名後，將自費金額以ATM轉帳、匯款或期他現金存入方式，將您的款項匯至：<br/><br/>");
        sb.Append("銀行：<span style='color:blue; font-weight:bold;'>新光銀行---新板分行 103</span><br/>");
        sb.Append("戶名：<span style='color:blue; font-weight:bold;'>海天青旅行社股份有限公司</span><br/>");
        sb.Append("帳號：<span style='color:blue; font-weight:bold;'>0462-10-100-2861</span><br/><br/>");
        sb.Append("最後，文曄科技福委及海天青旅行社感謝您的參加與支持！");
        sb.Append("我們將會於活動出發前兩天寄發行前通知單給予參加同仁，在煩請注意郵件信箱。");
        sb.Append("如有任何問題請洽海天青旅行社活動負責人員 02-2952-7535 #32、38  徐小姐or曹先生");
        sb.Append("</p>");

        sb.Append("<p style='margin-top:12px;'>");
        sb.Append("活動注意事項：");
        sb.Append("<li>員工本人每人自費負擔新台幣&nbsp;$1,000&nbsp;元<span style='color: red'>（每人限補助一次旅遊）</span>。</li>");
        sb.Append("<li>有報名『文曄走出戶外篇』活動之同仁即不可再報名『文曄兒童營』和『團結就是力量篇』活動。</li>");
        sb.Append("<li>報名成功後，如需額外付款，請待活動報名截止確認成行後，再將款項匯至本公司。</li>");
        sb.Append("<li>每梯次旅遊，<span style='color: red'>每車人數需達到該梯規定之最少人數</span>才可開梯，如未達該梯規定之最少人數則取消該車活動。</li>");
        sb.Append("<li>報名成功後如不克前往，<span style='color: red'>最晚需於出發前七天下午五點前（不可臨時找人替代更換名單）</span>，以電話告知旅行社，未提前告知者則無法退費，並喪失公司補助權益（此活動費用全額須由同仁自行負擔並由同仁薪資中扣除）。 </li>");
        sb.Append("<li>已報名旅遊行程之參加者，<span style='color: red'>不可無故不到亦不可員工本人不到僅攜伴者參加活動</span>，不到者即視同棄權且需自行負擔全額旅費，並由員工薪資中扣除。</li>");
        sb.Append("<li>如活動當天小朋友臨時生病或發燒，煩請先聯絡當日主辦人員，並提供當日就醫證明給福委會，則免扣除員工薪資。</li>");
        sb.Append("<li>每位參加同仁及親友皆有投保旅遊責任險（無法提供當日臨時加保服務）。</li>");
        sb.Append("<li>活動報名成功後，會於活動出發前三日統一寄發行前通知單，再煩請同仁特別注意信箱資訊及當日報到時間集合地點，並煩請告知同行親友。</li>");
        sb.Append("<li>請於行前通知單規定時間內準時集合，如遲到超過規定集合時間五分鐘以上，則視同放棄此活動，則無法退任何費用，並喪失公司補助權益，且該員工需付全額旅費費用，由當月薪資扣除。</li>");
        sb.Append("<li>報到當日請務必攜帶「身份証件」(如:身分證、駕照、健保卡)辦理報到事宜。查驗不符者將無法參與活動，敬請同仁配合。</li>");
        sb.Append("<li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li>");
        sb.Append("<li>若因實際出發後三歲以下孩童身高超過110公分，將於現場補足實際產生之費用。</li>");
        sb.Append("<li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液等，本單位不提供任何口服藥物。</li>");
        sb.Append("<li>遊覽車上請勿攜帶寵物及危險物品參與行程，感謝您的配合。</li>");
        sb.Append("<li>以上行程載明之車行時間僅供參考，如因路況或假日遊客眾多行程順序將視情況做更動調整。</li>");
        sb.Append("<li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li>");
        sb.Append("<li>補助期限至2016年6月，依網站公告的最後一次旅遊活動行程為止，<span style='color: red'>如於補助期限內未參加任何活動，則視同放棄權利</span>，不另轉發現金。</li>");
        sb.Append("<li>為確保活動質感，本公司不隨意安排購物站且不會安排車上工商銷售，以避免打擾旅客。敬請見諒。</li>");
        sb.Append("</ol>");
        sb.Append("</p>");
        return sb.ToString();
    }

    /********************************** 文瞱專案兒童營隊 **********************************************/
    [WebMethod]
    public string Create_Wt_KidOrder(clsOrder order, clsOrderDetail[] detail)
    {
        string result = "OK";
        string confirmText = "";
        string actname = "wt";
        string actid = "";

        StringBuilder sb = new StringBuilder();

        if (String.IsNullOrEmpty(order.Name)) { return "請輸入聯絡人姓名！"; }
        if (!MCPUtilities.IsPhoneNo(order.Tel1, "tel")) { return "聯絡人電話號碼格式錯誤！格式應為：02-8226-9088#分機！"; }
        //if (!MCPUtilities.IsPhoneNo(order.Cell1, "cell")) { return "聯絡人手機號碼格式錯誤！格式應為：0933-666888！"; }
        //if (!MCPUtilities.IsEmail(order.Email)) { return "聯絡人 Email格式錯誤，請重新輸入！"; }
        if (String.IsNullOrEmpty(order.Address)) { return "請輸入聯絡地址！"; }
        int yr = Convert.ToInt32(DateTime.Now.Year) - 1911;
        int count = 1, empidCount = 0, price = 0;
        string total = "";
        order.OrderID = "K" + Convert.ToString(yr) + DateTime.Now.ToString("MMdd"); //E1040703
        order.Company = "wt";

        DataTable dt = new DataTable();
        dt.Columns.Add("OrderID", typeof(string));
        dt.Columns.Add("Name", typeof(string));
        dt.Columns.Add("Tel1", typeof(string));
        dt.Columns.Add("Tel2", typeof(string));
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


        try
        {
            dt.Rows.Add(order.OrderID, order.Name, order.Tel1, "", order.Cell1, "", "", order.Address, order.Email, 0, false, false,
                        Convert.ToBoolean(order.IsPromote), "", "", order.Company, DateTime.Now);
            if (dt.Rows.Count <= 0) { return "請先輸入聯絡人相關資訊，然後再繼續！"; }

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


                sb.Append("<table style='border-collapse:collapse;'>");
                sb.Append(generate_wt_table_KidsHeader()); //產生 <th>

                foreach (clsOrderDetail item in detail)
                {
                    //先驗證資料再加入
                    if (String.IsNullOrEmpty(item.ActID)) { return "活動行程編號遺失，無法進行報名！"; }
                    //if (item.ActID.ToString() == "E1050301002") { return "很抱歉此活動只接受電話報名！"; }

                    //
                    if (!String.IsNullOrEmpty(item.EmpID))
                    {
                        if (!MCPUtilities.IsNumeric(item.EmpID))
                        {
                            item.EmpID = "000";
                        }
                        else {
                            empidCount += 1;
                        }
                    }
                    else {
                        item.EmpID = "000";
                    }
                    if (String.IsNullOrEmpty(item.Name)) { return "第" + count + "行：請輸入參加人姓名！"; }
                    if (!MCPUtilities.IsValidSID(item.SID)) { return "第" + count + "行：身份證或護照號碼錯誤，請重新輸入！"; }
                    if (!MCPUtilities.IsDay(item.DOB)) { return "第" + count + "行：生日日期不正確，請重新輸入！"; }
                    //if (!MCPUtilities.IsPhoneNo(item.Cell, "cell")) { return "第" + count + "行：手機格式錯誤，請重新輸入！"; }
                    if (count == 1) { actname = item.ActName; price = 1000; } else { price = 3000; }

                    actid = item.ActID;

                    dtD.Rows.Add(0, order.OrderID, item.ActID, item.ActName, item.Name, item.SID, item.EmpID, Convert.ToDateTime(item.DOB), "男", item.Cell,
                                 item.Email, "", Convert.ToBoolean(item.IsVeg), false, false, false, price, "", "", item.TempField);
                    //產生明細列<td>
                    sb.Append(generate_wt_table_content(item.Name, item.DOB, item.SID, item.EmpID, item.Cell, item.Email, Convert.ToBoolean(item.IsVeg), item.TempField));
                    count += 1;
                }

                if (empidCount <= 0) { return "請輸入聯絡人工號後方可報名！"; }
                //if (empidCount > 1) { return "員工攜伴者不可以為員工同仁，請確認只能使用一組員工工號！"; }

                DBManager db = new DBManager();
                SqlCommand cmd = db.GetSPCommand("enterprise_order_wtKid_Create", null);
                SqlParameter tvpOrder = cmd.Parameters.AddWithValue("@order", dt);
                tvpOrder.SqlDbType = SqlDbType.Structured;
                tvpOrder.Direction = ParameterDirection.Input;
                SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@details", dtD);
                tvpDetail.SqlDbType = SqlDbType.Structured;
                tvpDetail.Direction = ParameterDirection.Input;
                SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
                retValParam.Direction = ParameterDirection.Output;
                db.ExecuteNonQuery(cmd);
                result = retValParam.Value.ToString();
                dtD.Dispose();

                if (result.Substring(0, 2) == "OK")
                {
                    string tempid = result.Replace("OK", "");
                    sb.Append(generate_wt_TotalPriceInfo(tempid.Substring(11, tempid.Length - 11)));
                    sb.Append("</table>");

                    sb.Append(generate_wt_Info_KidsFooter());

                    confirmText = generate_wt_Info_Header(actname, tempid.Substring(0, 11), "initial") + sb.ToString();

                    MCPUtilities.send_single_mail(order.Email, "MCP-海天青線上報名通知", confirmText, "mcpwinnie@gmail.com", "");

                    //Dim aryEmail As Array = mail.Substring(0, mail.Length - 1).Split(",") lee13079@gmail.com
                    //MCPUtilities.SendMultipleMail("mcp@mcpgo.com", aryEmail, "MCP海天青線上報名通知", sb2.ToString, "s9340309@msn.com")
                }

            }
            else { return "您尚未加入參加人，請先加入參加人再繼續！"; }
            dt.Dispose();
        }
        catch (Exception ex) { return "資料庫連線異常，目前無法送出報名表！" + ex.Message.ToString(); }
        return result;
    }

    // <summary>產生確認信Table <th> 表頭</summary>
    protected string generate_wt_table_KidsHeader()
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("<tr>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>姓名</th>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>生日</th>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>身分證</th>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>工號</th>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>年級</th>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>備註</th>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>素食</th>");
        sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>車次</th>");
        sb.Append("</tr>");
        return sb.ToString();
    }

    // <summary>產生確認信件底部說明事項</summary>
    protected string generate_wt_Info_KidsFooter()
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("<p style='margin-top:12px;'>");
        sb.Append("<li>限員工本人小孩參加，第一位小孩每人自費新台幣$1000元；第二位以上小孩每人自費新台幣$3000元 (每人限補助一梯次營隊活動)。</li>");
        sb.Append("<li>有報名兒童營活動之同仁即不可再報名文曄走出戶外篇和團結就是力量篇活動。</li>");
        sb.Append("活動應付金額請於報名後，將金額以ATM轉帳、匯款或期他現金存入方式，將您的款項匯至：<br/><br/>");
        sb.Append("銀行：<span style='color:blue; font-weight:bold;'>新光銀行---新板分行 103</span><br/>");
        sb.Append("戶名：<span style='color:blue; font-weight:bold;'>海天青旅行社股份有限公司</span><br/>");
        sb.Append("帳號：<span style='color:blue; font-weight:bold;'>0462-10-100-2861</span><br/><br/>");
        sb.Append("最後，文曄科技福委及海天青旅行社感謝您的參加與支持！");
        sb.Append("我們將會於活動出發前兩天寄發行前通知單給予參加同仁，在煩請注意郵件信箱。");
        sb.Append("如有任何問題請洽海天青旅行社活動負責人員 02-2952-7535 #32、38  徐小姐or曹先生");
        sb.Append("</p>");

        sb.Append("<p style='margin-top:12px;'>");
        sb.Append("活動注意事項：");
        sb.Append("<ol style='border:solid 1px #c0c0c0; font-size:0.9em; list-style-position:inside; padding:4px; margin-left:0px; line-height:24px;'>");
        sb.Append("<li>限員工本人小孩參加，第一位小孩每人自費新台幣$1000元；第二位以上小孩每人自費新台幣$3000元 (每人限補助一梯次營隊活動)。</li>");
        sb.Append("<li>有報名『文曄走出戶外篇』活動之同仁即不可再報名『文曄兒童營』和『團結就是力量篇』活動。</li>");
        sb.Append("<li>報名成功後，系統會發通知信，請依系統通知信的帳號將款項匯至本公司。</li>");
        sb.Append("<li>每梯次旅遊，<span style='color: red'>每車人數需達到該梯規定之最少人數才可開梯</span>，如未達該梯規定之最少人數則取消該車活動。</li>");
        sb.Append("<li>報名成功後如不克前往，<span style='color: red'>最晚需於出發前七天下午五點前（不可臨時找人替代更換名單）</span>，以電話告知旅行社，未提前告知者則無法退費，並喪失公司補助權益（此活動費用全額須由同仁自行負擔並由同仁薪資中扣除）。</li>");
        sb.Append("<li>已報名旅遊行程之參加者，<span style='color: red'>不可無故不到</span>，不到者即視同棄權且需自行負擔全額旅費，並由員工薪資中扣除。</li>");
        sb.Append("<li>如活動當天小朋友臨時生病或發燒，煩請先聯絡當日主辦人員，並提供當日就醫證明給福委，則免扣除員工薪資。</li>");
        sb.Append("<li>每位參加小朋友皆有投保旅遊責任險（無法提供當日臨時加保服務）。</li>");
        sb.Append("<li>活動報名成功後，會於活動出發前三日統一寄發行前通知單，再煩請同仁特別注意信箱資訊及當日報到時間集合地點。</li>");
        sb.Append("<li>請於行前通知單規定時間內準時集合，如遲到超過規定集合時間五分鐘以上，則視同放棄此活動，則無法退任何費用，並喪失公司補助權益，且該員工需付全額旅費費用，由當月薪資扣除。</li>");
        sb.Append("<li>報到當日請務必攜帶「身份証件」(如:身分證、駕照、健保卡)辦理報到事宜。查驗不符者將無法參與活動，敬請同仁配合。</li>");
        sb.Append("<li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li>");
        sb.Append("<li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液等，本單位不提供任何口服藥物。</li>");
        sb.Append("<li>遊覽車上請勿攜帶寵物及危險物品參與行程，感謝您的配合。</li>");
        sb.Append("<li>以上行程載明之車行時間僅供參考，如因路況或假日遊客眾多行程順序將視情況做更動調整。</li>");
        sb.Append("<li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li>");
        sb.Append("<li>補助期限至2016年8月，依網站公告的最後一次旅遊活動行程為止，<span style='color: red'>如於補助期限內未參加任何活動，則視同放棄權利</span>，不另轉發現金。</li>");
        sb.Append("<li>為確保活動質感，本公司不隨意安排購物站且不會安排車上工商銷售，以避免打擾旅客。敬請見諒。</li>");
        sb.Append("</ol>");
        sb.Append("</p>");
        return sb.ToString();
    }

    /********************************** 文瞱露營專案 **********************************************/

    /// <summary>新增文瞱露營報名訂單</summary>
    /// <returns>成功時回傳OK</returns>
    [WebMethod]
    public string Create_Wt_CampingOrder(clsOrder order, clsOrderDetail[] detail)
    {
        string result = "OK";
        string username = "";
        string actname = "wt";
        string actid = "";
        //if (HttpContext.Current.User.Identity.IsAuthenticated) {
        //  username = HttpContext.Current.User.Identity.Name;
        //} else {
        //  return "請先登入再繼續報名！";
        //}
        if (String.IsNullOrEmpty(order.Name)) { return "請輸入聯絡人姓名！"; }
        if (!MCPUtilities.IsPhoneNo(order.Tel1, "tel")) { return "聯絡人電話號碼格式錯誤！格式應為：02-8226-9088#分機！"; }
        if (!MCPUtilities.IsPhoneNo(order.Cell1, "cell")) { return "聯絡人手機號碼格式錯誤！格式應為：0933-666888！"; }
        if (!MCPUtilities.IsEmail(order.Email)) { return "聯絡人 Email格式錯誤，請重新輸入！"; }
        if (String.IsNullOrEmpty(order.Address)) { return "請輸入聯絡地址！"; }
        int yr = Convert.ToInt32(DateTime.Now.Year) - 1911;

        order.OrderID = "C" + Convert.ToString(yr) + DateTime.Now.ToString("MMdd"); //E1040703
        order.Company = username;

        DataTable dt = new DataTable();
        dt.Columns.Add("OrderID", typeof(string));
        dt.Columns.Add("Name", typeof(string));
        dt.Columns.Add("Tel1", typeof(string));
        dt.Columns.Add("Tel2", typeof(string));
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


        try
        {
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

                //-- 檢查明細 --

                int adult = 0;
                int kid = 0;
                int discount300 = 0;
                int discount1000 = 0;
                int discount2300 = 0;
                int price = 2800;
                int count = 1;
                int total = 0;
                string gender = "男";
                string comment = "", cmt = "";
                List<String> lstEid = new List<string>();

                foreach (clsOrderDetail item in detail)
                {
                    //先驗證資料再加入
                    if (String.IsNullOrEmpty(item.ActID)) { return "活動行程編號遺失，無法進行報名！"; }
                    if (!String.IsNullOrEmpty(item.EmpID))
                    {
                        if (!MCPUtilities.IsWtEmployId(item.EmpID)) { return "第" + count + "列：工號格式錯誤！"; }
                    }
                    if (String.IsNullOrEmpty(item.Name)) { return "第" + count + "列：請輸入參加人姓名！"; }
                    if (!MCPUtilities.IsValidSID(item.SID)) { return "第" + count + "列：身份證或護照號碼錯誤，請重新輸入！"; }
                    if (!MCPUtilities.IsDay(item.DOB)) { return "第" + count + "列：生日日期不正確，請重新輸入！"; }
                    if (!MCPUtilities.IsPhoneNo(item.Cell, "cell")) { return "第" + count + "列：手機格式錯誤，請重新輸入！"; }
                    if (count == 1) { actname = item.ActName; }
                    actid = item.ActID;

                    // count total amount of kids and adult
                    // 三歲以下之兒童(2014年7月以後出生)
                    // 
                    //if (Convert.ToInt32(MCPUtilities.DateDiff(MCPUtilities.DateInterval.Day, Convert.ToDateTime(item.DOB), DateTime.Now)) <= 1345) { kid += 1;}else{ adult+=1; }

                    if (isKid(item.DOB)) { kid += 1; } else { adult += 1; }
                    // check duplated employee ID     
                    if (!String.IsNullOrEmpty(item.EmpID))
                    {
                        if (!lstEid.Exists(x => x == item.EmpID))
                        {
                            // 本人0 第1人300 第2人1000 第3人1000 三歲以下200
                            //lstEid.Add(item.EmpID); discount300 += 1; discount1000 += 2; 

                            // 本人0 第1人0 第2人1000 第3人2300 三歲以下200
                            lstEid.Add(item.EmpID); discount300 += 1; discount1000 += 1; discount2300 += 1;
                        }
                        else {
                            return "第" + count + "列：有重覆工號，請重新輸入！";
                        }
                    }
                    count += 1;
                }

                if (lstEid.Count <= 0) { return "請至少輸入一組員工工號，請重新輸入！"; }
                if (adult < 3) { return "此露營活動單次報名人數至少需三人（不含三歲以下兒童），方能報名！"; }
                if (adult > 4) { return "此露營活動單次報名人數最多僅接受四人（不含三歲以下兒童），方能報名！"; }
                if (adult == 4 && kid > 2) { return "此露營活動單次報名人數最多僅接受四人與兩位三歲以下兒童，方能報名！"; }

                if (adult == 3) { total += 800; comment = "須補營位價差800元"; }


                foreach (clsOrderDetail item in detail)
                {
                    price = 2800;
                    cmt = "";

                    if (isKid(item.DOB))
                    {
                        price = 200;
                        cmt = "三歲以下";
                    }
                    else {
                        // 本人0 第1人300 第2人1000 第3人1000 三歲以下200
                        //if (!String.IsNullOrEmpty(item.EmpID)) { price = 0; } // Employee is free
                        //else {
                        //    if (discount300 > 0) { price = 300; discount300 -= 1; }
                        //    else {
                        //        if (discount1000 > 0) { price = 1000; discount1000 -= 1; }
                        //    }
                        //}

                        // 本人0 第1人300 第2人1000 第3人2300 三歲以下200
                        if (!String.IsNullOrEmpty(item.EmpID)) { price = 0; } // Employee is free
                        else
                        {
                            if (discount300 > 0) { price = 0; discount300 -= 1; }
                            else
                            {
                                if (discount1000 > 0) { price = 1000; discount1000 -= 1; }
                                else
                                {
                                    if (discount2300 > 0) { price = 2300; discount1000 -= 1; }
                                }
                            }
                        }
                    }

                    item.Price = price;
                    total += price;

                    if (item.SID.Substring(1, 1) == "1") { gender = "男"; } else { gender = "女"; }

                    dtD.Rows.Add(0, order.OrderID, item.ActID, item.ActName, item.Name, item.SID, item.EmpID, Convert.ToDateTime(item.DOB), gender, item.Cell,
                                   item.Email, "", Convert.ToBoolean(item.IsVeg), false, false, false, Convert.ToInt32(item.Price), cmt, "", item.TempField);
                }

                // add main order
                dt.Rows.Add(order.OrderID, order.Name, order.Tel1, "", order.Cell1, "", "", order.Address, order.Email, total, false, false, Convert.ToBoolean(order.IsPromote), comment, "", "wt", DateTime.Now);
                if (dt.Rows.Count <= 0) { return "請先輸入聯絡人相關資訊，然後再繼續！"; }

                //result = "OKE1060705001" + total.ToString();
                DBManager db = new DBManager();
                SqlCommand cmd = db.GetSPCommand("enterprise_wt_Camping_Od_Add", null);
                SqlParameter tvpOrder = cmd.Parameters.AddWithValue("@ORDERLIST", dt);
                tvpOrder.SqlDbType = SqlDbType.Structured;
                tvpOrder.Direction = ParameterDirection.Input;
                SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@DETAILLIST", dtD);
                tvpDetail.SqlDbType = SqlDbType.Structured;
                tvpDetail.Direction = ParameterDirection.Input;
                SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
                retValParam.Direction = ParameterDirection.Output;
                db.ExecuteNonQuery(cmd);
                result = retValParam.Value.ToString() + total.ToString();
                dtD.Dispose();

                if (result.Substring(0, 2) == "OK")
                {
                    string tempid = result.Replace("OK", "");
                    send_camping_confirm_mail(tempid.Substring(0, 11), comment);
                }

            }
            else { return "您尚未加入參加人，請先加入參加人再繼續！"; }
            dt.Dispose();
        }
        catch (Exception ex) { return "資料庫連線異常，目前無法送出報名表！" + ex.Message.ToString(); }
        return result;
    }

    /// <summary>重新發送露營確認 Email</summary>
    // [WebMethod]
    //public string reSend_camping_confirm_mail(string orderid) {
    //  string result = "OK";
    //  result = send_camping_confirm_mail(orderid, "modified");
    //  return result;
    //}

    /// <summary>發送露營確認 Email</summary>   
    protected string send_camping_confirm_mail(string orderid, string cmt)
    {
        string result = "OK";
        StringBuilder sb = new StringBuilder();
        DataTable dt = new DataTable();
        int count = 0, total = 0;
        string actName = "", email = "", content = "";
        try
        {
            DBManager db = new DBManager();
            //SqlCommand cmd = db.GetSPCommand("enterprise_Order_wtExport", null);
            //cmd.Parameters.Add("@ActID", SqlDbType.NVarChar, 15).Value = "";
            //cmd.Parameters.Add("@OrderID", SqlDbType.NVarChar, 15).Value = orderid;
            //cmd.Parameters.Add("@method", SqlDbType.NVarChar, 15).Value = "email";
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Od_Report", null);
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = "Oid";
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = orderid;
            dt = db.ExecuteDataTable(cmd);

            if (dt.Rows.Count > 0)
            {


                sb.Append("<table style='border-collapse:collapse;'>");
                sb.Append("<tr>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>姓名</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>工號</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>身分證</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>生日</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>性別</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>手機</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>email</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>金額</th>");
                sb.Append("<th style='border:solid 1px #c0c0c0; padding:6px;'>備註</th>");
                sb.Append("</tr>");
                foreach (DataRow row in dt.Rows)
                {
                    //產生明細列
                    if (count == 0)
                    {
                        email = row["MainEmail"].ToString();
                        actName = row["ActName"].ToString();
                        total = Convert.ToInt32(row["TotalPrice"]);

                    }

                    sb.Append("<tr>");
                    //total += Convert.ToInt32(row["Price"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Name"].ToString());
                    if (row["EmpID"].ToString() == "000" || String.IsNullOrEmpty(row["EmpID"].ToString()))
                    {
                        sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>---</td>");
                    }
                    else {
                        sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["EmpID"].ToString());
                    }
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>******{0}</td>", row["SID"].ToString().Substring(6, 4));
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", Convert.ToDateTime(row["DOB"].ToString()).ToString("yyyy/MM/dd"));
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Sex"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Cell"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Email"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Price"].ToString());
                    sb.AppendFormat("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>{0}</td>", row["Cmt"].ToString());
                    sb.Append("</tr>");
                    //if (Math.Floor(new TimeSpan(DateTime.Now.Ticks - Convert.ToDateTime(row["DOB"].ToString()).Ticks).TotalDays) > 1095) {
                    //  adult +=1;
                    //}
                    //if (Convert.ToBoolean(row["IsVeg"])) {
                    //  sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>素食</td>");
                    //} else {             
                    //  sb.Append("<td style='border:solid 1px #c0c0c0; padding:6px; text-align:center;'>X</td>");
                    //}         
                    count += 1;
                }
                //應付總金額資訊
                sb.Append("<tr><th colspan='9' style='text-align:right; padding:6px; border:solid 1px #c0c0c0;'>");
                if (String.IsNullOrEmpty(cmt))
                {
                    sb.AppendFormat("應付總金額：<span style='font-weight:bold;color:red;'>{0}</span></th></tr>", total);
                }
                else {
                    sb.AppendFormat("應付總金額：<span style='font-weight:bold;color:red;'>{0}</span> ({1})</th></tr>", total, cmt);
                }

                sb.Append("</table>");
                //表尾注意事項
                //sb.Append(confirmation_Notes("Camping"));

                sb.Append("<p style='margin-top:12px;'>");
                sb.Append("若有額外的自費金額請於報名截止後(30天會有專人信件通知)，將自費金額以ATM轉帳、匯款或期他現金存入方式，將您的款項匯至：<br/><br/>");
                sb.Append("銀行：<span style='color:blue; font-weight:bold;'>新光銀行---新板分行 103</span><br/>");
                sb.Append("戶名：<span style='color:blue; font-weight:bold;'>海天青旅行社股份有限公司</span><br/>");
                sb.Append("帳號：<span style='color:blue; font-weight:bold;'>0462-10-100-2861</span><br/><br/>");
                sb.Append("匯款完成後請Email: mcp.otherstw@gmail.com 告知參加行程、員工姓名、匯款帳號後五碼，代會計確認入帳後，將回信通知您。");
                sb.Append("</p>");

                sb.Append("<p style='margin-top:12px;'>");
                sb.Append("最後，文曄科技福委及海天青旅行社感謝您的參加與支持！");
                sb.Append("我們將會於活動出發前 3 天寄發行前通知單給予參加同仁，在煩請注意郵件信箱。");
                sb.Append("如有任何問題請洽海天青旅行社活動負責人員 02-2952-7535 #32、40  徐小姐 顏小姐");
                sb.Append("</p>");

                sb.Append("<p style='margin-top:12px;'>文瞱科技旅遊補助辦法補助辦法</p>");
                sb.Append("<ol>");
                sb.Append("<li>每位同仁最多攜伴3人〈不含3歲以下孩童〉。</li>");
                sb.Append("<li>員工本人全額補助〈每人限參加及補助一次〉。</li>");
                sb.Append("<li>員工攜伴第1人免費。</li>");
                sb.Append("<li>員工攜伴第2人需自費新台幣 $1,000元。</li>");
                sb.Append("<li>員工攜伴第3人需自費新台幣 $2,300元。</li>");
                sb.Append("<li>員工攜伴者，不可為公司同仁(夫妻不在此限制內，但每人限參加一次活動) 。</li>");
                sb.Append("<li>0-3歲兒童定義〈2014年7月以後出生〉，每人酌收200元〈含保險/車資等行政代辦費用〉。</li>");
                sb.Append("</ol>");

                sb.Append("<p style='margin-top:12px;'>文瞱科技一日遊活動注意事項</p>");
                sb.Append("<ol>");
                sb.Append("<li style='color: red;'>每梯次露營活動需滿 100 人才可開梯，每位員工最多僅能佔用一營位，且每一帳篷須至少3位成人。若帳篷未滿四位成人，須另補新台幣800元的營位場地費用。</li>");
                sb.Append("<li>報名成功後如不克前往，最晚需於出發前7日下午5:00前，以電話告知旅行社，未提前告知者則無法退費，並喪失公司補助權益。 (公司仍需支付此筆費用予旅行社) 。</li>");
                sb.Append("<li>已報名旅遊行程之參加者<span style='color: red;'>不可無故不到，亦不可員工本人未到僅眷屬自行參與，未到者即視同棄權需自行負擔全額旅費，且由當月薪資扣除</span>。</li>");
                sb.Append("<li>請勿冒名頂替他人參與活動，違者須自行負擔全額旅費，且由當月薪資扣除。</li>");
                sb.Append("<li>每位參加同仁及親友皆有投保旅遊責任險 (無法提供當日臨時加保服務)。</li>");
                sb.Append("<li>報到當日請務必攜帶有<span style='color: red;'>照片</span>之「身份證件」(如:身分證、駕照、健保卡)。查驗不符者將無法參與活動，敬請同仁配合。</li>");
                sb.Append("<li>請於行前通知單規定時間內準時集合，如<span style='color: red;'>遲到超過規定集合時間五分鐘以上</span>，則視同放棄此活動，無法退回任何費用，並喪失公司補助權益，且該員工需付全額旅費費用，由當月薪資扣除。</li>");
                sb.Append("<li>公司員工旅遊需團體同進同出，故皆不開放同仁自行開車前往及提早離開，請同仁們多加留意，違者須自行負擔全額旅費，且由當月薪資扣除。</li>");
                sb.Append("<li>活動報名成功後，會於活動出發前<span style='color: red;'>三日</span>統一寄發行前通知單，在煩請同仁特別注意信箱資訊及當日報到時間和集合地點，並煩請告知同行親友。</li>");
                sb.Append("<li>如活動當天臨時生病或發燒，煩請先聯絡當日主辦人員，並提供當日就醫證明給福委會，則免扣除員工薪資。</li>");
                sb.Append("<li>補助期限至2018年7月，依網站公告的最後一次旅遊活動行程為止。</li>");
                sb.Append("<li>如於補助期限內未參加任何活動，則視同放棄權利，不另轉發現金。</li>");
                sb.Append("<li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li>");
                sb.Append("<li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將於現場補足實際產生之費用。</li>");
                sb.Append("<li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液.等。本單位不提供任何口服藥物。</li>");
                sb.Append("<li>遊覽車上請勿攜帶寵物及危險物品參與行程，感謝您的配合。</li>");
                sb.Append("<li>以上行程載明之車行時間僅供參考，如因路況或假日遊客眾多行程順序將視情況做更動調整。</li>");
                sb.Append("<li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li>");
                sb.Append("<li>旅遊活動諮詢專線：02-29527535  #32 徐小姐 #40 顏小姐。</li>");
                sb.Append("</ol>");

                content = sb.ToString();
                sb.Remove(0, sb.Length);

                sb.Append("<div style='marging-top:12px;margin-bottom:12px;'>");
                sb.AppendFormat("親愛的同仁您好！您已經在 MCP海天青企業專區網站上報名<span style='font-weight:bold;color:blue;'>「{0}」</span>的活動行程，", actName);
                sb.AppendFormat("您的報名編號為：<span style='font-weight:bold;color:red;'>{0}</span>，其他詳細資訊如下：", orderid);
                sb.Append("</div>");

                content = sb.ToString() + content;
                //MCPUtilities.send_single_mail(email, "MCP海天青線上文瞱科技線上報名確認信", content, "mcp.otherstw@gmail.com", "apple@mcpgo.com");
                MCPUtilities.send_single_mail(email, "MCP海天青線上文瞱集團線上報名確認信", content, "mcp.otherstw@gmail.com", "");
                //if (sentto == "customer")
                //{
                //    //MCPUtilities.send_single_mail(email, "MCP海天青線上文瞱科技線上報名確認信", content, "mcp.otherstw@gmail.com", "apple@mcpgo.com");
                //    MCPUtilities.send_single_mail("lee13079@gmail.com", "MCP海天青線上文瞱科技線上報名確認信", content, "apple@mcpgo.com", "winnie@mcpgo.com");
                //}
                //else
                //{
                //    MCPUtilities.send_single_mail("mcp.otherstw@gmail.com", "重發確認信", content, "winnie@mcpgo.com", "apple@mcpgo.com");
                //}         

            }
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        return result;
    }



    /********************************** 文瞱二日遊專案 **********************************************/
    [WebMethod]
    public string Create_Wt_TwoDaysOrder(clsOrder order, clsOrderDetail[] detail)
    {
        string result = "OK", actname = "", actid = "", cmt = "";

        StringBuilder sb = new StringBuilder();

        if (String.IsNullOrEmpty(order.Name)) { return "請輸入聯絡人姓名！"; }
        if (!MCPUtilities.IsPhoneNo(order.Tel1, "tel")) { return "聯絡人電話號碼格式錯誤！格式應為：02-8226-9088#分機！"; }
        if (!MCPUtilities.IsPhoneNo(order.Cell1, "cell")) { return "聯絡人手機號碼格式錯誤！格式應為：0933-666888！"; }
        if (!MCPUtilities.IsEmail(order.Email)) { return "聯絡人 Email格式錯誤，請重新輸入！"; }

        int yr = Convert.ToInt32(DateTime.Now.Year) - 1911;
        int y = 1970;

        string room = "";
        int price = 0, joinAmt = 0, empidCount = 0, freeAmt = 0, adult = 0, threeyr = 0, sixyr = 0, total = 0, age = 18;
        order.OrderID = "M" + Convert.ToString(yr) + DateTime.Now.ToString("MMdd"); //M1070809
        order.Company = "wt";

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

        try
        {
            room = order.Tel2;
            //if (room == 2) { cmt += "2人房1間"; }
            //if (room == 4) { cmt += "4人房1間"; }

            //if (dt.Rows.Count <= 0) { return "請先輸入聯絡人相關資訊，然後再繼續！"; }

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

                //第一次回圈先驗證資料
                foreach (clsOrderDetail item in detail)
                {
                    if (joinAmt == 0) { actname = item.ActName; actid = item.ActID; } // 取得活動 ID 及 名稱
                                                                                      //先驗證資料再加入
                    if (String.IsNullOrEmpty(item.ActID)) { return "活動行程編號遺失，無法進行報名！"; }
                    if (String.IsNullOrEmpty(item.Name)) { return "第" + (joinAmt + 1).ToString() + "行：請輸入參加人姓名！"; }
                    if (!MCPUtilities.IsValidSID(item.SID)) { return "第" + (joinAmt + 1).ToString() + "行：身份證或護照號碼錯誤，請重新輸入！"; }
                    if (!MCPUtilities.IsDay(item.DOB)) { return "第" + (joinAmt + 1).ToString() + "行：生日日期不正確，請重新輸入！"; }
                    if (!MCPUtilities.IsPhoneNo(item.Cell, "cell")) { return "第" + (joinAmt + 1).ToString() + "行：手機格式錯誤，請重新輸入！"; }
                    if (item.SID.Substring(1, 1) == "1") { item.Sex = "男"; } else { item.Sex = "女"; }

                    //count total amount of kids and adult 
                    //age = get_Age(Convert.ToInt32(MCPUtilities.DateDiff(MCPUtilities.DateInterval.Day, Convert.ToDateTime(item.DOB), DateTime.Now)));

                    y = Convert.ToInt32(item.DOB.ToString().Substring(0, 4));
                    age = 18;
                    if (y >= 2012)
                        age = 6;
                    if (y >= 2015)
                        age = 3;

                    switch (age)
                    {
                        case 3:
                        threeyr += 1;
                        break;
                        case 6:
                        sixyr += 1;
                        break;
                        default:
                        adult += 1;
                        break;
                    }

                    if (!String.IsNullOrEmpty(item.EmpID))
                    {
                        if (age < 18) { return "第" + (joinAmt + 1).ToString() + "行：兒童不可為員工，請重新輸入！"; }
                        if (!lstEid.Exists(x => x == item.EmpID))
                        {
                            // 判斷是否有重複的工號
                            lstEid.Add(item.EmpID);
                            empidCount += 1;
                            freeAmt += 2;
                        }
                        else
                        {
                            return "第" + (joinAmt + 1).ToString() + "行：有重覆工號，請重新輸入！";
                        }
                    }

                    // 判斷是否有重複的身份證號
                    if (!lstSid.Exists(x => x == item.SID))
                    {
                        lstSid.Add(item.SID);
                    }
                    else {
                        return "第" + (joinAmt + 1).ToString() + "行：有重覆身份證，請重新輸入！";
                    }
                    joinAmt += 1;
                }



                if (empidCount <= 0) { return "請至少輸入一組員工工號！請重新輸入！"; }

                //if (empidCount > 2) { return "員工攜伴者不可以為員工同仁(夫妻不在此限制內)！"; }

                switch (room)
                {
                    case "2A":
                    if (adult != 2) { return "請輸入2位成人參加者！"; }
                    break;
                    case "2B":
                    if (adult != 2 || threeyr != 1) { return "請輸入2位成人參加者，及1位三歲以下兒童資料！"; }
                    cmt += "，3歲以下兒童1位。";
                    break;
                    case "2C":
                    if (adult != 2 || threeyr != 1 || sixyr != 1) { return "請輸入2位成人參加者，1位四至六歲兒童，及1位三歲以下兒童資料！"; }
                    cmt += "，4-6歲兒童不佔床餐、3歲以下兒童各1位。";
                    break;
                    case "2D":
                    if (adult != 1 || sixyr != 1) { return "請輸入1位成人參加者，1位四至六歲兒童資料！"; }
                    cmt += "，4-6歲兒童佔床餐1位。";
                    break;
                    case "2F":
                    if (adult != 2 || sixyr != 1) { return "請輸入2位成人參加者，1位四至六歲兒童資料！"; }
                    cmt += "，4-6歲兒童佔床餐1位。";
                    break;
                    case "2G":
                    if (adult != 2 || threeyr != 2) { return "請輸入2位成人參加者，2位三歲以下兒童資料！"; }
                    cmt += "，4-6歲兒童佔床餐1位。";
                    break;
                    case "2H":
                    if (adult != 2 || sixyr != 2) { return "請輸入2位成人參加者，2位四至六歲兒童資料！"; }
                    cmt += "，4-6歲兒童佔床餐1位。";
                    break;
                    case "4A":
                    if (adult != 4) { return "請輸入4位成人參加者！"; }
                    break;
                    case "4B":
                    if (adult != 4 || threeyr != 1) { return "請輸入4位成人參加者，及1位三歲以下兒童資料！"; }
                    cmt += "，3歲以下兒童1位。";
                    break;
                    case "4C":
                    if (adult != 4 || threeyr != 1 || sixyr != 1) { return "請輸入4位成人參加者，1位四至六歲兒童，及1位三歲以下兒童資料！"; }
                    cmt += "，4-6歲兒童不佔床餐、3歲以下兒童各1位。";
                    break;
                    case "4D":
                    if (adult != 3 || sixyr != 1) { return "請輸入3位成人參加者，1位四至六歲兒童資料！"; }
                    cmt += "，4-6歲兒童佔床餐1位。";
                    break;
                    case "4F":
                    if (adult != 4 || sixyr != 1) { return "請輸入4位成人參加者，1位四至六歲兒童資料！"; }
                    cmt += "，4-6歲兒童佔床餐1位。";
                    break;
                    case "4G":
                    if (adult != 4 || threeyr != 2) { return "請輸入4位成人參加者，2位三歲以下兒童資料！"; }
                    cmt += "，4-6歲兒童佔床餐1位。";
                    break;
                    case "4H":
                    if (adult != 4 || sixyr != 2) { return "請輸入4位成人參加者，2位四至六歲兒童資料！"; }
                    cmt += "，4-6歲兒童佔床餐1位。";
                    break;
                }

                order.Comment = "預定 " + room.Substring(0, 1) + " 入房一間，共 " + Convert.ToString(joinAmt) + " 人" + cmt;

                //第二次迴圈將資料加入 DataTable 並計算金額（必須要先知道有多少免費名額才能正確算出個人金額）
                /*
                foreach (clsOrderDetail d in detail)
                {
                    //age = get_Age(Convert.ToInt32(MCPUtilities.DateDiff(MCPUtilities.DateInterval.Day, Convert.ToDateTime(d.DOB), DateTime.Now)));
                    y = Convert.ToInt32(d.DOB.ToString().Substring(0, 4));
                    age = 18;
                    if (y >= 2012)
                        age = 6;
                    if (y >= 2015)
                        age = 3;


                    switch (age)
                    {
                        case 3:
                            price = 500;
                            cmt = "3歲以下";
                            break;
                        case 6:
                            price = 1000;
                            cmt = "4-6歲不佔床餐";
                            if (room == "2D" || room == "4D")
                            {
                                price = 5000;
                                if (freeAmt > 0) { price = 0; freeAmt -= 1; }
                                cmt = "4-6歲佔床餐";
                            }
                            break;
                        default:
                            price = 5000;
                            if (freeAmt > 0)
                            {
                                price = 0;
                                freeAmt -= 1;
                            }
                            cmt = "";
                            break;
                    }

                    total += price;

                    dtD.Rows.Add(0, order.OrderID, d.ActID, d.ActName, d.Name, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.Email,
                        "", Convert.ToBoolean(d.IsVeg), false, false, false, price, cmt, "", d.TempField);
                }

                */


                //第二次迴圈先計算成人則扣並將資料加入 DataTable 並計算金額
                foreach (clsOrderDetail d in detail)
                {
                    y = Convert.ToInt32(d.DOB.ToString().Substring(0, 4));
                    if (y < 2012)
                    {
                        price = 5000;
                        if (freeAmt > 0) { price = 0; freeAmt -= 1; }
                        cmt = "";
                        total += price;
                        dtD.Rows.Add(0, order.OrderID, d.ActID, d.ActName, d.Name, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.Email, "", Convert.ToBoolean(d.IsVeg), false, false, false, price, cmt, "", d.TempField);
                    }
                }

                //第三次迴圈先計算4-6歲兒童則扣並將資料加入 DataTable 並計算金額
                foreach (clsOrderDetail d in detail)
                {
                    y = Convert.ToInt32(d.DOB.ToString().Substring(0, 4));
                    if (y >= 2012 && y < 2015)
                    {
                        price = 1000;
                        if (freeAmt > 0) { price = 0; freeAmt -= 1; }
                        cmt = "4-6歲不佔床餐";
                        total += price;
                        dtD.Rows.Add(0, order.OrderID, d.ActID, d.ActName, d.Name, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.Email, "", Convert.ToBoolean(d.IsVeg), false, false, false, price, cmt, "", d.TempField);
                    }
                }

                //第四次迴圈先計算0-3歲兒童則扣並將資料加入 DataTable 並計算金額
                foreach (clsOrderDetail d in detail)
                {
                    y = Convert.ToInt32(d.DOB.ToString().Substring(0, 4));
                    if (y >= 2015)
                    {
                        price = 500;
                        if (freeAmt > 0) { price = 0; freeAmt -= 1; }
                        cmt = "3歲以下";
                        total += price;
                        dtD.Rows.Add(0, order.OrderID, d.ActID, d.ActName, d.Name, d.SID, d.EmpID, Convert.ToDateTime(d.DOB), d.Sex, d.Cell, d.Email, "", Convert.ToBoolean(d.IsVeg), false, false, false, price, cmt, "", d.TempField);
                    }
                }


                dt.Rows.Add(order.OrderID, order.Name, order.Tel1, order.Tel2, order.Cell1, "", "", order.Address, order.Email, total, false, false,
                       Convert.ToBoolean(order.IsPromote), order.Comment, "", order.Company, DateTime.Now);



                DBManager db = new DBManager();
                SqlCommand cmd = db.GetSPCommand("enterprise_wt_TwoDays_Od_Add", null);
                SqlParameter tvpOrder = cmd.Parameters.AddWithValue("@ORDERLIST", dt);
                tvpOrder.SqlDbType = SqlDbType.Structured;
                tvpOrder.Direction = ParameterDirection.Input;
                SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@DETAILLIST", dtD);
                tvpDetail.SqlDbType = SqlDbType.Structured;
                tvpDetail.Direction = ParameterDirection.Input;
                SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
                retValParam.Direction = ParameterDirection.Output;
                db.ExecuteNonQuery(cmd);
                result = retValParam.Value.ToString() + Convert.ToString(total);

                //result = "OKE1040402002800";
                dtD.Dispose();

                if (result.Substring(0, 2) == "OK")
                {
                    string tempid = result.Replace("OK", "");
                    send_twodays_confirm_mail(tempid.Substring(0, 11), "customer");
                }
            }
            else { return "您尚未加入參加人，請先加入參加人再繼續！"; }
            dt.Dispose();
        }
        catch (Exception ex) { return "資料庫連線異常，目前無法送出報名表！" + ex.Message.ToString(); }

        return result;
    }

    /// <summary>檢查年齡</summary>   
    protected int get_Age(int days)
    {
        int age = 18;
        //if (days <= 2404)
        //{
        //    age = 6;
        //    if (days <= 1308) { age = 3; }
        //}
        if (days <= 1345)
            age = 3;


        //0-3歲兒童定義 - 2014年7月以後出生
        return age;
    }

    

    //-------------------------------------------------------------------------------------------
    //                                   文瞱減重報名清單
    //-----------------------------------------------------------------------------------------

    private string Check_Data_Valid(string name, string dob, string sid, string eid, string cell, string phone, string email)
    {
        string result = "OK";
        if (String.IsNullOrEmpty(name)) { return "請輸入姓名！"; }
        if (!MCPUtilities.IsPhoneNo(phone, "tel")) { return "電話號碼格式錯誤！格式應為：02-8226-9088#分機！"; }
        if (!MCPUtilities.IsPhoneNo(cell, "cell")) { return "手機號碼格式錯誤！格式應為：0933-666888！"; }
        if (!MCPUtilities.IsEmail(email)) { return "Email 格式錯誤，請重新輸入！"; }
        if (!MCPUtilities.IsDay(dob)) { return "生日格式錯誤！格式應為：yyyy/mm/dd"; }
        if (!MCPUtilities.IsValidSID(sid)) { return "身份證或護照號碼錯誤！"; }
        if (!MCPUtilities.IsNumeric(eid)) { return "請輸入工號！"; }
        return result;
    }

    [WebMethod]
    public string Modify_wt_Order(clsOrder order, string action)
    {
        string result = "OK";
        DataTable dt = new DataTable();
        dt.Columns.Add("OrderID", typeof(string));
        dt.Columns.Add("Name", typeof(string));
        dt.Columns.Add("Tel1", typeof(string));
        dt.Columns.Add("Tel2", typeof(string));
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
        try
        {
            if (String.IsNullOrEmpty(order.OrderID)) { return "報名編號遺失，無法進行更新！"; }
            if (action == "Update")
            {
                string strValid = "OK";
                strValid = Check_Data_Valid(order.Name, "1990/12/12", "Y117094843", "123", order.Cell1, order.Tel1, order.Email);
                if (strValid != "OK") { return strValid; }
            }
            if (!MCPUtilities.IsNumeric(Convert.ToString(order.TotalPrice))) { return "金額不正確，請重新輸入！"; }

            dt.Rows.Add(order.OrderID, order.Name, order.Tel1, order.Tel2, order.Cell1, order.Cell2, order.Fax, order.Address,
              order.Email, order.TotalPrice, order.IsPaid, order.IsConfirm, order.IsPromote, order.Comment, order.Source, order.Company, DateTime.Now);

            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Od_Modify", null);
            SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@ORDERLIST", dt);
            tvpDetail.SqlDbType = SqlDbType.Structured;
            tvpDetail.Direction = ParameterDirection.Input;
            cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 20).Value = action;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        finally { dt.Dispose(); }
        return result;
    }

    [WebMethod]
    public string Modify_wt_OrderDetails(clsOrderDetail details, string action)
    {
        string result = "OK";
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
        try
        {

            if (!MCPUtilities.IsNumeric(Convert.ToString(details.SeqNo))) { return "序列號遺失，無法執行！"; }
            if (String.IsNullOrEmpty(details.ActID)) { return "活動編號遺失，無法執行！"; }
            if (String.IsNullOrEmpty(details.OrderID)) { return "單號遺失，無法執行！"; }
            if (action == "Update")
            {
                string strValid = Check_Data_Valid(details.Name, details.DOB, details.SID, details.EmpID, details.Cell, "02-8226-9088", details.Email);
                if (strValid != "OK")
                    return strValid;
            }
            dtD.Rows.Add(details.SeqNo, details.OrderID, details.ActID, details.ActName,
                         details.Name, details.SID, details.EmpID, Convert.ToDateTime(details.DOB),
                         "", details.Cell, details.Email, "N", false, false, false, false, 0, details.Comment, "", "");
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Fitness_Odt_Modify", null);
            SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@DETAILLIST", dtD);
            tvpDetail.SqlDbType = SqlDbType.Structured;
            tvpDetail.Direction = ParameterDirection.Input;
            cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 20).Value = action;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();

        }
        catch (Exception ex) { result = ex.Message.ToString(); }
        finally { dtD.Dispose(); }
        return result;

    }

    /// <summary>新增文瞱線上報名訂單</summary>
    /// <returns>成功時回傳OK</returns>
    [WebMethod]
    public string Create_Wt_Fitness_Order(clsOrder order, clsOrderDetail[] detail)
    {
        string result = "OK";
        string strValid = "", actname = "", actid = "", confirmText = "", sex = "男";
        bool isValid = true;

        StringBuilder sb = new StringBuilder();
        //if (HttpContext.Current.User.Identity.IsAuthenticated) {
        //  username = HttpContext.Current.User.Identity.Name;
        //} else {
        //  return "請先登入再繼續報名！";
        //}

        strValid = Check_Data_Valid(order.Name, "1990/12/12", "Y117094843", "123", order.Cell1, order.Tel1, order.Email);
        if (strValid != "OK") { return strValid; }

        int yr = Convert.ToInt32(DateTime.Now.Year) - 1911;
        int count = 1;
        order.OrderID = "F" + Convert.ToString(yr) + DateTime.Now.ToString("MMdd"); //E1040703
        order.Company = "wt123";

        DataTable dt = new DataTable();
        dt.Columns.Add("OrderID", typeof(string));
        dt.Columns.Add("Name", typeof(string));
        dt.Columns.Add("Tel1", typeof(string));
        dt.Columns.Add("Tel2", typeof(string));
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
        try
        {
            dt.Rows.Add(order.OrderID, order.Name, order.Tel1, "", order.Cell1, "", "", "", order.Email, 0, false, false, false, order.Comment, "", order.Company, DateTime.Now);
            //if (dt.Rows.Count <= 0) { return "請先輸入聯絡人相關資訊，然後再繼續！"; }

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



                var list = new List<String>();
                var listEmail = new List<String>();
                foreach (clsOrderDetail item in detail)
                {
                    //先驗證資料再加入                    
                    if (count == 1)
                    {
                        if (String.IsNullOrEmpty(item.ActID))
                        {
                            strValid = "活動行程編號遺失，無法進行報名！";
                            isValid = false;
                            break;
                        }
                        actname = item.ActName; actid = item.ActID;
                    }

                    strValid = Check_Data_Valid(item.Name, item.DOB, item.SID, item.EmpID, item.Cell, "02-8226-9088", item.Email);
                    if (strValid != "OK")
                    {
                        strValid = "第 " + count.ToString() + " 列資料有錯誤：" + strValid;
                        isValid = false;
                        break;
                    }
                    if (item.SID.Substring(1, 1) == "2") { sex = "女"; }
                    dtD.Rows.Add(0, order.OrderID, actid, actname, item.Name, item.SID, item.EmpID, Convert.ToDateTime(item.DOB), sex, item.Cell,
                                 item.Email, "", false, false, false, false, 0, "", "", order.Comment);
                    list.Add(item.SID);
                    list.Add(item.EmpID);
                    listEmail.Add(item.Email);
                    //產生明細列<td>
                    //sb.Append(generate_wt_table_content(item.Name, item.DOB, item.SID, item.EmpID, item.Cell, item.Email, Convert.ToBoolean(item.IsVeg), item.TempField));
                    count += 1;
                }

                if (!isValid) { return strValid; }

                // 檢查是否有重複身分證號工號
                foreach (DataRow row in dtD.Rows)
                {
                    count = list.Count(x => x == row["SID"].ToString());
                    if (count > 1)
                    {
                        strValid = "有重覆的身分證號：" + row["SID"].ToString();
                        isValid = false;
                        break;
                    }
                    count = list.Count(x => x == row["EmpID"].ToString());
                    if (count > 1)
                    {
                        strValid = "有重覆的工號：" + row["EmpID"].ToString();
                        isValid = false;
                        break;
                    }
                }

                if (!isValid) { return strValid; }

                DBManager db = new DBManager();
                SqlCommand cmd = db.GetSPCommand("enterprise_wt_Fitness_Od_Add", null);
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

                if (result.Substring(0, 2) == "OK")
                {

                    string tempid = result.Replace("OK", "");
                    sb.Append("<div style='marging-top:12px;margin-bottom:12px;'>");
                    sb.AppendFormat("<p>您已完成減重活動線上報名程序，您的報名編號為：<b>{0}</b></p>", tempid);
                    sb.Append("<p>報名成功後，請於2/16上午10:00~17:00至8880會議室進行前測。</p>");
                    sb.Append("<p>如有任何問題請洽奧勒斯：02-29514508~9 顏小姐(Winnie) or 曹先生(Ricky)</p>");
                    sb.Append("<p>或是：文曄公司：Teri (健康管理師) 分機 8235 Vivian 分機 8584</p>");
                    sb.Append("</div>");
                    //&nbsp;&nbsp;&nbsp;&nbsp;
                    ////tempid = tempid.Substring(0,11);
                    ////total = tempid.Substring(12, tempid.Length-11);
                    ////total = tempid.Replace(tempid, "");
                    //sb.Append(generate_wt_TotalPriceInfo(tempid.Substring(11, tempid.Length - 11)));
                    //sb.Append("</table>");

                    //sb.Append(generate_wt_Info_Footer());

                    //confirmText = generate_wt_Info_Header(actname, tempid.Substring(0, 11), "initial") + sb.ToString();

                    foreach (string em in listEmail)
                    {
                        MCPUtilities.send_single_mail(em, "文曄減重活動線上報名通知", sb.ToString(), "mcpricky@gmail.com", "winnie@mcpgo.com");
                    }
                    //MCPUtilities.send_single_mail(order.Email, "MCP-海天青線上報名通知", confirmText, "lee13079@gmail.com", "");
                    ////Dim aryEmail As Array = mail.Substring(0, mail.Length - 1).Split(",")
                    //string[] toEmail, string subject, string contents, string copyto, string fromEmail                   
                    //MCPUtilities.send_multiple_mail(listEmail.ToArray(), "文曄減重活動線上報名通知", sb.ToString(), "s9340309@msn.com", "winnie@mcpgo.com");
                }

            }
            else { return "您尚未加入參加人，請先加入參加人再繼續！"; }
            dt.Dispose();
        }
        catch (Exception ex) { return "資料庫連線異常，目前無法送出報名表！" + ex.Message.ToString(); }
        return result;
    }


    /// <summary>取得文瞱減重報名資料(分頁)</summary>
    [WebMethod]
    public string load_FitnessOrder_Paging(int pageindex, int pagesize, string filterby, string filtervalue)
    {
        int totalRow = 0;
        //DataTable dt = new DataTable();
        //List<clsOrder> tempList = new List<clsOrder>();
        //clsOrderPageing newsPage = new clsOrderPageing();

        //try
        //{
        //    DBManager db = new DBManager();
        //    SqlCommand cmd = db.GetSPCommand("enterprise_all_Od_Paging", null);
        //    cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = pageindex;
        //    cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pagesize;
        //    cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = "wt123";
        //    cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = filterby;
        //    cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = filtervalue;
        //    // Get TotalRows
        //    SqlParameter retValParam = cmd.Parameters.Add("@RETURN_VALUE", SqlDbType.Int);
        //    retValParam.Direction = ParameterDirection.ReturnValue;

        //    dt = db.ExecuteDataTable(cmd);
        //    totalRow = Convert.ToInt32(retValParam.Value);

        //    if (dt.Rows.Count > 0)
        //    {
        //        foreach (DataRow row in dt.Rows)
        //        {
        //            clsOrder item = new clsOrder();
        //            item.OrderID = row["OrderID"].ToString();
        //            item.Name = row["Name"].ToString();
        //            item.Tel1 = row["Tel1"].ToString();
        //            item.Cell1 = row["Cell1"].ToString();
        //            item.Email = row["Email"].ToString();
        //            item.CreateDay = Convert.ToDateTime(row["CreateDay"]).ToString("yyyy/MM/dd");
        //            item.Comment = row["Comment"].ToString();
        //            tempList.Add(item);
        //        }
        //        dt.Dispose();
        //        newsPage.TotalRows = totalRow;
        //        newsPage.Orders = tempList;

        //    }
        //}
        //catch (Exception ex) { }
        //return actpage;
        //return new JavaScriptSerializer().Serialize(newsPage);
        return "";
    }


    //<summary>取得所有文瞱減重報名清單</summary>
    [WebMethod]
    public List<clsOrderDetail> Get_FitnessOrder_Report(string filterby, string filtervalue)
    {
        List<clsOrderDetail> tempList = new List<clsOrderDetail>();
        DataTable dt = new DataTable();
        DBManager db = new DBManager();
        try
        {
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Fitness_Od_Report", null);
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = filterby;
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = filtervalue;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsOrderDetail v = new clsOrderDetail();
                    //v.SeqNo = Convert.ToInt32(row["SeqNo"]);
                    v.OrderID = row["OrderID"].ToString();
                    v.ActID = row["ActID"].ToString();
                    v.ActName = row["ActName"].ToString();
                    v.Name = row["Name"].ToString();
                    v.SID = row["SID"].ToString();
                    v.EmpID = row["EmpID"].ToString();
                    v.DOB = Convert.ToDateTime(row["DOB"]).ToString("yyyy/MM/dd");
                    v.Cell = row["Cell"].ToString();
                    v.Sex = row["Sex"].ToString();
                    //v.Price = Convert.ToInt32(row["Price"]);
                    //v.IsVeg = Convert.ToBoolean(row["IsVeg"]);
                    v.Comment = row["Comment"].ToString();
                    v.TempField = row["Cmt"].ToString();
                    v.Email = row["Email"].ToString();
                    tempList.Add(v);
                }
            }
        }
        catch (Exception ex) { }
        finally { dt.Dispose(); }
        return tempList;
    }

}
