using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for clsHotel
/// </summary>
public class clsHotelSchedule
{
    public string ActID;
    public int ID;
    public string Name;
    public int RoomType;
    public string OpenDay;
    public int Qty;
}

public class HotelScheduleAddModel
{
    public string ActID;
    public int R2;
    public int R3;
    public int R4;
    public string Date;
}

public class HotelScheduleUpdateModel
{   
    public int ID;
    public int Qty;
    public string Action;
}

public class clsHotelOrder
{
    public string OrderID;
    public string Name;
    public string EID;
    public string SID;
    public string DOB;
    public string Tel;
    public string Cell;
    public string Email;
    public int Price;
    public string ChickIn;
    public int HotelID;
    public string Comment;
    public string CreateDay;
}

public class clsHotelWeekdayOrder
{
    public string ActID;
    public string Name;
    public string EID;
    public string SID;
    public string DOB;
    public string Tel;
    public string Cell;
    public string Email;
    public int Price;
    public string CheckIn;
    public int HotelID;
    public int RoomType;
    public string Comment;
    public string AccessDate;
}

public class HotelOrderPaging
{
    public int TotalRows;
    public List<HotelList> Orders;
}

public class HotelList
{
    public string ActName;
    public int RoomType;
    public string OpenDay;
    public string OrderID;
    public string Name;
    public string EID;
    public string SID;
    public string DOB;
    public string Tel;
    public string Cell;
    public string Email;
    public int Price;
    public string ChickIn;
    public string Comment;
    public string CreateDay;
}

public class HotelWeekdayPaging
{
    public int TotalRows;
    public List<HotelWeekdayList> Orders;
}

public class HotelWeekdayList
{
    public string ActName;
    public int RoomType;
    public string AccessDate;
    public string OrderID;
    public string Name;
    public string EID;
    public string SID;
    public string DOB;
    public string Tel;
    public string Cell;
    public string Email;
    public int Price;
    public string CheckIn;
    public string Comment;
}


public class HotelOrderUpdateModel
{
    public string OrderID;
    public string Tel;
    public string Cell;
    public string Email;
    public string SID;
    public string DOB;
    public int Price;
    public string ChickIn;
    public string Comment;
    public string Action;
}

public class HotelWeekdayUpdateModel
{
    public string OrderID;
    public string Tel;
    public string Cell;
    public string Email;
    public string SID;
    public string DOB;
    public int Price;
    public string CheckIn;
    public string AccessDate;
    public string Comment;
    public string Action;
}

public class HotePaylList
{
    public string ActName;
    public int RoomType;
    public string OpenDay;
    public string OrderID;
    public string Name;
    public string EID;
    public string SID;
    public int Price;
    public string Comment;
    public string PayName;
    public string PayTel;
    public string PayCell;
    public int ActualPay;   
    public string PayType;   
    public string Account;
    public string PayCmt;
    public string PayDay;
}

public class HoteReportList : HotePaylList
{
    public string Tel;
    public string Cell;
    public string Email;
    public string DOB;
    public string CheckIn;
    public string CreateDay;
}


public class HotePayPaging
{
    public int TotalRows;
    public List<HotePaylList> PayList;
}


public class HotelPayUpdateModel
{
    public string OrderID;
    public int Price;
    public string Account;
    public string Comment;
    public string Action;
}