using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for clsMyOrder
/// </summary>
public class clsMyOrder
{

    public string OrderID;
    public string Leader;
    public string Phone;
    public string Room;
    public string Email;   
    public string Comment;
    public string ActID;
    public string ActName;
    public string Joiner;
    public string SID;
    public string EmpID;
    public string DOB;
    public string Sex;
    public string Cell;
    public string PersonMail;
    public string Size;
    public string Summary;
    public string StartDay;
    public string RegExpDay;
    public Boolean IsVeg;
    public int price;
    public int TotalPrice;
    public int Seqno;
    public string Switch;

    public clsMyOrder()
	{
        OrderID = "";
        Leader = "";
        Phone = "";
        Room = "";
        Email = "";
        Comment = "";
        ActID = "";
        ActName = "";
        Joiner = "";
        SID = "";
        EmpID = "";
        DOB = "";
        Sex = "";
        Cell = "";
        PersonMail = "";
        Size = "";
        Summary = "";
        price = 0;
        TotalPrice = 0;
        Seqno = 0;
        IsVeg = false;
        StartDay = DateTime.Now.ToString("yyyy/mm/dd");
        RegExpDay = DateTime.Now.ToString("yyyy/mm/dd");
        Switch = "";

    }
}

public class clsRoom {
    // aryRoom['2B'] = { capacity: 3, room: 2, desc: "房型: 2位成人加1位三歲以下兒童。", adult: 2, three: 1, six: 0, cmd: "，1位三歲以下兒童500元行政費用。" };
    public int Capacity;
    public int RoomType;
    public int AdultAmt;
    public int threeYrAmt;
    public int sixYrAmt;
    public string Desc;
    public string Cmd;

    public clsRoom() {
        Capacity = 0;
        RoomType = 0;
        AdultAmt = 0;
        threeYrAmt = 0;
        sixYrAmt = 0;
        Desc = "";
        Cmd = "";
    }

    public clsRoom(int capacity, int roomtype, int adult, int three, int six, string desc, string cmd)
    {
        Capacity = capacity;
        RoomType = roomtype;
        AdultAmt = adult;
        threeYrAmt = three;
        sixYrAmt = six;
        Desc = desc;
        Cmd = cmd;
    }
}