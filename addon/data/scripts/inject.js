/*
    js from backend to front end
*/

function importCert() {
    self.port.emit("importCert");
}

function export_certs() {
    self.port.emit("export_certs");
}

function deleteCert() {
    self.port.emit("deleteCert");
}

document.getElementById('import').onclick = function() {
    importCert();
};

document.getElementById('delete').onclick = function() {
    deleteCert();
};

exportFunction(importCert, unsafeWindow, {
    defineAs: "importCert"
});

document.getElementById('exportButton').onclick = function() {
    export_certs()
};
exportFunction(export_certs, unsafeWindow, {
    defineAs: "export_certs"
});


function listCerts(id) {
    self.port.emit("listCerts", id);
}

exportFunction(listCerts, unsafeWindow, {
    defineAs: "listCerts"
});

function editCertTrust(auth, cert, ssl, email, objsign) {
    self.port.emit("editCertTrust", auth, cert, ssl, email, objsign);
}

exportFunction(editCertTrust, unsafeWindow, {
    defineAs: "editCertTrust"
});

function distrustAuth(id) {
    self.port.emit("distrustAuth", id);
}
exportFunction(distrustAuth, unsafeWindow, {
    defineAs: "distrustAuth"
});

function entrustAuth(id) {
    self.port.emit("entrustAuth", id);
}
exportFunction(entrustAuth, unsafeWindow, {
    defineAs: "entrustAuth"
});

self.port.on("insert_row", function insert_row(num, source, name, trust, last, country, trustbits, enabled) {
    var parent = '<tr class="parent" id="row$Num"><td>$Source</td> <td id="name$Num" colspan="2">$Name</td> <td>$Trust</td></tr>';
    parent = parent.replace('$Source', source);
    parent = parent.replace('$Name', name);
    parent = parent.replace('$Trust', trust);
    parent = parent.replace(/\$Num/g, num)

    var sub1 = '<tr style="display: none;" class="child-row$Num"><td>&nbsp;</td><td>Last Audit: </td><td>$Last</td></tr>';
    sub1 = sub1.replace('$Num', num)
    sub1 = sub1.replace('$Last', last)

    var sub2 = "<tr style='display: none;' class='child-row$Num'><td>&nbsp;</td><td>Country: </td><td>$Country</td><td>$Button</td></tr>"
    if (enabled) {
        sub2 = sub2.replace(/\$Button/g, "<button id='distrust-$Num' class='moreButton' onclick='distrust($Num);'>Distrust</button>");
    }
    else {
        sub2 = sub2.replace(/\$Button/g, "<button id='entrust-$Num' class='moreButton' onclick='entrust($Num);'>Trust</button>");
    }
    sub2 = sub2.replace(/\$Num/g, num)
    sub2 = sub2.replace('$Country', country)

    var sub3 = "<tr style='display: none;' class='child-row$Num'><td>&nbsp;</td><td>TrustBits: </td><td>$TrustBits</td></tr>"
    sub3 = sub3.replace('$Num', num)
    sub3 = sub3.replace('$TrustBits', trustbits)

    var sub4 = "<tr style='display: none;' class='child-row$Num'><td>&nbsp;</td><td>&nbsp;</td><td><button onclick='showDetails($Num);' class='moreButton'>View Certificates</button></td></tr>"
    sub4 = sub4.replace(/\$Num/g, num)

    var table = document.getElementById("auth_table");
    table.innerHTML += parent;
    table.innerHTML += sub1;
    table.innerHTML += sub2;
    table.innerHTML += sub3;
    table.innerHTML += sub4;

    $('tr.parent')
        .css("cursor", "pointer")
        .attr("title", "Click to expand Certificate")
        .click(function() {
            $(this).siblings('.child-' + this.id).toggle();
        });
});

// web, email, and software should be either "" or "checked"
self.port.on("insert_cert", function insert_cert(id, num, name, builtin, web, email, software) {
    var parent = '<tr class="parent" id="$Id-$Num"><td>$Name</td> <td>$Builtin</td> <td><input type="checkbox" class="$Id-$Num" onclick="updateCertTrust($(this));" $Web></input></td> <td><input type="checkbox" class="$Id-$Num" onclick="updateCertTrust($(this));" $Email></input></td> <td><input type="checkbox" class="$Id-$Num" onclick="updateCertTrust($(this));" $Software></input></td></tr>';
    parent = parent.replace(/\$Id/g, id);
    parent = parent.replace(/\$Num/g, num);
    parent = parent.replace(/\$Name/g, name);
    parent = parent.replace(/\$Builtin/g, builtin);
    parent = parent.replace(/\$Web/g, web);
    parent = parent.replace(/\$Email/g, email);
    parent = parent.replace(/\$Software/g, software);

    var table = document.getElementById("cert_table");
    table.innerHTML += parent;
	document.getElementById('viewButton').onclick = function() {
		self.port.emit("viewCert", id,$("#cert_table tr.selected").index());
	};
	$("#cert_table").find("tr").click( function(){
		//console.log($(this).find('td:first').text());
		$(this).addClass("selected").siblings().removeClass("selected");
	});
});