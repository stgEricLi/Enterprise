using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class enterprise_wt_order_camping : System.Web.UI.Page
{
  protected void Page_Load(object sender, EventArgs e) {
    if (!IsPostBack) {
      Load_Itinerary();
        /* JQuery 測試資料程式碼
         TESTINFO();
   
    add_newline('AAA', 'F225881769', '1975/01/11', '0987-069771', 'aaa@hotmail.com', '', 'false', "minor");
    add_newline('BBB', 'H222065596', '1976/02/03', '0987-069887', 'bbb@yahoo.com.tw', '', 'true', "minor");
    add_newline('CCC', 'N225167457', '1988/03/12', '0917-828953', 'ccc@mcpgo.com', '', 'false', "minor");
    add_newline('DDD', 'U245273890', '1975/04/11', '0987-069771', 'ddd@hotmail.com', '', 'false', "minor");
    add_newline('EEE', 'H193622781', '20136/03/03', '0987-069887', 'eee@yahoo.com.tw', '', 'true', "minor");
         * 
         * //$("#btnShow").click(function () {
    //  alert("300元：" + discntA.toString() + ", 1000元：" + discntB.toString() + ", 大人：" + adult.toString() + ", 小孩：" + kid.toString());
    //});
         */
    }
  }

  private void ShowMessage(string msg) {
    ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alert", "alert('" + msg + "')", true);
  }

  public void Load_Itinerary() {
      if (!string.IsNullOrEmpty(Request.QueryString["aid"]))
      {
          string actid = Request.QueryString["aid"];

          //if (actid == "E1060703001" || actid == "E1060703002")
          //{
          //    if (DateTime.Now.ToString("yyyy/MM/dd") == "2017/07/21") {
          //        Response.Redirect("Default.aspx");
          //        return;
          //    }
          //}


          StringBuilder sb = new StringBuilder();
          DataTable dt = new DataTable();
          dt = FnActivity.Get_Activity_Info("wt2014", "ActID", actid);
          if (dt.Rows.Count > 0)
          {
              hidActid.Value = Request.QueryString["aid"].ToString();
              hidCapacity.Value = dt.Rows[0]["Capacity"].ToString();
              hidActName.Value = dt.Rows[0]["Name"].ToString();
              //hidCart.Value = cart;       
              sb.AppendFormat("<h4>您目前選擇的報名項目為「{0}」</h4>", dt.Rows[0]["Name"].ToString());
              Literal1.Text = sb.ToString();
          }
          else
          {
              ShowMessage("缺乏報名活動資訊之必要條件，目前無法進行報名！");
          }

      }
      else
      {
          ShowMessage("缺乏報名之活動與車次必要條件，目前無法進行報名！");
      }
      //hidActid.Value = "E1060703001";
      //hidCapacity.Value = "80";
      //hidActName.Value = "露營2017";
  }
}