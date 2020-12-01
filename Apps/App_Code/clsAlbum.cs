using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for clsAlbum
/// </summary>
public class clsAlbum
{
    public int ID;
    public string Title;
    public string AlbumDate;
    public string Company;
    public string TargetLink;
    public string ImgUrl;
	public clsAlbum()
	{
        Title = "";
        AlbumDate = DateTime.Now.ToString("yyyy/mm/dd");
        Company = "";
        TargetLink = "";
        ImgUrl = "";
        
	}
}

public class clsAlbumPageing {
  public int TotalRows;
  public List<clsAlbum> Albums;
}