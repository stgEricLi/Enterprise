var BaseView = Backbone.View.extend({
  el: $(".mcp-container"),
  pageTemplate: "\
        <div class='nav-menu'> \
            <div class='user-logout'></div> \
            <div class='navigation-panel'></div> \
        </div > \
        <div class='content-container'> \
            <div class='mcp-header'></div> \
            <div class='mcp-subheader'> \
                <div class='client-info'></> \
            </div > \
            <div class='mcp-body'> \
                <div class='popup' id='popup-detailed'> \
                    <div id='detailed-body'></div> \
                </div> \
            </div> \
        </div>",

  navigationTemplate: '\
        <div class="user-logout" id="user-logout"> \
            <img src="img/ic_user_account_rev.svg" alt="End user" /> \
            <p id="user-name">{{userName}}</p> \
        </div> \
        <div class="user-logout-button" id="user-logout-button"> \
            <button class="{{#demoMode}}disabled{{/demoMode}}">Log Out</button> \
        </div> \
        <div class="navigation-panel"> \
            <div class="menu-items"> \
                <div class="nav-empty-row"></div> \
                {{#menuItems}} \
                <div class="nav-row"><div class="nav-item {{#selected}}nav-selected{{/selected}}" id="nav-{{id}}"><div class="nav-item-text">{{text}}</div></div></div> \
                {{/menuItems}} \
            </div > \
        </div>',

  headerRightElements: "<div class='profile' ></div>" +
		"<div class='app-logout {{#demoMode}}disabled{{/demoMode}}' id='signout-button'>Sign out</div>",

  menuItems: [
		{ id: 'systems', text: 'Systems' },
		{ id: 'devices', text: 'Devices' },
		{ id: 'users', text: 'Users' },
		{ id: 'network', text: 'Network' },
		{ id: 'settings', text: 'Settings' },
		{ id: 'history', text: 'History' },
		{ id: 'labels', text: 'Labels' },
		{ id: 'about', text: 'About' }
  ],
  renderHeader: function () {
    var _this = this;

    $(".sign-in-screen").removeClass("sign-in-screen");
    _this.$el.html(_this.pageTemplate);
    if (App.isSignedin != undefined && App.isSignedin) {
      _this.$el.find(".header-right").append(_this.headerRightElements);
    }
  },
  enabledMenuItems: function () {
    /*
    var modifiedMenuItems = [];
    var currentMenuItems = this.menuItems;
    var permissions = JSON.parse(localStorage.getItem("permissions"));

    for (var i = 0; i < currentMenuItems.length; i++) {
      var currentItem = currentMenuItems[i];
      var item = apiPermissions.getByName(currentItem.id);

      if (currentItem.id == "settings" && apiPermissions.getSettingsEnabled(permissions)) { //Temp solution until settings handling can be tweaked
        modifiedMenuItems.push(currentMenuItems[i]);
        continue;
      }

      if (item) {
        var category = item.category;
      }
      else {
        console.debug("Failed to find: " + currentItem);
        continue;
      }

      if (permissions[category][currentItem.id] && permissions[category][currentItem.id].enabled) {
        modifiedMenuItems.push(currentMenuItems[i]);
      }
    }
    return modifiedMenuItems;
    */
    return this.menuItems;
  },

  hideNavigationPanel: function () {
    $(".nav-menu").addClass("hide");
    $(".mcp-header").addClass("sign-in");
    $(".mcp-subheader").addClass("hide");
    if ($(".mcp-header").find(".help-ico").length) {
      $(".mcp-header").find(".help-ico").remove();
    }
  },
  renderNavigationPanel: function () {
    var _this = this;
    var navTemplate = "";
    var navStr = "";

    $(".nav-menu").removeClass("hide");
    $(".nav-menu").css("height", "100%");
    $(".mcp-subheader").removeClass("hide");
    $(".mcp-header").removeClass("sign-in");
    //var username = ($.cookie("userName") != undefined) ? $.cookie("userName") : "Unknown User";
    //var demoMode = (App.mode != undefined && App.mode === "demo") ? true : false;
    var username = "Eric";
    var demoMode = true;
    var menuItemsHtml = Mustache.to_html(this.navigationTemplate, {
      userName: username,
      menuItems: _this.enabledMenuItems(),
      demoMode: demoMode,
    });

    _this.$el.find('.nav-menu').html(menuItemsHtml);

    if ($(".mcp-header h1").length) {
      $(".mcp-header h1").addClass("show-help-icon");
      if ($(".mcp-header").find(".help-ico").length == 0) {
        var div = $('<div class="help-ico help-inline" title="Help" style="float: right; background-size: 25px 25px; height: 25px; width: 25px; position: relative; top: -5px; " id="help"></div>');
        $(".mcp-header").append(div);
      }
    }

  },
});