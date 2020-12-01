var Helper = function () {

  var getErrorMessageFromResponse = function (defaultMsg, response) {
    var errormsg = "<strong>" + defaultMsg + "</strong>";
    if (response.responseText != undefined && response.responseText != "") {
      if (response.responseText.indexOf("<!DOCTYPE html") < 0) {
        errormsg = "<strong>" + response.responseText + "</strong>";
      }
    } else {
      if (response.statusText != "") {
        errormsg = "<strong>" + response.statusText + "</strong>";
      }
    };

    return errormsg;
  };

  var getErrorCodeFromResponse = function (response) {
    return response.status;
  };

  var reScale = function () {
    var baseSize = {
      width: 1120,
      height: 630,
    };

    var height = $(window).height();
    var width = $(window).width();
    var newScale = 1;

    if (height > baseSize.height && width >= baseSize.width) {
      newScale = Math.min(
          width / baseSize.width,
          height / baseSize.height
      );
    };

    $(".mcp-container").css('transform', 'scale(' + newScale + ')');
  };

  var replaceTags = function (str) {
    var result = str.replace(new RegExp("<", "g"), "&lt;");
    result = result.replace(new RegExp(">", "g"), "&gt;");

    return result;
  };

  return {
    getErrorMessageFromResponse: getErrorMessageFromResponse,
    getErrorCodeFromResponse: getErrorCodeFromResponse,
    reScale: reScale,
    replaceTags: replaceTags
  }
}();