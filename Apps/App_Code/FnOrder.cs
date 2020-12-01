using System;
using System.Collections.Generic;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;

/// <summary>訂單功能 </summary>
public class FnOrder
{

  public FnOrder() { }

  
  //********************************** 文瞱科技 **********************************************

  //-------------------------------------------------------------------------------------------
  //                                  報名清單主表
  //-----------------------------------------------------------------------------------------
  
  /// <summary>取得訂單資料(分頁優化) </summary>
  /// <param name="maximumRows">每頁最大頁數</param>
  /// <param name="startRowIndex">起始頁數</param>
  /// <param name="WhereSyntax">查詢條件</param>
  /// <returns>DataTable</returns>
  public static DataTable sp_Get_Order_WithPaging(int maximumRows, int startRowIndex, string WhereSyntax)
  {
    DataTable dtOdPg = new DataTable();
    DBManager db = new DBManager();
    try
    {
      SqlCommand cmd = db.GetSPCommand("enterprise_Order_wtPaging", null);
      cmd.Parameters.Add("@whereSyntax", SqlDbType.NVarChar, 150).Value = WhereSyntax;
      cmd.Parameters.Add("@startRowIndex", SqlDbType.Int).Value = startRowIndex;
      cmd.Parameters.Add("@maximumRows", SqlDbType.Int).Value = maximumRows;
      dtOdPg = db.ExecuteDataTable(cmd);
    }
    catch (Exception ex) { }
    return dtOdPg;
  }

  /// <summary> 取得訂單資料總筆數（分頁優化） </summary>
  /// <param name="maximumRows">每頁最大頁數</param>
  /// <param name="startRowIndex">起始頁數</param>
  /// <param name="WhereSyntax">查詢條件</param>
  /// <returns>回傳查詢結果的總筆數</returns>
  public static int sp_Get_Order_RowNumber(int maximumRows, int startRowIndex, string WhereSyntax)
  {
    DBManager db = new DBManager();
    int totalRows = 0;
    try{
      SqlCommand cmd = db.GetSPCommand("enterprise_Order_wtRowTotal", null);
      cmd.Parameters.Add("@whereSyntax", SqlDbType.NVarChar, 150).Value = WhereSyntax;
      totalRows = db.ExecuteScalar<int>(cmd);
    }
    catch (Exception ex) { totalRows = 0; }
    return totalRows;
  }
  
  /// <summary> 取得文瞱活動報名狀況 </summary>
  /// <returns></returns>
  public static DataTable sp_Get_WtOrderStatus(){
    DataTable dts = new DataTable();
    DBManager db = new DBManager();
    try {
      /*
           ActID	   ActName	       StartDay	       Count
       ------------ --------- ------------------   -------
        E1040707001	梅花湖溯溪	 2015-09-01 00:00:00	    2
        E1040702001	宜蘭泛舟B	 2015-10-01 00:00:00	   10
       */
      SqlCommand cmd = db.GetSPCommand("enterprise_Act_Wt_OrderStatus", null);
      cmd.Parameters.Add("@cmp", SqlDbType.NVarChar, 256).Value = "wt";
      dts = db.ExecuteDataTable(cmd);
    } catch (Exception ex) { }
    return dts;
  }

  /// <summary> 取得文瞱活動報名狀況 </summary>
  /// <returns></returns>
  public static DataTable sp_Get_WtCampingStatus() {
    DataTable dts = new DataTable();
    DBManager db = new DBManager();
    try {
      /*
           ActID	   ActName	       StartDay	       Count
       ------------ --------- ------------------   -------
        E1040707001	梅花湖溯溪	 2015-09-01 00:00:00	    2
        E1040702001	宜蘭泛舟B	 2015-10-01 00:00:00	   10
       */
      SqlCommand cmd = db.GetSPCommand("enterprise_Act_Wt_OrderStatus", null);
      cmd.Parameters.Add("@cmp", SqlDbType.NVarChar, 256).Value = "wt";
      dts = db.ExecuteDataTable(cmd);
    } catch (Exception ex) { }
    return dts;
  }

  /// <summary> 依照活動編號匯出文瞱企業報名明細表資料 </summary>
  public static DataTable sp_Export_Order(string actid) {
    DataTable dt = new DataTable();
    DBManager db = new DBManager();
    try {    
      SqlCommand cmd = db.GetSPCommand("enterprise_Order_wtExport", null);
      cmd.Parameters.Add("@ActID", SqlDbType.NVarChar, 15).Value = actid;
      cmd.Parameters.Add("@OrderID", SqlDbType.NVarChar, 15).Value ="" ;
      cmd.Parameters.Add("@method", SqlDbType.NVarChar, 15).Value = "export";
      dt = db.ExecuteDataTable(cmd);
    } catch (Exception ex) { }
    return dt;
  }
}