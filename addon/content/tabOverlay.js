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

var gCertPane = {
  init: function ()
  {
    function setEventListener(aId, aEventType, aCallback)
    {
      document.getElementById(aId)
              .addEventListener(aEventType, aCallback.bind(gContentPane));
    }
  },
};
register_module("paneCertManager", gCertPane);