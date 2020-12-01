var StringTable = function () {
  var messages = {
    "html401": "Your session has expired.  Please sign in again.",
    "firmwareDeleteTitle": "Delete Firmware",
    "firmwareImportSuccess": "{1} was imported successfully!",
    "firmwareDeleteSuccess": "{1} was deleted successfully!",
    "firmwareDeleteFailed": "Delete firmware Failed!",
    "GetFailed": "Unable to retrieve {1}",
    "InputInvalidateTime": "Value must be a time",
    "InputInvalidateDate": "Value must be a date",
    "invalidInputFields": "Incomplete or missing or invalid information.  Please check your inputs and try again.",
    "invalidHostNameOrIpAddress": "Invalid IP Address/Host Name.",
    "invalidBaseDN": "Invalid Base Distinguished Name",
    "InputFieldRequired": "This field is required",
    "InputExceedStrLimit": "{1} cannot be longer than {2} characters",
    "featureNotSupportedByDevice": "This device does not support {1}",
    "configAllVoIPCardsLabel": "Configure all VoIP cards in this device",
    "ExceedsFileSizeLimit": "The certificate file size has exceeded max limit of 10K",
    "EmptyFile": "The file is empty",
    "InvalidRootCertificate": "The root certificate has failed the validation",
    "InvalidClientCertificate": "The client certificate has failed the validation",
    "CertificateFailedValidation": "The certificate has failed the validation",
    "UpdateSucceeded": "Update Succeeded",
    "UpdateFailed": "Update Failed",
    "ExportFailed": "Export Failed",
    "DeleteSucceeded": "Deleted Succeeded",
    "ContinueConfirmation": "You haven't saved your changes.  <br/>Are you sure you want to continue?",
    "8021xChangesSubmitted": "802.1X Configuration changes have been submitted.",
    "No8021xChanges": "There are no configuration changes to be submitted.",
    "FieldNotSelected": "{1} is not selected",
    "InvalidPort": "Invalid Port Number",
    "TimezonesFailed": "Failed to fetch time zones.",
    "FirmwareUpdate": "Updating Firmware",
    "NetworkChanges": "Updating Network Options",
    "VoipChanges": "Updating VoIP Settings",
    "Changing8021x": "Updating 802.1X Settings",
    "Reboot": "Rebooting",
    "Missing": "Missing",
    "CredentialForUpdateDevice": "This is a protected device. Enter your credentials to continue update.",
    "CredentialForGetDeviceLog": "This is a protected device. Enter your credentials to continue download Logs.",
    "CredentialForDeviceInfo": "This is a protected device. Enter your credentials to retrieve Device Information.",
    "UnableToDownload": "Unable to download {1}",
    "invalidCredentials": "The credentials provided were not valid.",
    "RequestSubmitted": "Update Request Submitted",
    "RebootDeviceFailed": "Reboot Device Failed!",
    "CloudNotAvailable": "Support mode is not currently available",
    "ClearFailed": "Clear {1} Failed!",
  };

  var getString = function (code, defaultString) {
    var value = messages[code];
    if (value == undefined) {
      return defaultString;
    }

    return value;
  }

  var getStringWithParams = function (code, params, defaultString) {
    var str = getString(code, defaultString);
    for (var i = 0; i < params.length; i++) {
      str = str.replace('{' + (i + 1) + '}', params[i]);
    };

    return str;
  }

  return {
    getString: getString,
    getStringWithParams: getStringWithParams,
  }
}();

var apiCalls = {
  about: "About",
  alertEmailSettings: "Settings/AlertEmail",
  assignLabels: "willBeImplemented",
  alertSmsSettings: "Settings/AlertSms",
  alertSmsGatewaySettings: "Settings/SMSGateways",
  itinerary: "SvBackend.asmx/login",
  smtpSettings: "Settings/smtp",
  labels: "Labels",
  label: "Label",
  network: "Settings/Network",
  history: "History",
  deviceVoIPCapability: "DeviceVoIP/Capability",
  deviceVoIPConfig: "DeviceVoIP/Configuration",
  device8021xConfig: "Device8021X/Configuration",
  device8021xCapability: "Device8021X/Capability",
  timeZone: "Settings/TimeZone",
  timeZoneList: "Settings/TimeZones",
  permissionsForRole: "ApiPermissionsForRole",
  roleAlias: "RoleALias",
  devices: "Devices",
  settingsNetwork: "Settings/Network",
  smsGateways: "Settings/SMSGateways",
  gatewayCloudSettings: "Settings/GatewayCloud",
  gatewayIISSettings: "Settings/GatewayIIS",
  login: "SvBackend.asmx/login",
  logout: "logout",
  systems: "systems",
  notifications: "notifications",
  forgetAll: "Devices/ForgetKnownDevices"
};
