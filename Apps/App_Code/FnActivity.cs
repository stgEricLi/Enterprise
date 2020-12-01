using System;
using System.Collections.Generic;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;

/// <summary>活動行程類別</summary>
public class FnActivity
{

  /*****************************************************************************************************************/
  //                                                活動主要資料
  /*****************************************************************************************************************/
  /// <summary> 取得活動行程資料(分頁優化) </summary>
  /// <param name="maximumRows">每頁最大頁數</param>
  /// <param name="startRowIndex">起始頁數</param>
  /// <param name="WhereSyntax">查詢條件</param>
  /// <param name="OrderBySyntax">排序條件</param>
  /// <returns>DataTable</returns>
  public static DataTable sp_Get_Activity_WithPaging(int maximumRows, int startRowIndex, string WhereSyntax)
  {
    DataTable dtActPg = new DataTable();
    DBManager db = new DBManager();
    try
    {
      SqlCommand cmd = db.GetSPCommand("enterprise_Act_Paging", null);
      cmd.Parameters.Add("@whereSyntax", SqlDbType.NVarChar, 150).Value = WhereSyntax;
      cmd.Parameters.Add("@startRowIndex", SqlDbType.Int).Value = startRowIndex;
      cmd.Parameters.Add("@maximumRows", SqlDbType.Int).Value = maximumRows;
      dtActPg = db.ExecuteDataTable(cmd);
    }
    catch (Exception ex) { }
    return dtActPg;
  }

  /// <summary> 取得活動行程資料總筆數（分頁優化） </summary>
  /// <param name="maximumRows">每頁最大頁數</param>
  /// <param name="startRowIndex">起始頁數</param>
  /// <param name="WhereSyntax">查詢條件</param>
  /// <param name="OrderBySyntax">排序條件</param>
  /// <returns>回傳查詢結果的總筆數</returns>
  public static int sp_Get_Activity_RowNumber(int maximumRows, int startRowIndex, string WhereSyntax)
  {
    DBManager db = new DBManager();
    int totalRows = 0;
    try
    {
      SqlCommand cmd = db.GetSPCommand("enterprise_Act_RowTotal", null);
      cmd.Parameters.Add("@whereSyntax", SqlDbType.NVarChar, 150).Value = WhereSyntax;
      totalRows = db.ExecuteScalar<int>(cmd);
    }
    catch (Exception ex) { totalRows = 0; }
    return totalRows;
  }

  /// <summary>取得一個企業專區活動</summary>
  /// <param name="actid"></param>
  /// <returns></returns>
  public static DataTable Get_Act_By(string filedName, string searchVal, string company)
  {
      DataTable dtA = new DataTable();
      try
      {
          DBManager db = new DBManager();
          SqlCommand cmd = db.GetSPCommand("enterprise_all_Act_Get", null);
          cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = company;
          cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = filedName;
          cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = searchVal;
          dtA = db.ExecuteDataTable(cmd);
      }
      catch (Exception ex) { }
      return dtA;
  }

  /// <summary>取得一個企業專區活動</summary>
  /// <param name="actid"></param>
  /// <returns></returns>
  public static DataTable Get_Activity(string actid) {
    DataTable dtA = new DataTable();    
    try {
      DBManager db = new DBManager();
      SqlCommand cmd = db.GetSPCommand("enterprise_Act_Get", null);
      cmd.Parameters.Add("@ActID", SqlDbType.NVarChar, 15).Value = actid;
      dtA = db.ExecuteDataTable(cmd);
    } catch (Exception ex) {}
    return dtA;
  }

  /// <summary>取得一個企業專區活動</summary>
  /// <param name="actid"></param>
  /// <returns></returns>
  public static DataTable Get_Activity_withRoom(string actid)
  {
      DataTable dtA = new DataTable();
      try
      {
          DBManager db = new DBManager();
          SqlCommand cmd = db.GetSPCommand("enterprise_all_Act_RemainingRoom", null);
          cmd.Parameters.Add("@actid", SqlDbType.NVarChar, 12).Value = actid;
          dtA = db.ExecuteDataTable(cmd);
      }
      catch (Exception ex) { }
      return dtA;
  }


  /// <summary>取得一個企業專區活動</summary>
  public static DataTable Get_Activity_Info(string company, string filterBY, string filtervalue)
  {
      DataTable dtA = new DataTable();
      try
      {
          DBManager db = new DBManager();
          SqlCommand cmd = db.GetSPCommand("enterprise_all_Act_Get", null);
          cmd.Parameters.Add("@Company", SqlDbType.NVarChar, 50).Value = company;
          cmd.Parameters.Add("@FilterBy", SqlDbType.NVarChar, 25).Value = filterBY;
          cmd.Parameters.Add("@Filter", SqlDbType.NVarChar, 50).Value = filtervalue;
          dtA = db.ExecuteDataTable(cmd);
      }
      catch (Exception ex) { }
      return dtA;
  }

  /// <summary>依照企業帳號取得該企業所有活動</summary>
  /// <param name="actid"></param>
  /// <returns></returns>
  public static DataTable Get_Activity_ByCompany(string account) {
    DataTable dtA = new DataTable();
    try {
      DBManager db = new DBManager();
      SqlCommand cmd = db.GetSPCommand("enterprise_Act_Get_ByCompany", null);
      cmd.Parameters.Add("@cmp", SqlDbType.NVarChar, 256).Value = account;
      dtA = db.ExecuteDataTable(cmd);
    } catch (Exception ex) { }
    return dtA;
  }
}