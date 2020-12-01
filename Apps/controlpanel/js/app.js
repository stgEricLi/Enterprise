var App = function () {
  var initialize = function () {
    var _this = this;
    console.log("App.initialize");
    //var deferred = getServerConfig();

    //if ($.cookie("timezone") != null) {
    //  _this.timezone = JSON.parse($.cookie("timezone"))
    //};

    /*
    $.when(deferred).done(function () {
      // Pass in our Router module and call it's initialize function
      if (typeof (DevConfig) != "undefined") {
        if (DevConfig.init) {
          DevConfig.init();
        }
      };

      if ($.cookie("sessionId") !== undefined) {
        App.sessionId = $.cookie("sessionId");
        var bearer = $.cookie("Bearer");
        App.setRequestHeader((bearer == undefined) ? "" : bearer, App.sessionId);
        App.isSignedin = true;
      };

      var appRouter = new router();
      appRouter.initialize();

      $(window).on('resize', function () {
        clearTimeout(_this.resizeTimerId);
        _this.resizeTimerId = setTimeout(function () {
          _this.adjustMinHeight();
          if (_this.viewInstance != undefined && _this.viewInstance.onResize != undefined) {
            _this.viewInstance.onResize();
          }
          // Helper.reScale();
        }, 200);
      });
    });*/

    var appRouter = new router();
    appRouter.initialize();
  };

  return {
    initialize: initialize
  };
}();