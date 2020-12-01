<%@ WebHandler Language="C#" Class="PictureUpload" %>

using System;
using System.Web;
using System.Web.Script.Serialization;
using System.IO;
using System.Web.SessionState;
using System.Drawing;
public class PictureUpload : IHttpHandler, IReadOnlySessionState
{
    
    public void ProcessRequest (HttpContext context) {
      context.Response.ContentType = "text/plain";
      string mid = context.Request.Form["mid"]; //傳入的參數（檔名）
      string fold = context.Request.Form["fold"]; //傳入的參數（資料夾名稱）
      string path = "~/img/" + fold + "/" ;
      //string fileName = mid+".jpg";
      //string orgImgPath = HttpContext.Current.Server.MapPath(@"~\img\activity\" + mid + ".jpg");
      //string thumbImgPath = HttpContext.Current.Server.MapPath(@"~\img\inv\thumb\" + mid + ".jpg");
      string orgImgPath = HttpContext.Current.Server.MapPath(@path + mid + ".jpg");
      string ret = "OK";
      JMessage result = new JMessage();
      try
      {
        int count = context.Request.Files.Count;
        HttpPostedFile file = context.Request.Files[0];
        byte[] pic = new byte[file.InputStream.Length];
        file.InputStream.Read(pic, 0, (int)file.InputStream.Length);

        MemoryStream ms = new MemoryStream(pic);
        Image img = Image.FromStream(ms);
        ms.Close();
        ms.Dispose();


        // string thumbImgResult = MCPUtilities.Resize_Img_SavetoFile(img2, thumbImgPath, new Size(200, 152), true);
        if (MCPUtilities.Resize_Img_SavetoFile(img, orgImgPath, new Size(800, 600), true) != "OK")
        {
          ret = "圖片上傳失敗，請用 FTP 上傳同名圖片至路徑 " + path + " 之下！";
        }
        else
        {
          MemoryStream ms2 = new MemoryStream(pic);
          Image img2 = Image.FromStream(ms2);
          ms.Close();
          ms.Dispose();
          //if (MCPUtilities.Resize_Img_SavetoFile(img2, thumbImgPath, new Size(200, 150), true) != "OK")
          //{
          //  ret = "大圖(800 X 600)上傳成功，但圖片縮圖 (205 X 154) 上傳失敗，請用 FTP 上傳同名圖片至路徑 ../img/inv/thumb 之下！";
          //}          
        }               
        result.state = ret;
      }
      catch (Exception ex)
      {
        result.state = ex.Message.ToString();
      }
      finally
      {
        JavaScriptSerializer js = new JavaScriptSerializer();
        string jsondata = js.Serialize(result);
        context.Response.Write(jsondata);
      }
    }
 
    public bool IsReusable {
        get { return false; }
    }
}

public class JMessage
{
  public string state { get; set; }
  public JMessage()
  {
    state = "";
  }
}