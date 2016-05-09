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
exports.main = function(options,callback){
	CertManager.main(options,callback);
};
exports.onUnload = function(reason){
	CertManager.onUnload(reason);
};

/*
    First thing that is run
    Ran when the extension page is loaded sets up everything else on the page
*/
function onReady(tab) {
    var worker = tab.attach({
        contentScriptFile: [self.data.url("../node_modules/jquery/dist/jquery.min.js"), self.data.url("./scripts/inject.js")]
    });

    authMap = CertManager.genCAData();
    var rows = authMap;
    for (var i = 0; i < rows.length; i++) {
        worker.port.emit("insert_row", i, rows[i].source,
            rows[i].name, rows[i].trust, rows[i].last,
            rows[i].country, rows[i].bits, rows[i].trusted,
            rows[i].countryCode, rows[i].owner);
    }

    worker.port.on("listCerts", function(id) {
        var certs = authMap[id].certs;

        for (var i = 0; i < certs.length; i++) {
            var cert = certs[i];
            // if no common name, then display the friendly name
            var name = cert.commonName.length > 0 ? cert.commonName : (cert.nickname.indexOf(":") > 0 ? cert.nickname.split(":")[1] : cert.nickname);
            var builtIn = CertManager.isCertBuiltIn(cert) ? "builtIn" : "customCert";
            var sslTrust = CertManager.isSSLTrust(cert) ? "checked" : "";
            var emailTrust = CertManager.isEmailTrust(cert) ? "checked" : "";
            var objTrust = CertManager.isObjTrust(cert) ? "checked" : "";
            worker.port.emit("insert_cert", id, i, name, builtIn, sslTrust, emailTrust, objTrust);
        }
    });

    worker.port.on("listAllCerts", function() {
        var certs = [];
        var authIds = [];
        var certIndexes = [];

        // put all of the certificates in an array while also tracking its authority's index
        // and its relative index within the authority list of certificates
        for (var i = 0; i < authMap.length; i++) {
            var authority = authMap[i];
            var authCerts = authority.certs;
            for (var j = 0; j < authCerts.length; j++) {
                var cert = authCerts[j];
                authIds.push(i);
                certIndexes.push(j);
                certs.push(cert);
            }
        }

        // alphabetically sort the array
        for (var i = 0; i < certs.length; i++) {
            for (var j = 0; j < certs.length; j++) {
                var cert1 = certs[i];
                var cert2 = certs[j];
                var name1 = cert1.commonName.length > 0 ? cert1.commonName : (cert1.nickname.indexOf(":") > 0 ? cert1.nickname.split(":")[1] : cert1.nickname);
                var name2 = cert2.commonName.length > 0 ? cert2.commonName : (cert2.nickname.indexOf(":") > 0 ? cert2.nickname.split(":")[1] : cert2.nickname);
                if (name1.toLowerCase() >= name2.toLowerCase()) {
                    continue;
                }
                certs[j] = cert1;
                certs[i] = cert2;
                // rearrange the corresponding elements in the index tracking arrays so the data stays consistent
                var temp = authIds[j];
                authIds[j] = authIds[i];
                authIds[i] = temp;
                temp = certIndexes[j];
                certIndexes[j] = certIndexes[i];
                certIndexes[i] = temp;
            }
        }

        for (var i = 0; i < certs.length; i++) {
            var cert = certs[i];
            // if no common name, then display the friendly name
            var name = cert.commonName.length > 0 ? cert.commonName : cert.nickname.split(":")[1];
            var builtIn = CertManager.isCertBuiltIn(cert) ? "builtIn" : "customCert";
            var sslTrust = CertManager.isSSLTrust(cert) ? "checked" : "";
            var emailTrust = CertManager.isEmailTrust(cert) ? "checked" : "";
            var objTrust = CertManager.isObjTrust(cert) ? "checked" : "";
            worker.port.emit("insert_cert", authIds[i], certIndexes[i], name, builtIn, sslTrust, emailTrust, objTrust);
        // });
        }
    });

    worker.port.on("editCertTrust", function(auth, certId, ssl, email, objsign) {
        return CertManager.setCertTrusts(authMap[auth].certs[certId], ssl, email, objsign);
    });

	worker.port.on("viewCert", function(auth, certId) {
		CertManager.viewCert(authMap[auth].certs[certId]);
	});

    worker.port.on("importCert", function(){
		var reload = CertManager.importCert();
		if(reload){
			var newAuthMap = CertManager.genCAData();
			var newRows = newAuthMap;
			var changedIndex = -1;
			if(newRows.length != rows.length){
				worker.port.emit("resetAuthTable");
				for (var i = 0; i < newRows.length; i++) {
					worker.port.emit("insert_row", i, newRows[i].source,
						newRows[i].name, newRows[i].trust, newRows[i].last,
						newRows[i].country, newRows[i].bits, newRows[i].trusted,
						newRows[i].countryCode, newRows[i].owner);
					if(changedIndex < 0 && i < rows.length){
						if(rows[i].name != newRows[i].name){changedIndex = i;}
					}else if (changedIndex < 0 && i >=rows.length){
						changedIndex = i;
					}
				}
			}else{
				for(var i = 0 ; i < rows.length ; i++){
					if(changedIndex < 0 && rows[i].certs.length != newRows[i].certs.length){
						changedIndex = i;
					}
				}
			}
			//highlight changed index
			authMap = newAuthMap;
			rows = newRows;
            // update according to which view is active
            worker.port.emit("checkView", changedIndex);
		}

	});

    worker.port.on("refreshDetailTable", function() {
        worker.port.emit("resetCertTable");
    });

    // update auth table and expand the newly imported cert authority's row
    worker.port.on("refreshMainTable", function(changedIndex) {
        worker.port.emit("update_certs", changedIndex);
        worker.port.emit("select_auth", changedIndex);
    });

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
	worker.port.emit("reload_page", "page");
}
