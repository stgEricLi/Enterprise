var router = function () {
  var appRouter = Backbone.Router.extend({
    routes: {
      '': 'showHomeView',
      '?*querystring': 'showHomeView',
      'index.html?*querystring': 'showHomeView',
      'login': 'showLoginView',
      'default': 'showDefaultView',
      'devices': 'showDevicesView',
      'about': 'showAboutView',
      'labels': 'showLabelsView',
      'users': 'showUsersView',
      'adminaccount': 'showAdminAccountView',
      'network': 'showNetworkView',
      'settings': 'showSettingsView',
      'history': 'showHistoryView',
    },
    showHomeView: function (queryString) {
      console.log('Home');
      //this.setRunMode(queryString);
      //var _this = this;
      //var homeView = new MainView();
      //homeView.render();

      //if (App.isCloud) {
      //  var params = document.location.search.split("=");
        //if (params.length === 2) {
        //  if (params[0] === "?gatewayId") {
        //    $.cookie("sessionId", params[1]);
        //    App.setRequestHeader($.cookie("Bearer"), $.cookie("sessionId"));
        //    var userData = $.cookie("UserData");
        //    var username = "Unknown";
        //    if (userData != undefined) {
        //      var userObj = JSON.parse($.cookie("UserData"));
        //      username = userObj.FullName
        //    };

        //    $.cookie("userName", username);
        //  };

        //  var uri = window.location.toString();
        //  if (uri.indexOf("?") > 0) {
        //    var clean_uri = uri.substring(0, uri.indexOf("?"));
        //    window.history.replaceState({}, document.title, clean_uri);
        //  };

        //  setTimeout(function () {
        //    Backbone.history.navigate(App.menuItems.systems, true);
        //  }, 200);

        //  return;
        //}
      //};

      //setTimeout(function () {
      //  Backbone.history.navigate(App.menuItems.login, true);
      //}, 200);
      var loginView = new LoginView();
      loginView.render();
    },
    showLoginView: function (queryString) {
      console.log('Login');
      //console.debug(this.login);
      //this.setRunMode(queryString);
      //this.destroyCurrentView();
      //if (App.isCloud) {
      //  //document.location.href = "https://biamp.auth0.com/authorize?audience=https://biamp.auth0.com/api/v2/&scope=openid%20profile%20email&response_type=code&client_id=yAvHhzCBdwfB0FHRyQZY-6hzc3Dqk5e-&redirect_uri=http://localhost:4152/api/login/callback&state=asdf";
      //  document.location.href = App.getauth0Url();
      //} else {
      //  var loginView = new LoginView();
      //  loginView.render();
      //}
      var loginView = new LoginView();
      loginView.render();
    },
    showDefaultView: function () {
      var model = new BaseModel();
      var defaultView = new DefaultView({
        model: model
      });
      defaultView.render();

      //if (this.isSignedin()) {
      //  var model = new BaseModel();

      //  var usersView = new UsersView({
      //    model: model
      //  });
      //  usersView.render();
      //} else {
      //  Backbone.history.navigate(App.menuItems.login, true);
      //}
    }
  });

  var initialize = function () {
    App.Router = new appRouter();
    Backbone.history.start();
  };

  return {
    initialize: initialize,
  };

};