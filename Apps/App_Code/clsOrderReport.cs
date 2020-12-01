using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for clsOrderReport
/// </summary>
public class clsOrderReport : clsOrderDetail 
{
    public string mainName;
    public string mainTel;
    public string mainCell;
    public string Address;
    public string mainEmail;
    public string mainCmt;
    public int TotalPrice;

	public clsOrderReport()
	{
        mainName = "";
        mainTel = "";
        mainCell = "";
        Address = "";
        mainEmail = "";
        mainCmt = "";
        TotalPrice = 0;
	}
}


public class clsOrderReportWithPay : clsOrderReport
{
    public string PayName;
    public string PayType;
    public string Account;
    public string PayDay;
    public string StartDay;
    public string PayCmt;
    public int ActualPay;

    public clsOrderReportWithPay()
    {
        PayName = "";
        PayType = "";
        Account = "";
        PayDay = "";
        StartDay = "";
        PayCmt = "";
        ActualPay = 0;
    }
}