using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class index : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //if (MCPUtilities.IsEmail("effie_chiu@maxtek.icrep.com.tw"))
        //{
        //    lbmg.Text = "OK";
        //}
        //else {
        //    lbmg.Text = "INVALID";
        //}
    }
    protected void btnLogin_Click(object sender, EventArgs e)
    {        
        string username = txtAcctID.Text.Trim();
        string password = txtPwd.Text.Trim();
        string path = "";       

        if (string.IsNullOrEmpty(username))
        {
            lbmg.Text = "<p class='failure'><span class='glyphicon glyphicon-exclamation-sign'></span>&nbsp;請輸入帳號！</p>"; return;
        }

        if (string.IsNullOrEmpty(password))
        {
            lbmg.Text = "<p class='failure'><span class='glyphicon glyphicon-exclamation-sign'></span>&nbsp;請輸入密碼！</p>"; return;
        }

        // 統一使用 wtmec 作為使用者名 (使用者名轉換)
        if (username == "wtmec") { username = "wt2014"; } // PASSWORD: 31536041

        // 避免同仁打錯密碼超過六次
        if (username == "wt2014") {
            if (password != "31536041") {
                lbmg.Text = "<p class='failure'><span class='glyphicon glyphicon-asterisk'></span>&nbsp;密碼錯誤，請再重新試一次！</p>";
                return;
            }               
        }

        // 測試時打開，不讓同仁登入
        //if (username == "wt2014" && password == "31536041")
        //{
        //    lbmg.Text = "<p class='failure'><span class='glyphicon glyphicon-asterisk'></span>&nbsp;此一帳號暫不開放！</p>";
        //    return;
        //}

        if (Membership.ValidateUser(username, password)){
            
            FormsAuthentication.RedirectFromLoginPage(username, true);
           
            if (Roles.IsUserInRole(username, "admin")){
                // mcp / 16287466
                if (username == "mcp" ) {
                    Response.Redirect("~/enterprise/wt/Default.aspx");
                }
                else
                {
                    Response.Redirect("~/backend/zindex.aspx"); //如果屬於 admin 群組則導向後台首頁
                }
               
            }else{
                // wttest / apple3321
                if (username == "wt2014" || username == "wttest") { username = "wt"; }
                Response.Redirect("~/enterprise/" + username + "/Default.aspx");                
            }
        }else{
            lbmg.Text = "<p class='failure'><span class='glyphicon glyphicon-asterisk'></span>&nbsp;帳號或密碼錯誤，請再重新試一次！</p>";
        }

       
               

    }
}