var DefaultView = BaseView.extend({
  name: 'DefaultView',

  template: ' \
		<div class="user-container"> \
      <h2>Default View</h2> \
      <div class="user-list"> \
        <div id="user-datagrid"></div> \
      </div> \
      <div class="user-tools"> \
				<button id="add-user" class="btn-icon_add {{^createuser}}disabled{{/createuser}}" title="Add a User"></button> \
				<button id="edit-user" class="btn-icon_edit hide {{^modifyuser}}disabled{{/modifyuser}}" title="Edit User"></button> \
				<button id="delete-user" class="btn-icon_delete hide {{^deleteuser}}disabled{{/deleteuser}}" title="Delete User"></button> \
			</div> \
      <div id="grid-loadpanel"></div> \
		</div> \
	',

  userTypes: [
      { type: "Ldap", description: "Only LDAP users" },
      { type: "Local", description: "Only local users" },
      { type: "All", description: "All users", selected: "checked" },
  ],

  defaultPicture: "webapp/img/ic_user_account.svg",

  initialize: function () {
    console.log("initializing " + this.name);
    App.viewInstance = this;
    var _this = this;
    _this.model.userType = "All";
    //this.permissions = JSON.parse(localStorage.getItem("permissions"));
  },

  render: function () {
    var _this = this;
    //Dialog.cleanUpDialogs();
    _this.renderHeader();
    //_this.selectMenuItem(App.menuItems.users);
    _this.renderNavigationPanel();   
    _this.renderHtml();
    _this.getInineraryData(_this.model.userType);
    _this.renderDataGrid();
    //
    //_this.attachMenuEvents();   
  },

  renderHtml: function () {
    var _this = this;
    var data = {
      createuser: true,
      modifyuser: true,
      deleteuser: true
    };
    var html = Mustache.to_html(_this.template, data);
    _this.$el.find(".mcp-body").html(_this.template);
    _this.attachEvents();
  },  

  renderDataGrid: function () {
    var _this = this;
    _this.$el.find("#user-datagrid").dxDataGrid({
      dataSource: [],
      width: "100%",
      height: 345,
      headerFilter: {visible: false},
      showColumnLines: false,
      selection: { mode: "multiple", showCheckBoxesMode: "always" },
      hoverStateEnabled: true,
      searchPanel: { visible: false},
      paging: { enabled: false },
      pager: { showPageSizeSelector: false,  showInfo: false,  showNavigationButtons: false, visible: false},
      searchPanel: { visible: true, width: "100%" },
      rowAlternationEnabled: false,
      showBorders: true,
      showRowLines: true,
      scrolling: { mode: "standard",  userNative: true, },
      columns: [
          { dataField: 'ActID', caption: "ID", visible: true, dataType: "string" },
          { dataField: 'Name', caption: "Name", visible: true, dataType: "string" },
          { dataField: 'StartDay', caption: "Start Day", visible: true, dataType: "string" },
          { dataField: 'Capacity', caption: "Capacity", visible: true, dataType: "integer" }
          //{
          //  dataField: 'Role', width: 220, caption: "Role", visible: true, dataType: "string",
          //  cellTemplate: function (container, options) {
          //    var result = _this.getRoleClass(options.data);
          //    var role = $("<div class='" + result.roleClass + "'>").append(result.roleDisplayString);

          //    var dev = $("<div class='user-role'>").append(role);
          //    dev.appendTo(container);
          //  }
          //},
      ],
      onCellPrepared: function (e) {
        //if (e.column.command === 'select') {
        //  switch (e.rowType) {
        //    case "header":
        //      e.cellElement.find('.dx-select-checkbox').remove();

        //      break;
        //    case "data":
        //      // 1 = OrganizationUnit   2 = Group
        //      if (e.data.UserClass === App.userClass.Group || e.data.UserClass === App.userClass.OrganizationalUnit) {
        //        var td = e.cellElement.find('.dx-select-checkbox').parent();
        //        var checkbox = e.cellElement.find('.dx-select-checkbox').dxCheckBox("instance");
        //        checkbox.option({ "disable": true });
        //        e.cellElement.find('.dx-select-checkbox').remove();
        //        td.removeClass('dx-command-select');
        //        td.attr("aria-label", "");

        //        var btnId = "ldap-monitors" + e.rowIndex;
        //        var folder = $('<button id="' + btnId + '" class="btn-icon_folder btn-icon_small" title="Open folder">');
        //        var div = $("<div class='ldap-folder'>").append($("<div class='user-checkbox'>").append(folder));
        //        td.append(div);
        //      }
        //      break;
        //  }
        //}
      },
      onRowClick: function (info) {
        if (info.component._$element.find(".row-focus").length) {
          info.component._$element.find(".row-focus").removeClass("row-focus");
        }
        info.rowElement.addClass("row-focus");
        _this.renderUserInfo(info.data);
      },

      onSelectionChanged: function (info) {
        console.log("User selection changed");
        //var data = null;
        //if (info.currentSelectedRowKeys.length == 1) {
        //  var data = info.currentSelectedRowKeys[0];
        //  if (data.UserClass == "Group" || data.UserClass == "OrganizationalUnit") {
        //    info.component.deselectRows(info.currentSelectedRowKeys);
        //    delete _this.prevLocaltion;
        //    _this.prevLocation = [];
        //    _this.prevLocation.push("main");
        //    _this.renderLdapList(data);
        //    return;
        //  }
        //} else if (info.currentDeselectedRowKeys.length == 1) {
        //  data = info.currentDeselectedRowKeys[0];
        //  if (data.UserClass == "Group" || data.UserClass == "OrganizationalUnit") {
        //    console.log("Skip for ldap entries");
        //    return;
        //  }
        //};

        //if (info.selectedRowsData.length > 0) {
        //  if (info.selectedRowsData.length > 1) {
        //    $("#edit-user").addClass("hide");
        //    $("#delete-user").addClass("hide");
        //  } else {
        //    $("#edit-user").removeClass("hide");
        //    $("#delete-user").removeClass("hide");
        //  }
        //} else {
        //  $("#edit-user").addClass("hide");
        //  $("#delete-user").addClass("hide");
        //}

      },
    });

    $("#user-datagrid .dx-toolbar-items-container").css({
      "margin-top": "20px"
    });

    $("#user-datagrid .dx-toolbar-after").css({
      width: "100%",
      "padding-left": 0,
    })

    $("#user-datagrid .dx-item-content.dx-toolbar-item-content").css({
      position: "relative",
      left: "-15px"
    })
  },

  getInineraryData: function (userType) {
    var _this = this;
    console.log("RefreshUsersList (" + userType + ")");
    //var deferred = $.Deferred();
    _this.showLoadPanel();

    var model = new BaseModel("SvBackend.asmx/getItinerary");
    model.fetch({
      success: function (collection, response, options) {
        //  
        _this.hideLoadPanel();
        console.log('success');
        //var json = JSON.parse(response.d);
        //var totalrows = json.TotalRows;

        //total.html('---- 共有 ' + totalrows.toString() + ' 筆資料 ----');
        //var objOd = json.Users;
        //_this.refreshUsersGrid(response.d);

        var data = JSON.parse(response.d);
        //console.log(data.Acts);
        var datagrid = _this.$el.find("#user-datagrid").dxDataGrid("instance");
        datagrid.option("dataSource", data.Acts);
        datagrid.refresh();

      },

      error: function (collection, response, options) {
        //console.log('error');
        //console.log(response);
        //console.log(response.status);
        //console.log(response.responseText);
        _this.hideLoadPanel();
       
        var errormsg = StringTable.getStringWithParams("GetFailed", ["Ininerary"]);
        //var errorCode = Helper.getErrorCodeFromResponse(response);

        if (response.status === 401) {
          errormsg = StringTable.getString("html401", errormsg);
        };

        Dialog.showErrorMessageDialog("Ininerary", errormsg, function () {
          //if (response.status === 401) {
          //  Backbone.history.navigate("login", true);
          //}
        });
      }
    });

    //var roleAliasesDeferred = _this.getRoleAlias();

    /*$.when(roleAliasesDeferred).done(function (value) {
      if (App.mode != undefined && App.mode == "test") {
        $.get("/../testdata/users.txt", function (data) {
          var testdata = JSON.parse(data);
          var result = {};
          switch (userType) {
            case "Local":
              result = _this.filterLocal(testdata);
              break;
            case "Ldap":
              result = _this.filterLdap(testdata);
              break;
            case "All":
              result = testdata;
              break;
          }
          _this.refreshUsersGrid(result);
          deferred.resolve("done");
          _this.hideLoadPanel();
        });
      } else {
        var model = new BaseModel("Users")
        model.fetch({
          success: function (collection, response, options) {
            _this.refreshUsersGrid(response);
            deferred.resolve("done");
            _this.hideLoadPanel();
          },

          error: function (collection, response, options) {
            //_this.fetchErrorHandler(_this, response);
            _this.hideLoadPanel();
            deferred.resolve("done");

            var errormsg = StringTable.getStringWithParams("GetFailed", ["Users"]);
            var errorCode = Helper.getErrorCodeFromResponse(response);

            if (response.status === 401) {
              errormsg = StringTable.getString("html401", errormsg);
            };

            Dialog.showErrorMessageDialog("Users", errormsg, function () {
              if (response.status === 401) {
                Backbone.history.navigate("login", true);
              }
            });
          }
        });
      }
    });*/

    //return deferred.promise();
  },

  renderUserInfoView: function (header, user) {
    var _this = this;
    var adminSelected = false;
    var maintenanceASelected = false;
    var maintenanceBSelected = false;
    var maintenanceCSelected = false;
    var monitorSelected = false;
    var unauthorizedSelected = false;
    var localUser = true;
    var saveType = "PUT";
    var newPhoto = "";
    var isNewUser = true;

    var roles = JSON.parse(JSON.stringify(_this.roleAliases));

    //if (user == undefined) {
    //  monitorSelected = true;
    //  saveType = "POST";
    //  for (var i = 0; i < roles.length; i++) {
    //    if (roles[i].Role === App.solsticeRole.Unauthorized) {
    //      roles[i].selected = true;
    //    }
    //  }
    //} else {
    //  isNewUser = false;
    //  if (user.Picture && user.Picture != "") {
    //    if (user.Picture != _this.defaultPicture && user.Picture.indexOf("data:image") == -1) {
    //      newPhoto = 'data:image/jpg;base64,' + user.Picture;
    //    } else {
    //      newPhoto = user.Picture;
    //    }
    //  } else {
    //    newPhoto = _this.defaultPicture;
    //  };
    //  for (var i = 0; i < roles.length; i++) {
    //    if (roles[i].Role === user.Role) {
    //      roles[i].selected = true;
    //      break;
    //    }
    //  };

    //  localUser = (user.UserClass == App.userClass.Local);
    //}

    $("#popup-detailed").show().addClass('popup-modal');
    var userFormHtml = Mustache.to_html(_this.userFormTemplate, {
      header: header,
      roleAliases: roles,
      user: user,
      localUser: localUser,
      demoMode: (App.mode != undefined && App.mode === "demo")
    });

    $("#user-modal").show();
    $(".dialog-wrapper").html(userFormHtml);

    if (user != undefined) {
      switch (user.UserClass) {
        case App.userClass.Individual:
        case App.userClass.Group:
          $(".dialog-content input[id=full-name-txt]").prop('disabled', true);
          $(".dialog-content input[id=user-name-txt]").prop('disabled', true);
          $(".dialog-content input[id=email-txt]").prop('disabled', true);
          $(".dialog-content input[id=image-file]").prop('disabled', true);
          $(".dialog-content .photo-upload-container").css({ "pointer-events": "none", "opacity": 0.5 });
          break;
        case App.userClass.Local:
          $(".dialog-content input[id=user-name-txt]").prop('disabled', true);
          break;
      }
    };

    $("#photo-preview").attr("src", newPhoto);

    $("#userInfoCancelBtn").off("click");
    $("#userInfoCancelBtn").on('click', function () {
      _this.cancelUserInfoView();
    });

    $("#userInfoSaveBtn").off('click');
    $("#userInfoSaveBtn").on('click', function () {
      _this.saveUserInfo(user, newPhoto, { isNewUser: isNewUser, isLocalUser: localUser });
    });

    $(".toggle-password").off('click');
    $(".toggle-password").on('click', function (evt) {
      $(evt.currentTarget).toggleClass("eye-open eye-slash");
      var input = $($(evt.currentTarget).attr("toggle"));
      if (input.attr("type") == "password") {
        input.attr("type", "text");
      } else {
        input.attr("type", "password");
      }
    });

    $("#image-file").change(function () {
      var file = this.files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        console.log('RESULT', reader.result);
        newPhoto = reader.result;
        $("#photo-preview").attr("src", newPhoto);
      }
      reader.readAsDataURL(file);
    })
  },

  setFocusToFirstRow: function (datagrid) {
    var _this = this;
    setTimeout(function () {
      $(datagrid._$element.find(".dx-data-row:first")[0]).addClass("row-focus");
      var dataSource = datagrid.option("dataSource");
      if (dataSource.length > 0) {
        _this.renderUserInfo(dataSource[0]);
      }
    }, 200);
  },

  showLoadPanel: function () {
    $("#grid-loadpanel").dxLoadPanel({
      shadingColor: "rgba(0,0,0,0.4)",
      position: { of: ".user-list" },
      visible: true,
      showIndicator: true,
      showPane: true,
      shading: true,
      closeOnOutsideClick: false,
      onShown: function (info) {
        //if (App.isIEorEDGE()) {
        //  App.loadPanelFixForIEandEdge(info.component);
        //}
      },
    });
  },

  hideLoadPanel: function () {
    var loadPanel = $("#grid-loadpanel").dxLoadPanel("instance");
    if (loadPanel != undefined) {
      loadPanel.dispose();
    }
  },

  attachEvents: function () {
    $('#add-user').off('click');
    $('#add-user').on('click', function () {
      _this.renderUserInfoView("Add User", undefined);
    });
    $('#edit-user').on('click', function () {
      var datagrid = null;
      if ($("#user-datagrid").is(":visible")) {
        datagrid = $("#user-datagrid").dxDataGrid("instance");
      } else {
        datagrid = $("#ldap-datagrid").dxDataGrid("instance");
      };

      var selected = [];
      if (datagrid != undefined) {
        selected = datagrid.getSelectedRowsData();
      };
      if (selected.length === 1) {
        _this.renderUserInfoView("Edit User", selected[0]);
      }
    });
    $('#delete-user').on('click', function () {
      _this.renderDeleteUserDialog();
    });
  }
});