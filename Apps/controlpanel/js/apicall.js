Backbone.sync = function (method, model, options) {
  var _this = this;
  options = options || {};
  console.log("Sync-method: " + method);
  //console.log(model);
  //console.log(_this.url);
  
  //$.ajax({
  //  method: 'POST',
  //  url: this.url(),  // url() needs to be manually declared in collections
  //  data: JSON.stringify(model.attributes),
  //  dataType: 'json',         // the data type we're expecting back from the server
  //  contentType: 'application/json',    // the data type we're sending to the server
  //  success: function (result) {
  //    //console.log(result);
  //    //model.set('id', result);
  //    model.hasSynced = true;
  //    model.trigger('sync');  // trigger the sync event
  //    model.trigger('sync_success', result); // trigger the sync_success event
  //  },
  //  error: function (xhr, status, error) {
  //    console.log(xhr.status);
  //    console.log(xhr.responseText);
  //    console.log(error);      
  //    model.hasSynced = true;
  //    model.trigger('sync');
  //    model.trigger('sync_error', xhr);// trigger the sync_error event
  //  }
  //});

  switch (method) {
    case 'create':
      console.log("Save Data...");
      //Save()
      //$.ajax({
      //  method: 'POST',
      //  url: '/api/' + this.url,  // url() needs to be manually declared in collections
      //  data: JSON.stringify(model.attributes),
      //  dataType: 'json',         // the data type we're expecting back from the server
      //  contentType: 'application/json',    // the data type we're sending to the server
      //  success: function (result) {
      //    model.set('id', result);
      //    model.hasSynced = true;
      //    model.trigger('sync');  // trigger the sync event
      //    model.trigger('sync_success'); // trigger the sync_success event
      //  },
      //  error: function (result) {
      //    model.hasSynced = true;
      //    model.trigger('sync');
      //    model.trigger('sync_error');// trigger the sync_error event
      //  }
      //});
      break;

    case 'update':
      //$.ajax({
      //  method: 'PUT',
      //  url: '/api/' + this.url,
      //  data: JSON.stringify(model.attributes),
      //  dataType: 'json',
      //  contentType: 'application/json',
      //  success: function (result) {
      //    model.hasSynced = true;
      //    model.trigger('sync');
      //    model.trigger('sync_success');
      //  },
      //  error: function (result) {
      //    model.hasSynced = true;
      //    model.trigger('sync');
      //    model.trigger('sync_error');
      //  }
      //});
      break;

    case 'delete':
      //$.ajax({
      //  method: 'DELETE',
      //  url: '/api/' + this.url,
      //  data: JSON.stringify(model.attributes),
      //  dataType: 'json',
      //  contentType: 'application/json',
      //  success: function (result) {
      //    model.hasSynced = true;
      //    model.trigger('sync');
      //    model.trigger('sync_success');
      //  },
      //  error: function (result) {
      //    model.hasSynced = true;
      //    model.trigger('sync');
      //    model.trigger('sync_error');
      //  }
      //});
      break;
    case 'read':
      console.log("Fetch Data...");

      //$.ajax({
      //  method: 'GET',
      //  //url: '/api/'+this.url,
      //  url: this.url,
      //  dataType: 'json',
      //  success: function (result) {
      //    console.log(result); //return JSON object from server
      //    if (result) {
      //      if (model instanceof Backbone.Model) {
      //        model.set(result);
      //      } else if (model instanceof Backbone.Collection) {
      //        model.add(result); //add result to the collection
      //      }
      //    }
      //    model.hasSynced = true;
      //    model.trigger('sync');
      //    // trigger the sync_success event and pass the JSON object result to callback
      //    model.trigger('sync_success', result);
      //  },
      //  error: function (jqXHR, textStatus, thrownError) {
      //    console.log("Reading faild");
      //    model.hasSynced = true;
      //    model.trigger('sync');
      //    // trigger the sync_error event and pass the jqXHR object to callback function
      //    model.trigger('sync_error', jqXHR);
      //  }
      //});
      break;
  }
};
