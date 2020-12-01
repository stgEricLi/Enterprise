using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>訂單物件</summary>
public class clsOrder{
  public string OrderID;
  public string Name;
  public string Tel1;
  public string Tel2;
  public string Cell1;
  public string Cell2;
  public string Fax;
  public string Address;
  public string Email;
  public int TotalPrice;
  public Boolean IsPaid;
  public Boolean IsConfirm;
  public Boolean IsPromote;
  public string Comment;
  public string Source;
  public string Company;
  public string CreateDay;

	public clsOrder()
	{
    OrderID = "";
    Name = "";    
    Tel1 = "";
    Tel2 = "";
    Cell1 = "";
    Cell2 = "";
    Fax = "";
    Address = "";
    Email = "";
    TotalPrice = 0;
    IsPaid = false;
    IsConfirm = false;
    IsPromote=false;
    Comment = "";    
    Source = "";
    Company = "";
    CreateDay = "";
    /*
        [OrderID] [nvarchar](50) NOT NULL,			--訂單編號
        [Name] [nvarchar](256) NOT NULL,			--聯絡人
        [Tel1] [nvarchar](20) NULL,					--主要電話
        [Tel2] [nvarchar](20) NULL,					--次要電話
        [Cell1] [nvarchar](20) NULL,				--主要手機
        [cell2] [nvarchar](20) NULL,				--次要手機
        [Fax] [nvarchar](20) NULL,					--傳真
        [Address] [nvarchar](256) NULL,				--地址
        [Email] [nvarchar](300) NULL,				--Email
        [TotalPrice] [int]  NOT NULL,				--總金額
        [IsPaid] [bit]   NOT NULL,					--是否付款
        [IsConfirm] [bit]   NOT NULL,				--是否確定參加
        [IsPromote] [bit]   NOT NULL,				--是否收到廣告
        [Comment] [nvarchar](300) NULL,				--備註說明
        [Source] [nvarchar](20) NULL,				--消息來源
        [Company] [nvarchar](50) NULL,				--公司企業
        [CreateDay] [smalldatetime] NOT NULL,		--下單日
        [FieldStr1] [nvarchar](255) NULL,			--文字擴充欄位
        [FieldStr2] [nvarchar](255) NULL,			--文字擴充欄位
        [FieldInt1] [smallint]  NULL,				--數字擴充欄位
        [FieldInt2] [smallint]  NULL,				--數字擴充欄位
    */
    }
}

public class clsOrderPageing
{
    public int TotalRows;
    public List<clsOrder> Orders;
}

public class clsOrderWithStartDay : clsOrder
{
    public string ActName;
    public string StartDay;

    public clsOrderWithStartDay()
    {
        ActName = "";
        StartDay = "";
    }
}

public class clsOrderWithStartDayPageing
{
    public int TotalRows;
    public List<clsOrderWithStartDay> Orders;
}