var BaseModel = Backbone.Model.extend({
  apiCall: "",

  urlRoot: function () {
    var _this = this;
    var url = window.location.origin; //http://localhost:29895
    /*
    if (App.apiURL != undefined) {
      url = App.apiURL + "/" + _this.apiCall;
      if (_this.id != undefined) {
        url += "/" + _this.id;
      }
    } else {
      if (App.isCloud) {
        url = "/api/" + _this.apiCall;
      } else {
        url += window.location.pathname + "api/" + _this.apiCall;
      };

      if (_this.id != undefined) {
        url += "/" + _this.id;
      };
    };
    */

    /*
    if (_this.apiCall != "Login") {
        if (_this.apiCall.indexOf("?") > 0) {
            url += "&sessionId=" + App.sessionId;
        } else {
            url += "?sessionId=" + App.sessionId;

        }
    }
    */
    //url: "../../mcpservices/SvOrder.asmx/Create_Wt_TwoDaysOrder",
    url = url + "/mcpservices/" + _this.apiCall;
    return url;
  },
  sync: function (method, model, options) {
    options || (options = {});
    console.log("Sync-method: " + method);

    if (method == "create") {
      $.ajax({
        method: 'POST',
        url: this.url(),  // url() needs to be manually declared in collections
        data: JSON.stringify(model.attributes),
        dataType: 'json',         // the data type we're expecting back from the server
        contentType: 'application/json',    // the data type we're sending to the server
        success: function (result) {
          var success = options.success;
          //if (success) success(model, result);
          success(result);
          // return result;
          //console.log(result);
          //model.set('id', result);
          //model.hasSynced = true;
          //model.trigger('sync');  // trigger the sync event
          //model.trigger('sync_success', result); // trigger the sync_success event
        },
        error: function (xhr, textStatus, errorThrown) {

          var error = options.error;
          if (error) { error.call(options.context, xhr, textStatus, errorThrown); }

          //console.log(error);

          //options.error(options.xhr);
          //return textStatus;

          // options.error = function(xhr, textStatus, errorThrown)
          // {
          //   options.textStatus = textStatus;
          //   options.errorThrown = errorThrown;
          //   //model.trigger('error', model, resp, options);
          //   if (error) { error.call(options.context, xhr, textStatus, errorThrown); }
          // };


          //console.log(xhr.status);
          //console.log(xhr.responseText);
          //console.log(error);      
          // model.hasSynced = true;
          //model.trigger('sync');
          //model.trigger('sync_error', xhr);// trigger the sync_error event

        }
      });
    }

    if (method == "read") {
      $.ajax({
        method: 'GET',
        url: this.url(),  
        //data: JSON.stringify(model.attributes),
        dataType: 'json',        
        contentType: 'application/json',   
        success: function (result) {
          var success = options.success;
          success(result);         
        },
        error: function (xhr, textStatus, errorThrown) {
          var error = options.error;
          if (error) { error.call(options.context, xhr, textStatus, errorThrown); }
        }
      });
    }
    
  },
  initialize: function (apiCall, id) {
    //console.log(window.location.origin);
    //console.log(window.location.pathname);
    if (apiCall != undefined) {
      this.apiCall = apiCall;
    };

    if (id != undefined) {
      this.id = id;
    }
  }
});