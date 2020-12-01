using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;
using System.Collections;

/// <summary>
/// Summary description for DBManager
/// </summary>
public class DBManager
{
    private string _ConnectString;
    private SqlConnection _sqlConn;
    private SqlTransaction _SqlTrans;
	
    /// <summary>建構子 開啟連線</summary>
    public DBManager()
	{
    _ConnectString = ConfigurationManager.ConnectionStrings["OLSDBConnectionString"].ConnectionString;
       _sqlConn = new SqlConnection(_ConnectString);
	}

    public string ConnectionString
    {
        get { return _ConnectString; }
        set { _ConnectString = value; }
    }

    public SqlTransaction Tran {
        get { return _SqlTrans; }
        set { _SqlTrans = value; }
    }

    /// <summary>開啟資料庫交易</summary>
    public void BeginTrans(SqlConnection DBConnection)
    {
        if (DBConnection == null)
        {
            if (_sqlConn.State != ConnectionState.Open)
                _sqlConn.Open();
            DBConnection = _sqlConn;
        }
        _SqlTrans = DBConnection.BeginTransaction();
    }

    /// <summary>資料庫交易成功做 Commit 動作</summary>
    public void Commit(){
        _SqlTrans.Commit();
        if (_sqlConn.State == ConnectionState.Open) { _sqlConn.Close(); }
    }

    public void RollBack() {
        _SqlTrans.Rollback();
        if (_sqlConn.State == ConnectionState.Open) { _sqlConn.Close(); }           
    }

    /// <summary> 取得一個 SqlCommand 物件 </summary>
    public SqlCommand GetSQLCommand(string Commandtxt, SqlConnection DBConnection) {
        SqlCommand cmd = null;
        try
        {
            if (DBConnection == null)
            {
                if (_sqlConn.State != ConnectionState.Open)
                    _sqlConn.Open();
                // Open Database Connection
                DBConnection = _sqlConn;
            }
                        
            if (_SqlTrans == null)
            {
                cmd = new SqlCommand(Commandtxt, DBConnection);
            }
            else
            {
                cmd = new SqlCommand(Commandtxt, DBConnection, _SqlTrans);
            }
        }
        catch (Exception ex)
        {
            _sqlConn.Close(); // If any error occurs, close database connection
            
        }
        return cmd;
    }

    /// <summary> 取得一個 StoreProcude SqlCommand 物件 </summary>
    public SqlCommand GetSPCommand(string ProduceName, SqlConnection DBConnection )
    {
        SqlCommand cmd = null;
        try
        {
            if (DBConnection == null)
            {
                if (_sqlConn.State != ConnectionState.Open)
                    _sqlConn.Open();
                // Open Database Connection
                DBConnection = _sqlConn;
            }
           
            if (_SqlTrans == null){
                cmd = new SqlCommand(ProduceName, DBConnection);
                cmd.CommandType = CommandType.StoredProcedure;
            }else{
                cmd = new SqlCommand(ProduceName, DBConnection, _SqlTrans);
                cmd.CommandType = CommandType.StoredProcedure;
            }
        }
        catch (Exception ex){
            _sqlConn.Close();
        }
        return cmd;
    }


    #region " Execute SQL Command "

    /// <summary> 取得單一值 </summary>
    public T ExecuteScalar<T>(SqlCommand cmd){
        T result = default(T);
        try{
            result = (T)cmd.ExecuteScalar();
        }catch (SqlException oledbErr){        
        }
        catch (Exception ex)
        {
        }
        finally
        {
            if (_SqlTrans == null){
              if (_sqlConn.State == ConnectionState.Open) { _sqlConn.Close(); }      
            }
        }
        return result;
    }

    /// <summary> 執行 Insert, Update, Delete 時使用 </summary>
    public int ExecuteNonQuery(SqlCommand cmd)
    {
        int AffectedRow = -1;
        try{
            AffectedRow = cmd.ExecuteNonQuery();
        }
        catch (SqlException oledbErr){
            AffectedRow = -1;
        }
        catch (Exception ex){
            AffectedRow = -1;
        }
        finally{
            if (_SqlTrans == null){
                if (_sqlConn.State == ConnectionState.Open) { _sqlConn.Close(); }
            }
        }
        return AffectedRow;
    }

    /// <summary> 資料庫查詢返回 DataTable </summary>
    public DataTable ExecuteDataTable(SqlCommand cmd)
    {
      //----------------- 使用 ADO.NET Adapter 方法 -----------------
      //SqlDataAdapter adpater = null;
      //DataTable dt = new DataTable();
      //try
      //{
      //  adpater = new SqlDataAdapter(cmd);
      //  adpater.Fill(dt);
      //}
      //catch (SqlException oledbErr) { }
      //catch (Exception ex) { }
      //finally
      //{
      //  if (_SqlTrans == null)
      //  {
      //    if (_sqlConn.State == ConnectionState.Open) { _sqlConn.Close(); }
      //  }
      //}

      //----------------- 使用 ADO.NET2.0 DataReader + DataTable Load() 方法 -----------------
      //SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
      //DataTable dt = new DataTable();      
      //try {
      //  dt.Load(dr);
      //}
      //catch (SqlException oledbErr) { }
      //catch (Exception ex) { }
      //finally
      //{
      //  if (_SqlTrans == null){
      //    if (_sqlConn.State == ConnectionState.Open) { _sqlConn.Close(); }
      //  }
      //}

      //----------------- 使用 ADO.NET DataReader + DataTable Schema 方法 -----------------
      //SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
      SqlDataReader dr = cmd.ExecuteReader();
      DataTable dtSchema = dr.GetSchemaTable();
      DataTable dt = new DataTable();
      List<DataColumn> listCols = new List<DataColumn>(); // You can also use an ArrayList instead of List<>     
      try
      {
        if (dtSchema != null)
        {
          foreach (DataRow drow in dtSchema.Rows)
          {
            string columnName = System.Convert.ToString(drow["ColumnName"]);
            DataColumn column = new DataColumn(columnName, (Type)(drow["DataType"]));
            column.Unique = (bool)drow["IsUnique"];
            column.AllowDBNull = (bool)drow["AllowDBNull"];
            column.AutoIncrement = (bool)drow["IsAutoIncrement"];
            listCols.Add(column);
            dt.Columns.Add(column);
          }
        }

        // Read rows from DataReader and populate the DataTable
        while (dr.Read())
        {
          DataRow dataRow = dt.NewRow();
          for (int i = 0; i < listCols.Count; i++)
          {
            dataRow[((DataColumn)listCols[i])] = dr[i];
          }
          dt.Rows.Add(dataRow);
        }
      }
      catch (SqlException sqlerror) { }
      catch (Exception ex) { }
      finally
      {
        if (_SqlTrans == null)
        {
          if (_sqlConn.State == ConnectionState.Open) { _sqlConn.Close(); }
        }
        else { dr.Close(); }
      }
      return dt;
    }


    public DataSet ExecuteDataSet(SqlCommand cmd) {
      DataSet ds = new DataSet();
      
      //DBConnection db = new DBConnection();
      //SqlConnection conn = db.getConnection();
      //cmd.Connection = conn;
      try {
        SqlDataAdapter adapter = new SqlDataAdapter(cmd);
        //conn.Open();

        //fill dataset with results
        
        adapter.Fill(ds);
      } catch (SqlException ex) {        
      } catch (Exception ex) {       
      } finally {
        if (_SqlTrans == null) {
          if (_sqlConn.State == ConnectionState.Open) { _sqlConn.Close(); }
        }
      }
      return ds;
    }

    /// <summary> 資料庫查詢返回單一筆資料於 array中 </summary>
    public string[] ExecuteArray(SqlCommand cmd)
    {
      List<string> list = new List<string>();
      int columnNo = 0;      
        SqlDataReader rd = null;
        rd = cmd.ExecuteReader(CommandBehavior.SingleRow);
        columnNo = rd.FieldCount;
      try {
          while (rd.Read()){
            for (int i = 0; i < columnNo; i++){
              switch (rd.GetValue(i).GetType().ToString())
              {
                case "System.DateTime":
                  list.Add(rd.GetDateTime(i).ToString("yyyy/MM/dd hh:mm"));
                  break;
                case "System.Int16":
                  list.Add(rd.GetInt16(i).ToString());
                  break;
                case "System.Int32":
                  list.Add(rd.GetInt32(i).ToString());
                  break;
                  case "System.Double":
                  list.Add(rd.GetDouble(i).ToString());
                  break;
                  case "System.Decimal":
                  list.Add(rd.GetDecimal(i).ToString());
                  break;
                  case "System.Boolean":
                  list.Add(rd.GetBoolean(i).ToString());
                  break;
                  case "System.DBNull":
                  list.Add("");
                  break;                  
                default:
                  list.Add(rd.GetString(i));
                  break;
              }
            }
          }
      }
      catch (SqlException oledbErr) { }
      catch (Exception ex) { }
      finally
      {
          if (_SqlTrans == null)
          {
              if (_sqlConn.State == ConnectionState.Open) { _sqlConn.Close(); }
          }
          rd.Close();
      }    
      return list.ToArray();
    }

    /// <summary> 資料庫查詢返回單一筆資料於 List 中 </summary>
    public List<String> ExecuteList(SqlCommand cmd)
    {
        SqlDataReader rd = null;
        Object[] myAry;
        List<String> al = new List<String>();
        
        try {
            rd = cmd.ExecuteReader(CommandBehavior.SingleRow);
            myAry = new Object[rd.FieldCount];
            while (rd.Read())
            {               
                rd.GetValues(myAry);                
            }

            foreach (Object item in myAry)
            {
                al.Add(Convert.ToString(item));
            }

        }
        catch (SqlException oledbErr) { }
        catch (Exception ex) { }
        finally
        {
            if (_SqlTrans == null)
            {
                if (_sqlConn.State == ConnectionState.Open) { _sqlConn.Close(); }
            }
            rd.Close();
        }
        return al;

    }


    #endregion

}