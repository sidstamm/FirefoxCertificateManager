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
var a;

function click_row(st,ev){
  row = ev.target;
  console.log(ev)
  if(ev.layerX>595 && ev.layerX<640){
    toggle_checkbox(row);
  }
  if(ev.layerX>2 && ev.layerX<15){
    toggle_arrow(row)
  }
  a = ev;
}

function toggle_arrow(){
  box = row.getElementsByClassName("arrow")[0]
  status = box.getAttribute("direction")
  if(status=="right"){
    box.innerHTML = "&#8595;"
    status = box.setAttribute("direction","down")
  }
  else{
    box.innerHTML = "&#8594;"
    status = box.setAttribute("direction","right")
  }
}

function checked(row){
  box = row.getElementsByClassName("checkbox")[0]
  check = box.getAttribute("checked")
  if(check=="false"){
    return false;
  }
  return true;
}

function toggle_checkbox(row){
  box = row.getElementsByClassName("checkbox")[0]

  if(checked(row)){
    box.setAttribute("checked","false")
  }
  else{
    box.setAttribute("checked","true")
  }
}

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
