let { Cc, Ci } = require('chrome');

var certManagerJsonText = '{  "Wells Fargo WellsSecure": {    "auditDate": "2014.09.12",     "trustBits": "Websites"  },   "Certificate Issuer Organization": {    "auditDate": "Standard Audit Statement Dt",     "trustBits": "Trust Bits"  },   "The Go Daddy Group, Inc.": {    "auditDate": "2014.08.14",     "trustBits": "Code; Email; Websites"  },   "CNNIC": {    "auditDate": "2014.08.01",     "trustBits": "Websites"  },   "Hellenic Academic and Research Institutions Cert. Authority": {    "auditDate": "2014.12.20",     "trustBits": "Code; Email; Websites"  },   "GlobalSign nv-sa": {    "auditDate": "2014.06.11",     "trustBits": "Code; Email; Websites"  },   "TeliaSonera": {    "auditDate": "2014.07.27",     "trustBits": "Email; Websites"  },   "GoDaddy.com, Inc.": {    "auditDate": "2014.08.14",     "trustBits": "Code; Websites"  },   "DigiCert Inc": {    "auditDate": "2014.07.16",     "trustBits": "Code; Email; Websites"  },   "certSIGN": {    "auditDate": "2015.04.10",     "trustBits": "Code; Email; Websites"  },   "Unizeto Technologies S.A.": {    "auditDate": "2014.07.09",     "trustBits": "Code; Email; Websites"  },   "Equifax Secure Inc.": {    "auditDate": "2014.06.18",     "trustBits": "Email"  },   "Entrust, Inc.": {    "auditDate": "2014.04.21",     "trustBits": "Code; Email; Websites"  },   "GlobalSign": {    "auditDate": "2014.06.11",     "trustBits": "Code; Email; Websites"  },   "IZENPE S.A.": {    "auditDate": "2014.07.31",     "trustBits": "Code; Websites"  },   "SECOM Trust.net": {    "auditDate": "2014.07.31",     "trustBits": "Code; Email; Websites"  },   "NetLock Kft.": {    "auditDate": "2014.06.04",     "trustBits": "Code; Email; Websites"  },   "EBG Bili\u015fim Teknolojileri ve Hizmetleri A.\u015e.": {    "auditDate": "2014.07.30",     "trustBits": "Code; Email; Websites"  },   "SecureTrust Corporation": {    "auditDate": "2014.11.14",     "trustBits": "Code; Websites"  },   "Microsec Ltd.": {    "auditDate": "2015.01.29",     "trustBits": "Code; Email; Websites"  },   "StartCom Ltd.": {    "auditDate": "2015.03.31",     "trustBits": "Code; Email; Websites"  },   "China Financial Certification Authority": {    "auditDate": "2014.12.05",     "trustBits": "Websites"  },   "TC TrustCenter GmbH": {    "auditDate": "2014.02.14",     "trustBits": "All Trust Bits Turned Off"  },   "thawte, Inc.": {    "auditDate": "2014.06.18",     "trustBits": "Code; Websites"  },   "SwissSign AG": {    "auditDate": "2015.04.02",     "trustBits": "Code; Email; Websites"  },   "Entrust.net": {    "auditDate": "2014.04.21",     "trustBits": "Code; Email; Websites"  },   "Equifax": {    "auditDate": "2014.06.18",     "trustBits": "Code; Email; Websites"  },   "T\u00dcRKTRUST Bilgi \u0130leti\u015fim ve Bili\u015fim G\u00fcvenli\u011fi Hizmetleri A.\u015e. (c) Aral\u0131k 2007": {    "auditDate": "2014.12.19",     "trustBits": "Code; Websites"  },   "T\u00fcrkiye Bilimsel ve Teknolojik Ara\u015ft\u0131rma Kurumu - T\u00dcB\u0130TAK": {    "auditDate": "2014.08.26",     "trustBits": "Email; Websites"  },   "Certplus": {    "auditDate": "2015.04.09",     "trustBits": "Email; Websites"  },   "WISeKey": {    "auditDate": "2014.05.27",     "trustBits": "Email; Websites"  },   "(c) 2005 T\u00dcRKTRUST Bilgi \u0130leti\u015fim ve Bili\u015fim G\u00fcvenli\u011fi Hizmetleri A.\u015e.": {    "auditDate": "2014.12.19",     "trustBits": "Code; Email; Websites"  },   "EDICOM": {    "auditDate": "2014.10.13",     "trustBits": "Code; Email; Websites"  },   "Agencia Catalana de Certificacio (NIF Q-0801176-I)": {    "auditDate": "2014.03.10",     "trustBits": "Websites"  },   "China Internet Network Information Center": {    "auditDate": "2014.08.01",     "trustBits": "Websites"  },   "SECOM Trust Systems CO.,LTD.": {    "auditDate": "2014.07.31",     "trustBits": "Code; Email; Websites"  },   "AS Sertifitseerimiskeskus": {    "auditDate": "2015.01.30",     "trustBits": "Code; Websites"  },   "Certinomis": {    "auditDate": "2014.06.30",     "trustBits": "Websites"  },   "Disig a.s.": {    "auditDate": "2014.10.29",     "trustBits": "Code; Email; Websites"  },   "Generalitat Valenciana": {    "auditDate": "2014.07.21",     "trustBits": "Code; Email; Websites"  },   "IdenTrust": {    "auditDate": "2014.07.25",     "trustBits": "Email; Websites"  },   "SG TRUST SERVICES": {    "auditDate": "2014.09.15",     "trustBits": "Email"  },   "E-Tu\u011fra EBG Bili\u015fim Teknolojileri ve Hizmetleri A.\u015e.": {    "auditDate": "2014.07.30",     "trustBits": "Code; Websites"  },   "VeriSign, Inc.": {    "auditDate": "2014.06.18",     "trustBits": "Code; Email; Websites"  },   "Sistema Nacional de Certificacion Electronica": {    "auditDate": "2014.06.20",     "trustBits": "Code; Email; Websites"  },   "Comodo CA Limited": {    "auditDate": "2014.09.10",     "trustBits": "Code; Email; Websites"  },   "Trustis Limited": {    "auditDate": "2015.03.01",     "trustBits": "Email; Websites"  },   "Actalis S.p.A./03358520967": {    "auditDate": "2014.09.23",     "trustBits": "Code; Websites"  },   "Digital Signature Trust Co.": {    "auditDate": "2014.07.25",     "trustBits": "Websites"  },   "Autoridad de Certificacion Firmaprofesional": {    "auditDate": "2015.03.11",     "trustBits": "Code; Email; Websites"  },   "Government Root Certification Authority": {    "auditDate": "2014.04.23",     "trustBits": "Code; Email; Websites"  },   "T-Systems Enterprise Services GmbH": {    "auditDate": "2014.07.11",     "trustBits": "Websites"  },   "Chunghwa Telecom Co., Ltd.": {    "auditDate": "2014.11.26",     "trustBits": "Code; Email; Websites"  },   "Japan Certification Services, Inc.": {    "auditDate": "2014.07.31",     "trustBits": "Websites"  },   "Hongkong Post": {    "auditDate": "2014.02.28",     "trustBits": "Websites"  },   "WoSign CA Limited": {    "auditDate": "2015.02.28",     "trustBits": "Code; Email; Websites"  },   "A-Trust Ges. f. Sicherheitssysteme im elektr. Datenverkehr GmbH": {    "auditDate": "2014.10.03",     "trustBits": "Websites"  },   "D-Trust GmbH": {    "auditDate": "2015.02.27",     "trustBits": "Websites"  },   "Sonera": {    "auditDate": "2014.07.27",     "trustBits": "Email; Websites"  },   "COMODO CA Limited": {    "auditDate": "2014.09.10",     "trustBits": "Code; Email; Websites"  },   "AC Camerfirma S.A.": {    "auditDate": "2014.05.30",     "trustBits": "Code; Email; Websites"  },   "QuoVadis Limited": {    "auditDate": "2015.03.27",     "trustBits": "Code; Email; Websites"  },   "TAIWAN-CA": {    "auditDate": "2014.05.15",     "trustBits": "Code; Email; Websites"  },   "Cybertrust, Inc": {    "auditDate": "2014.12.15",     "trustBits": "Websites"  },   "VISA": {    "auditDate": "2014.06.06",     "trustBits": "Code; Email; Websites"  },   "NetLock Halozatbiztonsagi Kft.": {    "auditDate": "2014.06.04",     "trustBits": "Email"  },   "Unizeto Sp. z o.o.": {    "auditDate": "2014.07.09",     "trustBits": "Code; Email; Websites"  },   "Swisscom": {    "auditDate": "2014.06.18",     "trustBits": "Code; Websites"  },   "Buypass AS-983163327": {    "auditDate": "2015.02.25",     "trustBits": "Websites"  },   "Digital Signature Trust": {    "auditDate": "2014.07.25",     "trustBits": "Websites"  },   "Staat der Nederlanden": {    "auditDate": "2015.03.03",     "trustBits": "Email; Websites"  },   "Dhimyotis": {    "auditDate": "2015.01.15",     "trustBits": "Email; Websites"  },   "ACCV": {    "auditDate": "2014.07.21",     "trustBits": "Code; Email; Websites"  },   "The USERTRUST Network": {    "auditDate": "2014.09.10",     "trustBits": "Code"  },   "Deutscher Sparkassen Verlag GmbH": {    "auditDate": "2014.04.11",     "trustBits": "Email"  },   "Atos": {    "auditDate": "2014.07.29",     "trustBits": "Code; Email; Websites"  },   "Network Solutions L.L.C.": {    "auditDate": "2015.02.24",     "trustBits": "Websites"  },   "Sociedad Cameral de Certificaci\u00f3n Digital - Certic\u00e1mara S.A.": {    "auditDate": "2014.07.14",     "trustBits": "Code; Email"  },   "GeoTrust Inc.": {    "auditDate": "2014.06.18",     "trustBits": "Code; Email; Websites"  },   "T\u00dcRKTRUST Bilgi \u0130leti\u015fim ve Bili\u015fim G\u00fcvenli\u011fi Hizmetleri A.\u015e. (c) Kas\u0131m 2005": {    "auditDate": "2014.12.19",     "trustBits": "Code; Email; Websites"  },   "AC Camerfirma SA CIF A82743287": {    "auditDate": "2014.05.30",     "trustBits": "Code; Email; Websites"  },   "Deutsche Telekom AG": {    "auditDate": "2014.07.11",     "trustBits": "Code; Email; Websites"  },   "Starfield Technologies, Inc.": {    "auditDate": "2014.08.14",     "trustBits": "Code; Websites"  },   "ComSign": {    "auditDate": "2014.09.16",     "trustBits": "Code; Websites"  },   "PM/SGDN": {    "auditDate": "2014.12.15",     "trustBits": "Code; Email; Websites"  },   "RSA Security Inc": {    "auditDate": "2015.02.11",     "trustBits": "Code; Email; Websites"  },   "Baltimore": {    "auditDate": "2014.12.15",     "trustBits": "Email; Websites"  },   "XRamp Security Services Inc": {    "auditDate": "2014.11.14",     "trustBits": "Code; Email; Websites"  },   "AddTrust AB": {    "auditDate": "2014.09.10",     "trustBits": ""  },   "AffirmTrust": {    "auditDate": "2014.06.30",     "trustBits": "Websites"  },   "Japanese Government": {    "auditDate": "2014.12.25",     "trustBits": "Code; Websites"  }}';

var certManagerJson = JSON.parse(certManagerJsonText);

const nsIX509CertDB = Ci.nsIX509CertDB;
const nsX509CertDB = "@mozilla.org/security/x509certdb;1";
const nsIX509Cert = Ci.nsIX509Cert;

const nsIFilePicker = Ci.nsIFilePicker;
const nsFilePicker = "@mozilla.org/filepicker;1";
const gCertFileTypes = "*.p7b; *.crt; *.cert; *.cer; *.pem; *.der";

var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var pageWorkers = require("sdk/page-worker");
var button = buttons.ActionButton({
  id: "cert-link",
  label: "View Certificate Manager",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});
function handleClick(state) {
	tabs.open({
		url: "index.html",
		onReady: function onReady(tab){
			tab.attach({
				contentScriptFile: self.data.url("callback.js")
			});
			var worker = tab.attach({
				contentScriptFile: [self.data.url("./jquery-1.11.3.js"),self.data.url("inject.js"),self.data.url("callback.js")]
			});
			
			var rows = CertManager.genCAData();
			for (var i = 0; i < rows.length; i++) {
		    	worker.port.emit("insert_row", i, rows[i][0], rows[i][1], rows[i][2], rows[i][3], rows[i][4], rows[i][5]);
		    }
			worker.port.on("insert_cert",function(num){
				//TODO: get data and emit it via worker
				console.log(num);
			});
		}
	});
}

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
    var certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);
    var sslTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_SSL); 
    var emailTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_EMAIL); 
    var objTrust = certdb.isCertTrusted(cert, Ci.nsIX509Cert.CA_CERT, Ci.nsIX509CertDB.TRUSTED_OBJSIGN);
    return sslTrust || emailTrust || objTrust;
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
    	    	authorities[cert.issuerOrganization] = [source, name, trust, last, country, trustbits];
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
  
  CertManager.addCACerts = function() {
      var fp = Cc[nsFilePicker].createInstance(nsIFilePicker);
      fp.init(window,
              "Select File containing CA certificate(s) to import",
              nsIFilePicker.modeOpen);
      fp.appendFilter("Certificate Files",
                      gCertFileTypes);
      fp.appendFilters(nsIFilePicker.filterAll);
      if (fp.show() == nsIFilePicker.returnOK) {
        var certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);
        certdb.importCertsFromFile(null, fp.file, nsIX509Cert.CA_CERT);
        CertManager.setView();
      }
    }
};


