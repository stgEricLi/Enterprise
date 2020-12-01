using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for clsNews
/// </summary>
public class clsNews
{

    public int NewsID; 
    public string Desc;
    public string NewsDate;
    public string Company;
    public string Link;
    public Boolean Enable;

	public clsNews(){
        Desc = "";
        NewsDate = DateTime.Now.ToString("yyyy/mm/dd");        
        Company = "";
        Link = "";
        Enable = true;
	}
}

public class clsNewsPageing {
  public int TotalRows;
  public List<clsNews> News;
}