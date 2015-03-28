/**
* CertManager namespace.
*/
if ("undefined" == typeof(CertManager)) {
  var CertManager = {};
};

/**
* Controls the tab overlay for the extension.
*/
CertManager.TabOverlay = {
  /**
  * Says 'Hello' to the user.
  */
  sayHello : function(aEvent) {
    let stringBundle = document.getElementById("certmanager-string-bundle");
    let message = stringBundle.getString("certmanager.greeting.label");
   	window.alert(message);
  }
};