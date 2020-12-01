using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using System.IO;

/// <summary>網站系統控制類別</summary>
public class FnSystem
{
  /// <summary> 取得帳號資料預存程序 </summary>
  /// <param name="UserName">使用者帳號</param>
  /// <param name="startRowIndex">起始頁數</param>
  /// <param name="maximumRows">每頁資料筆數</param>
  /// <returns>資料筆數（整數）</returns>
  public static DataTable sp_Get_Users(string UserName, int startRowIndex, int maximumRows) {
    DataTable dt = new DataTable();
    DBManager dbmg = new DBManager();
    SqlCommand cmd = dbmg.GetSPCommand("aspnet_Membership_FindUsersByName", null);
    int pageindex = 0;
    if (startRowIndex > 0) { pageindex = (startRowIndex / maximumRows); }
    if (startRowIndex <= 0) { pageindex = 0; }

    //SET @PageLowerBound = @PageSize * @PageIndex
    //SET @PageUpperBound = @PageSize - 1 + @PageLowerBound
    //p.IndexId >= @PageLowerBound AND p.IndexId <= @PageUpperBound
    try {
      cmd.Parameters.Add("@ApplicationName", SqlDbType.NVarChar, 256).Value = "others";
      cmd.Parameters.Add("@UserNameToMatch", SqlDbType.NVarChar, 256).Value = UserName;
      cmd.Parameters.Add("@PageIndex", SqlDbType.Int).Value = pageindex;
      cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = maximumRows;
      dt = dbmg.ExecuteDataTable(cmd);
    } catch (Exception ex) { }
    return dt;
  }

  /// <summary> 取得帳號資料筆數預存程序 </summary>
  /// <param name="UserName">使用者帳號</param>
  /// <param name="startRowIndex">起始頁數</param>
  /// <param name="maximumRows">每頁資料筆數</param>
  /// <returns>資料筆數（整數）</returns>
  public static int sp_Get_Users_Rows(string UserName, int startRowIndex, int maximumRows) {
    int rows = 0;
    DBManager dbmg = new DBManager();
    SqlCommand cmd = dbmg.GetSPCommand("aspnet_Membership_FindUsersByName", null);
    try {
      cmd.Parameters.Add("@ApplicationName", SqlDbType.NVarChar, 256).Value = "others";
      cmd.Parameters.Add("@UserNameToMatch", SqlDbType.NVarChar, 256).Value = UserName ;
      cmd.Parameters.Add("@PageIndex", SqlDbType.Int).Value = startRowIndex;
      cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = maximumRows;
      SqlParameter retValParam = cmd.Parameters.Add("@TotalRecords", SqlDbType.Int);
      retValParam.Direction = ParameterDirection.ReturnValue;
      dbmg.ExecuteNonQuery(cmd);
      rows = Convert.ToInt32(retValParam.Value);
    } catch (Exception ex) { }
    return rows;
  }

  /// <summary> 取得所有群組</summary>
  /// <returns>DataTable</returns>
  public static DataTable Get_AllRoles() {
    DataTable dt = new DataTable();
    DBManager dbmg = new DBManager();
    SqlCommand cmd = dbmg.GetSQLCommand("SELECT [RoleId],[RoleName]  FROM [aspnet_Roles]", null);
    try { dt = dbmg.ExecuteDataTable(cmd); } catch (Exception ex) { }
    return dt;
  }



}