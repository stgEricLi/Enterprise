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
/// Summary description for SvAlbum
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class SvAlbum : System.Web.Services.WebService {

    public SvAlbum () {        }

    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string Modify_Album(clsAlbum album, string action)
    {
        string result = "OK";
        if (action != "Delete") {
          if (String.IsNullOrEmpty(album.Company) || album.Company == "none") { return "無法取得企業清單，目前無法新增相簿！"; }
          if (String.IsNullOrEmpty(album.Title)) { return "請輸入相簿標題！"; }
          if (!MCPUtilities.IsDay(album.AlbumDate.ToString())) { return "相簿日期格式錯誤"; }
          //if (!MCPUtilities.IsUrl(album.TargetLink)) { return "相簿對外連結網址錯誤"; }
          //if (!MCPUtilities.IsUrl(album.ImgUrl)) { return "相簿封面來源網址錯誤"; }
        }
        
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Album_Modify", null);
            cmd.Parameters.Add("@Id", SqlDbType.Int).Value = album.ID;
            cmd.Parameters.Add("@Title", SqlDbType.NVarChar, 250).Value = album.Title;
            cmd.Parameters.Add("@AlbumDate", SqlDbType.SmallDateTime).Value = album.AlbumDate.ToString();
            cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = album.Company;
            cmd.Parameters.Add("@TargetLink", SqlDbType.NVarChar).Value = album.TargetLink;            
            cmd.Parameters.Add("@ImgUrl", SqlDbType.NVarChar).Value = album.ImgUrl;
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
    public string load_Album_Paging(int pageindex, int pagesize, string company) {
      int totalRow = 0;
      DataTable dt = new DataTable();
      List<clsAlbum> tempList = new List<clsAlbum>();
      clsAlbumPageing newsPage = new clsAlbumPageing();
      try {
        DBManager db = new DBManager();
        SqlCommand cmd = db.GetSPCommand("enterprise_all_Album_Paging", null);
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
            clsAlbum item = new clsAlbum();
            item.ID = Convert.ToInt32(row["ID"]);
            item.Title = row["Title"].ToString();
            item.TargetLink = row["TargetLink"].ToString();
            item.ImgUrl = row["ImgUrl"].ToString();
            item.AlbumDate = Convert.ToDateTime(row["AlbumDate"]).ToString("yyyy/MM/dd");
            item.Company = row["Company"].ToString();
            tempList.Add(item);
          }
          dt.Dispose();
          newsPage.TotalRows = totalRow;
          newsPage.Albums = tempList;
        }
      } catch (Exception ex) { }
      return new JavaScriptSerializer().Serialize(newsPage);
    }


    /// <summary>取得消息資料(分頁Cache)</summary>
    [WebMethod(CacheDuration = 60)]
    public string load_Album_Paging_Cache(int pageindex, int pagesize, string company)
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<clsAlbum> tempList = new List<clsAlbum>();
        clsAlbumPageing newsPage = new clsAlbumPageing();
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_all_Album_Paging", null);
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
                    clsAlbum item = new clsAlbum();
                    item.ID = Convert.ToInt32(row["ID"]);
                    item.Title = row["Title"].ToString();
                    item.TargetLink = row["TargetLink"].ToString();
                    item.ImgUrl = row["ImgUrl"].ToString();
                    item.AlbumDate = Convert.ToDateTime(row["AlbumDate"]).ToString("yyyy/MM/dd");
                    item.Company = row["Company"].ToString();
                    tempList.Add(item);
                }
                dt.Dispose();
                newsPage.TotalRows = totalRow;
                newsPage.Albums = tempList;
            }
        }
        catch (Exception ex) { }
        return new JavaScriptSerializer().Serialize(newsPage);
    }


    [WebMethod]
    public string get_wt_Album(string filterBy, string filterVal)
    {
        int totalRow = 0;
        DataTable dt = new DataTable();
        List<clsAlbum> tempList = new List<clsAlbum>();        
        try
        {
            DBManager db = new DBManager();
            SqlCommand cmd = db.GetSPCommand("enterprise_wt_Album_Get", null);
            cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = filterBy;
            cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = filterVal;
            dt = db.ExecuteDataTable(cmd);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    clsAlbum item = new clsAlbum();
                    item.ID = Convert.ToInt32(row["ID"]);
                    item.Title = row["Desc"].ToString();
                    item.ImgUrl = row["Thumb"].ToString();
                    item.TargetLink = row["Link"].ToString();                    
                    item.AlbumDate = Convert.ToDateTime(row["Date"]).ToString("yyyy/MM/dd");
                    item.Company = "";
                    tempList.Add(item);
                }
                dt.Dispose();                
            }
        }
        catch (Exception ex) { }
        return new JavaScriptSerializer().Serialize(tempList);
    }
}
