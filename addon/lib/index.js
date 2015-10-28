/*
  Main file ran first
*/

let {
    Cc, Ci
} = require('chrome');

var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var ss = require("sdk/simple-storage");
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
        worker.port.emit("insert_row", i, rows[i][0], rows[i][1], rows[i][2], rows[i][3], rows[i][4], rows[i][5], rows[i][8]);
    }

    worker.port.on("listCerts", function(id) {
        var certs = authMap[id][6];

        for (var i = 0; i < certs.length; i++) {
            var cert = certs[i];
            var builtIn = CertManager.isCertBuiltIn(cert) ? "builtIn" : "customCert";
            var sslTrust = CertManager.isSSLTrust(cert) ? "checked" : "";
            var emailTrust = CertManager.isEmailTrust(cert) ? "checked" : "";
            var objTrust = CertManager.isObjTrust(cert) ? "checked" : "";
            worker.port.emit("insert_cert", id, i, cert.commonName, builtIn, sslTrust, emailTrust, objTrust);
        }
    });

    worker.port.on("editCertTrust", function(auth, certId, ssl, email, objsign) {
        return CertManager.setCertTrusts(authMap[auth][6][certId], ssl, email, objsign);
    });
	worker.port.on("viewCert", function(auth,certId) {
		CertManager.viewCert(authMap[auth][6][certId]);
	});
    worker.port.on("importCert", CertManager.importCert);

    worker.port.on("export_button", CertManager.exportCerts);

    worker.port.on("deleteCert", CertManager.deleteCert);

    worker.port.on("distrustAuth", function(id) {
        CertManager.distrustAuth(authMap[id]);
    });

    worker.port.on("entrustAuth", function(id) {
        CertManager.entrustAuth(authMap[id]);
    });
}