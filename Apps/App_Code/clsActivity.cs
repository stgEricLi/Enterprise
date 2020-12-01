using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>活動行程類別 </summary>
public class clsActivity
{
  public string ActID; //E1030702001 
  public string Name;
  public string StartDay;
  public string RegExpDay;
  public string Company;
  public int Capacity;
  public int Price;
  public int Price2;
  public Boolean Enable;

  public string FieldStr1;
  public string FieldStr2;
  public int FieldInt1;
  public int FieldInt2;

  // 第一碼：E  
  // 第二碼~四碼：民國年
  // 第五碼~八碼：月日
  // 後三碼：流水號
	public clsActivity()
	{
    ActID = "";
    Name = "";
    StartDay = DateTime.Now.ToString("yyyy/mm/dd") ;
    RegExpDay = DateTime.Now.ToString("yyyy/mm/dd");
    Company="";
    Capacity = 80;
    Price = 0;
    Price2 = 0;
    Enable = true;
    FieldStr1 = "";
    FieldStr2 = "";
    FieldInt1 = 0;
    FieldInt2 = 0;
        /*
        [ActID] [nvarchar](15) NOT NULL,				--行程編號
        [Name] [nvarchar](50) NOT NULL,					--行程名稱
        [StartDay] [smalldatetime] NOT NULL,			--起始日
        [RegExpDay] [smalldatetime] NOT NULL,			--報名截止日
        [Capacity] [smallint] NOT NULL,					--人數
        [Price] [smallint] NOT NULL,					--價格
        [Price2] [smallint] NOT NULL,					--價格2
        [Company] [nvarchar](50) NOT NULL,				--企業名稱
        [Enable] [bit] NOT NULL,						--開啟
        [FieldStr1] [nvarchar](255) NULL,				--文字擴充欄位
        [FieldStr2] [nvarchar](255) NULL,				--文字擴充欄位
        [FieldInt1] [smallint]  NULL,					--數字擴充欄位
        [FieldInt2] [smallint]  NULL,					--數字擴充欄位
       */
    }


}

public class clsActPageing {
  public int TotalRows;
  public List<clsActivity> Acts;
}