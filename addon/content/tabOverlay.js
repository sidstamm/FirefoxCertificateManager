// const {Cu} = require("chrome");
// const {TextDecoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});
// const {TextDecoder, TextEncoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});


// function get_certs() {
//   //Returns the certs saved on the system
//   Components.utils.import("resource://gre/modules/FileUtils.jsm");
//   var file = FileUtils.File("C:\\Users\\daxx\\Documents\\Classes\\Senior\ Project\\SeniorProject\\addon\\certs.txt");
//   if(!file.exists()){
//     console.log("certs.txt doesn't exist")
//   }

//   var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].
//   createInstance(Components.interfaces.nsIFileInputStream);
//   istream.init(file, 0x01, 0444, 0);
//   istream.QueryInterface(Components.interfaces.nsILineInputStream);

//   var line = {},
//     lines = [],
//     hasmore;
//   do {
//     hasmore = istream.readLine(line);
//     lines.push(line.value);
//   } while (hasmore);

//   istream.close();
//   return lines;
// }

const nsIX509CertDB = Components.interfaces.nsIX509CertDB;
const nsX509CertDB = "@mozilla.org/security/x509certdb;1";
const nsIX509Cert = Components.interfaces.nsIX509Cert;

const nsIFilePicker = Components.interfaces.nsIFilePicker;
const nsFilePicker = "@mozilla.org/filepicker;1";
const gCertFileTypes = "*.p7b; *.crt; *.cert; *.cer; *.pem; *.der";



// while (enumerator.hasMoreElements()) {
//   var cert =
//   enumerator.getNext().QueryInterface(Components.interfaces.nsIX509Cert);
//   if (cert.certType == Components.interfaces.nsIX509Cert.CA_CERT) {
//     // do something with cert
//   }
// }


function addCACerts(){
   console.log("Attempting to add cert")
   var bundle = document.getElementById("pippki_string_bundle");
   var fp = Components.classes[nsFilePicker].createInstance(nsIFilePicker);
   console.log("Got before fp init")
   fp.init(window,
           "Select File containing CA certificate(s) to import",
           nsIFilePicker.modeOpen);
   console.log("Successful init")
   fp.appendFilter("Certificate Files",//bundle.getString("file_browse_Certificate_spec"),
                   gCertFileTypes);
   fp.appendFilters(nsIFilePicker.filterAll);
   if (fp.show() == nsIFilePicker.returnOK) {
     certdb.importCertsFromFile(null, fp.file, nsIX509Cert.CA_CERT);
     caTreeView.loadCerts(nsIX509Cert.CA_CERT);
     caTreeView.selection.clearSelection();
   }
  }

/**
 * CertManager namespace.
 */
if ("undefined" == typeof(CertManager)) {
  var certdb = Components.classes[nsX509CertDB].getService(nsIX509CertDB);
  var certcache = certdb.getCerts();
  var enumerator = certcache.getEnumerator();
  var authorities = {};





  function isBuiltinToken(tokenName) {
    return tokenName == "Builtin Object Token"; }

  function isCertBuiltIn(cert) {
    let tokenNames = cert.getAllTokenNames({});
    if (!tokenNames) {
      return false;
    }
    if (tokenNames.some(isBuiltinToken)) {
      return true;
    }
    return false;
  }

  function isTrusted(cert) {  	
    var sslTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_SSL); 
    var emailTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_EMAIL); 
    var objTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_OBJSIGN);
    return sslTrust || emailTrust || objTrust;
  }


  
  while (enumerator.hasMoreElements()) {
  	var cert =
  	enumerator.getNext().QueryInterface(Components.interfaces.nsIX509Cert);
  	if (cert.certType == nsIX509Cert.CA_CERT) {
  	  if (!(cert.issuerOrganization in authorities)) {

  	  	// Trust bits
  	  	var trusted = isTrusted(cert) ? "true" : "false";

  	  	var builtIn = isCertBuiltIn(cert) ? "builtInCert" : "customCert";

  	  	// Setup basic data
  	  	var tempVisRow = [[builtIn, cert.issuerOrganization, "Green", trusted], true, false];

  	  	// SalesForce
  	  	var tempChildData = (cert.issuerOrganization in certManagerJson) ?  
  	  	                          [certManagerJson[cert.issuerOrganization].auditDate, "UNKNOWN", certManagerJson[cert.issuerOrganization].trustBits] : 
  	  	                          ["UNKNOWN", "UNKNOWN", "UNKNOWN"];

  	  	authorities[cert.issuerOrganization] = [tempVisRow, tempChildData];
  	  } else {
  	  	var trusted = isTrusted(cert) ? "true" : "false";
  	  	var builtIn = isCertBuiltIn(cert) ? "builtInCert" : "customCert";
  	  	if (authorities[cert.issuerOrganization][0][0][3] == "false" && trusted == "true") {
  	  	  authorities[cert.issuerOrganization][0][0][3] = "true";
  	  	}
  	  	if (authorities[cert.issuerOrganization][0][0][0] == "customCert" && builtIn == "builtInCert") {
  	  	  authorities[cert.issuerOrganization][0][0][0] = builtIn;
  	  	}
  	  }
  	}
  }

  var visData = [];
  var chData = [];
  var keys = [];

  for (var auth in authorities) {
  	keys.push(auth);
  }

  keys.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  for (var i = 0; i < keys.length; i++) {
  	visData.push(authorities[keys[i]][0]);
  	chData.push(authorities[keys[i]][1]);
  }

  var CertManager = {
  	vData: visData,
  	cData: chData,
  };
};

CertManager.make_treeView = function(){
  var treeView = {
  	/*
    *  [[Image, Name, Trustworthiness, Trusted], HasData, Expanded] 
    */
    visibleData: CertManager.vData
    // [
    //   //First one is text in the rows the booleans are isContainer and isContainerOpen respectively    
    //   [
    //     ["builtInCert", "SidTrust", "Green", "true"], true, false
    //   ],
    //   [
    //     ["customCert", "Dax Trust", "Red", "false"], true, false
    //   ]
    // ]
    ,
    /*
    *  [Last Audit, Country, ...]
    */
    childData: CertManager.cData
    // [    
    //   ["Never", "USA", "stuff"],
    //   ["Today", "China", "stuff2"]
    // ]
    ,
    // rowAttr:[
    //   [true, false],
    //   [true, false],
    // ]
    //,
    treeBox: null,
  //TODO Figure out why this is getrowCount
    get rowCount() {
      return this.visibleData.length;
    },
    getCellText: function(row, column) {
      switch (column.id) {
        case ("sourceColumn"):
          if (!this.isContainer(row)) return this.visibleData[row][0][0]
          break;
        case ("authorityColumn"):
          return this.visibleData[row][0][1];
        case ("trustworthinessColumn"):
          return this.visibleData[row][0][2];
      }
    },
    setTree: function(treebox) {
      this.treeBox = treebox;
    },
    isContainer: function(row) {
      return this.visibleData[row][1];
    },
    isContainerOpen: function(row) {
      return this.visibleData[row][2];
    },
    isContainerEmpty: function(row) {
      return false;
    },
    isSeparator: function(row) {
      return false;
    },
    isSorted: function() {
      return false;
    },
    getParentIndex: function(row) {
      if (this.isContainer(row)) return -1;
      for (var i = row - 1; i >= 0; i--) {
        if (this.isContainer(i)) return i;
      }
    },
    getLevel: function(row) {
      if (this.isContainer(row)) return 0;
      return 1;
    },
    hasNextSibling: function(row, after) {
      var level = this.getLevel(row);
      for (var i = after + 1; i < this.visibleData.length; i++) {
        var nlevel = this.getLevel(i);
        if (nlevel == level) return true;
        if (nlevel < thisLevel) break;
      }
      return false;
    },
    toggleOpenState: function(row) {
      //Add dis hardcoded
      var data = this.visibleData[row];
      if (!data[1]) return;

      if (data[2]) {
        data[2] = false;

        /** Stock 3 rows on toggle atm */
        this.visibleData.splice(row + 1, 3);
        if (this.treeBox) this.treeBox.rowCountChanged(row + 1, -3);
      } else {
        data[2] = true;
        var toInsert = this.childData[row]
        this.visibleData.splice(row + 0 + 1, 0, [
          ["Last Audit:", toInsert[0]], false
        ]);
        this.visibleData.splice(row + 1 + 1, 0, [
          ["Country:", toInsert[1]], false
        ]);
        this.visibleData.splice(row + 2 + 1, 0, [
          [toInsert[2]], false
        ]);
        if (this.treeBox) this.treeBox.rowCountChanged(row + 1, 3);
      }
      if (this.treeBox) this.treeBox.invalidateRow(row);
    },
    getImageSrc: function(row, col) {
      return null;
    },
    getRowProperties: function(row, props) {},
    getCellProperties: function(row, column, props) {
      if (this.isContainer(row)) {
        switch (column.id) {
          case ("sourceColumn"):
            return this.visibleData[row][0][0];
          case ("trustworthinessColumn"):
            return "greenTrust"; /** TODO update with  color logic */
        }
      }
    },

    getColumnProperties: function(colid, col, props) {},
    isEditable: function(row, col) {
      if (col.id == "trustedColumn" && this.isContainer(row)) return true;
      else return false;
    },
    setCellValue: function(row, col, value) {
      if (this.isContainer(row)) {
        this.visibleData[row][0][3] = value;
      }
    },
    getCellValue: function(row, col) {
      return this.visibleData[row][0][3];
    },
  };
  return treeView
};


CertManager.setView = function() {
  document.getElementById('certView').view = CertManager.make_treeView();
}

var gCertPane = {
  init: function() {
    //console.log(get_certs())
    function setEventListener(aId, aEventType, aCallback) {
      document.getElementById(aId)
        .addEventListener(aEventType, aCallback.bind(gContentPane));
    }

    CertManager.setView();
  },
};

register_module("paneCertManager", gCertPane);