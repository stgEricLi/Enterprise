var LoginView = BaseView.extend({
  name: 'LoginView',
  template: '\
		<section class="mcp-section" > \
			<div class="dialog-wrapper"> \
				<header class="dialog signin"> \
					<h6>Sign In</h6> \
				</header> \
				<div class="dialog-content"> \
					<div class="form-input"> \
						<label for="username">User Name</label> \
						<input type="text" id="username" placeholder="User Name" required> \
					</div> \
					<div class="form-input"> \
						<label for="password">Password</label> \
						<input type="password" id="password" placeholder="Password" required> \
						<span toggle="#password" class="eye-open field-icon toggle-password"></span> \
					</div> \
					<div class="form-input"> \
						<input type="checkbox" id="rememberme-chkbox"><label for="rememberme-chkbox" class="inline-label">Remember Me</label> \
					</div> \
					<button class="btn-long" id="loginButton" value="Next">Sign In<div class="loadingicon"></div></button> \
					<div class="login-error error-background"></div> \
				</div> \
			</div> \
		</section> \
	',

  events: {
  },

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

  initialize: function () {
    console.log("initializing " + this.name);
    if (localStorage.length != 0) {
      localStorage.clear()
    }
    this.viewInstance = this;
  },

  buildAndRender: function () {
    console.log('buildAndRender ' + this.name);
    this.render();
  },

  render: function () {
    //var logindata = {};
    var _this = this;

    //$("#detailed-body").html("");
    //$("#popup-detailed").hide();
    //_this.hideNavigationPanel();
    //_this.renderHeader();

    //if (App.mode != undefined && App.mode === "demo") {
    //  _this._login(App.demoUser, App.demoPwd, false);
    //} else {
    //  _this.$el.find('.mcp-body').html(_this.template);

    //  $(".content-container").addClass("sign-in-screen");
    //  _this.attachEvents();
    //}

    _this.$el.find('.mcp-body').html(_this.template);
    $(".content-container").addClass("sign-in-screen");
    _this.attachEvents();
  },

  attachEvents: function () {
    var _this = this;

    $("#loginButton").keyup(function (event) {
      if (event.keyCode === 13) {
        _this.loginClickHandler();
      }
    });

    $("#username").keyup(function (event) {
      if (event.keyCode === 13) {
        _this.loginClickHandler();
      }
    });

    $("#password").keyup(function (event) {
      if (event.keyCode === 13) {
        _this.loginClickHandler();
      }
    });

    $("#loginButton").off('click');
    $("#loginButton").on('click', function () {
      _this.loginClickHandler();
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
  },

  loginClickHandler: function () {
    console.log("Login");
    $(".login-error").hide();

    var _this = this;
    var errors = [];

    var username = $("#username").val();
    if (username === 'undefine' || username === '') {
      errors.push("Username is required.");
    }
    /*else if (_this.isEmail(username) === false) {
			errors.push("Invalid email address.");
		};*/

    var pwd = $("#password").val();
    if (pwd === 'undefine' || pwd === '') {
      errors.push("Password is required.");
    };

    if (errors.length > 0) {
      _this.showErrors(errors);
      return;
    };

    _this.disableLogin();

    if (App.mode != undefined && App.mode == "test") {
      _this.loginTestMode();
    } else {
      _this._login(username, pwd, $("#rememberme-chkbox").is(':checked'));
    }
  },

  loginTestMode: function () {
    var _this = this;

    App.isSignedin = true;
    App.sessionId = "testguid";
    $.cookie("sessionId", App.sessionId);
    App.role = "Administrator";
    $.cookie("sessionId", App.sessionId);
    // use provided username for now
    $.cookie("userName", "Test User");
    localStorage.setItem("role", App.role);
    $.get("/../testdata/permissions.txt", function (data) {
      var testdata = JSON.parse(data);

      localStorage.setItem("permissions", JSON.stringify(testdata));

      _this.showFirstPage();
    });
  },

  _login: function (username, pwd, rememberme) {
    var _this = this;
    var authentication = new BaseModel(apiCalls.login);
    console.log(authentication.urlRoot());
    authentication.save({ 'username': 'wttest', 'password': 'apple3321' }, {
      success: function (model, response) {
        console.log('success');
        console.log(response);
        var data = response.d;
        console.log(data.Name);
        console.log(data.authTicket);
        console.log(data.expire);
        console.log(data.roles[0]);
        App.isSignedin = true;
        _this.showFirstPage();
        //$.cookie("mcp", response.d);
        //$.cookie("mcp", response.d, { expires : 2 }); // Expires in 2 days
        //$.removeCookie("mcp");

      },
      error: function (model, response) {
        console.log('error');
        console.log(response);
        console.log(response.status);
        console.log(response.responseText);
      }      
    });

    //authentication.on('sync_success', function (response) {
    //  console.log('Fetch Sync Success');
    //  console.log(response);
    //});

    //authentication.on('sync_error', function (jqXHR) {
    //  console.log('Fetch Sync Failed');
    //  console.log(jqXHR.status);
    //  console.log(jqXHR.statusText);
    //  console.log(jqXHR.responseJSON);
    //});





    //App.setRequestHeader("", "");

    //authentication.save({
    //  credentials: {
    //    userName: username,
    //    password: pwd,
    //    rememberMe: rememberme
    //  }
    //},
    //    {
    //      credentials: "include",
    //      withCredentials: true,
    //      success: function (model, response, options) {
    //        if (response.model) {
    //          if (response.model.isSuccess) {
    //            console.log("Success - cloud");
    //            //    $.cookie('login', 'true');
    //            App.isSignedin = true;
    //            _this.showFirstPage();
    //          } else {
    //            _this.showErrors([response.model.errMessage]);
    //          }
    //        } else {
    //          if (response.LoginId) {
    //            console.log("Success - gateway(" + response.LoginId + ")");
    //            //    $.cookie('login', 'true');
    //            App.isSignedin = true;
    //            App.sessionId = response.LoginId;
    //            App.role = response.Role;
    //            $.cookie("sessionId", App.sessionId);
    //            App.setRequestHeader("", App.sessionId);
    //            // use provided username for now
    //            $.cookie("userName", username);
    //            localStorage.setItem("role", App.role);
    //          } else {
    //            //
    //            // temporary for now
    //            App.isSignedin = true;
    //            $.cookie("sessionId", App.getGatewayId());
    //            App.setRequestHeader("", App.getGatewayId());
    //            if (response.UserName != undefined) {
    //              $.cookie("userName", response.UserName)
    //            } else {
    //              // use provided username
    //              $.cookie("userName", username);
    //            };
    //          };

    //          var deferredTZ = _this.getTimeZone();
    //          $.when(deferredTZ).done(function () {
    //            var deferredPermissions = _this.getPermissions();
    //            $.when(deferredPermissions).done(function () {
    //              _this.showFirstPage();
    //            });
    //          });
    //        }
    //      },

    //      error: function (model, xhr, options) {
    //        console.log("Failed");
    //        _this.showErrors(["Login Failed"]);
    //      }
    //    });
  },

  getTimeZone: function () {
    var deferred = $.Deferred();

    var model = new BaseModel(apiCalls.timeZone);
    model.fetch({
      success: function (model, response, options) {
        //
        //Setup App.timezone
        // Save a copy to local storage
        App.timezone = response.TimeZoneSettings
        $.cookie("timezone", JSON.stringify(App.timezone));
        deferred.resolve("done");
      },

      error: function (model, response, options) {
        console.log("Unable to retrieve Time Zone information");
        deferred.resolve("done");
      }
    });

    return deferred.promise();
  },

  getPermissions: function () {
    var deferred = $.Deferred();
    var role = localStorage.getItem("role");
    if (role == undefined) {
      role = Administrator;
    };

    var _this = this;
    var apiCallString = apiCalls.permissionsForRole + "?role=" + role;
    var model = new BaseModel(apiCallString);
    model.fetch({
      success: function (model, response, options) {
        //
        //Setup App.timezone
        if (response.ApiPermissions != undefined) {
          _this.setCleanedPermissions(response);
        };
        deferred.resolve("done");
      },

      error: function (model, response, options) {
        console.log("Unable to retrieve Time Zone information");
        deferred.resolve("done");
      }
    });
    return deferred.promise();
  },

  setCleanedPermissions: function (rawPermissions) {

    var cleanedPermissions = {
      "Devices": {},
      "Users": {},
      "Settings": {},
      "General": {},
      "Labels": {},
      "Systems": {}
    };

    rawPermissions = rawPermissions.ApiPermissions;
    for (var i = 0; i < rawPermissions.length; i++) {
      var command = rawPermissions[i].Command;
      var enabled = rawPermissions[i].Allowed;

      var screenName = apiPermissions.getByCommand(command);
      if (screenName != undefined) {
        if (cleanedPermissions["role"] == undefined) {
          cleanedPermissions["role"] = rawPermissions[i].Role;
          console.debug("Role set: " + rawPermissions[i].Role);
        }
        //console.debug("Command: " + command + " Current enable status: " + enabled);
        var permission = {};
        permission.command = command;
        permission.enabled = enabled;
        cleanedPermissions[screenName.category][screenName.name.toLowerCase()] = permission;
      }
      else {
        //console.debug("Failed to find: " + command);
      }
    }

    localStorage.setItem("permissions", JSON.stringify(cleanedPermissions));
  },

  showErrors: function (errors) {
    var html = "<ul>";
    if (errors.length > 0) {
      for (var i = 0; i < errors.length; i++) {
        html += "<li>" + errors[i] + "</li>";
      }

      html += "</ul>";

      $(".login-error").html(html);
      $(".login-error").show();

      this.enableLogin();
    }
  },

  disableLogin: function () {
    $("#loginButton").removeClass("button").addClass("disable-control");
    $(".loadingicon").css("display", "inline-block");
  },

  enableLogin: function () {
    $("#loginButton").addClass("button").removeClass("disable-control");
    $(".loadingicon").css("display", "none");
  },

  showErrorMessage: function (msg) {
    console.log("ShowErrorMessage");
    $(".error-text").text(msg);
    $(".error-text").show();
  },

  showFirstPage: function () {
    console.log("ShowMainPage");
    //document.location.href = "/Home";
    //var permissions = JSON.parse(localStorage.getItem("permissions"));
    var loadPage = "default";
    //for (var i = 0; i < this.menuItems.length; i++) {
    //  var currentItem = this.menuItems[i];
    //  var item = apiPermissions.getByName(currentItem.id);
    //  if (item) {
    //    var category = item.category;
    //  }
    //  else {
    //    console.debug("Failed to find: " + currentItem);
    //    continue;
    //  }
    //  if (permissions[category][currentItem.id] != undefined && permissions[category][currentItem.id].enabled) {
    //    loadPage = currentItem.id;
    //    break;
    //  }
    //}
    Backbone.history.navigate(loadPage, true);
  },
});
