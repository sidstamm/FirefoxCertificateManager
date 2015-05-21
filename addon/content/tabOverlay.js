const nsIX509CertDB = Components.interfaces.nsIX509CertDB;
const nsX509CertDB = "@mozilla.org/security/x509certdb;1";
const nsIX509Cert = Components.interfaces.nsIX509Cert;

const nsIFilePicker = Components.interfaces.nsIFilePicker;
const nsFilePicker = "@mozilla.org/filepicker;1";
const gCertFileTypes = "*.p7b; *.crt; *.cert; *.cer; *.pem; *.der";

/**
 * CertManager namespace.
 */
if ("undefined" == typeof(CertManager)) {
  var CertManager = {};

  CertManager.isBuiltinToken = function(tokenName) {
    return tokenName == "Builtin Object Token"; 
  }
  
  CertManager.isCertBuiltIn = function(cert) {
    let tokenNames = cert.getAllTokenNames({});
    if (!tokenNames) {
      return false;
    }
    if (tokenNames.some(CertManager.isBuiltinToken)) {
      return true;
    }
    return false;
  }
  
  CertManager.isTrusted = function(cert) {
    var certdb = Components.classes[nsX509CertDB].getService(nsIX509CertDB);
    var sslTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_SSL); 
    var emailTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_EMAIL); 
    var objTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_OBJSIGN);
    return sslTrust || emailTrust || objTrust;
  }
  
  CertManager.getCAData = function() {
  
    var certdb = Components.classes[nsX509CertDB].getService(nsIX509CertDB);
    var certcache = certdb.getCerts();
    var enumerator = certcache.getEnumerator();
    var authorities = {};
  
    while (enumerator.hasMoreElements()) {
    	var cert =
    	enumerator.getNext().QueryInterface(Components.interfaces.nsIX509Cert);
    	if (cert.certType == nsIX509Cert.CA_CERT) {
    	  if (!(cert.issuerOrganization in authorities)) {
  
    	  	// Trust bits
    	  	var trusted = CertManager.isTrusted(cert) ? "true" : "false";
  
    	  	var builtIn = CertManager.isCertBuiltIn(cert) ? "builtInCert" : "customCert";
  
    	  	// Setup basic data
    	  	var tempVisRow = [[builtIn, cert.issuerOrganization, "Green", trusted], true, false];
  
    	  	// SalesForce
    	  	var tempChildData = (cert.issuerOrganization in certManagerJson) ?  
    	  	                          [certManagerJson[cert.issuerOrganization].auditDate, "UNKNOWN", certManagerJson[cert.issuerOrganization].trustBits] : 
    	  	                          ["UNKNOWN", "UNKNOWN", "UNKNOWN"];
  
    	  	authorities[cert.issuerOrganization] = [tempVisRow, tempChildData];
    	  } else {
    	  	var trusted = CertManager.isTrusted(cert) ? "true" : "false";
    	  	var builtIn = CertManager.isCertBuiltIn(cert) ? "builtInCert" : "customCert";
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
  
    return [visData, chData];
  }
  
  CertManager.make_treeView = function(){
    var CAs = CertManager.getCAData();
    var treeView = {
    	/*
      *  [[Image, Name, Trustworthiness, Trusted], HasData, Expanded] 
      */
      visibleData: CAs[0],
  
      /*
      *  [Last Audit, Country, ...]
      */
      childData: CAs[1],
  
      treeBox: null,
    //TODO Figure out why this is get rowCount
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
  
  
  CertManager.addCACerts = function() {
      var fp = Components.classes[nsFilePicker].createInstance(nsIFilePicker);
      fp.init(window,
              "Select File containing CA certificate(s) to import",
              nsIFilePicker.modeOpen);
      fp.appendFilter("Certificate Files",
                      gCertFileTypes);
      fp.appendFilters(nsIFilePicker.filterAll);
      if (fp.show() == nsIFilePicker.returnOK) {
        var certdb = Components.classes[nsX509CertDB].getService(nsIX509CertDB);
        certdb.importCertsFromFile(null, fp.file, nsIX509Cert.CA_CERT);
        CertManager.setView();
      }
    }
};



var gCertPane = {
  init: function() {
    function setEventListener(aId, aEventType, aCallback) {
      document.getElementById(aId)
        .addEventListener(aEventType, aCallback.bind(gContentPane));
    }

    CertManager.setView();
  },
};

register_module("paneCertManager", gCertPane);