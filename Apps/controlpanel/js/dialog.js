var Dialog = function () {
  var mainContainerClass = "content-container";
  var confirmDialogTempate = ' \
            <div class="message-modal"> \
                <div class="modal-container"> \
                    <div id="confirm-label-delete" class="dialog-wrapper message-dialog-wrapper"> \
                        <header class="dialog"> \
                            <h6>{{title}}</h6> \
                        </header> \
                        <div class="dialog-content"> \
                            <p>{{{message}}}</p> \
                            <p><strong>{{description}}</strong></p> \
                            <p>{{{confirmMessage}}}</p> \
                            <div class="apply-or-cancel-buttons-stacked_confirm"> \
                                <button class="btn-inline btn-text" id="dc-cancelBtn">Cancel</button> \
                                <button class="btn-inline" id="dc-yesBtn" value="delete">{{yesButtonText}}</button> \
                            </div> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        ';

  var messageDialogTempate = ' \
        <div class="message-modal config-modal"> \
            <div class="modal-container"> \
                <div class="dialog-wrapper message-dialog-wrapper"> \
                    <header class="dialog"> \
                        <h6>{{title}}</h6> \
                    </header> \
                    <div class="dialog-content"> \
                        <div class=""> \
                            <strong>{{{message}}}</strong> \
                        </div> \
                        <div class="apply-or-cancel-buttons-stacked_success"> \
                            <button class="btn-inline" id="update-success" value="OK">OK</button> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        </div>';

  var protectSystemTemplate = ' \
        <div class="message-modal"> \
            <div class="modal-container"> \
                <div id="confirm-label-delete" class="dialog-wrapper message-dialog-wrapper"> \
                    <header class="dialog"> \
                        <h6>{{title}}</h6> \
                    </header> \
                    <div class="dialog-content"> \
                        <div class="form-input"> \
						    <label for="username">User Name</label> \
						    <input type="text" id="protected-username" placeholder="User Name" required> \
                            <p class="error" id="protected-username-error"></p> \
					    </div> \
                        <div class="form-input"> \
						    <label for="password">Password</label> \
						    <input type="password" id="protected-password" placeholder="Password" required> \
                            <span toggle="#protected-password" class="eye-open field-icon toggle-password"></span> \
					    </div> \
                        <div class="apply-or-cancel-buttons-stacked_confirm"> \
                            <button class="btn-inline btn-text" id="dc-cancelBtn">Cancel</button> \
                            <button class="btn-inline {{#demoMode}}disabled{{/demoMode}}" id="dc-yesBtn">Ok</button> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        </div> \
    ';

  var credentialsTemplate = ' \
            <div class="message-modal"> \
                <div class="modal-container"> \
                    <div id="confirm-label-delete" class="dialog-wrapper message-dialog-wrapper credential-dlg-width"> \
                        <header class="dialog"> \
                            <h6>{{title}}</h6> \
                        </header> \
                        <div class="dialog-content"> \
                            <div class="section"> \
                            <p><strong>{{description}}</strong></p> \
                            <p>{{message}}</p> \
                            <!-- p>This is a protected system. Enter your credentials to continue update.</p --> \
                            </div> \
                            <div class="group"> \
                                    <div class="form-input"> \
						                <label for="username">User Name</label> \
						                <input type="text" id="protected-username" placeholder="User Name" required> \
                                        <p class="error" id="protected-username-error"></p> \
					                </div> \
                                    <div class="form-input"> \
						                <label for="password">Password</label> \
						                <input type="password" id="protected-password" placeholder="Password" required> \
                                        <span toggle="#protected-password" class="eye-open field-icon toggle-password"></span> \
					                </div> \
                            </div> \
                            <div class="apply-or-cancel-buttons-stacked_confirm"> \
                                <button class="btn-inline btn-text" id="dc-cancelBtn">Cancel</button> \
                                <button class="btn-inline" id="dc-yesBtn">Ok</button> \
                            </div> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        ';

  var errorDialogTemplate = ' \
         <div class="message-modal config-modal"> \
          <div class="modal-container"> \
            <div class="dialog-wrapper message-dialog-wrapper"> \
              <header class="dialog"> \
                <h6>{{title}}</h6> \
              </header> \
              <div class="dialog-content"> \
                <div>{{{message}}}</div> \
                <div class= "apply-or-cancel-buttons-stacked_confirm"> \
                  <button class="btn-inline" id="update-error" value="OK">OK</button> \
                </div> \
              </div> \
            </div> \
          </div> \
        </div>';

  var showDeleteConfirmation = function (info, confirmYesCallback, confirmCancelCallback) {
    var confirmDelete = "This action cannot be undone.<br />Are you certain you want to delete it ?";

    var html = Mustache.to_html(confirmDialogTempate, {
      title: info.title,
      message: info.message,
      description: info.description,
      confirmMessage: confirmDelete,
      yesButtonText: "Yes, delete it",
    });

    var dialogContainer = $("<div class='popup popup-modal' id='delete-confirmation-dialog'>")
    $("." + mainContainerClass).append(dialogContainer);

    setTimeout(function () {
      $("#delete-confirmation-dialog").html(html);
      $("#delete-confirmation-dialog #dc-yesBtn").off('click');
      $("#delete-confirmation-dialog #dc-yesBtn").on('click', function () {
        if (confirmYesCallback) {
          confirmYesCallback();
        };

        $("#delete-confirmation-dialog").remove();
      });

      $("#delete-confirmation-dialog #dc-cancelBtn").off('click');
      $("#delete-confirmation-dialog #dc-cancelBtn").on('click', function () {
        if (confirmCancelCallback) {
          confirmCancelCallback();
        };

        $("#delete-confirmation-dialog").remove();
      });

      var zindex = findHighestPoupZIndex() + 1;
      $("#delete-confirmation-dialog").css("z-index", zindex);

      $("#delete-confirmation-dialog").show();

    }, 300);
  }

  var showConfirmDialog = function (title, message, confirmYesCallback, confirmCancelCallback) {
    var html = Mustache.to_html(confirmDialogTempate, {
      title: title,
      confirmMessage: message,
      yesButtonText: "Yes, Continue",
    });

    var dialogId = "dialog-" + Date.now();
    var dialogContainer = $("<div class='popup popup-modal' id='" + dialogId + "'>");
    $("." + mainContainerClass).append(dialogContainer);

    setTimeout(function () {
      $("#" + dialogId).html(html);

      $("#" + dialogId + " #dc-yesBtn").off('click');
      $("#" + dialogId + " #dc-yesBtn").on('click', function () {
        if (confirmYesCallback) {
          confirmYesCallback();
        };

        $("#" + dialogId).remove();
      });

      $("#" + dialogId + " #dc-cancelBtn").off('click');
      $("#" + dialogId + " #dc-cancelBtn").on('click', function () {
        if (confirmCancelCallback) {
          confirmCancelCallback();
        };

        $("#" + dialogId).remove();
      });

      var zindex = findHighestPoupZIndex() + 1;
      $("#" + dialogId).css("z-index", zindex);

      $("#" + dialogId).show();

    }, 300);
  };

  var showErrorMessageDialog = function (title, message, callback) {
    _showMessageDialog(errorDialogTemplate, title, "<b>" + message + "</b>", callback);
  };

  var showSuccessMessageDialog = function (title, message, callback) {
    _showMessageDialog(messageDialogTempate, title, message, callback);
  };

  var showMessageDialog = function (title, message, callback) {
    _showMessageDialog(messageDialogTempate, title, message, callback);
  };

  var _showMessageDialog = function (dialogTemplate, title, message, callBack) {
    var html = Mustache.to_html(dialogTemplate, {
      title: title,
      message: message,
    });

    var dialogId = "dialog-" + Date.now();
    var dialogContainer = $("<div class='popup popup-modal' id='" + dialogId + "'>");
    $("." + mainContainerClass).append(dialogContainer);
    setTimeout(function () {
      $("#" + dialogId).html(html);

      $("#" + dialogId + " .btn-inline").off('click');
      $("#" + dialogId + " .btn-inline").on('click', function () {
        $("#" + dialogId + " .btn-inline").off('click');
        if (callBack != undefined) {
          callBack();
        };
        $("#" + dialogId).remove();
      });

      var zindex = findHighestPoupZIndex() + 1;
      $("#" + dialogId).css("z-index", zindex);

      $("#" + dialogId).show();
    }, 300);
  };

  var showSysProtectedCredentials = function (title, description, msg, continueCallBack, cancelCallBack) {
    _showProtectSystemDialog(credentialsTemplate, title, description, msg, continueCallBack, cancelCallBack);
  };


  function _showProtectSystemDialog(template, title, description, msg, continueCallBack, cancelCallBack) {
    var html = Mustache.to_html(template, {
      title: title,
      description: description,
      message: msg,
      demoMode: (App.mode != undefined && App.mode === "demo")
    });

    var dialogId = "dialog-" + Date.now();
    var dialogContainer = $("<div class='popup popup-modal' id='" + dialogId + "'>");
    $("." + mainContainerClass).append(dialogContainer);
    setTimeout(function () {
      $("#" + dialogId).html(html);

      $("#" + dialogId + " .toggle-password").click(function () {
        $(this).toggleClass("eye-open eye-slash");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
          input.attr("type", "text");
        } else {
          input.attr("type", "password");
        }
      });

      $("#" + dialogId + " #dc-yesBtn").off('click');
      $("#" + dialogId + " #dc-yesBtn").on('click', function () {
        $("#" + dialogId + " #protected-username-error").html("");
        $("#" + dialogId + " #protected-username-error").parent().removeClass("error");

        var uname = $("#" + dialogId + " #protected-username").val();
        var pwd = $("#" + dialogId + " #protected-password").val();

        if (uname === "") {
          $("#" + dialogId + " #protected-username-error").html("This field is required");
          $("#" + dialogId + " #protected-username-error").parent().addClass("error");
        } else {
          if (continueCallBack != undefined) {
            continueCallBack(uname, pwd);
          };
          $("#" + dialogId).remove();
        }
      });

      $("#" + dialogId + " #dc-cancelBtn").off('click');
      $("#" + dialogId + " #dc-cancelBtn").on('click', function () {
        if (cancelCallBack != undefined) {
          cancelCallBack();
        };
        $("#" + dialogId).remove();
      });

      $("#" + dialogId + " input").keyup(function (event) {
        if (event.keyCode === 13) {
          $("#" + dialogId + " #dc-yesBtn").click();
        }
      });

      var zindex = findHighestPoupZIndex() + 1;
      $("#" + dialogId).css("z-index", zindex);
      $("#" + dialogId).show();

      setTimeout(function () {
        $("#" + dialogId + " #protected-username").focus();
      }, 100)
    }, 300);
  };

  var showProtectSystemDialog = function (title, yesCallBack, cancelCallBack) {
    _showProtectSystemDialog(protectSystemTemplate, title, "", "", yesCallBack, cancelCallBack);
  };

  var findHighestPoupZIndex = function () {
    var highest = 0;
    for (var i = 0; i < $(".popup-modal").length; i++) {
      var zindex = 0;

      try {
        zindex = parseInt($($(".popup-modal")[i]).css('z-index'));
      } catch (err) { };

      if (zindex > highest) {
        highest = zindex + 5;
      }
    };

    for (var i = 0; i < $(".popup").length; i++) {
      var zindex = 0;

      try {
        zindex = parseInt($($(".popup")[i]).css('z-index'));
      } catch (err) { };

      if (zindex > highest) {
        highest = zindex + 5;
      }
    };

    return highest;
  };

  cleanUpDialogs = function () {
    $("div[id^='dialog']").remove();
  };

  return {
    showDeleteConfirmation: showDeleteConfirmation,
    showErrorMessageDialog: showErrorMessageDialog,
    showSuccessMessageDialog: showSuccessMessageDialog,
    showMessageDialog: showMessageDialog,
    showConfirmationDialog: showConfirmDialog,
    showSysProtectedCredentials: showSysProtectedCredentials,
    showProtectSystemDialog: showProtectSystemDialog,
    findHighestPoupZIndex: findHighestPoupZIndex,
    cleanUpDialogs: cleanUpDialogs,
  }
}();