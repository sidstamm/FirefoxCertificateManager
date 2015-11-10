/*
    js from backend to front end
*/

function importCert() {
    self.port.emit("importCert");
}

function export_certs() {
    self.port.emit("export_certs");
}

document.getElementById('import').onclick = function() {
    importCert();
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
    // Making the parent
    var parent = document.createElement('tr');
    parent.className = 'parent';
    parent.id = 'row'+num;

    var source_node = document.createElement('td');
    var source_text = document.createTextNode(source);
    source_node.appendChild(source_text);

    var trust_node = document.createElement('td');
    var trust_text = document.createTextNode(trust);
    trust_node.appendChild(trust_text);

    var name_node = document.createElement('td');
    name_node.colSpan = '2';
    name_node.id = 'name'+num;
    var name_text = document.createTextNode(name);
    name_node.appendChild(name_text);

    parent.appendChild(source_node);
    parent.appendChild(name_node);
    parent.appendChild(trust_node);

    // var parent = '<tr class="parent" id="row$Num"><td>$Source</td> <td id="name$Num" colspan="2">$Name</td> <td>$Trust</td></tr>';

    // parent = parent.replace('$Source', source);
    // parent = parent.replace('$Name', name);
    // parent = parent.replace('$Trust', trust);
    // parent = parent.replace(/\$Num/g, num)

    var sub1 = document.createElement('tr');
    sub1.style = 'display:none';
    sub1.className = 'child-row'+num;

    var first_node = document.createElement('td');
    var first_text = document.createTextNode('\t');
    first_node.appendChild(first_text);

    var middle_node = document.createElement('td');
    var middle_text = document.createTextNode('Last Audit: ');
    middle_node.appendChild(middle_text);

    var last_node = document.createElement('td');
    var last_text = document.createTextNode(last);
    last_node.appendChild(last_text);

    sub1.appendChild(first_node);
    sub1.appendChild(middle_node);
    sub1.appendChild(last_node);

    var sub2 = document.createElement('tr');
    sub2.style = 'display:none';
    sub2.className = 'child-row'+num;

    var first_node = document.createElement('td');
    var first_text = document.createTextNode('\t');
    first_node.appendChild(first_text);

    var middle_node = document.createElement('td');
    var middle_text = document.createTextNode('Country: ');
    middle_node.appendChild(middle_text);

    var last_node = document.createElement('td');
    var last_text = document.createTextNode(country);
    last_node.appendChild(last_text);

    sub2_button = document.createElement('button'); 
    if (enabled) {
        sub2_button.id = 'distrust-'+num;
        var button_text = document.createTextNode('Distrust');
        sub2_button.onclick = function(){
            distrust(num);
        }
    }
    else {
        sub2_button.id = 'entrust-'+num;
        var button_text = document.createTextNode('Trust');
        sub2_button.onclick = function(){
            entrust(num);
        }
    }
    sub2_button.appendChild(button_text);

    sub2.appendChild(first_node);
    sub2.appendChild(middle_node);
    sub2.appendChild(last_node);
    sub2.appendChild(sub2_button);

    var sub3 = document.createElement('tr');
    sub3.style = 'display:none';
    sub3.className = 'child-row'+num;

    var first_node = document.createElement('td');
    var first_text = document.createTextNode('\t');
    first_node.appendChild(first_text);

    var middle_node = document.createElement('td');
    var middle_text = document.createTextNode('TrustBits: ');
    middle_node.appendChild(middle_text);

    var last_node = document.createElement('td');
    var last_text = document.createTextNode(trustbits);
    last_node.appendChild(last_text);

    sub3.appendChild(first_node);
    sub3.appendChild(middle_node);
    sub3.appendChild(last_node);

    var sub4 = document.createElement('tr');
    sub4.style = 'display:none';
    sub4.className = 'child-row'+num;

    var first_node = document.createElement('td');
    var first_text = document.createTextNode('\t');
    first_node.appendChild(first_text);

    var middle_node = document.createElement('td');
    var middle_text = document.createTextNode('\t');
    middle_node.appendChild(middle_text);

    var last_node = document.createElement('td');
    
    sub4_button = document.createElement('button');

    sub4_button.className = 'moreButton';
    var button_text = document.createTextNode('View Certificates');
    sub4_button.appendChild(button_text);
    sub4_button.onclick = function(){
        showDetails(num);
    }
    last_node.appendChild(sub4_button);

    sub4.appendChild(first_node);
    sub4.appendChild(middle_node);
    sub4.appendChild(last_node);


    var table = document.getElementById("auth_table");
    table.appendChild(parent);
    table.appendChild(sub1);
    table.appendChild(sub2);
    table.appendChild(sub3);
    table.appendChild(sub4);
    parent.onclick = function(){
        $(this).siblings('.child-' + this.id).toggle();
    }
});

function distrust(num) {
    // authMap[id].trusted = false;
    // CertManager.distrustAuth(authMap[id]);
    self.port.emit("distrustAuth", num);
    $("#distrust-"+num).attr('onclick', '').unbind().click(function() { entrust(num); })
    $("#distrust-"+num).text("Trust");
    $("#distrust-"+num).attr('id', 'entrust-'+num);
}

function entrust(num) {    
    // authMap[id].trusted = true;
    // CertManager.entrustAuth(authMap[id]);
    self.port.emit("entrustAuth", num);
    $("#entrust-"+num).attr('onclick', '').unbind().click(function() { distrust(num); })
    $("#entrust-"+num).text("Distrust");
    $("#entrust-"+num).attr('id', 'distrust-'+num);
}

function showDetails(num) {
    var table = document.getElementById("cert_table");
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }
    window.listCerts(num);
    $("#main_table").toggle();
    $("#detail_table").toggle();
    $("#certsSearch").toggle();
    $("#authsSearch").toggle();
    $("#authName").html('<a href="#" onclick="showAuths()">&lt; Back</a> ' + $("#name" + num).text());
    $("#viewButton").show();
    $("#exportButton").show();
    $("#authName").show();
}

function updateCertTrust(check) {
     //TODO: FIX ME
    console.log(check);
    var classId = check.attr('class');
    console.log(classId);
    var allChecks = $("."+classId);
    editCertTrust(classId.split('-')[0], classId.split('-')[1], allChecks[0].checked, allChecks[1].checked, allChecks[2].checked);
}

// web, email, and software should be either "" or "checked"
self.port.on("insert_cert", function insert_cert(id, num, name, builtin, web, email, software) {
    var parent = document.createElement('tr');
    parent.className = 'parent'
    parent.id = id + '-' + num;

    var name_node = document.createElement('td');
    var text = document.createTextNode(name);
    name_node.appendChild(text);

    var builtin_node = document.createElement('td');
    var text = document.createTextNode(builtin);
    builtin_node.appendChild(text);

    var web_node = document.createElement('td');
    input = document.createElement('input');
    input.className = id + '-' + num;
    input.type = 'checkbox';
    input.checked = false;
    if(web=='checked'){
        input.checked = true;
    }
    web_node.onclick = function(){
        //TODO: FIX ME
        console.log("click");
        updateCertTrust('web');
    }
    web_node.checked = web_node;
    web_node.appendChild(input);

    var email_node = document.createElement('td');
    input = document.createElement('input');
    input.className = id + '-' + num;
    input.type = 'checkbox';
    input.checked = false;
    if(web=='checked'){
        input.checked = true;
    }
    email_node.onclick = function(){
         //TODO: FIX ME
        updateCertTrust(email_node);
    }
    email_node.checked = email_node;
    email_node.appendChild(input);

    var software_node = document.createElement('td');
    input = document.createElement('input');
    input.className = id + '-' + num;
    input.type = 'checkbox';
    input.checked = false;
    if(web=='checked'){
        input.checked = true;
    }
    software_node.onclick = function(){
         //TODO: FIX ME
        updateCertTrust(software_node);
    }
    software_node.checked = software_node;
    software_node.appendChild(input);

    parent.appendChild(name_node);
    parent.appendChild(builtin_node);
    parent.appendChild(web_node);
    parent.appendChild(email_node);
    parent.appendChild(software_node);

    var table = document.getElementById("cert_table");
    table.appendChild(parent);

	document.getElementById('viewButton').onclick = function() {
		self.port.emit("viewCert", id,$("#cert_table tr.selected").index());
	};

    document.getElementById('delete').onclick = function() {
        self.port.emit("deleteCert", id,$("#cert_table tr.selected").index());
        $("#cert_table tr.selected").remove();
    };

    document.getElementById('exportButton').onclick = function() {
        self.port.emit("exportCert", id,$("#cert_table tr.selected").index());
    };

	$("#cert_table").find("tr").click( function(){
		$(this).addClass("selected").siblings().removeClass("selected");
	});
	
	$("#cert_table").find("tr").dblclick( function(){
		self.port.emit("viewCert", id,$("#cert_table tr.selected").index());
	});
});