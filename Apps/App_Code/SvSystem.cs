using System;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Text;
using System.Data;
using System.Text.RegularExpressions;
using System.Web.Script.Services;
using System.Web.Security;
using System.Collections.Generic;
using System.Web.Configuration;
using System.Configuration;

/// <summary>系統專用服務</summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
 [System.Web.Script.Services.ScriptService]
public class SvSystem : System.Web.Services.WebService {

    public SvSystem () {}

    /// <summary> 新增群組 </summary>
    /// <param name="rolename">群組名稱</param>
    [WebMethod]
    public string Add_New_Role(string rolename) {
      string result = "OK";
      try {
        Roles.CreateRole(rolename);
        if (!Roles.RoleExists(rolename)) { result = "新增群組失敗！"; }
      } catch (Exception ex) {
        return "新增群組失敗！";
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

    /// <summary> 解除帳號封鎖 </summary>
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

    /// <summary> 取得所有群組 </summary>
    /// <returns>傳回 String 物件集合格式</returns>
    [WebMethod]
    [ScriptMethod(UseHttpGet = true)]
    public List<String> Get_AllRoles() {
      List<String> tempList = new List<String>();
      string[] rolesArry = Roles.GetAllRoles();
      foreach (string item in rolesArry) {
        tempList.Add(item);
      }
      return tempList;
    }

    /// <summary> 取得該使用者所屬群組 </summary>
    [WebMethod]
    public List<String> Get_User_Roles(string username) {
      List<String> tempList = new List<String>();
      string[] rolesArry = Roles.GetRolesForUser(username);
      foreach (string item in rolesArry) {
        tempList.Add(item);
      }
      return tempList;
    }

    /// <summary> 將帳戶加到群組中 </summary>
    /// <param name="username"></param>
    /// <param name="groupname"></param>
    /// <returns>成功回傳 OK 字串</returns>
    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string JoinToGroup(string username, string groupname) {
      string result = "";
      string[] rolesArry = Roles.GetRolesForUser(username);
      string strRole = "";

      if (rolesArry.Length >= 1) {
        for (int i = 0; i <= rolesArry.Length - 1; i++) {
          strRole += rolesArry[i] + ",";
        }
        //strRole = strRole.Substring(0, strRole.Length - 1);
      }

      if (strRole.Contains(groupname)) { return "此帳號已在此一群組中！"; }

      MembershipUser usr = Membership.GetUser(username);
      try {
        Roles.AddUserToRole(username, groupname);
        result = "OK" + strRole + groupname;
      } catch (Exception ex) {
        result = "加入到群組中失敗！";
      }
      return result;
    }

    /// <summary> 將帳戶移出群組 </summary>
    /// <param name="username"></param>
    /// <param name="groupname"></param>
    /// <returns>成功回傳 OK 字串</returns>
    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string RemoveFromGroup(string username, string groupname) {
      string result = "";
      string[] rolesArry = Roles.GetRolesForUser(username);
      string strRole = "";
      string strRole2 = "";
      if (rolesArry.Length >= 1) {
        for (int i = 0; i <= rolesArry.Length - 1; i++) {
          if (groupname != rolesArry[i].ToString()) {
            strRole2 += rolesArry[i] + ",";
          }
          strRole += rolesArry[i] + ",";
        }
        if (!string.IsNullOrEmpty(strRole2)) { strRole2 = strRole2.Substring(0, strRole2.Length - 1); }
      } else { return "此帳號不在任何群組中！"; }

      if (!strRole.Contains(groupname)) { return "此帳號不在此一群組中！"; }

      MembershipUser usr = Membership.GetUser(username);
      try {
        Roles.RemoveUserFromRole(username, groupname);
        result = "OK" + strRole2;
      } catch (Exception ex) {
        result = "移出群組失敗！";
      }
      return result;
    }

    /// <summary>刪除帳號與其相關資料 </summary>
    /// <param name="username"></param>
    /// <returns>成功回傳 OK 字串</returns>
    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string RemoveAccount(string username) {
      string result = "OK";
      if (!Membership.DeleteUser(username, true)) { return "刪除帳號失敗！"; }
      return result;
    }

    /// <summary> 新增帳號 </summary>
    /// <param name="username"></param>
    /// <param name="password"></param>
    /// <param name="email"></param>
    /// <param name="ssid"></param>
    /// <returns>成功回傳 OK 字串</returns>
    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string CreateAccount(string username, string password, string email, string ssid) {
      string result = "OK";
      //if (!MCPUtilities.IsValidSID(ssid)) { return "不合法的身份証號"; }

      //MembershipUser newUser;
      //MembershipCreateStatus status;

      //try {
      //  newUser = Membership.CreateUser(username, password, email, "您的身分證號", ssid, true, out status);
      //  if ((newUser != null)) {
      //    result = FNEmployee.Update_Employee_HasAccount(username);
      //    if (result != "OK") {
      //      Membership.DeleteUser(username, true); // 如果更新失敗則先刪除此帳號
      //      return result;
      //    }
      //    Roles.AddUserToRole(username, "empolyee"); // 成功後加入 employee 群組中去         
      //  } else {
      //    switch (status) {
      //      case MembershipCreateStatus.DuplicateUserName:
      //        result = "此帳戶工號已被使用。";
      //        break;
      //      case MembershipCreateStatus.DuplicateEmail:
      //        result = "此一電子郵件信箱已被使用，請使用其他電子郵件信。";
      //        break;
      //      case MembershipCreateStatus.InvalidPassword:
      //        result = "您的密碼至少要六個字元並含有至少一個數字與特殊字元。";
      //        break;
      //      case MembershipCreateStatus.InvalidEmail:
      //        result = "您輸入的電子郵件信箱不合法，請重新輸入。";
      //        break;
      //      case MembershipCreateStatus.InvalidUserName:
      //        result = "您輸入的帳戶名稱不合法，請使用其他名稱。";
      //        break;
      //      case MembershipCreateStatus.ProviderError:
      //        result = "很抱歉目前系統過於繁忙無法進行註冊，請稍後再做嘗試。";
      //        break;
      //      case MembershipCreateStatus.UserRejected:
      //        result = "系統發生錯誤，請確認輸入的資料是否合法！";
      //        break;
      //      default:
      //        result = "發生原因不明的錯誤，請確認輸入的資料是否合法！";
      //        break;
      //    }
      //  }
      //} catch (Exception) { }
      return result;
    }

    /// <summary>新增群組</summary>
    /// <param name="rolename">群組名稱</param>
    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string add_newRole(string rolename) {
    string result ="";
      try {
        if (Roles.RoleExists(rolename)) { return "此一群組已經存在，新增群組終止！"; }
        Roles.CreateRole(rolename); 
        result ="OK";       
      } catch (Exception ex) {
        return "伺服器發生錯誤，新增群組失敗！";
      }
      return result;
    }

    /// <summary>新增群組</summary>
    /// <param name="rolename">群組名稱</param>
    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string delete_role(string rolename) {
      string result = "";
      try {
        if (!Roles.RoleExists(rolename)) { return "此一群組不存在，刪除群組終止！"; }
        Roles.DeleteRole(rolename);
        result = "OK";
      } catch (Exception ex) {
        return "伺服器發生錯誤，刪除群組失敗！";
      }
      return result;
    
    }
    
}
