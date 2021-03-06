﻿using System;
using System.Collections.Generic;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;
/// <summary>
/// Summary description for FnMember
/// </summary>
public class FnMember
{
 
	public FnMember(){}

  /// <summary> 取得帳號資料預存程序 </summary>
    /// <param name="UserName">使用者帳號</param>
    /// <param name="startRowIndex">起始頁數</param>
    /// <param name="maximumRows">每頁資料筆數</param>
    /// <returns>資料筆數（整數）</returns>
  public static DataTable sp_Get_Account(string UserName, int startRowIndex, int maximumRows)
    {
      DataTable dt = new DataTable();
      DBManager dbmg = new DBManager();
      SqlCommand cmd = dbmg.GetSPCommand("enterprise_User_Get", null);
      int pageindex = 0;
      if (startRowIndex > 0) { pageindex = (startRowIndex / maximumRows); }
      if (startRowIndex <= 0) { pageindex = 0; }     
      if (String.IsNullOrEmpty(UserName)) { UserName = ""; } 
      try{
        cmd.Parameters.Add("@UserName", SqlDbType.NVarChar, 50).Value = UserName;
        cmd.Parameters.Add("@startRowIndex", SqlDbType.Int).Value = pageindex;
        cmd.Parameters.Add("@maximumRows", SqlDbType.Int).Value = maximumRows; 
        dt = dbmg.ExecuteDataTable(cmd);       
      } catch (Exception ex) { }
        return dt;
    }

  /// <summary> 取得帳號資料筆數預存程序 </summary>
    /// <param name="UserName">使用者帳號</param>
    /// <param name="startRowIndex">起始頁數</param>
    /// <param name="maximumRows">每頁資料筆數</param>
    /// <returns>資料筆數（整數）</returns>  
  public static int sp_Get_Account_Rows(string UserName, int startRowIndex, int maximumRows)
    {
      int rows = 0;
      DBManager dbmg = new DBManager();
      SqlCommand cmd = dbmg.GetSPCommand("enterprise_User_Get", null);
      if (String.IsNullOrEmpty(UserName)) { UserName = ""; } 
      try{
        cmd.Parameters.Add("@UserName", SqlDbType.NVarChar, 50).Value = UserName;
        cmd.Parameters.Add("@startRowIndex", SqlDbType.Int).Value = startRowIndex;
        cmd.Parameters.Add("@maximumRows", SqlDbType.Int).Value = maximumRows;
        SqlParameter retValParam = cmd.Parameters.Add("@TotalRecords", SqlDbType.Int);
        retValParam.Direction = ParameterDirection.ReturnValue;
        dbmg.ExecuteNonQuery(cmd);
        rows = Convert.ToInt32(retValParam.Value);
      }catch (Exception ex) { }
      return rows;
    }
    
    /// <summary>取得企業帳號清單</summary>
    /// <returns></returns>
 public static DataTable sp_Get_Account_List(){
    DataTable dtPf = new DataTable();
    DBManager db = new DBManager();
    try {
      SqlCommand cmd = db.GetSPCommand("enterprise_User_List", null);
      dtPf = db.ExecuteDataTable(cmd);      
    } catch (Exception ex) { } 
    return dtPf;
 }




}