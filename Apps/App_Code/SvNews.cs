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

/// <summary>
/// Summary description for SvNews
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class SvNews : System.Web.Services.WebService {

    public SvNews () {}

    /*----------------------------------------------------------------------------------------------------------------------
                                                            消息
    ---------------------------------------------------------------------------------------------------------------------- */
    /// <summary>新增消息</summary>
    /// <param name="news">clsNews物件</param>
    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string Modify_News(clsNews news, string action) {
      string result = "OK";
      if (String.IsNullOrEmpty(news.Company) || news.Company == "none") { return "無法取得企業清單，目前無法新增消息！"; }
      if (action != "Delete") {
          if (String.IsNullOrEmpty(news.Desc)) { return "請輸入消息內容！"; }
          if (!MCPUtilities.IsDay(news.NewsDate.ToString())) { return "活動日格式錯誤！"; }
      }
      
      try
      {
          DBManager db = new DBManager();
          SqlCommand cmd = db.GetSPCommand("enterprise_all_News_Update", null);
          cmd.Parameters.Add("@Id", SqlDbType.Int).Value = news.NewsID;
          cmd.Parameters.Add("@Desc", SqlDbType.NVarChar, 256).Value = news.Desc;
          cmd.Parameters.Add("@NewsDate", SqlDbType.SmallDateTime).Value = news.NewsDate;
          cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = news.Company;
          cmd.Parameters.Add("@Enable", SqlDbType.Bit).Value = news.Enable;
          cmd.Parameters.Add("@Link", SqlDbType.NVarChar).Value = news.Link;
          cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 12).Value = action;

          SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
          retValParam.Direction = ParameterDirection.Output;
          db.ExecuteNonQuery(cmd);
          result = retValParam.Value.ToString();
      }
      catch (Exception ex)
      {
          result = ex.Message.ToString();
      }
      return result;
    }
    
  
    /// <summary>取得消息資料(分頁)</summary>
    [WebMethod]
    public string load_News_Paging(int pageindex, int pagesize, string company, string stday, string endday) {
      int totalRow = 0;
      DataTable dt = new DataTable();
      List<clsNews> tempList = new List<clsNews>();
      clsNewsPageing newsPage = new clsNewsPageing();
      try {
        DBManager db = new DBManager();
        SqlCommand cmd = db.GetSPCommand("enterprise_all_News_Paging", null);
        cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = pageindex;
        cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pagesize;
        cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = company;
        cmd.Parameters.Add("@StDay", SqlDbType.SmallDateTime).Value = stday;
        cmd.Parameters.Add("@EndDay", SqlDbType.SmallDateTime).Value = endday;
        // Get TotalRows
        SqlParameter retValParam = cmd.Parameters.Add("@RETURN_VALUE", SqlDbType.Int);
        retValParam.Direction = ParameterDirection.ReturnValue;

        dt = db.ExecuteDataTable(cmd);
        totalRow = Convert.ToInt32(retValParam.Value);

        if (dt.Rows.Count > 0) {
          foreach (DataRow row in dt.Rows) {
            clsNews item = new clsNews();
            // [NewsID],[Desc],[NewsDate],[Link],[Company],[Enable] 
            item.NewsID = Convert.ToInt32(row["NewsID"]);
            item.Desc = row["Desc"].ToString();
            item.NewsDate = Convert.ToDateTime(row["NewsDate"]).ToString("yyyy/MM/dd");
            item.Link = row["Link"].ToString();            
            item.Company = row["Company"].ToString();           
            item.Enable = Convert.ToBoolean(row["Enable"]);
            tempList.Add(item);
          }
          dt.Dispose();
          newsPage.TotalRows = totalRow;
          newsPage.News = tempList;

        }
      } catch (Exception ex) { }
      //return actpage;
      return new JavaScriptSerializer().Serialize(newsPage);
    }

    
    /// <summary>取得消息資料(分頁)</summary>
    [WebMethod]
    public List<clsNews> load_News_Normal(string company, int pagesize)
    {
        DataTable dt = new DataTable();
        List<clsNews> tempList = new List<clsNews>();
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_News_Get", null);
            cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = company;
            cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pagesize;
            
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsNews item = new clsNews();
                    item.NewsID = Convert.ToInt32(row["NewsID"]);
                    item.Desc = row["Desc"].ToString();
                    item.Link = row["Link"].ToString();
                    item.Enable = Convert.ToBoolean(row["Enable"]);
                    item.NewsDate = Convert.ToDateTime(row["NewsDate"]).ToString("yyyy/MM/dd");
                    item.Company = row["Company"].ToString();
                    tempList.Add(item);
                }
                dt.Dispose();
            }
        }
        catch (Exception ex) { }
        return tempList;
    }


    /// <summary>取得消息資料(分頁)</summary>
    [WebMethod(CacheDuration = 60)]
    public string load_News_Paging_cache(int pageindex, int pagesize, string company, string stday, string endday)
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<clsNews> tempList = new List<clsNews>();
        clsNewsPageing newsPage = new clsNewsPageing();
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_News_Paging", null);
            cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = pageindex;
            cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pagesize;
            cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = company;
            cmd.Parameters.Add("@StDay", SqlDbType.SmallDateTime).Value = DateTime.Now.AddDays(-60);
            cmd.Parameters.Add("@EndDay", SqlDbType.SmallDateTime).Value = DateTime.Now.AddDays(60);
            // Get TotalRows
            SqlParameter retValParam = cmd.Parameters.Add("@RETURN_VALUE", SqlDbType.Int);
            retValParam.Direction = ParameterDirection.ReturnValue;

            dt = db.ExecuteDataTable(cmd);
            totalRow = Convert.ToInt32(retValParam.Value);

            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsNews item = new clsNews();
                    // [NewsID],[Desc],[NewsDate],[Link],[Company],[Enable] 
                    item.NewsID = Convert.ToInt32(row["NewsID"]);
                    item.Desc = row["Desc"].ToString();
                    item.NewsDate = Convert.ToDateTime(row["NewsDate"]).ToString("yyyy/MM/dd");
                    item.Link = row["Link"].ToString();
                    item.Company = row["Company"].ToString();
                    item.Enable = Convert.ToBoolean(row["Enable"]);
                    tempList.Add(item);
                }
                dt.Dispose();
                newsPage.TotalRows = totalRow;
                newsPage.News = tempList;

            }
        }
        catch (Exception ex) { }
        //return actpage;
        return new JavaScriptSerializer().Serialize(newsPage);
    }


    /*----------------------------------------------------------------------------------------------------------------------
                                                           減重目標
   ---------------------------------------------------------------------------------------------------------------------- */
    /// <summary>新增目標</summary>
    /// <param name="news">clsNews物件</param>
    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string Modify_Fitness(clsNews news, string action)
    {
        string result = "OK";
        if (action != "Delete")
        {
            if (String.IsNullOrEmpty(news.Company)) { return "沒有週期，目前無法新增目標！"; }
            if (String.IsNullOrEmpty(news.Desc)) { return "請輸入目標內容！"; }
        }
        
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Fitness_Modify", null);
            cmd.Parameters.Add("@Id", SqlDbType.Int).Value = news.NewsID;
            cmd.Parameters.Add("@Period", SqlDbType.NVarChar, 50).Value = news.Company;
            cmd.Parameters.Add("@Goal", SqlDbType.NVarChar, 256).Value = news.Desc;
            cmd.Parameters.Add("@Action", SqlDbType.NVarChar, 12).Value = action;
            SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
            retValParam.Direction = ParameterDirection.Output;
            db.ExecuteNonQuery(cmd);
            result = retValParam.Value.ToString();
        }
        catch (Exception ex)
        {
            result = ex.Message.ToString();
        }
        return result;
    }

    /// <summary>取得消息資料(分頁)</summary>
    [WebMethod]
    public string load_Fitness_Paging(int pageindex, int pagesize)
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<clsNews> tempList = new List<clsNews>();
        clsNewsPageing newsPage = new clsNewsPageing();
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Fitness_Paging", null);
            cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = pageindex;
            cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pagesize;            
            // Get TotalRows
            SqlParameter retValParam = cmd.Parameters.Add("@RETURN_VALUE", SqlDbType.Int);
            retValParam.Direction = ParameterDirection.ReturnValue;
            dt = db.ExecuteDataTable(cmd);
            totalRow = Convert.ToInt32(retValParam.Value);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsNews item = new clsNews();
                    // [ID],[Period],[Goal]
                    item.NewsID = Convert.ToInt32(row["ID"]);
                    item.Desc = row["Goal"].ToString();                  
                    item.Company = row["Period"].ToString();
                    tempList.Add(item);
                }
                dt.Dispose();
                newsPage.TotalRows = totalRow;
                newsPage.News = tempList;

            }
        }
        catch (Exception ex) { }
        //return actpage;
        return new JavaScriptSerializer().Serialize(newsPage);
    }

  
    [WebMethod(CacheDuration =60)]
    public string load_Fitness_Cache()
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<clsNews> tempList = new List<clsNews>();
        clsNewsPageing newsPage = new clsNewsPageing();
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Fitness_Paging", null);
            cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = 1;
            cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = 60;
            // Get TotalRows
            SqlParameter retValParam = cmd.Parameters.Add("@RETURN_VALUE", SqlDbType.Int);
            retValParam.Direction = ParameterDirection.ReturnValue;
            dt = db.ExecuteDataTable(cmd);
            totalRow = Convert.ToInt32(retValParam.Value);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsNews item = new clsNews();
                    item.NewsID = Convert.ToInt32(row["ID"]);
                    item.Desc = row["Goal"].ToString();
                    item.Company = row["Period"].ToString();
                    tempList.Add(item);
                }
                dt.Dispose();
                newsPage.TotalRows = totalRow;
                newsPage.News = tempList;
            }
        }
        catch (Exception ex) { }
        return new JavaScriptSerializer().Serialize(newsPage);
    }
}
