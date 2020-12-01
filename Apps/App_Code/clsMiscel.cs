using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for clsMiscel
/// </summary>
public class clsMiscel
{
    public int ID; 
    public string Company;  
    public int intField1;
    public int intField2;
    public string txtField1;
    public string txtField2;
    public string dayField;
  
  
	public clsMiscel()
	{
        ID = 0;
        Company = "";
        txtField1 = "";
        txtField2 = "";
        intField1 = 0;
        intField1 = 0;
        dayField = DateTime.Now.ToString("yyyy/mm/dd");

	}
}