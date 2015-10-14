/*
    Responsible for managing cert data
*/
let { Cc, Ci } = require('chrome');

const nsIX509CertDB = Ci.nsIX509CertDB;
const nsX509CertDB = "@mozilla.org/security/x509certdb;1";
const nsIX509Cert = Ci.nsIX509Cert;

const nsIFilePicker = Ci.nsIFilePicker;
const nsFilePicker = "@mozilla.org/filepicker;1";
const gCertFileTypes = "*.p7b; *.crt; *.cert; *.cer; *.pem; *.der";

var SFD = require("./SalesForceData.js");
var certManagerJson = SFD.getJSON();

function getCM(){

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
    var certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);
    var sslTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_SSL); 
    var emailTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_EMAIL); 
    var objTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_OBJSIGN);
    return sslTrust || emailTrust || objTrust;
    }

    CertManager.isSSLTrust = function(cert) {
    var certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);
    return certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_SSL);
    }

    CertManager.isEmailTrust = function(cert) {
    var certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);
    return certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_EMAIL);
    }

    CertManager.isObjTrust = function(cert) {
    var certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);
    return certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_OBJSIGN);
    }


    CertManager.insertCert = function() {
        var fp = Cc[nsFilePicker].createInstance(nsIFilePicker);
        var win = require("sdk/window/utils").getMostRecentBrowserWindow();
        fp.init(win,
                "Select File containing CA certificate(s) to import",
                nsIFilePicker.modeOpen);
        fp.appendFilter("Certificate Files",
                        gCertFileTypes);
        fp.appendFilters(nsIFilePicker.filterAll);
        if (fp.show() == nsIFilePicker.returnOK) {
          var certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);
          certdb.importCertsFromFile(null, fp.file, nsIX509Cert.CA_CERT);
          // TODO: update table so new data appears
        }           
    }

    CertManager.genCAData = function() {

    var certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);
    var certcache = certdb.getCerts();
    var enumerator = certcache.getEnumerator();
    var authorities = {};

    while (enumerator.hasMoreElements()) {
        var cert =
        enumerator.getNext().QueryInterface(Ci.nsIX509Cert);
        if (cert.certType == nsIX509Cert.CA_CERT) {
            if (!(cert.issuerOrganization in authorities)) {
                var source = CertManager.isCertBuiltIn(cert) ? "builtInCert" : "customCert";
                var name = cert.issuerOrganization;
                var trust = CertManager.isTrusted(cert) ? "100" : "0";
                var last = (cert.issuerOrganization in certManagerJson) ? certManagerJson[cert.issuerOrganization].auditDate : "UNKNOWN"; 
                var country = "UNKNOWN";
                var trustbits = (cert.issuerOrganization in certManagerJson) ? certManagerJson[cert.issuerOrganization].trustBits : "UKNOWN";
                authorities[cert.issuerOrganization] = [source, name, trust, last, country, trustbits, [cert]];
            }
            else
            {
                var source = CertManager.isCertBuiltIn(cert) ? "builtInCert" : "customCert";
                var name = cert.issuerOrganization;
                var trust = CertManager.isTrusted(cert) ? "100" : "0";
                var last = (cert.issuerOrganization in certManagerJson) ? certManagerJson[cert.issuerOrganization].auditDate : "UNKNOWN"; 
                var country = "UNKNOWN";
                var trustbits = (cert.issuerOrganization in certManagerJson) ? certManagerJson[cert.issuerOrganization].trustBits : "UKNOWN";

                if (authorities[cert.issuerOrganization][0] === "customCert") {
                    authorities[cert.issuerOrganization][0] = source;
                }
                if (authorities[cert.issuerOrganization][2] === "0") {
                    authorities[cert.issuerOrganization][2] = trust;
                }
                if (authorities[cert.issuerOrganization][3] === "UNKNOWN") {
                    authorities[cert.issuerOrganization][3] = last;
                }
                if (authorities[cert.issuerOrganization][4] === "UNKNOWN") {
                    authorities[cert.issuerOrganization][4] = country;
                }
                if (authorities[cert.issuerOrganization][5] === "UNKNOWN") {
                    authorities[cert.issuerOrganization][5] = trustbits;
                }

                authorities[cert.issuerOrganization][6].push(cert);
            }
        }
    }

    var keys = [];
    var out = [];

    for (var auth in authorities) {
        keys.push(auth);
    }

    keys.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    for (var i = 0; i < keys.length; i++) {
        out.push(authorities[keys[i]]);
    }

    return out;
    }  

    return CertManager;
}

exports.getCM = getCM