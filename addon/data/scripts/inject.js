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
    export_certs();
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

	var source_image = document.createElement('img');
	source_image.setAttribute('src',(source == "customCert") ? './img/custom-512.png':'./img/firefox-512.png');
	source_image.setAttribute('width','16');
	source_image.setAttribute('height','16');
	source_image.setAttribute('title',source);
    source_node.appendChild(source_image);

    var trust_node = document.createElement('td');
	var trust_bar = document.createElement('progress');
	trust_bar.setAttribute('value',trust);
	trust_bar.setAttribute('title',trust);
	trust_bar.setAttribute('max','100');
	
	if( trust > 80) trust_bar.className = trust_bar.className + " green-trustbar";
	else if(trust > 50) trust_bar.className = trust_bar.className + " yellow-trustbar";
	else if(trust > 20) trust_bar.className = trust_bar.className + " orange-trustbar";
	else trust_bar.className = trust_bar.className + " red-trustbar";
	
	
    trust_node.appendChild(trust_bar);

    var name_node = document.createElement('td');
    name_node.colSpan = '2';
    name_node.id = 'name'+num;
    var name_text = document.createTextNode(name);
    name_node.appendChild(name_text);

    parent.appendChild(source_node);
    parent.appendChild(name_node);
    parent.appendChild(trust_node);

    var sub1 = document.createElement('tr');
    sub1.style = 'display:none';
    sub1.className = 'detail_row child-row'+num;

    var first_node = document.createElement('td');
    var first_text = document.createTextNode('\t');
    first_node.appendChild(first_text);

    var middle_node = document.createElement('td');
    middle_node.setAttribute('width', '10%');
    var middle_text = document.createTextNode('Last Audit: ');
    middle_node.appendChild(middle_text);

    var last_node = document.createElement('td');
    last_node.setAttribute('width', '90%');
    var last_text = document.createTextNode(last);
    last_node.appendChild(last_text);

    sub1.appendChild(first_node);
    sub1.appendChild(middle_node);
    sub1.appendChild(last_node);

    var sub2 = document.createElement('tr');
    sub2.style = 'display:none';
    sub2.className = 'detail_row child-row'+num;

    var first_node = document.createElement('td');
    var first_text = document.createTextNode('\t');
    first_node.appendChild(first_text);

    var middle_node = document.createElement('td');
    middle_node.setAttribute('width', '10%');
    var middle_text = document.createTextNode('Country: ');
    middle_node.appendChild(middle_text);

    var last_node = document.createElement('td');
    last_node.setAttribute('width', '90%');
    var last_text = document.createTextNode(country);
    last_node.appendChild(last_text);

    sub2_button = document.createElement('button'); 
    if (enabled) {
        sub2_button.id = 'distrust-'+num;
        sub2_button.className = 'red ui button';
        var button_text = document.createTextNode('Distrust');
        sub2_button.onclick = function(){
            distrust(num);
        };
    }
    else {
        sub2_button.id = 'entrust-'+num;
        var button_text = document.createTextNode('Trust');
        sub2_button.onclick = function(){
            entrust(num);
        };
    }
    sub2_button.appendChild(button_text);

    sub2.appendChild(first_node);
    sub2.appendChild(middle_node);
    sub2.appendChild(last_node);
    // sub2.appendChild(sub2_button);

    var sub3 = document.createElement('tr');
    sub3.style = 'display:none';
    sub3.className = 'detail_row child-row'+num;

    var first_node = document.createElement('td');
    var first_text = document.createTextNode('\t');
    first_node.appendChild(first_text);

    var middle_node = document.createElement('td');
    middle_node.setAttribute('width', '10%');
    var middle_text = document.createTextNode('TrustBits: ');
    middle_node.appendChild(middle_text);

    var last_node = document.createElement('td');
    last_node.setAttribute('width', '90%');
    var last_text = document.createTextNode(trustbits);
    last_node.appendChild(last_text);

    sub3.appendChild(first_node);
    sub3.appendChild(middle_node);
    sub3.appendChild(last_node);

    var sub4 = document.createElement('tr');
    sub4.style = 'display:none';
    sub4.className = 'detail_row child-row'+num;

    var first_node = document.createElement('td');
    var first_text = document.createTextNode('\t');
    first_node.appendChild(first_text);

    var middle_node = document.createElement('td');
    var middle_text = document.createTextNode('\t');
    middle_node.appendChild(middle_text);

    var last_node = document.createElement('td');
    last_node.setAttribute('text-align', 'right');
    
    sub4_button = document.createElement('button');

    sub4_button.className = 'moreButton blue ui button';
    var button_text = document.createTextNode('View Certificates');
    sub4_button.appendChild(button_text);
    sub4_button.onclick = function(){
        showDetails(num);
    };
    last_node.appendChild(sub4_button);

    var distrust_button_node = document.createElement('td');
    distrust_button_node.setAttribute('text-align', 'left');
    distrust_button_node.appendChild(sub2_button);

    sub4.appendChild(first_node);
    sub4.appendChild(middle_node);
    sub4.appendChild(last_node);
    sub4.appendChild(distrust_button_node);

    var table = document.getElementById("auth_table");
    table.appendChild(parent);
    table.appendChild(sub1);
    table.appendChild(sub2);
    table.appendChild(sub3);
    table.appendChild(sub4);
    parent.onclick = function(){
        $(this).siblings('.child-' + this.id).toggle();
    };
});

function distrust(num) {
    // authMap[id].trusted = false;
    // CertManager.distrustAuth(authMap[id]);
    self.port.emit("distrustAuth", num);
    $("#distrust-"+num).attr('onclick', '').unbind().click(function() { entrust(num); });
    $("#distrust-"+num).text("Trust");
    $("#distrust-"+num).attr('id', 'entrust-'+num);
}

function entrust(num) {    
    // authMap[id].trusted = true;
    // CertManager.entrustAuth(authMap[id]);
    self.port.emit("entrustAuth", num);
    $("#entrust-"+num).attr('onclick', '').unbind().click(function() { distrust(num); });
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
    $("#authName").html($("#name" + num).text());
    $("#back_button").html('<i class="fa fa-chevron-left fa-2x"></i>');
    $("#viewButton").show();
    $("#exportButton").show();
    $("#authName").show();
    $("#back_button").show();
    $("#delete").show();
    $("#editTrustButton").show();
    $("#footer_plain").attr("id", "footer");
}

function updateCertTrust(classId) {
    var allChecks = $("."+classId);
    editCertTrust(classId.split('-')[0], classId.split('-')[1], allChecks[0].checked, allChecks[1].checked, allChecks[2].checked);
}

// web, email, and software should be either "" or "checked"
self.port.on("insert_cert", function insert_cert(id, num, name, builtin, web, email, software) {
    var parent = document.createElement('tr');
    parent.className = 'parent';
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
        updateCertTrust(id + '-' + num);
    };
    web_node.checked = web_node;
    web_node.appendChild(input);

    var email_node = document.createElement('td');
    input = document.createElement('input');
    input.className = id + '-' + num;
    input.type = 'checkbox';
    input.checked = false;
    if(email=='checked'){
        input.checked = true;
    }
    email_node.onclick = function(){
        updateCertTrust(id + '-' + num);
    };
    email_node.checked = email_node;
    email_node.appendChild(input);

    var software_node = document.createElement('td');
    input = document.createElement('input');
    input.className = id + '-' + num;
    input.type = 'checkbox';
    input.checked = false;
    if(software=='checked'){
        input.checked = true;
    }
    software_node.onclick = function(){
        updateCertTrust(id + '-' + num);
    };
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