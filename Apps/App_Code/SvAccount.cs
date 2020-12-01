using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Web;
using System.Web.Script.Services;
using System.Web.Security;
using System.Web.Services;
using System.Text;
using System.IO;


/// <summary>
/// Summary description for SvAccount
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class SvAccount : System.Web.Services.WebService {

  /**********************************************************************
                                帳號
 **********************************************************************/
  /// <summary> 新增帳號 </summary>
  /// <returns>成功回傳 OK 字串</returns>
  [WebMethod]
  [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
  public string CreateAccount(string username, string password, string email, string companyName, string companyID, string companyTel, string cell, string address) {
    string result = "OK";
    MembershipUser newUser;
    MembershipCreateStatus status;
    if (String.IsNullOrEmpty(username)) { return "請輸入帳號名稱！"; }
    if (String.IsNullOrEmpty(password)) { return "請輸入密碼！"; }
    if (String.IsNullOrEmpty(companyName)) { return "請輸入公司名稱！"; }
    if (!MCPUtilities.IsPhoneNo(companyTel, "tel")) { return "電話格式需為：02-2952-7535"; }
    if (!MCPUtilities.IsPhoneNo(cell, "cell")) { return "手機格式需為：0932-666888"; }
    if (!MCPUtilities.IsEmail(email)) { return "email 格式錯誤！"; }
    try {
        newUser = Membership.CreateUser(username, password, email, "您的公司名稱", companyName, true, out status);

      if ((newUser != null)) {
          //若註冊會員成功後則將公司資料寫入資料庫
          DBManager db = new DBManager();
          SqlCommand cmd = db.GetSPCommand("enterprise_Company_Add", null);
          cmd.Parameters.Add("@UserName", SqlDbType.NVarChar, 256).Value = username;
          cmd.Parameters.Add("@TrueName", SqlDbType.NVarChar, 50).Value = companyName;
          cmd.Parameters.Add("@SID", SqlDbType.NVarChar, 20).Value = companyID;
          cmd.Parameters.Add("@Tel1", SqlDbType.NVarChar, 20).Value = companyTel;
          cmd.Parameters.Add("@Cell1", SqlDbType.NVarChar, 20).Value = cell;
          cmd.Parameters.Add("@Adddress", SqlDbType.NVarChar, 50).Value = address;
          cmd.Parameters.Add("@Comment", SqlDbType.NVarChar, 50).Value = password;
          SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
          retValParam.Direction = ParameterDirection.Output;
          db.ExecuteNonQuery(cmd);
          result = retValParam.Value.ToString();

          //產生專屬資料夾與 webconfig 檔案
          if (!Directory.Exists(Server.MapPath("~/enterprise/" + username)))
          {
              Directory.CreateDirectory(Server.MapPath("~/enterprise/" + username));
          }

          if (Directory.Exists(Server.MapPath("~/enterprise/" + username)))
          {
              Directory.CreateDirectory(Server.MapPath("~/enterprise/" + username + "/img"));
              Directory.CreateDirectory(Server.MapPath("~/enterprise/" + username + "/css"));
              Directory.CreateDirectory(Server.MapPath("~/enterprise/" + username + "/js"));
              StringBuilder sb = new StringBuilder();
              sb.Append("<?xml version='1.0' encoding='utf-8'?>\r\n");
              sb.Append("<configuration>\r\n<appSettings/>\r\n<connectionStrings/>\r\n");
              sb.Append("<system.web>\r\n");
              sb.Append("<authorization>\r\n");
              sb.Append("<allow roles='admin' />\r\n");
              sb.AppendFormat("<allow users='{0}' />\r\n", username);
              sb.Append("<deny users=' * ' />\r\n");
              sb.Append("</authorization>\r\n");
              sb.Append("</system.web>\r\n</configuration>");
              FileStream fs = new FileStream(Server.MapPath("~/enterprise/" + username + "/Web.config"), FileMode.Create, FileAccess.Write);
              StreamWriter sw = new StreamWriter(fs);
              try
              {
                  sw.BaseStream.Seek(0, SeekOrigin.End);
                  sw.WriteLine(sb.ToString(), Encoding.Unicode);
              }
              catch (Exception ex)
              {
                  if (result == "OK") { result = "帳號已建立，但因權限問題導致企業專屬資料夾無法建立，請以手動方式建立相關資料夾與權限設定檔"; }
                  else { result = "帳號已建立，但目前企業資料無法寫入資料庫中，且因權限問題導致企業專屬資料夾無法建立，請以手動方式建立相關資料夾與權限設定檔"; }
              }
              finally { sw.Close(); fs.Close(); }
          }
      } else {
        switch (status) {
          case MembershipCreateStatus.DuplicateUserName:
            result = "此帳號名稱已被使用。";
            break;
          case MembershipCreateStatus.DuplicateEmail:
            result = "此一 Email 已被使用。";
            break;
          case MembershipCreateStatus.InvalidPassword:
            result = "您的密碼至少要六個字元，建議含有至少一個數字與特殊字元。";
            break;
          case MembershipCreateStatus.InvalidEmail:
            result = "您輸入的 Email 不合法，請重新輸入。";
            break;
          case MembershipCreateStatus.InvalidUserName:
            result = "您輸入的帳號名稱不合法，請重新輸入。";
            break;
          case MembershipCreateStatus.ProviderError:
            result = "很抱歉目前系統過於繁忙無法進行註冊，請稍後再做嘗試。";
            break;
          case MembershipCreateStatus.UserRejected:
            result = "系統發生錯誤，請確認輸入的資料是否正確！";
            break;
          default:
            result = "發生原因不明的錯誤，請確認輸入的資料是否合法！";
            break;
        }
      }
    } catch (Exception ex) { return Convert.ToString(ex.Message); }
    return result;
  }

   [WebMethod]
  [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
  public string CreateAccount_for_Admin(string username, string password, string email){
    string result = "OK";
    MembershipUser newUser;
    MembershipCreateStatus status;
    if (String.IsNullOrEmpty(username)) { return "請輸入帳號名稱！"; }
    if (String.IsNullOrEmpty(password)) { return "請輸入密碼！"; }
    if (!MCPUtilities.IsEmail(email)) { return "email 格式錯誤！"; }
    try {
        newUser = Membership.CreateUser(username, password, email, "公司英文名稱", "mcp", true, out status);

      if ((newUser != null)) {
        //若註冊成功後則加入 admin 群組
        Roles.AddUserToRole(username,"admin");
      } else {
        switch (status) {
          case MembershipCreateStatus.DuplicateUserName:
            result = "此帳號名稱已被使用。";
            break;
          case MembershipCreateStatus.DuplicateEmail:
            result = "此一 Email 已被使用。";
            break;
          case MembershipCreateStatus.InvalidPassword:
            result = "您的密碼至少要六個字元，建議含有至少一個數字與特殊字元。";
            break;
          case MembershipCreateStatus.InvalidEmail:
            result = "您輸入的 Email 不合法，請重新輸入。";
            break;
          case MembershipCreateStatus.InvalidUserName:
            result = "您輸入的帳號名稱不合法，請重新輸入。";
            break;
          case MembershipCreateStatus.ProviderError:
            result = "很抱歉目前系統過於繁忙無法進行註冊，請稍後再做嘗試。";
            break;
          case MembershipCreateStatus.UserRejected:
            result = "系統發生錯誤，請確認輸入的資料是否正確！";
            break;
          default:
            result = "發生原因不明的錯誤，請確認輸入的資料是否合法！";
            break;
        }
      }
    } catch (Exception ex) { return Convert.ToString(ex.Message); }
    return result;
  }


  /// <summary> 更新帳號資訊 </summary>
  [WebMethod]
  [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
  public string Update_Account_info(string username, string companyName, string companyID, string tel1, string cell1, string tel2, string cell2, string fax, string address) {
    string result = "OK";    
    if (String.IsNullOrEmpty(username)) { return "請輸入帳號名稱！"; }    
    if (String.IsNullOrEmpty(companyName)) { return "請輸入公司名稱！"; }
    if (!MCPUtilities.IsPhoneNo(tel1, "tel")) { return "電話格式需為：02-2952-7535"; }
    if (!MCPUtilities.IsPhoneNo(cell1, "cell")) { return "手機格式需為：0932-666888"; }
    if (!String.IsNullOrEmpty(tel2)) { if (!MCPUtilities.IsPhoneNo(tel2, "tel")) { return "其他電話格式需為：02-2952-7535"; } }
    if (!String.IsNullOrEmpty(cell2)) { if (!MCPUtilities.IsPhoneNo(cell2, "cell")) { return "其他手機格式需為：0932-666888"; } }
    if (!String.IsNullOrEmpty(fax)) { if (!MCPUtilities.IsPhoneNo(fax, "tel")) { return "傳真格式需為：02-2952-7535"; } }
    try {  
        DBManager db = new DBManager();
        SqlCommand cmd = db.GetSPCommand("enterprise_Company_Update", null);
        cmd.Parameters.Add("@UserName", SqlDbType.NVarChar, 256).Value = username;
        cmd.Parameters.Add("@TrueName", SqlDbType.NVarChar, 256).Value = companyName;
        cmd.Parameters.Add("@SID", SqlDbType.NVarChar, 20).Value = companyID;
        cmd.Parameters.Add("@Tel1", SqlDbType.NVarChar, 20).Value = tel1;
        cmd.Parameters.Add("@Cell1", SqlDbType.NVarChar, 20).Value = cell1;
        cmd.Parameters.Add("@Tel2", SqlDbType.NVarChar, 20).Value = tel2;
        cmd.Parameters.Add("@Cell2", SqlDbType.NVarChar, 20).Value = cell2;
        cmd.Parameters.Add("@Fax", SqlDbType.NVarChar, 20).Value = fax;
        cmd.Parameters.Add("@Adddress", SqlDbType.NVarChar, 256).Value = address;
        SqlParameter retValParam = cmd.Parameters.Add("@result", SqlDbType.NVarChar, 50);
        retValParam.Direction = ParameterDirection.Output;
        db.ExecuteNonQuery(cmd);
        result = retValParam.Value.ToString();    
    } catch (Exception ex) { return Convert.ToString(ex.Message); }
    return result;
  }


  /// <summary> 變更密碼 </summary>
  /// <param name="username"></param>
  /// <param name="newpassword"></param>
  [WebMethod]
  [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
  public string ChangePassword(string username, string newpassword) {
    string result = "OK";
    string tempPwd = "";
    if (string.IsNullOrEmpty(username)) { return "帳號名稱錯誤！"; }
    if (newpassword.Length < 6) { return "密碼長度至少要六個字！"; }
    MembershipUser usr = Membership.GetUser(username);
    try {
      tempPwd = usr.ResetPassword();  //要將 web.config 中 requiresQuestionAndAnswer 設為 false
      if (!usr.ChangePassword(tempPwd, newpassword)) { result = "變更密碼失敗！"; }
    } catch (Exception ex) {
      result = "變更密碼失敗！";
    }
    return result;
  }

  /// <summary> 取得使用者密碼 </summary>
  /// <param name="username">使用者帳號</param>
  /// <returns>返回實際密碼</returns>
  [WebMethod]
  [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
  public string Get_Account_Password(string username) {
    string result = "none";
    if (string.IsNullOrEmpty(username)) { return "帳號名稱錯誤！"; }
    DBManager dbmg = new DBManager();
    SqlCommand cmd = dbmg.GetSPCommand("account_GetPassword", null);
    try {
      cmd.Parameters.Add("@UserName", SqlDbType.NVarChar, 256).Value = username;
      result = dbmg.ExecuteScalar<string>(cmd);
      if (!string.IsNullOrEmpty(result)) {
        var pwdManager = new AcctPwdManager();
        result = pwdManager.GetClearTextPassword(result);
      }
    } catch (Exception ex) { return Convert.ToString(ex.Message); }    
    return result;    
  }

  //取得帳號狀態
  [WebMethod]
  public string Get_Account_Status(string username, string status) {
    string result = "false";
     MembershipUser usr = Membership.GetUser(username);
     if(status=="approve"){
       if (usr.IsApproved) { result = "true"; }else{result="false";}       
     }else{
       if (usr.IsLockedOut) { result = "true"; } else { result = "false"; } 
     }
     return result; 
  }

  /// <summary> 解除帳號封鎖 </summary>
  /// <param name="username"></param>
  [WebMethod]
  [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
  public string UnLockUser(string username) {
    string result = "OK";
    MembershipUser usr = Membership.GetUser(username);
    if (!usr.UnlockUser()) { return "目前無法解除封鎖！"; }
    Membership.UpdateUser(usr);
    return result;
  }

  /// <summary> 帳號核准 </summary>
  /// <param name="username"></param>
  /// <param name="IsApprove">Approve 或 Unapprove</param>
  [WebMethod]
  [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
  public string ApproveUser(string username, string IsApprove) {
    string result = "OK";
    MembershipUser usr = Membership.GetUser(username);
    if (IsApprove == "Approved") {
      usr.IsApproved = true; result = "帳號已開通";
    } else {
      usr.IsApproved = false; result = "帳號已關閉";
    }
    Membership.UpdateUser(usr);
    return result;
  }

  /// <summary>取得帳號清單（DropDownList）</summary>
  /// <returns>clsProfile物件</returns>
  [WebMethod]
  [ScriptMethod(UseHttpGet = true)]
  public List<clsProfile> Get_Account_DDL() {
    List<clsProfile> tempList = new List<clsProfile>();
    DataTable dtPf = new DataTable();
    DBManager db = new DBManager();
    
    try {
      SqlCommand cmd = db.GetSPCommand("enterprise_all_UserName_Get", null);
      dtPf = db.ExecuteDataTable(cmd);
      if (dtPf.Rows.Count > 0) {
        foreach (DataRow row in dtPf.Rows) {
          clsProfile pf = new clsProfile();
          pf.UserName = row["UserName"].ToString();
          //pf.TrueName = row["TrueName"].ToString();
          tempList.Add(pf);
        }
      }
    } catch (Exception ex) { } finally { dtPf.Dispose(); }
    return tempList;
  }


  [WebMethod]
  [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
  public string AddRole(string roleName)
  {
      string result = "OK";
      try{
          if (!Roles.RoleExists(roleName)){
              Roles.CreateRole(roleName);
          }else{
              result = "此一群組已存在，無法新增群組！";
          }         
      }catch (Exception ex) { result = "錯誤：" + ex.Message; }   
      return result;
  }
}
