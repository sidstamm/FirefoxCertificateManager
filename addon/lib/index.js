/*
  Main file ran first
*/

let {
    Cc, Ci
} = require('chrome');

var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var pageWorkers = require("sdk/page-worker");

var CM = require("./CertManager.js");
var CertManager = CM.getCM();

var button = buttons.ActionButton({
    id: "cert-link",
    label: "View Certificate Manager",
    icon: {
        "16": "./img/icon-16.png",
        "32": "./img/icon-32.png",
        "64": "./img/icon-64.png"
    },
    onClick: loadPage
});

function loadPage(state) {
    tabs.open({
        url: "index.html",
        onReady: onReady
    });
}

/*
    First thing that is run 
    Ran when the extension page is loaded sets up everything else on the page
*/
function onReady(tab) {

    var worker = tab.attach({
        contentScriptFile: [self.data.url("./import/jquery-1.11.3.js"), self.data.url("./scripts/inject.js")]
    });

    authMap = CertManager.genCAData();
    var rows = authMap;
    for (var i = 0; i < rows.length; i++) {
        worker.port.emit("insert_row", i, rows[i].source, rows[i].name, rows[i].trust, rows[i].last, rows[i].country, rows[i].bits, rows[i].trusted);
    }

    worker.port.on("listCerts", function(id) {
        var certs = authMap[id].certs;

        for (var i = 0; i < certs.length; i++) {
            var cert = certs[i];
            var name = cert.commonName.length > 0 ? cert.commonName : "Certificate for " + cert.issuerOrganization;
            var builtIn = CertManager.isCertBuiltIn(cert) ? "builtIn" : "customCert";
            var sslTrust = CertManager.isSSLTrust(cert) ? "checked" : "";
            var emailTrust = CertManager.isEmailTrust(cert) ? "checked" : "";
            var objTrust = CertManager.isObjTrust(cert) ? "checked" : "";
            worker.port.emit("insert_cert", id, i, name, builtIn, sslTrust, emailTrust, objTrust);
        }
    });

    worker.port.on("editCertTrust", function(auth, certId, ssl, email, objsign) {
        console.log('got to edit cert trust')
        return CertManager.setCertTrusts(authMap[auth].certs[certId], ssl, email, objsign);
    });

	worker.port.on("viewCert", function(auth, certId) {
		CertManager.viewCert(authMap[auth].certs[certId]);
	});
    
    worker.port.on("importCert", CertManager.importCert);

    worker.port.on("exportCert", function(auth, certId) {
        CertManager.exportCert(authMap[auth].certs[certId]);
    });

    worker.port.on("deleteCert", function(auth, certId) {
        CertManager.deleteCert(authMap[auth].certs[certId]);
    });

    worker.port.on("distrustAuth", function(id) {
        authMap[id].trusted = false;
        CertManager.distrustAuth(authMap[id]);
    });

    worker.port.on("entrustAuth", function(id) {
        authMap[id].trusted = true;
        CertManager.entrustAuth(authMap[id]);
    });
}