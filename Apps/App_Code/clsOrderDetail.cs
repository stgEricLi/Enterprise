using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>訂單明細物件</summary>
public class clsOrderDetail
{
  public int SeqNo;
  public string OrderID;
  public string ActID;
  public string ActName;
  public string Name;
  public string SID;
  public string EmpID;
  public string DOB;
  public string Sex;
  public string Cell;
  public string Email;
  public string Size;
  public int Price;
  public Boolean IsVeg;
  public Boolean IsOld;
  public Boolean IsEarly;
  public Boolean IsDiscount;
  public string Comment;
  public string Location;
  public string TempField;

	public clsOrderDetail()
	{   
    SeqNo = 0;
    OrderID = "";
    ActID = "";
    ActName = "";
    Name = "";    
    SID = "";
    EmpID="";
    DOB = "";
    Sex = "男";
    Cell = "";
    Size="L";
    Price = 0;
    IsOld = false;
    IsVeg = false;
    IsEarly = false;
    IsDiscount = true;
    Comment = "";
    Location = "";
    TempField = "N";
    Email="";
        /*
            [SeqNo] [int] IDENTITY(1,1) NOT NULL,		--流水號
            [OrderID] [nvarchar](50) NOT NULL,			--訂單編號
            [ActID] [nvarchar](15) NOT NULL,			--活動編號
            [ActName] [nvarchar](50) NOT NULL,			--活動名稱
            [Name] [nvarchar](50) NOT NULL,				--參加人姓名
            [SID] [nvarchar](20) NULL,					--身份證或護照號碼
            [EmpID] [nvarchar](20) NULL,				--員工工號
            [DOB] [smalldatetime] NULL,					--生日
            [Sex] [nvarchar](1) NULL,					--性別
            [Cell] [nvarchar](20) NULL,					--聯絡手機
            [Email] [nvarchar](256) NULL,				--聯絡Email
            [Size] [nvarchar](5) NULL,					--衣服尺寸
            [IsVeg] [bit]  NULL,						--是否素食
            [IsOld] [bit]  NULL,						--是否舊客戶
            [IsEarly] [bit] NULL,						--是否早鳥
            [IsDiscount] [bit] NULL,					--是否有折扣
            [Price] [int]  NOT NULL,					--金額
            [Comment] [nvarchar](255) NULL,				--備註說明
            [Location] [nvarchar](50) NULL,				--上課或上車地點	
            [TempField] [nvarchar](255) NULL,			--文字擴充欄位
            [FieldStr1] [nvarchar](255) NULL,			--文字擴充欄位
            [FieldStr2] [nvarchar](255) NULL,			--文字擴充欄位
            [FieldInt1] [smallint]  NULL,				--數字擴充欄位
            [FieldInt2] [smallint]  NULL,				--數字擴充欄位
        */
    }
}