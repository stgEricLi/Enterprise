using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Web;
using System.Web.Script.Services;
using System.Web.Security;
using System.Web.Services;
using System.Text;
using System.Web.Script.Serialization;

/// <summary>活動服務</summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class SvAct : System.Web.Services.WebService {

    public SvAct () { }

    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string Import_Activity(clsActivity[] acts)
    {
        string result = "OK";
        
        DataTable dtD = new DataTable();       
        dtD.Columns.Add("ActID", typeof(string));
        dtD.Columns.Add("Name", typeof(string));
        //dtD.Columns.Add("StartDay", typeof(DateTime));
        //dtD.Columns.Add("RegExpDay", typeof(DateTime));
        dtD.Columns.Add("StartDay", typeof(string));
        dtD.Columns.Add("RegExpDay", typeof(string));
        dtD.Columns.Add("Capacity", typeof(int));
        dtD.Columns.Add("Price", typeof(int));
        dtD.Columns.Add("Price2", typeof(int));
        dtD.Columns.Add("Company", typeof(string));
        dtD.Columns.Add("Enable", typeof(Boolean));
        dtD.Columns.Add("FieldStr1", typeof(string));
        dtD.Columns.Add("FieldStr2", typeof(string));
        dtD.Columns.Add("FieldInt1", typeof(int));
        dtD.Columns.Add("FieldInt2", typeof(int));

        List<String> lstAid = new List<string>();
        int count = 1;

        //第一次回圈先驗證資料
        foreach (clsActivity item in acts)
        {
            if (String.IsNullOrEmpty(item.Company)) { return "第" + count + "列：請指定企業！"; }
            if (!MCPUtilities.IsDay(item.StartDay)) { return "第" + count + "列：活動日期格式錯誤！"; }
            if (!MCPUtilities.IsDay(item.RegExpDay)) { return "第" + count + "列：報名截止日期格式錯誤！"; }
            if (!MCPUtilities.IsNumeric(Convert.ToString(item.Price))) { item.Price = 5000; }
            if (!MCPUtilities.IsNumeric(Convert.ToString(item.Price2))) { item.Price2 = 5000; }
            if (!MCPUtilities.IsNumeric(Convert.ToString(item.FieldInt1))) { item.FieldInt1 = 0; }
            if (!MCPUtilities.IsNumeric(Convert.ToString(item.FieldInt2))) { item.FieldInt2 = 0; }
            if (!MCPUtilities.IsNumeric(Convert.ToString(item.Capacity))) { item.Capacity = 40; }

            if (!lstAid.Exists(x => x == item.ActID))
                lstAid.Add(item.ActID);
            else
                return "第" + count + "列：活動編碼（" + item.ActID + " ）重複！";
            count++;
        }

        
        //第二次回圈先加入資料
        foreach (clsActivity d in acts)
        {
            //dtD.Rows.Add(d.ActID, d.Name, Convert.ToDateTime(d.StartDay), Convert.ToDateTime(d.RegExpDay), d.Capacity, d.Price, d.Price2, d.Company, Convert.ToBoolean(d.Enable), d.FieldStr1, d.FieldStr2, d.FieldInt1, d.FieldInt2);
            dtD.Rows.Add(d.ActID, d.Name, d.StartDay, d.RegExpDay, d.Capacity, d.Price, d.Price2, d.Company, Convert.ToBoolean(d.Enable), d.FieldStr1, d.FieldStr2, d.FieldInt1, d.FieldInt2);
        }

        try
        {
            //string yr = Convert.ToString(Convert.ToInt32(DateTime.Now.Year) - 1911);
            //yr = acttype + yr.Substring(1, 2);
            //act.ActID = "E" + Convert.ToString(yr) + DateTime.Now.ToString("MMdd");
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Act_Import", null);
            SqlParameter tvpDetail = cmd.Parameters.AddWithValue("@ACTLIST", dtD);
            tvpDetail.SqlDbType = SqlDbType.Structured;
            tvpDetail.Direction = ParameterDirection.Input;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();           
            dtD.Dispose();           
        }
        catch (Exception ex)
        {
            result = ex.Message.ToString();
        }
        return result;
    }

    /// <summary>新增活動行程 </summary>
    /// <param name="act">clsActivity物件</param>
    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string Add_Activity(clsActivity act, string acttype) {
      string result = "OK";
      if (String.IsNullOrEmpty(act.Company) || act.Company == "none") { return "無法取得企業清單，目前無法新增活動！"; }
      if (String.IsNullOrEmpty(act.Name)) { return "請輸入活動名稱！"; }
      if (!MCPUtilities.IsDay(act.StartDay)) { return "活動日格式錯誤！"; }
      if (!MCPUtilities.IsDay(act.RegExpDay)) { return "報名終止日格式錯誤！"; }
      if (!MCPUtilities.IsNumeric(Convert.ToString(act.Price))) { return "請輸入活動價格A！"; }
      if (!MCPUtilities.IsNumeric(Convert.ToString(act.Price2))) { return "請輸入活動價格B！"; }
      if (!MCPUtilities.IsNumeric(Convert.ToString(act.FieldInt1))) { act.FieldInt1 = 0; }
      if (!MCPUtilities.IsNumeric(Convert.ToString(act.FieldInt2))) { act.FieldInt2 = 0; }
      if (!MCPUtilities.IsNumeric(Convert.ToString(act.Capacity))) { return "請輸入可容納人數！"; }

      try{
        string yr = Convert.ToString(Convert.ToInt32(DateTime.Now.Year) - 1911);
        yr = acttype + yr.Substring(1, 2);
        act.ActID = "E" + Convert.ToString(yr) + DateTime.Now.ToString("MMdd");
        DBManager db = new DBManager();
        SqlCommand cmd = db.GetSPCommand("enterprise_all_Act_Add", null);
        cmd.Parameters.Add("@preID", SqlDbType.NVarChar, 15).Value = act.ActID;
        cmd.Parameters.Add("@Name", SqlDbType.NVarChar, 50).Value = act.Name;
        cmd.Parameters.Add("@StartDay", SqlDbType.SmallDateTime).Value = act.StartDay;
        cmd.Parameters.Add("@RegExpDay", SqlDbType.SmallDateTime).Value = act.RegExpDay;
        cmd.Parameters.Add("@Capacity", SqlDbType.Int).Value = act.Capacity;
        cmd.Parameters.Add("@Price", SqlDbType.Int).Value = act.Price;
        cmd.Parameters.Add("@Price2", SqlDbType.Int).Value = act.Price2;
        cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = act.Company;
        cmd.Parameters.Add("@Enable", SqlDbType.Bit).Value = act.Enable;
        cmd.Parameters.Add("@FieldStr1", SqlDbType.NVarChar, 50).Value = act.FieldStr1;
        cmd.Parameters.Add("@FieldStr2", SqlDbType.NVarChar, 50).Value = act.FieldStr2;
        cmd.Parameters.Add("@FieldInt1", SqlDbType.Int).Value = act.FieldInt1;
        cmd.Parameters.Add("@FieldInt2", SqlDbType.Int).Value = act.FieldInt2;
        SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
        retValParam.Direction = ParameterDirection.Output;
        db.ExecuteNonQuery(cmd);
        result = retValParam.Value.ToString();
      }catch(Exception ex){
        result = ex.Message.ToString();
      }      
      return result;
    }

    /// <summary>更新活動行程 </summary>
    /// <param name="act">clsActivity物件</param>
    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string Update_Activity(clsActivity act) {
      string result = "OK";
      if (String.IsNullOrEmpty(act.Company)) { return "無法取得活動所屬企業，目前無法更新活動！"; }
      if (String.IsNullOrEmpty(act.Name)) { return "請輸入活動名稱！"; }
      if (!MCPUtilities.IsDay(act.StartDay)) { return "活動日格式錯誤！"; }
      if (!MCPUtilities.IsDay(act.RegExpDay)) { return "報名終止日格式錯誤！"; }
      if (!MCPUtilities.IsNumeric(Convert.ToString(act.Price))) { return "請輸入活動價格A！"; }
      if (!MCPUtilities.IsNumeric(Convert.ToString(act.Price2))) { return "請輸入活動價格B！"; }
      if (!MCPUtilities.IsNumeric(Convert.ToString(act.Capacity))) { return "請輸入可容納人數！"; }
      if (!MCPUtilities.IsNumeric(Convert.ToString(act.FieldInt1))) { act.FieldInt1 = 0; }
      if (!MCPUtilities.IsNumeric(Convert.ToString(act.FieldInt2))) { act.FieldInt2 = 0; }

      try {        
        DBManager db = new DBManager();
        SqlCommand cmd = db.GetSPCommand("enterprise_all_Act_Update", null);
        cmd.Parameters.Add("@ActID", SqlDbType.NVarChar, 15).Value = act.ActID;
        cmd.Parameters.Add("@Name", SqlDbType.NVarChar, 50).Value = act.Name;
        cmd.Parameters.Add("@StartDay", SqlDbType.SmallDateTime).Value = act.StartDay;
        cmd.Parameters.Add("@RegExpDay", SqlDbType.SmallDateTime).Value = act.RegExpDay;
        cmd.Parameters.Add("@Capacity", SqlDbType.Int).Value = act.Capacity;
        cmd.Parameters.Add("@Price", SqlDbType.Int).Value = act.Price;
        cmd.Parameters.Add("@Price2", SqlDbType.Int).Value = act.Price2;
        cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = act.Company;
        cmd.Parameters.Add("@Enable", SqlDbType.Bit).Value = act.Enable;
        cmd.Parameters.Add("@FieldStr1", SqlDbType.NVarChar, 50).Value = act.FieldStr1;
        cmd.Parameters.Add("@FieldStr2", SqlDbType.NVarChar, 50).Value = act.FieldStr2;
        cmd.Parameters.Add("@FieldInt1", SqlDbType.Int).Value = act.FieldInt1;
        cmd.Parameters.Add("@FieldInt2", SqlDbType.Int).Value = act.FieldInt2;
        SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
        retValParam.Direction = ParameterDirection.Output;
        db.ExecuteNonQuery(cmd);
        result = retValParam.Value.ToString();
      } catch (Exception ex) {
        result = ex.Message.ToString();
      }
      return result;
    }

    /// <summary>刪除活動行程 </summary>
    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string Delete_Activity(string actid) {
      string result = "OK";
      if (String.IsNullOrEmpty(actid)) { return "無法取得活動編號，目前無法刪除活動！"; }    
      try {
        DBManager db = new DBManager();
        SqlCommand cmd = db.GetSPCommand("enterprise_all_Act_Delete", null);
        cmd.Parameters.Add("@ActID", SqlDbType.NVarChar, 15).Value = actid;
        SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
        retValParam.Direction = ParameterDirection.Output;
        db.ExecuteNonQuery(cmd);
        result = retValParam.Value.ToString();
      } catch (Exception ex) {
        result = ex.Message.ToString();
      }
      return result;
    }

    /// <summary>取得一個企業專區活動 </summary>
    [WebMethod]
    public List<clsActivity> Get_Activity(string actid) {
      DataTable dtA = new DataTable();      
      List<clsActivity> tempList = new List<clsActivity>();
      try {
        DBManager db = new DBManager();
        SqlCommand cmd = db.GetSPCommand("enterprise_Act_Get", null);
        cmd.Parameters.Add("@ActID", SqlDbType.NVarChar, 15).Value = actid;
        dtA=db.ExecuteDataTable(cmd);
        foreach (DataRow row in dtA.Rows) {
          clsActivity act = new clsActivity();          
          act.Name = Convert.ToString(row["Name"]);
          act.StartDay = Convert.ToDateTime(row["StartDay"]).ToString("yyyy-MM-dd");
          act.RegExpDay = Convert.ToDateTime(row["RegExpDay"]).ToString("yyyy-MM-dd");
          act.Capacity = Convert.ToInt32(row["Capacity"]);
          act.Price = Convert.ToInt32(row["Price"]);
          act.Price2 = Convert.ToInt32(row["Pric2"]);
          act.Enable = Convert.ToBoolean(row["Enable"]);
          act.FieldInt1 = Convert.ToInt32(row["FieldInt1"]);
          act.FieldInt2 = Convert.ToInt32(row["FieldInt2"]);
          tempList.Add(act);
        }
        dtA.Dispose();       
      } catch (Exception ex) {
       
      }
      return tempList;
    }

    /// <summary>依照公司代號取得活動行程資料</summary>
    [WebMethod]
    public string load_Act_by_Comapny(string company)
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<clsActivity> tempList = new List<clsActivity>();
        clsActPageing actpage = new clsActPageing();
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Act_Get_By_Company", null);         
            cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = company;          
            dt = db.ExecuteDataTable(cmd);           
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
                    item.FieldInt1 = Convert.ToInt32(row["FieldInt1"]);
                    item.FieldInt2 = Convert.ToInt32(row["FieldInt2"]);
                    tempList.Add(item);
                }
                dt.Dispose();
                actpage.TotalRows = 0;
                actpage.Acts = tempList;
            }
        }
        catch (Exception ex) { }
        //return actpage;
        return new JavaScriptSerializer().Serialize(actpage);
    }

    /// <summary>取得活動行程資料(分頁優化)</summary>
    [WebMethod]
    public string load_Act(int pageindex, int pagesize, string company) {
      int totalRow = 0;
      DataTable dt = new DataTable();
      List<clsActivity> tempList = new List<clsActivity>();
      clsActPageing actpage = new clsActPageing();
      try {
        DBManager db = new DBManager();
        SqlCommand cmd = db.GetSPCommand("enterprise_all_Act_Paging", null);        
 
        cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = pageindex;
        cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pagesize;
        cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = company;
        // Get TotalRows
        SqlParameter retValParam = cmd.Parameters.Add("@RETURN_VALUE", SqlDbType.Int);
        retValParam.Direction = ParameterDirection.ReturnValue;

        dt = db.ExecuteDataTable(cmd);
        totalRow = Convert.ToInt32(retValParam.Value);

        if (dt.Rows.Count > 0) {
          foreach (DataRow row in dt.Rows) {
            clsActivity item = new clsActivity();
            item.ActID = row["ActID"].ToString();
            item.Name = row["Name"].ToString();
            item.StartDay = Convert.ToDateTime(row["StartDay"]).ToString("yyyy/MM/dd");
            item.RegExpDay = Convert.ToDateTime(row["RegExpDay"]).ToString("yyyy/MM/dd");
            item.Company = row["Company"].ToString();
            item.Capacity = Convert.ToInt32(row["Capacity"]);
            item.Price = Convert.ToInt32(row["Price"]);
            item.Price2 = Convert.ToInt32(row["Price2"]);
            item.FieldInt1 = Convert.ToInt32(row["FieldInt1"]);
            item.FieldInt2 = Convert.ToInt32(row["FieldInt2"]);
            item.Enable = Convert.ToBoolean(row["Enable"]);           
            tempList.Add(item);
          }
          dt.Dispose();
          actpage.TotalRows = totalRow;
          actpage.Acts = tempList;

        }
      } catch (Exception ex) { }
      //return actpage;
      return new JavaScriptSerializer().Serialize(actpage);
    }

    /// <summary>取得活動行程資料(分頁 Cache)</summary>
    [WebMethod(CacheDuration = 60)]
    public string load_Act_Cache(int pageindex, int pagesize, string company)
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<clsActivity> tempList = new List<clsActivity>();
        clsActPageing actpage = new clsActPageing();
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Act_Paging", null);

            cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = pageindex;
            cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pagesize;
            cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = company;
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
        }
        catch (Exception ex) { }
        //return actpage;
        return new JavaScriptSerializer().Serialize(actpage);
    }


    /// <summary>活動剩餘名額</summary>
    [WebMethod]
    public int get_Act_Capacity(string actid) {
        DataTable dt = new DataTable();
        int result = 0;
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Act_Capacity", null);
            cmd.Parameters.Add("@actid", SqlDbType.NVarChar, 12).Value = actid;
            dt = db.ExecuteDataTable(cmd);
            result = Convert.ToInt32(dt.Rows[0][0]);            
            dt.Dispose();
        }
        catch (Exception ex)
        {

        }
        return result;
    }

    // 活動所有欄位資訊
    [WebMethod]
    public string get_All_Act_Details(string filtervalue)
    {
        DataTable dt = new DataTable();        
        int rows =0;
        List<clsActivity> tempList = new List<clsActivity>();
        clsActPageing actpage = new clsActPageing();
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Act", null);
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = "ActID";
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = filtervalue;
            dt = db.ExecuteDataTable(cmd);           
            rows = dt.Rows.Count;
            if (rows > 0)
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
                    item.FieldInt1 = Convert.ToInt32(row["FieldInt1"]);
                    item.FieldInt2 = Convert.ToInt32(row["FieldInt2"]);
                    item.FieldStr1 = row["FieldStr1"].ToString();
                    item.FieldStr2 = row["FieldStr2"].ToString();
                    tempList.Add(item);
                }
            }
          dt.Dispose();
          actpage.TotalRows = rows;
          actpage.Acts = tempList;
        }
        catch (Exception ex)
        {

        }
        return new JavaScriptSerializer().Serialize(actpage);
    }

    //

    /// <summary>活動剩餘名額</summary>
    [WebMethod]
    public string get_Act_RemainingRoom(string actid)
    {
        DataTable dt = new DataTable();
        string result = "0,0";
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Act_RemainingRoom", null);
            /*
             [FieldInt1],[FieldInt2],[ActID],[Name],[StartDay],[RegExpDay],[Capacity],[Price],[Price2],[Company],[Enable] 
             */
            cmd.Parameters.Add("@actid", SqlDbType.NVarChar, 12).Value = actid;
            dt = db.ExecuteDataTable(cmd);            
            result = dt.Rows[0][0].ToString() + "," + dt.Rows[0][1].ToString(); // Room2 + "," + Room4
            dt.Dispose();
        }
        catch (Exception ex)
        {

        }
        return result;
    }
}
