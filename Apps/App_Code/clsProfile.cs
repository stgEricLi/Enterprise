using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>會員基本資料物件</summary>
public class clsProfile
{
  
  public string UserName;
  public string TrueName;
  public string DOB;
  public string Sex;
  public string Tel1;
  public string Tel2;
  public string Cell1;
  public string Cell2;
  public string Fax;
  public string SID;
  public string Adddress;
  public int PointA;
  public int PointB;
  public int PointC;
  public string Comment;

	public clsProfile()
	{
    UserName = "";
    TrueName = "";
    SID = "";
    DOB = "";
    Sex = "";
    Tel1 = "";
    Tel2 = "";
    Cell1 = "";
    Cell2 = "";
    Fax = "";
    Adddress = "";
    PointA = 0;
    PointB = 0;
    PointC = 0;
    Comment = "";
    /*
  [UserName] [nvarchar](256) NOT NULL,
  [TrueName] [nvarchar](256) NULL,
  [SID] [nvarchar](20)  NULL,
  [DOB] [smalldatetime]  NULL,
  [Sex] [nvarchar](1)  NULL,
  [Tel1] [nvarchar](20)  NULL,
  [Tel2] [nvarchar](20)  NULL,
  [Cell1] [nvarchar](20)  NULL,
  [Cell2] [nvarchar](20)  NULL,
  [Fax] [nvarchar](20)  NULL,
  [Adddress] [nvarchar](256)  NULL,
  [PointA][int] NOT NULL,
  [PointB][int] NOT NULL,
  [PointC][int] NOT NULL,
  [Comment] [nvarchar](256) NOT NULL,
     */
  }
}