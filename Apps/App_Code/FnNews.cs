using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

public class FnNews
{
	public FnNews(){}

  /// <summary> 取得消息資料 (分頁優化) </summary>
  public static DataTable Get_News_Paging(int maximumRows, int startRowIndex, string Startday, string Endday, string Company) {
    DataTable dtItinerary = new DataTable();
    DBManager db = new DBManager();
    SqlCommand cmd = db.GetSPCommand("Enterprise_News_Get_Paging", null);
    try {
      cmd.Parameters.Add("@Startday", SqlDbType.SmallDateTime).Value = Convert.ToDateTime(Startday).ToString("yyyy-MM-dd");
      cmd.Parameters.Add("@Endday", SqlDbType.SmallDateTime).Value = Convert.ToDateTime(Endday).ToString("yyyy-MM-dd");
      cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = Company;
      cmd.Parameters.Add("@startRowIndex", SqlDbType.Int).Value = startRowIndex;
      cmd.Parameters.Add("@maximumRows", SqlDbType.Int).Value = maximumRows;
      dtItinerary = db.ExecuteDataTable(cmd);
    } catch (Exception ex) { }
    return dtItinerary;
  }

  /// <summary> 取得消息資料筆數(分頁優化) </summary>
  public static int Get_News_RowTotal(int maximumRows, int startRowIndex, string Startday, string Endday, string Company)
  {
    DBManager db = new DBManager();
    SqlCommand cmd = db.GetSPCommand("Enterprise_News_Get_RowTotal", null);
    cmd.Parameters.Add("@Startday", SqlDbType.SmallDateTime).Value = Convert.ToDateTime(Startday).ToString("yyyy-MM-dd");
    cmd.Parameters.Add("@Endday", SqlDbType.SmallDateTime).Value = Convert.ToDateTime(Endday).ToString("yyyy-MM-dd");
    cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = Company;
    int total = 0;
    try {     
      total = db.ExecuteScalar<int>(cmd);
    } catch (Exception ex) { }
    return total;
  }

  /// <summary> 取得目標資料 (分頁優化) </summary>
  public static DataTable Get_Fitness_Paging(int maximumRows, int startRowIndex)
  {
      DataTable dtItinerary = new DataTable();
      DBManager db = new DBManager();
      SqlCommand cmd = db.GetSPCommand("Enterprise_wt_Fitness_Paging", null);
      try
      {          
          cmd.Parameters.Add("@startRowIndex", SqlDbType.Int).Value = startRowIndex;
          cmd.Parameters.Add("@maximumRows", SqlDbType.Int).Value = maximumRows;
          dtItinerary = db.ExecuteDataTable(cmd);
      }
      catch (Exception ex) { }
      return dtItinerary;
  }

  /// <summary> 取得消息資料筆數(分頁優化) </summary>
  public static int Get_Fitness_RowTotal(int maximumRows, int startRowIndex)
  {
    DBManager db = new DBManager();
    SqlCommand cmd = db.GetSPCommand("Enterprise_wt_Fitness_RowTotal", null);  
    int total = 0;
    try {     
      total = db.ExecuteScalar<int>(cmd);
    } catch (Exception ex) { }
    return total;
  }

    


}