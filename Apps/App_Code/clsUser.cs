using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for clsUser
/// </summary>
public class clsUser
{
    public string UserId; 
    public string Name;
    public string Password;
    public string Email;
    public string PasswordQuestion;
    public string LastLoginDate;
    public string LastLockoutDate;
    public Boolean IsApproved;
    public Boolean IsLockedOut;
    public int FailedPasswordAttemptCount;
    public int FailedPasswordAnswerAttemptCount;
    
	public clsUser()
	{
        Password = "";
        LastLoginDate = DateTime.Now.ToString("yyyy/mm/dd");
        LastLockoutDate = DateTime.Now.ToString("yyyy/mm/dd");
    }
}

public class clsUserPageing
{
    public int TotalRows;
    public List<clsUser> Users;
}

public class clsLogin {
    public string Name;
    public List<string> roles;
    public DateTime expire;
    public string authTicket;
}