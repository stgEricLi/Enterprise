var WT = (function () {
  "use strict";

  var aryRoom = [];
  var arryVeg = ["吃素", "不吃素"];
  var arryVegVal = ["true", "false"];

  function Joinner() {
    this.ActID = "";
    this.ActName = "";
    this.Name = "";
    this.SID = "";
    this.EmpID = "";
    this.DOB = "";
    this.Cell = "";
    this.Email = "";
    this.IsVeg = "";
    this.TempField = "";
    this.Age = 0;
    this.SeqNo = 0;
  }

  function Info() {
    this.KidSixYr = 0;
    this.KidThreeYr = 0;
    this.Adult = 0;
    this.FreeCount = 0;
    this.NumOfPeople = 0;
    this.TotalAmount = 0;
    this.Room = 0;
    this.Command = "";
    this.Error = "";
    this.RoomType = "";
  }

  function initialRoom() {
    aryRoom["2A"] = { capacity: 2, room: 2, desc: "請輸入2位成人參加者資料。", adult: 2, three: 0, six: 0, cmd: "" };
    aryRoom["2B"] = { capacity: 3, room: 2, desc: "請輸入2位成人參加者，及1位三歲以下兒童資料（2016年1月以後出生）。", adult: 2, three: 1, six: 0, cmd: "，1位三歲以下兒童500元行政費用。" };
    aryRoom["2C"] = { capacity: 4, room: 2, desc: "請輸入2位成人參加者，1位四至六歲兒童（2013年1月以後出生），及1位三歲以下兒童資料（2016年1月以後出生）。", adult: 2, three: 1, six: 1, cmd: "，1位四至六歲兒童不佔床餐1000元，1位三歲以下兒童500元行政費用。" };
    aryRoom["2D"] = { capacity: 2, room: 2, desc: "請輸入1位成人參加者，1位四至六歲兒童（2013年1月以後出生）。", adult: 1, three: 0, six: 1, cmd: "，1位四至六歲兒童佔床餐（等同成人費用）。" };
    aryRoom["2F"] = { capacity: 3, room: 2, desc: "請輸入2位成人參加者，1位四至六歲兒童（2013年1月以後出生）。", adult: 2, three: 0, six: 1, cmd: "，1位四至六歲兒童不佔床餐。" };
    aryRoom["2G"] = { capacity: 4, room: 2, desc: "請輸入2位成人參加者，2位三歲以下兒童（2016年1月以後出生）。", adult: 2, three: 2, six: 0, cmd: "，2位四至六歲兒童不佔床餐。" };
    aryRoom["2H"] = { capacity: 4, room: 2, desc: "請輸入2位成人參加者，2位四至六歲兒童（2013年1月以後出生）。", adult: 2, three: 0, six: 2, cmd: "，2位四至六歲兒童不佔床餐。" };
    aryRoom["4A"] = { capacity: 4, room: 4, desc: "請輸入4位成人參加者資料。", adult: 4, three: 0, six: 0, cmd: "" };
    aryRoom["4B"] = { capacity: 5, room: 4, desc: "請輸入4位成人參加者，及1位三歲以下兒童資料（2015年1月以後出生）。", adult: 4, three: 1, six: 0, cmd: "，1位三歲以下兒童500元行政費用。" };
    aryRoom["4C"] = { capacity: 6, room: 4, desc: "請輸入4位成人參加者，1位四至六歲兒童（2013年1月以後出生），及1位三歲以下兒童資料（2016年1月以後出生）。", adult: 4, three: 1, six: 1, cmd: "，1位四至六歲兒童不佔床餐1000元，1位三歲以下兒童500元行政費用。" };
    aryRoom["4D"] = { capacity: 4, room: 4, desc: "請輸入3位成人參加者，1位四至六歲兒童（2013年1月以後出生）。", adult: 3, three: 0, six: 1, cmd: "，1位四至六歲兒童佔床餐（等同成人費用）。" };
    aryRoom["4F"] = { capacity: 5, room: 4, desc: "請輸入4位成人參加者，1位四至六歲兒童（2013年1月以後出生）。", adult: 4, three: 0, six: 1, cmd: "，1位四至六歲兒童不佔床餐。" };
    aryRoom["4G"] = { capacity: 6, room: 4, desc: "請輸入4位成人參加者，2位三歲以下兒童（2016年1月以後出生）。", adult: 4, three: 2, six: 0, cmd: "，2位四至六歲兒童不佔床餐。" };
    aryRoom["4H"] = { capacity: 6, room: 4, desc: "請輸入4位成人參加者，2位四至六歲兒童（2013年1月以後出生）。", adult: 4, three: 0, six: 2, cmd: "，2位四至六歲兒童不佔床餐。" };
  }

  function checkRoomAvailable(roomType, restRoom2, restRoom4) {
    var message = [];
    var roomObj = aryRoom[roomType];
    if (roomObj.room == 2 && restRoom2 <= 0) message.push("此活動目前兩人房已額滿，請從新選擇！");
    if (roomObj.room == 4 && restRoom4 <= 0) message.push("此活動目前四人房已額滿，請從新選擇！");

    //if (roomObj.room == 2 && roomObj.room > room2)
    //    message.push("此活動目前兩人房已無餘額，請從新選擇！");
    //if (roomObj.room == 4 && roomObj.room > room4)
    //    message.push("此活動目前四人房已無餘額，請從新選擇！");
    return message;
  }

  function getCapacity(roomType) {
    return aryRoom[roomType].capacity;
  }

  function getRoomObject(roomType) {
    return aryRoom[roomType];
  }

  function createJoinerForm(capacity, leaderName, leaderSID, leaderEID) {
    var sb = "<table class='table table-striped' style='width:100%;'>";
    sb += "<tr><th>中文姓名</th><th>身分字號</th><th>生日</th><th>員工工號</th><th>手機</th><th>素食</th><th>Email</th></tr>";
    for (var i = 1; i <= capacity; i++) {
      sb += "<tr class='listline'>";
      if (i == 1) {
        sb += "<td style='width:124px;'><input id='txtName1' type='text' value='" + leaderName + "' class='form-control input-sm'  disabled/></td>";
        sb += "<td style='width:124px;'><input id='txtSid1' type='text' value='" + leaderSID + "' class='form-control input-sm'  disabled/></td>";
      } else {
        sb += "<td style='width:124px;'>" + textBox("txtName" + i, "", "required", 15, 0, "中文姓名") + "</td>";
        sb += "<td style='width:124px;'>" + textBox("txtSid" + i, "", "required", 10, 0, "身分字號") + "</td>";
      }
      sb += "<td style='width:266px;'>";
      sb += "<select id='ddlYr" + i + "' class='form-control input-sm' style='width:72px;'></select>";
      sb += "<select id='ddlMm" + i + "' class='form-control input-sm' style='width:60px;'></select>";
      sb += "<select id='ddlDd" + i + "' class='form-control input-sm' style='width:60px;'></select>";
      sb += "</td>";
      if (i == 1) {
        sb += "<td style='width:124px;'><input id='txtEid1' type='text' value='" + leaderEID + "' class='form-control input-sm'  disabled/></td>";
      } else {
        //sb += "<td style='width:124px;'>" + textBox('txtEid' + i, '', '', 12, 0, '員工工號') + "</td>";
        sb += "<td style='width:124px;'><input id='txtEid" + i + "' type='text' class='form-control input-sm'  onblur='WT.evulateEid(this.id)'/></td>";
      }
      sb += "<td  style='width:142px;'>" + textBox("txtCell" + i, "", "required", 11, 0, '手機：0900-000000"') + "</td>";
      sb += "<td style='width:96px;'>" + dropList("ddlVeg" + i, arryVeg, arryVegVal, "false", 84) + "</td>";
      sb += "<td>" + textBox("txtEmail" + i, "", "required", 120, 0, "Email");
      sb += "<input type='hidden' id='hidSeqno" + i + "' value='" + i + "' /></td>";
      sb += "</tr>";
    }
    sb += "</table>";
    return sb;
  }

  function evulateEid(id) {
    var txtbox = $("#" + id);
    var tr = txtbox.parent().parent();
    var eid = txtbox.val();
    var sid = tr.find("input[id^='txtSid']").val();
    var actid = $("#hidActid").val();

    if (eid.length <= 0) {
      return false;
    }
    if (!isEID(eid)) {
      alert("請先輸入合法的工號再繼續");
      return false;
    }
    if (!isSID(sid)) {
      alert("請先輸入合法的身份證號再繼續");
      return false;
    }

    checkEmployee(eid, sid, actid)
      .done((response) => {
        if (response.hasOwnProperty("d")) {
          /*if (parseInt(JSON.parse(response.d)) <= 0) {
                    txtbox.val('');
                    alert("查不到此工號 " + eid + " 或是此系列活動已參加了！");
                    return false;
                }*/
          if (response.d == "Empty") {
            txtbox.val("");
            alert("查不到此工號 " + eid + " 或是此系列活動已參加了！");
            return false;
          }
          tr.find("input[id^='txtName']").val(response.d);
        }
      })
      .fail((xhr, textStatus, error) => {
        console.log(xhr.status);
        console.log(error);
        console.log("checkEmployee Failed");
        txtbox.val("");
        alert("很抱歉服務器發生錯誤，請稍後再嘗試！");
        return false;
      });
    //console.log(eid);
    //console.log(sid);
    //console.log(actid);
  }

  function getJoinerList(actId, actName) {
    var aryJoinner = [];
    if ($("tr.listline").size() > 0) {
      var y = "";
      $("tr.listline").each(function (i) {
        var j = new Joinner();
        y = $(this).find("select[id^='ddlYr']").val();
        j.ActID = actId;
        j.ActName = actName;
        j.Name = $(this).find("input[id^='txtName']").val();
        j.SID = $(this).find("input[id^='txtSid']").val();
        j.DOB = y + "/" + padLeft("00", $(this).find("select[id^='ddlMm']").val()) + "/" + padLeft("00", $(this).find("select[id^='ddlDd']").val());
        j.EmpID = $(this).find("input[id^='txtEid']").val();
        j.Cell = $(this).find("input[id^='txtCell']").val();
        j.IsVeg = $(this).find("select[id^='ddlVeg']").val();
        j.Email = $(this).find("input[id^='txtEmail']").val();
        j.Age = getAges(parseInt(y));
        j.SeqNo = parseInt($(this).find("input[id^='hidSeqno']").val());
        aryJoinner.push(j);
      });
    }
    return aryJoinner;
  }

  function validateJoiner(jArray) {
    var message = [];
    var temp = [];
    $.each(jArray, function (i, v) {
      if (v.Name.length <= 0) {
        //message.push("第 " + (i + 1) + " 位參加人:請輸入姓名");
        message.push("請輸入姓名");
      }
      if (!isSID(v.SID)) {
        // message.push("第 " + (i + 1) + " 位參加人:身份證號格式錯誤");
        message.push("身份證號格式錯誤");
      }
      if (!isValidDate(v.DOB)) {
        //message.push("第 " + (i + 1) + " 位參加人:生日格式錯誤");
        message.push("生日格式錯誤");
      }
      if (!isTel(v.Cell, "cell")) {
        //message.push("第 " + (i + 1) + " 位參加人:手機號碼格式錯誤 0900-000000");
        message.push("手機號碼格式錯誤 0900-000000");
      }
      if (!isEmail(v.Email)) {
        //message.push("第 " + (i + 1) + " 位參加人:Email 格式錯誤");
        message.push("Email 格式錯誤");
      }
    });

    if (message.length > 0) {
      return message;
    }

    $.each(jArray, function (key, joiner) {
      if (temp.findIndex((x) => x.SID === joiner.SID) === -1) {
        temp.push(joiner);
      } else {
        message.push("有重複的身份證號 " + joiner.SID + " 請重新輸入！");
      }
    });

    /*
       temp = [];
       $.each(jArray, function (idx, j) {
           if (j.EmpID.length > 0) {
               if (temp.findIndex(x => x.EmpID === j.EmpID) === -1) {
                   temp.push(j);
               } else {
                   message.push("有重複的工號 " + j.EmpID + " 請重新輸入！");
               }
           }          
       });
       */
    // if(temp.findIndex(x => x.SID === v.SID && x.Name ==='thovadimmas'))
    return message;
  }

  function validateTwoDaysOrder(jArray, roomType) {
    var objRoom = aryRoom[roomType];
    var info = new Info();
    info.Room = objRoom.room;
    info.RoomType = roomType;
    $.each(jArray, function (i, j) {
      switch (j.Age) {
        case 3:
          info.KidThreeYr = info.KidThreeYr + 1;
          break;
        case 6:
          info.KidSixYr = info.KidSixYr + 1;
          break;
        default:
          info.Adult = info.Adult + 1;
          break;
      }
      if (j.EmpID.length > 0) {
        info.FreeCount = info.FreeCount + 2;
      }
      info.NumOfPeople = info.NumOfPeople + 1;
    });

    if (objRoom.adult != info.Adult || objRoom.three != info.KidThreeYr || objRoom.six != info.KidSixYr) {
      info.Error = objRoom.desc;
    }

    info.TotalAmount = info.Adult * 5000 + info.KidSixYr * 1000 + info.KidThreeYr * 500 - info.FreeCount * 5000;

    if (roomType == "4D") {
      //3位成人+1位六歲兒童佔床餐（等同成人費用）
      info.TotalAmount = info.Adult * 5000 + info.KidSixYr * 5000 + info.KidThreeYr * 500 - info.FreeCount * 5000;
    }

    return info;
  }

  function validateOneDayOrder(jArray) {
    console.log(jArray);
    var message = [];
    var employee = 0,
      adult = 0;
    $.each(jArray, function (i, j) {
      if (j.EmpID.length > 0) {
        employee += 1;
        adult += 1;
      } else {
        if (j.Age > 3) {
          adult += 1;
        }
      }
    });
    if (employee <= 0) {
      message.push("需有一組員工工號！");
    }
    if (employee > 2) {
      message.push("員工攜伴者，不可為公司同仁！");
    }
    // if (employee == 2 && adult > 8) { message.push("每位同仁最多攜伴3人！"); }
    if (employee == 1 && adult > 4) {
      message.push("每位同仁最多攜伴3人！");
    }
    return message;
  }

  function calculateOneDayPrice(jArray) {
    var aryJoinner = [];
    var price = 0,
      freeCount = 0,
      discount1000 = 0,
      discount2300 = 0;
    $.each(jArray, function (i, j) {
      if (j.EmpID.length > 0) {
        freeCount += 2;
        discount1000 += 1;
        //discount2300 += 1;
      }
    });

    //先算員工金額
    $.each(jArray, function (i, j) {
      if (j.EmpID.length > 0) {
        j.Price = 0;
        freeCount -= 1;
        aryJoinner.push(j);
        return true;
      }
    });

    //再算成人眷屬金額
    $.each(jArray, function (i, j) {
      if (j.EmpID.length <= 0 && j.Age > 3) {
        if (freeCount > 0) {
          j.Price = 0;
          freeCount -= 1;
        } else {
          if (discount1000 > 0) {
            j.Price = 1000;
            discount1000 -= 1;
          } else {
            j.Price = 2300;
            //if (discount2300 > 0) {
            //    j.Price = 2300;
            //    discount2300 -= 1;
            //} else {
            //    j.Price = 2300;
            //}
          }
        } // End Else
        aryJoinner.push(j);
      }
    });

    //再算3歲小孩眷屬金額
    $.each(jArray, function (i, j) {
      if (j.Age <= 3) {
        //if (discount1000 > 0) {
        //    j.Price = 0;
        //    freeCount -= 1;
        //} else {
        //    j.Price = 200;
        //}
        j.Price = 200;
        if (freeCount > 0) {
          j.Price = 0;
        }

        aryJoinner.push(j);
        return true;
      }
    });

    return aryJoinner;
  }

  function assignDateToDll() {
    var today = new Date();
    var days = 0;
    var sb = "";
    $("tr.listline").each(function (i) {
      var yy = $("#" + $(this).find("select[id^='ddlYr']").attr("id"));
      var mm = $("#" + $(this).find("select[id^='ddlMm']").attr("id"));
      var dd = $("#" + $(this).find("select[id^='ddlDd']").attr("id"));
      yy.append("<option value='0'>年</option>");
      for (var yr = 1911; yr <= today.getFullYear(); yr++) {
        yy.append("<option value='" + yr + "'>" + yr + "</option>");
      }
      mm.append("<option value='0'>月</option>");
      for (var mt = 1; mt <= 12; mt++) {
        mm.append("<option value='" + mt + "'>" + mt + "</option>");
      }
      dd.append("<option value='0'>日</option>");
      yy.change(function () {
        if (this.value != "0" && mm.val() != "0") {
          dd.empty();
          days = daysInMonth(parseInt(mm.val()), parseInt(this.value));
          for (var dy = 1; dy <= days; dy++) {
            dd.append("<option value='" + dy + "'>" + dy + "</option>");
          }
        }
      });
      mm.change(function () {
        if (this.value != "0" && yy.val() != "0") {
          dd.empty();
          //days = daysInMonth(parseInt(mm.val()), parseInt(this.value));
          days = daysInMonth(parseInt(this.value), parseInt(yy.val()));
          //console.log("mm.change: " + days);
          for (var dy = 1; dy <= days; dy++) {
            dd.append("<option value='" + dy + "'>" + dy + "</option>");
          }
        }
      });
    });
  }

  function dropList(/* id */ id, /* ddlText */ arryText, /* ddlValue */ arryValue, /* string */ matchText, width) {
    var htm = "";
    htm += "<select id='" + id + "' class='form-control input-sm' ";
    if (width > 0) {
      htm += "style='width:" + width.toString() + "px!important;'";
    }
    htm += " >";

    if (arryText.length <= 0 || arryValue.length <= 0) {
      htm += "<option value='none'>無法載入資料</option></select>";
      return htm;
    }

    $.each(arryText, function (i, value) {
      htm += "<option value='" + arryValue[i].toString() + "' ";
      if (arryValue[i].toString() == matchText.toString()) {
        htm += " selected ";
      }
      htm += ">" + value + "</option> ";
    });
    htm += "</select>";
    return htm;
  }

  function textBox(/* ID */ id, value, /* attribute */ attr, /* Max Length */ maxlength, /* Width */ width, /* placeholder */ placeholder) {
    var sb = "";
    sb += "<input id='" + id + "' type='text' value='" + value + "' ";
    sb += "class='form-control input-sm ";
    if (attr.length > 0) {
      sb += attr;
    }
    sb += "' maxLength='" + maxlength.toString() + "' ";
    if (width > 0) {
      sb += "style='width:" + width.toString() + "px!important;'";
    }
    if (placeholder.length > 0) {
      sb += " placeholder='" + placeholder + "' ";
    }
    sb += " />";
    return sb;
  }

  function isInt(no) {
    try {
      if (no.length <= 0) {
        return false;
      }
      if (isNaN(no)) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      return false;
    }
  }

  function isSID(str) {
    var pattSid = /^[A-Z]{1}[0-9]{9}$/g;
    if (!pattSid.test(str)) {
      if (!isInt(str)) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  function isEID(id) {
    return /^1[0-1][1358]\d{5}$/g.test(id);
  }

  function isTel(telNo, /*cell or tel*/ type) {
    var pattTel = /^0\d{1,4}-\d{4}-\d{1,4}(\#\d{1,6})?$/g;
    var pattCel = /^09\d{2}-([0-9]{6})$/g;
    if (type == "tel") {
      return pattTel.test(telNo);
    } //02-2952-7535
    if (type == "cell") {
      return pattCel.test(telNo);
    } //0932-666888
  }

  function isEmail(str) {
    var pattid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
    return pattid.test(str);
  }

  function getAges(y) {
    var d = new Date();
    var yr = d.getFullYear() * 1;
    var yr3 = yr - 3;
    var yr6 = yr - 6;

    var age = 18;
    if (y >= yr6) age = 6;
    if (y >= yr3) age = 3;
    return age;
  }

  function checkEmployee(eid, sid, actid) {
    return $.ajax({
      type: "POST",
      url: "../../mcpservices/SvOrder.asmx/Check_Employee",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({ eid: eid, sid: sid, aid: actid }),
    });
  }

  function generateOneDayConfirm(arrayJoinner) {
    $("#confirmation").html("");
    var total = 0;
    var sb = "<table class='table table-striped' style='width:100%;'>";
    sb += "<tr><th>中文姓名</th><th>身分字號</th><th>生日</th><th>員工工號</th><th>手機</th><th>素食</th><th>Email</th><th>金額</th></tr>";
    $.each(arrayJoinner, function (i, joiner) {
      sb += "<tr class='FinalLine'>";
      sb += "<td>" + joiner.Name + "</span>";
      if (i == 0) {
        sb += "<span class='text-danger'>(主要聯絡人)</span>";
      }
      sb += "</td>";
      sb += "<td>" + joiner.SID + "</td>";
      sb += "<td>" + joiner.DOB + "<sapn class='text-danger'>";
      if (joiner.Age == 3) {
        sb += "（3歲以下）";
      }
      sb += "</span></td>";
      sb += "<td>" + joiner.EmpID + "</td>";
      sb += "<td>" + joiner.Cell + "</td>";
      if (joiner.IsVeg == "true") {
        sb += "<td>素食</td>";
      } else {
        sb += "<td>X</td>";
      }
      sb += "<td>" + joiner.Email + "</td>";
      sb += "<td>" + joiner.Price + "</td>";
      sb += "</tr>";
      total += joiner.Price;
    });
    sb += "</table>";
    sb += "<div style='margin-top:12px; border-top:dotted 1px #c0c0c0; padding:12px; text-align:right;'>";
    sb += "<p>共有 " + arrayJoinner.length + " 參加人，預估應付總金額為：<span class='text-danger'>";
    if (total <= 0) {
      sb += "$0</span></p>";
    } else {
      sb += "$" + total + "</span></p>";
    }
    sb += "</div>";
    $("#confirmation").html(sb);
  }

  function generateTwoDaysConfirm(arrayJoinner, info) {
    var free = info.FreeCount * 1;
    var price = 0;

    $.each(arrayJoinner, function (i, v) {
      if (v.Age > 6) {
        price = 5000;
        if (free > 0) {
          price = 0;
          free -= 1;
        }
        v.Price = price;
      }
    });
    $.each(arrayJoinner, function (i, v) {
      if (v.Age == 6) {
        price = 1000;
        if (info.RoomType == "4D") {
          //3位成人+1位六歲兒童佔床餐（等同成人費用）
          price = 5000;
        }
        if (free > 0) {
          price = 0;
          free -= 1;
        }
        v.Price = price;
      }
    });
    $.each(arrayJoinner, function (i, v) {
      if (v.Age == 3) {
        price = 500;
        if (free > 0) {
          price = 0;
          free -= 1;
        }
        v.Price = price;
      }
    });

    $("#confirmation").html("");
    var sb = "<table class='table table-striped' style='width:100%;'>";
    sb += "<tr><th>中文姓名</th><th>身分字號</th><th>生日</th><th>員工工號</th><th>手機</th><th>素食</th><th>Email</th><th>金額</th></tr>";
    $.each(arrayJoinner, function (i, joiner) {
      sb += "<tr class='FinalLine'>";
      sb += "<td>" + joiner.Name + "</span>";
      if (i == 0) {
        sb += "<span class='text-danger'>(主要聯絡人)</span>";
      }
      sb += "</td>";
      sb += "<td>" + joiner.SID + "</td>";
      sb += "<td>" + joiner.DOB + "<sapn class='text-danger'>";
      switch (joiner.Age) {
        case 3:
          sb += "（3歲以下）";
          break;
        case 6:
          sb += "（4-6歲）";
          break;
      }
      sb += "</span></td>";
      sb += "<td>" + joiner.EmpID + "</td>";
      sb += "<td>" + joiner.Cell + "</td>";
      if (joiner.IsVeg == "true") {
        sb += "<td>素食</td>";
      } else {
        sb += "<td>X</td>";
      }
      sb += "<td>" + joiner.Email + "</td>";
      sb += "<td>$" + joiner.Price + "</td>";
      sb += "</tr>";
    });
    sb += "</table>";
    sb += "<div style='margin-top:12px; border-top:dotted 1px #c0c0c0; padding:12px; text-align:right;'>";
    sb += "<p>您預定了一間 " + info.Room + " 人房，共有 " + info.NumOfPeople + " 參加人，預估應付總金額為：<span class='text-danger'>";
    if (info.TotalAmount <= 0) {
      sb += "$0</span></p>";
    } else {
      sb += "$" + info.TotalAmount + "</span></p>";
    }
    sb += "</div>";
    $("#confirmation").html(sb);
  }

  function makeTwoDaysOrder(obj) {
    return $.ajax({
      type: "POST",
      url: "../../mcpservices/SvOrder.asmx/Create_Wt_TwoDaysOrder",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(obj),
    });
  }

  function makeOneDayOrder(jArray) {
    return $.ajax({
      type: "POST",
      url: "../../mcpservices/SvOrder.asmx/Create_Wt_TwoDaysOrder",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(cdata),
    });
  }

  function makeTwoDaysWaitingList(obj) {
    return $.ajax({
      type: "POST",
      url: "../../mcpservices/SvOrder.asmx/Create_Wt_TwoDaysWaiting",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(obj),
    });
  }

  function makeOneDayWaitingList(obj) {
    return $.ajax({
      type: "POST",
      url: "../../mcpservices/SvOrder.asmx/Create_Wt_OneDayWaiting",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(obj),
    });
  }

  function makeHotelOrder(obj) {
    // return $.ajax({
    //   type: "POST",
    //   url: "../../mcpservices/SvOrder.asmx/Create_Wt_HotelOrder",
    //   contentType: "application/json; charset=utf-8",
    //   dataType: "json",
    //   data: JSON.stringify(obj),
    // });

    return $.ajax({
      type: "POST",
      url: "../../mcpservices/SvHotel.asmx/Add_Wt_HotelOrder",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(obj),
    });
  }

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  function padLeft(nth, str) {
    var res = nth.substring(0, nth.length - str.length) + str;
    return res;
  }

  function getDay(plusDay) {
    var date = new Date();
    date.setDate(date.getDate() + plusDay);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y.toString() + "/" + padLeft("00", m.toString()) + "/" + padLeft("00", d.toString());
  }

  function isValidDate(value) {
    if (value.length != 10) {
      return false;
    }
    var day = new Date(value);
    return !isNaN(day.getDate());
  }

  function daysToNow(dateString) {
    var today = new Date();
    var days = dayDiff(dateString, today, "days");
    return days;
  }

  function dayDiff(date1, date2, interval) {
    var second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24,
      week = day * 7;
    date1 = new Date(date1);
    date2 = new Date(date2);
    var timediff = date2 - date1;
    if (isNaN(timediff)) return NaN;
    switch (interval) {
      case "years":
        return date2.getFullYear() - date1.getFullYear();
      case "months":
        return date2.getFullYear() * 12 + date2.getMonth() - (date1.getFullYear() * 12 + date1.getMonth());
      case "weeks":
        return Math.floor(timediff / week);
      case "days":
        return Math.floor(timediff / day);
      case "hours":
        return Math.floor(timediff / hour);
      case "minutes":
        return Math.floor(timediff / minute);
      case "seconds":
        return Math.floor(timediff / second);
      default:
        return undefined;
    }
  }

  function pageDescTwoDays() {
    $("#pgDesc").html("");
    var sb = "";
    sb += '<div class="panel-heading panel-heading-custom">';
    sb += '<h4 class="panel-title">MCP海天青重要隱私權聲明 </h4>';
    sb += "</div>";
    sb += '<div style="padding: 12px; border-bottom: solid 1px #c0c0c0;">';
    sb += '<h4 class="text-important">為了資料的安全性與頁面功能的完整性，建議您使用最新版本的瀏覽器來進行線上報名。';
    sb += '在進行報名之前請先詳細閱讀<span class="text-primary">「MCP海天青重要隱私權聲明」</span>，';
    sb += '然後請勾選<span class="text-primary">「我同意此項聲明」</span>來進行線上報名程序。</h4>';
    sb += "</div>";
    sb += '<div class="panel-body">';
    sb += "<p>本公司僅收集我們認為相關且有助於您的旅遊保險所必要的個人資料。我們會運用您的個人資料，以向您提供更好的客戶服務。除非已經取得您的同意、或依法令規定、或事前已向您通知，本會不會向任何外界機構或個人透露您的個人資料。</p>";
    sb += "<p>本公司實行嚴格的個資安全政策，以防止任何人（包括本公司職員）未經授權而取得您的個人資料。本公司所有獲准使用您的個人資料的職員及第三人，均被特別要求遵守本公司的保密義務。";
    sb += "網際網路資料的傳輸於現行科技下，尚不能保證百分之百的安全；因此，儘管MCP海天青旅行社在保護您的個人資料安全上做最嚴格的把關，";
    sb += "我們也無法確信或保證您傳送給MCP海天青旅行社的資料之絕對安全；所以鄭重提醒您，並請您瞭解、注意並承擔此部分之風險。</p>";
    sb += "<p>本公司會將活動照片放在報名網站上或粉絲團內，以供同仁下載，不會用在商業行為上。</p>";
    sb += '<h5 style="color: Red;">補助辦法：</h5>';
    sb += "<ol>";
    sb += "<li>每位同仁最多可攜伴3人(不含未足6歲不佔床不占餐兒童)。</li>";
    sb += "<li>員工本人全額補助（每人限補助一次）。</li>";
    sb += "<li>員工攜伴第1人免費。</li>";
    sb += "<li>員工攜伴第2人需自費新台幣 $5,000元。</li>";
    sb += "<li>員工攜伴第3人需自費新台幣 $5,000元。</li>";
    sb += "<li>員工攜伴者，不可為公司同仁(夫妻不在此限制內)。</li>";
    sb += '<li>4-6歲兒童定義<span style="color:red">〈2013年01月~2015年12月間〉</span>，每人酌收1000元〈含保險/車資/活動門票費用等行政代辦費用〉。</li>';
    sb += '<li>0-3歲幼童定義<span style="color:red">〈2016年01月以後出生〉</span>，每人酌收500元〈含保險/車資等行政代辦費用〉。</li>';
    sb += "<li>4-6歲小朋友身高如有超過收費規定，衍伸火車票或是飯店住宿早餐等其他費用，則依當日實際支付之費用另收。</li>";
    sb += "</ol>";
    sb += '<h5 style="color: Red;">注意事項：（有關個人權益，請確實詳讀）</h5>';
    sb += "<ol>";
    sb += "<li>每梯次旅遊，每車人數需滿 30 人才可開梯，如未達 30 人則取消該車活動。</li>";
    sb += '<li>報名成功後如不克前往，最晚需於出發前<span style="color:red">35日</span>下午5:00前，自行登入取消，未提前取消者則無法退費，並喪失公司補助權益。 (公司仍需支付此筆費用予旅行社) 。</li>';
    sb += "<li>已報名旅遊行程之參加者不可無故不到，亦不可員工本人未到僅眷屬自行參與，未到者即視同棄權需自行負擔全額旅費，且由當月薪資扣除。</li>";
    sb += "<li>請勿冒名頂替他人參與活動，違者須自行負擔全額旅費，且由當月薪資扣除。</li>";
    sb += "<li>每位參加同仁及親友皆有投保旅遊責任險 (無法提供當日臨時加保服務)。</li>";
    sb += "<li>報到當日請務必攜帶有照片之「身份證件」(如:身分證、駕照、健保卡)。查驗不符者將無法參與活動，敬請同仁配合。</li>";
    sb += "<li>請於行前通知單規定時間內準時集合，如遲到超過規定集合時間五分鐘以上，則視同放棄此活動，無法退回任何費用，並喪失公司補助權益，且該員工需付全額旅費費用，由當月薪資扣除。</li>";
    sb += "<li>公司員工旅遊需團體同進同出，故皆不開放同仁自行開車前往及提早離開，請同仁們多加留意，違者須自行負擔全額旅費，且由當月薪資扣除。</li>";
    sb += "<li>活動報名成功後，會於活動出發前三日統一寄發行前通知單，在煩請同仁特別注意信箱資訊及當日報到時間和集合地點，並煩請告知同行親友。</li>";
    sb += "<li>如活動當天臨時生病或發燒，煩請先聯絡當日主辦人員，並提供當日就醫證明給福委會，則免扣除員工薪資。</li>";
    sb += "<li>補助期限至2019年12月底，依網站公告的最後一次旅遊活動行程為止。</li>";
    sb += "<li>如於補助期限內未參加任何活動，則視同放棄權利，不另轉發現金。</li>";
    sb += "<li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li>";
    sb += "<li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將於現場補足實際產生之費用。</li>";
    sb += "<li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液.等。本單位不提供任何口服藥物。</li>";
    sb += "<li>遊覽車上請勿攜帶寵物及危險物品參與行程，感謝您的配合。</li>";
    sb += "<li>以上行程載明之車行時間僅供參考，如因路況或假日遊客眾多行程順序將視情況做更動調整。</li>";
    sb += "<li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li>";
    sb += "</ol>";
    sb += "</div>";
    sb += '<div class="modal-footer"><input id="ckAgree" type="checkbox" /><span id="lbAgree">我同意此項聲明</span></div>';
    $("#pgDesc").html(sb);
  }

  function pageDescOneDay() {
    $("#pgDesc").html("");
    var sb = "";
    sb += '<div class="panel-heading panel-heading-custom">';
    sb += '<h4 class="panel-title">MCP海天青重要隱私權聲明 </h4>';
    sb += "</div>";
    sb += '<div style="padding: 12px; border-bottom: solid 1px #c0c0c0;">';
    sb += '<h4 class="text-important">為了資料的安全性與頁面功能的完整性，建議您使用最新版本的瀏覽器來進行線上報名。';
    sb += '在進行報名之前請先詳細閱讀<span class="text-primary">「MCP海天青重要隱私權聲明」</span>，';
    sb += '然後請勾選<span class="text-primary">「我同意此項聲明」</span>來進行線上報名程序。</h4>';
    sb += "</div>";
    sb += '<div class="panel-body">';
    sb += "<p>本公司僅收集我們認為相關且有助於您的旅遊保險所必要的個人資料。我們會運用您的個人資料，以向您提供更好的客戶服務。除非已經取得您的同意、或依法令規定、或事前已向您通知，本會不會向任何外界機構或個人透露您的個人資料。</p>";
    sb += "<p>本公司實行嚴格的個資安全政策，以防止任何人（包括本公司職員）未經授權而取得您的個人資料。本公司所有獲准使用您的個人資料的職員及第三人，均被特別要求遵守本公司的保密義務。";
    sb += "網際網路資料的傳輸於現行科技下，尚不能保證百分之百的安全；因此，儘管MCP海天青旅行社在保護您的個人資料安全上做最嚴格的把關，";
    sb += "我們也無法確信或保證您傳送給MCP海天青旅行社的資料之絕對安全；所以鄭重提醒您，並請您瞭解、注意並承擔此部分之風險。</p>";
    sb += "<p>本公司會將活動照片放在報名網站上或粉絲團內，以供同仁下載，不會用在商業行為上。</p>";
    sb += '<h5 style="color: Red;">補助辦法：</h5>';
    sb += "<ol>";
    sb += "<li>每位同仁最多可攜伴3人(不含3歲以下孩童)。</li>";
    sb += "<li>員工本人全額補助〈每人限參加及補助一次〉。</li>";
    sb += "<li>員工攜伴第1人免費。</li>";
    sb += "<li>員工攜伴第2人需自費新台幣 $1,000元。</li>";
    sb += "<li>員工攜伴第3人需自費新台幣 $2,300元。</li>";
    sb += "<li>員工攜伴者，不可為公司同仁(夫妻不在此限制內，但每人限參加一次活動)。</li>";
    sb += '<li>0-3歲兒童定義<span style="color:red">〈2016年1月以後出生〉</span>，每人酌收200元〈含保險/車資等行政代辦費用〉。</li>';
    sb += "</ol>";
    sb += '<h5 style="color: Red;">注意事項：（有關個人權益，請確實詳讀）</h5>';
    sb += "<ol>";
    sb += '<li>每梯次旅遊，<span style="color:red">每車人數需滿30人才可開梯</span>，如未達30人則取消該車活動。</li>';
    sb += '<li>報名成功後如不克前往，最晚需於出發前<span style="color:red">5日</span>下午5:00前，自行登入取消，未提前取消者則無法退費，並喪失公司補助權益。 (公司仍需支付此筆費用予旅行社) 。</li>';
    sb += '<li>已報名旅遊行程之參加者<span style="color:red">不可無故不到，亦不可員工本人未到僅眷屬自行參與，未到者即視同棄權需自行負擔全額旅費，且由當月薪資扣除</span>。</li>';
    sb += "<li>請勿冒名頂替他人參與活動，違者須自行負擔全額旅費，且由當月薪資扣除。</li>";
    sb += "<li>每位參加同仁及親友皆有投保旅遊責任險 (無法提供當日臨時加保服務)。</li>";
    sb += '<li>報到當日請務必攜帶有<span style="color:red">照片</span>之「身份證件」(如:身分證、駕照、健保卡)。查驗不符者將無法參與活動，敬請同仁配合。</li>';
    sb += '<li>請於行前通知單規定時間內準時集合，如遲到<span style="color:red">超過規定集合時間五分鐘以上</span>，則視同放棄此活動，則無法退任何費用，並喪失公司補助權益，且該員工需付全額旅費費用，由當月薪資扣除。</li>';
    sb += "<li>公司員工旅遊需團體同進同出，故皆不開放同仁自行開車前往及提早離開，請同仁們多加留意，違者須自行負擔全額旅費，且由當月薪資扣除。</li>";
    sb += '<li>活動報名成功後，會於活動出發前<span style="color:red">三日</span>統一寄發行前通知單，在煩請同仁特別注意信箱資訊及當日報到時間和集合地點，並煩請告知同行親友。</li>';
    sb += "<li>如活動當天臨時生病或發燒，煩請先聯絡當日主辦人員，並提供當日就醫證明給福委會，則免扣除員工薪資。</li>";
    sb += "<li>補助期限至2019年12月，依網站公告的最後一次旅遊活動行程為止。</li>";
    sb += "<li>如於補助期限內未參加任何活動，則視同放棄權利，不另轉發現金。</li>";
    sb += "<li>凡個人患有心臟病、高血壓、氣喘病、羊癲症等慢性疾病、政府規定之法定傳染病、身體狀況不宜劇烈運動或戶外活動者，請務必主動告知，切勿勉強報名，違反規定者應要自行負責。</li>";
    sb += "<li>若因實際出發後3歲以下孩童身高或年齡超出限制規定，將於現場補足實際產生之費用。</li>";
    sb += "<li>如有身體不適請自備個人隨身藥品：如暈車藥、感冒藥、防蚊蟲液.等。本單位不提供任何口服藥物。</li>";
    sb += "<li>遊覽車上請勿攜帶寵物及危險物品參與行程，感謝您的配合。</li>";
    sb += "<li>以上行程載明之車行時間僅供參考，如因路況或假日遊客眾多行程順序將視情況做更動調整。</li>";
    sb += "<li>若遇天候不佳或不可抗拒之因素，本公司保有取消或變更行程的權利。</li>";
    sb += "<li>旅遊活動諮詢專線：02-29527535  #32 徐小姐 。</li>";
    sb += "</ol>";
    sb += "</div>";
    sb += '<div class="modal-footer"><input id="ckAgree" type="checkbox" /><span id="lbAgree">我同意此項聲明</span></div>';
    $("#pgDesc").html(sb);
  }

  return {
    pageDescTwoDays: pageDescTwoDays,
    pageDescOneDay: pageDescOneDay,
    getJoinerList: getJoinerList,
    getCapacity: getCapacity,
    getRoomObject: getRoomObject,
    assignDateToDll: assignDateToDll,
    createJoinerForm: createJoinerForm,
    checkEmployee: checkEmployee,
    validateJoiner: validateJoiner,
    validateTwoDaysOrder: validateTwoDaysOrder,
    validateOneDayOrder: validateOneDayOrder,
    calculateOneDayPrice: calculateOneDayPrice,
    generateOneDayConfirm: generateOneDayConfirm,
    generateTwoDaysConfirm: generateTwoDaysConfirm,
    makeTwoDaysOrder: makeTwoDaysOrder,
    makeOneDayOrder: makeOneDayOrder,
    makeTwoDaysWaitingList: makeTwoDaysWaitingList,
    makeOneDayWaitingList: makeOneDayWaitingList,
    makeHotelOrder: makeHotelOrder,
    initialRoom: initialRoom,
    checkRoomAvailable: checkRoomAvailable,
    getAges: getAges,
    isInt: isInt,
    isSID: isSID,
    isEID: isEID,
    isTel: isTel,
    isEmail: isEmail,
    isValidDate: isValidDate,
    evulateEid: evulateEid,
    daysToNow: daysToNow,
    getDay: getDay,
  };
})();
