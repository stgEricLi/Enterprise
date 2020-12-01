using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for clsPayment
/// </summary>
public class clsPayment
{
    public string OrderID;
    public string Name;
    public string ActName;
    public string ActID;
    public string PayName;
    public string Tel;
    public string Cell;
    public int Payable;
    public int ActualPay;
    public string PayType;
    public string Account;
    public string MainComment;
    public string Comment;
    public string PostDay;
    public string PayDay;
    //[ActName], [OrderID],[Name],[PayName],[Payable],[ActualPay],[Tel],[Cell],[PayType],[Account],[MainCmt],[Comment],[PayDay] 
    public clsPayment()
    {
        OrderID = "";
        Name = "";
        ActName = "";
        ActID = "";
        PayName = "";
        Tel = "";
        Cell = "";
        Payable = 0;
        ActualPay = 0;
        PayType = "";
        Account = "";
        Comment = "";
        MainComment = "";
        PostDay = DateTime.Now.ToString("yyyy/MM/dd");
        PayDay = DateTime.Now.ToString("yyyy/MM/dd");
    }
}

public class clsSwPayPageing
{
    public int TotalRows;
    public List<clsPayment> SwPay;
}