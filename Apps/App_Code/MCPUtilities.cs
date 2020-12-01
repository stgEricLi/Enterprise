using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Web;
using System.Text.RegularExpressions;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Net.Mail;
using System.Net;

/// <summary>
/// Summary description for MCPUtilities
/// </summary>
public class MCPUtilities{

  /******************************************************************************************************
     *                                      資料型態檢查
  ******************************************************************************************************/
  #region 資料型態檢查
  /// <summary> 檢查字串是否為合法日期 </summary>
  /// <param name="txtDay">日期字串</param>
  /// <returns>若為合法日期返回 True</returns>
  public static bool IsDay(string txtDay)
  {
    bool result = false;
    //string pattern = @"^(([0-9][0-9])|([1-2][0,9][0-9][0-9]))[\\/|\\-](([1-9])|(0[1-9])|(1[0-2]))[\\/|\\-](([0-9])|([0-2][0-9])|(3[0-1]))$";
    //Regex rgx = new Regex(pattern);
    Regex reg = new Regex("^(([0-9][0-9])|([1-2][0,9][0-9][0-9]))[\\/|\\-](([1-9])|(0[1-9])|(1[0-2]))[\\/|\\-](([0-9])|([0-2][0-9])|(3[0-1]))$");
    if (reg.IsMatch(txtDay)) { result = true; }

    DateTime dateTime;
    if (DateTime.TryParse(txtDay, out dateTime)) { result = true; }
    return result;
  }

  /// <summary> 檢查是否為數字 </summary>
  /// <param name="strNo">字串</param>
  /// <returns>若為數字返回 True</returns>
  public static bool IsNumeric(string strNo)
  {
    bool result = false;
    int n;
    result = int.TryParse(strNo, out n);
    return result;
  }

  /// <summary> 檢查是否為文曄工號</summary>
  /// <param name="strNo">字串</param>
  public static bool IsWtEmployId(string strNo)
  {
      Regex regex = new Regex(@"^1\d{7}$"); 
      return regex.IsMatch(strNo);
  }

  /// <summary> 檢查是否為浮點數 </summary>
  /// <param name="strNo">字串</param>
  /// <returns>若為浮點數返回 True</returns>
  public static bool IsDecimal(string strNo) {
    Regex regex = new Regex(@"^\d{1,3}(.\d{1})?$"); //最多為三位整數或最多三位整數加一小數
    return regex.IsMatch(strNo);
  }

  /// <summary> 檢查是否符合台灣身分證字號規則 </summary>
  /// <param name="id">身分證字號</param>
  /// <returns>不符合則返回 False</returns>
  public static bool IsValidSID(string id){
    Boolean result = false;
    if (string.IsNullOrEmpty(id)) { return false; } //沒有輸入，回傳 ID 錯誤
    id = id.ToUpper();

    var regex = new Regex("^[A-Z]{1}[0-9]{9}$");
    //Regular Expression 驗證失敗，回傳 ID 錯誤
    if (!regex.IsMatch(id))
    {
      if (!IsNumeric(id)) { return false; } else { return true; }
    }  

    int[] seed = new int[10];  //除了檢查碼外每個數字的存放空間
    string[] charMapping = new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "W", "Z", "I", "O" };
    //A=10 B=11 C=12 D=13 E=14 F=15 G=16 H=17 J=18 K=19 L=20 M=21 N=22 P=23 Q=24 R=25 S=26 T=27 U=28 V=29 X=30 Y=31 W=32  Z=33 I=34 O=35
    string target = id.Substring(0, 1);
    for (int index = 0; index < charMapping.Length; index++)
    {
      if (charMapping[index] == target)
      {
        index += 10;
        seed[0] = index / 10;       //10進制的高位元放入存放空間
        seed[1] = (index % 10) * 9; //10進制的低位元*9後放入存放空間
        break;
      }
    }
    for (int index = 2; index < 10; index++)
    {   //將剩餘數字乘上權數後放入存放空間
      seed[index] = Convert.ToInt32(id.Substring(index - 1, 1)) * (10 - index);
    }
    //檢查是否符合檢查規則，10減存放空間所有數字和除以10的餘數的個位數字是否等於檢查碼
    //(10 - ((seed[0] + .... + seed[9]) % 10)) % 10 == 身分證字號的最後一碼
    result =(10 - (seed.Sum() % 10)) % 10 == Convert.ToInt32(id.Substring(9, 1));

    //若不為身份正號就判斷是否維護照號碼
    if ( ! result){
      if (!IsDecimal(id)) { result = false; } else { result = true; }
    }
   
    //return (10 - (seed.Sum() % 10)) % 10 == Convert.ToInt32(id.Substring(9, 1));
    return result;
  }

  /// <summary> 檢查是否為 Email</summary>
  /// <param name="strEmail">Email</param>
  /// <returns>合法返回 True</returns>
  public static bool IsEmail(string strEmail)
  {
    bool result = false;
        //Regex reg = new Regex(@"^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(([0-9]{1,3})|([a-zA-Z]{2,3})|(aero|coop|info|museum|name))$");
        //Regex regex = new Regex(@"^(([^<>()\[\]\\.,;:\s@]+(\.[^<>()\[\]\\.,;:\s@]+)*)| (.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$");
        Regex regex = new Regex(@"^(([^<>()\[\]\\.,;:\s@\""]+(\.[^<>()\[\]\\.,;:\s@\""]+)*)|(\"".+\""))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$");
        
        if (regex.IsMatch(strEmail)) { result = true; }       
        return result;
  } 

  /// <summary>電話與手機號碼驗證</summary>
  /// <param name="TelNo">電話號碼</param>
  /// <param name="TelType">電話型態 tel cell</param>
  /// <returns>若合法則回傳 True</returns>
   public static bool IsPhoneNo(string TelNo, string TelType)
  {
    bool result = false;
    Regex regexTel = new Regex(@"0\d{1,4}-\d{4}-\d{1,4}(\#\d{1,6})?$"); //02-2383-0294
    Regex regexCel = new Regex(@"^09(\d{2}-\d{6})$"); //0932-555666

    if (TelType == "tel") {
      if (regexTel.IsMatch(TelNo)) { result = true; } else { result = false; }
    }

    if (TelType == "cell"){
      if (regexCel.IsMatch(TelNo)) { result = true; } else { result = false; }
    }    
    return result;
  }

  /// <summary>取得中文星期</summary>
  /// <param name="day">西元日期</param>
  /// <returns>西元日期加星期</returns>
   public static string ChineseWeekDay(string day)
   {
     string result = "";    
     day = Convert.ToDateTime(day).ToString("yyyy/MM/dd");
     int week = (int)Convert.ToDateTime(day).DayOfWeek;
     switch (week){
       case 1:
         result = "(一)";
         break;
       case 2:
         result = "(二)";
         break;
       case 3:
         result = "(三)";
         break;
       case 4:
         result = "(四)";
         break;
       case 5:
         result = "(五)";
         break;
       case 6:
         result = "(六)";
         break;
       case 0:
         result = "(日)";
         break;
     }
     result = day + result;
     return result;
   }

   /// <summary>檢查檔案的副檔名是否符合需求 </summary>
   /// <param name="fileName">完整檔名</param>
   /// <param name="extension">副檔名</param>
  /// <returns>符合返回 true 否則返回 false</returns>
   public static bool check_FileType(string fileName, string extension)
   {
     Boolean result = false;
     // 
     Regex regex = new Regex(@"([^\s]+(\.(?i)(" + extension + "))$)");
     //string strEx = "([a-zA-Z]:(\\w+)*\\[a-zA-Z0_9]+)?" + extension;
     //Regex regex = new Regex("@" + strEx);
     if (regex.IsMatch(fileName)) { result = true; }
     return result;    
   }

   public static bool IsUrl(string url) {   
    Regex regexRUL = new Regex(@"^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$"); //02-23830294
    return   regexRUL.IsMatch(url);
   }
  #endregion


   /******************************************************************************************************
     *                                      日期比較
    ******************************************************************************************************/

   public enum DateInterval
   {
       Day,
       DayOfYear,
       Hour,
       Minute,
       Month,
       Quarter,
       Second,
       Weekday,
       WeekOfYear,
       Year
   }

   public static long DateDiff(DateInterval intervalType, System.DateTime dateOne, System.DateTime dateTwo)
   {
       switch (intervalType)
       {
           case DateInterval.Day:

           case DateInterval.DayOfYear:
               System.TimeSpan spanForDays = dateTwo - dateOne;
               return (long)spanForDays.TotalDays;

           case DateInterval.Hour:
               System.TimeSpan spanForHours = dateTwo - dateOne;
               return (long)spanForHours.TotalHours;

           case DateInterval.Minute:
               System.TimeSpan spanForMinutes = dateTwo - dateOne;
               return (long)spanForMinutes.TotalMinutes;

           case DateInterval.Month:
               return ((dateTwo.Year - dateOne.Year) * 12) + (dateTwo.Month - dateOne.Month);

           case DateInterval.Quarter:
               long dateOneQuarter = (long)System.Math.Ceiling(dateOne.Month / 3.0);
               long dateTwoQuarter = (long)System.Math.Ceiling(dateTwo.Month / 3.0);
               return (4 * (dateTwo.Year - dateOne.Year)) + dateTwoQuarter - dateOneQuarter;

           case DateInterval.Second:
               System.TimeSpan spanForSeconds = dateTwo - dateOne;
               return (long)spanForSeconds.TotalSeconds;

           case DateInterval.Weekday:
               System.TimeSpan spanForWeekdays = dateTwo - dateOne;
               return (long)(spanForWeekdays.TotalDays / 7.0);

           case DateInterval.WeekOfYear:
               System.DateTime dateOneModified = dateOne;
               System.DateTime dateTwoModified = dateTwo;
               while (dateTwoModified.DayOfWeek != System.Globalization.DateTimeFormatInfo.CurrentInfo.FirstDayOfWeek)
               {
                   dateTwoModified = dateTwoModified.AddDays(-1);
               }
               while (dateOneModified.DayOfWeek != System.Globalization.DateTimeFormatInfo.CurrentInfo.FirstDayOfWeek)
               {
                   dateOneModified = dateOneModified.AddDays(-1);
               }
               System.TimeSpan spanForWeekOfYear = dateTwoModified - dateOneModified;
               return (long)(spanForWeekOfYear.TotalDays / 7.0);

           case DateInterval.Year:
               return dateTwo.Year - dateOne.Year;
           default:
               return 0;
       }
   }


  /******************************************************************************************************
     *                                      城市地區
  ******************************************************************************************************/
  #region 城市地區
  /// <summary>載入城市</summary>
  /// <returns>DataTable</returns>
  public static DataTable sp_Get_City()
  {
    DataTable dtCity = new DataTable();
    DBManager dbmg = new DBManager();
    SqlCommand cmd = dbmg.GetSPCommand("mcp_Get_City", null);
    try{     
      dtCity = dbmg.ExecuteDataTable(cmd);
    }catch (Exception ex) { }
    return dtCity;
  }

  /// <summary>載入區域</summary>
  /// <param name="CityID">城市英文代碼</param>
  /// <returns>DataTable</returns>
  public static DataTable sp_Get_District(int CityID)
  {
    DataTable dtDs = new DataTable();
    DBManager dbmg = new DBManager();
    SqlCommand cmd = dbmg.GetSPCommand("mcp_Get_County", null);
    try{
      cmd.Parameters.Add("@code", SqlDbType.NVarChar, 6).Value = CityID;
      dtDs = dbmg.ExecuteDataTable(cmd);
    }catch (Exception ex) { }
    return dtDs;
  }
  #endregion

  /******************************************************************************************************
     *                                      Email 函式
  ******************************************************************************************************/
  /// <summary> 寄出單一郵件 </summary>
  /// <param name="toEmail"></param>
  /// <param name="subject"></param>
  /// <param name="contents"></param>
  /// <param name="conpyto"></param>
  /// <param name="fromEmail"></param>
  /// <returns>成功返回字串 OK</returns>
  public static string send_single_mail(string toEmail, string subject, string contents, string copyto, string fromEmail) {
    string result = "OK";
    MailMessage newMail = new MailMessage();
    SmtpClient smtpMail = new SmtpClient();

    if (string.IsNullOrEmpty(fromEmail)) { fromEmail = "mcp@mcpgo.com"; }
    if (string.IsNullOrEmpty(copyto)) { copyto = "ricky@mcpgo.com"; }

    MailAddress fromaddr = new MailAddress(fromEmail, "MCP海天青");
    newMail.From = fromaddr;
    newMail.Body = contents;
    newMail.Subject = subject;
    newMail.BodyEncoding = System.Text.Encoding.GetEncoding("utf-8");
    newMail.To.Add(toEmail);
    newMail.CC.Add(copyto);
    newMail.IsBodyHtml = true;
    newMail.Priority = MailPriority.Normal;

    try{
      NetworkCredential security = new NetworkCredential("mcp@mcpgo.com", "$1688sky");
      smtpMail.Host = "mcpgo.com";
      smtpMail.UseDefaultCredentials = false;
      smtpMail.DeliveryMethod = SmtpDeliveryMethod.Network;
      smtpMail.Credentials = security;
      smtpMail.Send(newMail);
      result = "OK";
    } catch (SmtpException mailerror) {
      result = mailerror.Message.ToString();
    }catch (Exception ex) {
      result = ex.Message.ToString();
    }
    return result;
  }

    public static Boolean send_mail_using_gmail(string toEmail, string subject, string contents, string copyto)
    {
        bool result = false;

        MailAddress to = new MailAddress(toEmail);
        MailAddress from = new MailAddress("mcp.otherstw@gmail.com");
        MailAddress cc = new MailAddress(copyto);
        MailMessage msg;
        SmtpClient client = new SmtpClient();
        client.EnableSsl = true;
        client.Port = 587;
        client.Host = "smtp.gmail.com";
        client.Credentials = new System.Net.NetworkCredential("stgtestmail@gmail.com", "!4s2t4g0");
        msg = new MailMessage(from, to);
        msg.CC.Add(cc);
        msg.Subject = subject;
        msg.Body = contents;
        try
        {                    
            client.Send(msg);
            result = true;
        }
        catch (Exception ex)
        {
           var str = ex.Message.ToString();
        }
        return result;
    }

  /// <summary> 寄出多封郵件 </summary>
  /// <param name="toEmail">email 地址陣列</param>
  /// <param name="subject"></param>
  /// <param name="contents"></param>
  /// <param name="copyto"></param>
  /// <param name="fromEmail"></param>
  /// <returns>成功返回字串 OK</returns>
  public static string send_multiple_mail(string[] toEmail, string subject, string contents, string copyto, string fromEmail)
  { 
   string result = "OK";
     MailMessage newMail = new MailMessage();
    SmtpClient smtpMail = new SmtpClient();
    if (string.IsNullOrEmpty(fromEmail)) { fromEmail = "mcp@mcpgo.com"; }
    if (string.IsNullOrEmpty(copyto)) { copyto = "ricky@mcpgo.com"; }
    MailAddress fromaddr = new MailAddress(fromEmail, "MCP海天青");
    newMail.From = fromaddr;
    newMail.Body = contents;
    newMail.Subject = subject;
    newMail.BodyEncoding = System.Text.Encoding.GetEncoding("utf-8");    
    foreach (string item in toEmail){ newMail.To.Add(item);}
    newMail.CC.Add(copyto);
    newMail.IsBodyHtml = true;
    newMail.Priority = MailPriority.Normal;
    try{
      NetworkCredential security = new NetworkCredential("mcp@mcpgo.com", "$1688sky");
      smtpMail.Host = "mcpgo.com";
      smtpMail.SendAsync(newMail,"");     
      result = "OK";
    }catch (SmtpException smtperror){
      result = smtperror.Message.ToString();
    }catch (Exception ex){
      result = ex.Message.ToString();
    }
   return result;
  }
  /******************************************************************************************************
     *                                      圖形處理
  ******************************************************************************************************/
  public static string Resize_Img_SavetoFile(Image originalImage, string filepath, Size size, Boolean preserveAspectRatio)
  {
    string result = "OK";
    int newWidth = 0;
    int newHeight = 0;
    if (preserveAspectRatio)
    {
      int originalWidth = originalImage.Width;
      int originalHeight = originalImage.Height;
      float percentWidth = Convert.ToSingle(size.Width) / Convert.ToSingle(originalWidth);
      float percentHeight = Convert.ToSingle(size.Height) / Convert.ToSingle(originalHeight);
      float percent = percentHeight < percentWidth ? percentHeight : percentWidth;
      newWidth = Convert.ToInt32(originalWidth * percent);
      newHeight = Convert.ToInt32(originalHeight * percent);
    }
    else
    {
      newWidth = size.Width;
      newHeight = size.Height;
    }

    Image newImage = new Bitmap(newWidth, newHeight);

    using (Graphics graphicsHandle = Graphics.FromImage(newImage))
    {
      graphicsHandle.InterpolationMode = InterpolationMode.HighQualityBicubic;
      graphicsHandle.DrawImage(originalImage, 0, 0, newWidth, newHeight);
    }

    try
    {
      // 以 jpg 格式 儲存圖檔
      newImage.Save(filepath, System.Drawing.Imaging.ImageFormat.Jpeg);
    }
    catch (System.Exception e)
    {
      return "錯誤：" + e.Message;
    }
    finally
    {
      originalImage.Dispose();
      newImage.Dispose();
    }
    return result;
  }

  /******************************************************************************************************
     *                                      資料庫安全
    ******************************************************************************************************/
    /// <summary>回傳 SQL 資料型態 </summary>
    /// <param name="str">型態字串如:int,Nvarchar</param>
    /// <returns>回傳一個 SqlDbType 物件</returns>
    public static SqlDbType GetSqlType(string str)
    {
        SqlDbType slqtype = new SqlDbType();
        switch (str)
        {
            case "NVarChar":
                slqtype = SqlDbType.NVarChar;
                break;
            case "Int":
                slqtype = SqlDbType.Int;
                break;
            default:
                break;
        }
        return slqtype;
    }


    
}