/*
    Responsible for managing cert data
*/
let {
    Cc, Ci
} = require('chrome');

const nsIX509CertDB = Ci.nsIX509CertDB;
const nsX509CertDB = "@mozilla.org/security/x509certdb;1";
const nsIX509Cert = Ci.nsIX509Cert;

const nsICertificateDialogs = Ci.nsICertificateDialogs;
const nsCertificateDialogs = "@mozilla.org/nsCertificateDialogs;1"

const nsIFilePicker = Ci.nsIFilePicker;
const nsFilePicker = "@mozilla.org/filepicker;1";
const gCertFileTypes = "*.p7b; *.crt; *.cert; *.cer; *.pem; *.der";

const nsDialogParamBlock = "@mozilla.org/embedcomp/dialogparam;1";
const nsIDialogParamBlock = Ci.nsIDialogParamBlock;

var SFD = require("./SalesForceData.js");
var tabs = require('sdk/tabs');
var ss = require("sdk/simple-storage");
var certManagerJson = SFD.getJSON();

function getCM() {

    var CertManager = {};

    CertManager.exportCerts = function() {
        // https://dxr.mozilla.org/mozilla-central/source/security/manager/pki/resources/content/certManager.js
        // see exportCerts() function

        // getSelectedCerts();
        // var numcerts = selected_certs.length;
        // if (!numcerts)
        //   return;

        // for (var t=0; t<numcerts; t++) {
        //   exportToFile(window, selected_certs[t]);
    }

    CertManager.distrustAuth = function(authInfo) {
        if (!('savedAuths' in ss.storage)) {
            ss.storage.savedAuths = {};
        }
        var authSavedTrusts = {};
        for( var certId in authInfo.certs ) {
            var cert = authInfo.certs[certId];
            var certTrust = {ssl: CertManager.isSSLTrust(cert), email: CertManager.isEmailTrust(cert), obj: CertManager.isObjTrust(cert) };
            CertManager.setCertTrusts(cert, false, false, false);
            authSavedTrusts[cert.commonName] = certTrust;
        }
        ss.storage.savedAuths[authInfo.name] = authSavedTrusts;
    }

    CertManager.entrustAuth = function(authInfo) {
        var certTrusts = ss.storage.savedAuths[authInfo.name];
        for( var certId in authInfo.certs ) {
            var cert = authInfo.certs[certId];
            var trust = certTrusts[cert.commonName];
            CertManager.setCertTrusts(cert, trust.ssl, trust.email, trust.obj);
        }
        delete ss.storage.savedAuths[authInfo.name];
    }

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


    CertManager.importCert = function() {
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
            tabs.activeTab.reload();
        }
    }

    CertManager.deleteCert = function(cert) {
        var certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);
        certdb.deleteCertificate(cert);
    }

	CertManager.viewCert = function(cert) {
		var cd = Cc[nsCertificateDialogs].getService(nsICertificateDialogs);
		cd.viewCert(null, cert);
	}

	CertManager.calculateTrust = function(cert,numCerts,score){
	//ASN1Structure ASN1_SEQUENCE = 16 --> SHA 256
	//enum for type of encryption https://dxr.mozilla.org/mozilla-central/source/dom/crypto/WebCryptoTask.cpp ->mOidTag == encrypting algorithm
	//https://dxr.mozilla.org/mozilla-central/source/dom/crypto/WebCryptoCommon.h#17
	// https://dxr.mozilla.org/mozilla-central/source/security/manager/locales/en-US/chrome/pipnss/pipnss.properties -- reverse search the descriptions to get an actual algorithm used with the enum in WebCrypto
		if(cert.ASN1Structure.ASN1_SEQUENCE == "16"){
			var t = ((score+10) / numCerts);
			return t.toFixed(1);
		}else{
			var t = score / numCerts;
			return t.toFixed(1);
		}
	}

    CertManager.setCertTrusts = function(cert, ssl, email, objsign) {
        var certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);
        var trustssl = (ssl) ? nsIX509CertDB.TRUSTED_SSL : 0;
        var trustemail = (email) ? nsIX509CertDB.TRUSTED_EMAIL : 0;
        var trustobjsign = (objsign) ? nsIX509CertDB.TRUSTED_OBJSIGN : 0;

        certdb.setCertTrust(cert, nsIX509Cert.CA_CERT, trustssl | trustemail | trustobjsign);
        return true;
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
                    var trust = CertManager.calculateTrust(cert,1,90);
                    var last = (cert.issuerOrganization in certManagerJson) ? certManagerJson[cert.issuerOrganization].auditDate : "UNKNOWN";
                    var country = "UNKNOWN";
                    var trustbits = []
                    if (CertManager.isSSLTrust(cert)) {
                        trustbits.push("SSL");
                    } 
                    if (CertManager.isEmailTrust(cert)) {
                        trustbits.push("EMAIL");
                    }
                    if (CertManager.isObjTrust(cert)) {
                        trustbits.push("SOFTWARE");
                    }
                    trustbits = trustbits.join(", ");
                    var enabled = ('savedAuths' in ss.storage && name in ss.storage.savedAuths) ? false : true;
                    authorities[cert.issuerOrganization] = { source: source, name: name, trust: trust, last: last, country: country, bits: trustbits, certs: [cert], certCount: 1, trusted: enabled};
                } else {
                    var source = CertManager.isCertBuiltIn(cert) ? "builtInCert" : "customCert";
                    var name = cert.issuerOrganization;
                    var trust = CertManager.calculateTrust(cert,authorities[cert.issuerOrganization].certCount+1,authorities[cert.issuerOrganization].trust);
                    var last = (cert.issuerOrganization in certManagerJson) ? certManagerJson[cert.issuerOrganization].auditDate : "UNKNOWN";
                    var country = "UNKNOWN";

                    if (authorities[cert.issuerOrganization].source === "customCert") {
                        authorities[cert.issuerOrganization].source = source;
                    }
					authorities[cert.issuerOrganization].trust = trust;
                    if (authorities[cert.issuerOrganization].last === "UNKNOWN") {
                        authorities[cert.issuerOrganization].last = last;
                    }
                    if (authorities[cert.issuerOrganization].country === "UNKNOWN") {
                        authorities[cert.issuerOrganization].country = country;
                    }

                    var trusts = authorities[cert.issuerOrganization].bits.split(", ");
                    var trustbits = []
                    if (trusts.indexOf("SSL") > -1 || CertManager.isSSLTrust(cert)) {
                        trustbits.push("SSL");
                    } 
                    if (trusts.indexOf("EMAIL") > -1 || CertManager.isEmailTrust(cert)) {
                        trustbits.push("EMAIL");
                    }
                    if (trusts.indexOf("SOFTWARE") > -1 || CertManager.isObjTrust(cert)) {
                        trustbits.push("SOFTWARE");
                    }                    
                    trustbits = trustbits.join(", ");
                    authorities[cert.issuerOrganization].bits = trustbits;
                    authorities[cert.issuerOrganization].certs.push(cert);
					authorities[cert.issuerOrganization].certCount = authorities[cert.issuerOrganization].certCount;
                }
            }
        }

        var keys = [];
        var out = [];

        for (var auth in authorities) {
            keys.push(auth);
        }

        keys.sort(function(a, b) {
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