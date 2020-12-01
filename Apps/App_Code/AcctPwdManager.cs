using System;
using System.Text;
using System.Web;
using System.Web.Security;

/// <summary> 處理會員密碼 </summary>
public class AcctPwdManager : SqlMembershipProvider
{

  /// <summary> 密碼解密 </summary>
  /// <param name="encryptedPwd">加密密碼字串</param>
  /// <returns>返回原始密碼</returns>
  public string GetClearTextPassword(string encryptedPwd){
    byte[] encodedPassword = Convert.FromBase64String(encryptedPwd);
    byte[] bytes = this.DecryptPassword(encodedPassword);
    if (bytes == null) { return null; }
    return Encoding.Unicode.GetString(bytes, 0x10, bytes.Length - 0x10);
    /*
     var passwordManager = new NetFourMembershipProvider();
    var clearPWd = passwordManager.GetClearTextPassword("encryptedpasswordhere");
    Console.WriteLine(clearPWd);
     * 
     * 
     * string decrypted = null;

    if (!string.IsNullOrEmpty(encryptedText))
    {
        byte[] encodedbytes = Convert.FromBase64String(encryptedText);
        byte[] decryptedbytes = base.DecryptPassword(encodedbytes);

        if (decryptedbytes != null)
        decrypted = System.Text.Encoding.Unicode.GetString(decryptedbytes, 16, decryptedbytes.Length - 16);
    }

    return decrypted;
}
     */
  }

}