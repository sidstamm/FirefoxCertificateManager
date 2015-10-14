/*
    js from backend to front end
*/

function insert_cert(){
    self.port.emit("insert_cert");
}

function export_certs(){
    self.port.emit("export_certs");
}


document.getElementById('import').onclick = function(){insert_cert()}; 
exportFunction(insert_cert,unsafeWindow,{defineAs: "insert_cert"});

document.getElementById('export').onclick = function(){export_certs()};
exportFunction(export_certs,unsafeWindow,{defineAs: "export_certs"});


function listCerts(id){
    self.port.emit("listCerts", id);
}

exportFunction(listCerts,unsafeWindow,{defineAs: "listCerts"});

self.port.on("insert_row",function insert_row(num, source, name, trust, last, country, trustbits){
		var parent = '<tr class="parent" id="row$Num"><td>$Source</td> <td id="name$Num" colspan="2">$Name</td> <td>$Trust</td></tr>';
        parent = parent.replace('$Source', source);
        parent = parent.replace('$Name', name);
        parent = parent.replace('$Trust', trust);
        parent = parent.replace(/\$Num/g, num)

        var sub1 = '<tr class="child-row$Num"><td>&nbsp;</td><td>Last Audit: </td><td>$Last</td></tr>';
        sub1 = sub1.replace('$Num', num)
        sub1 = sub1.replace('$Last', last)

        var sub2 = "<tr class='child-row$Num'><td>&nbsp;</td><td>Country: </td><td>$Country</td></tr>"
        sub2 = sub2.replace('$Num', num)
        sub2 = sub2.replace('$Country', country)

        var sub3 = "<tr class='child-row$Num'><td>&nbsp;</td><td>TrustBits: </td><td>$TrustBits</td></tr>"
        sub3 = sub3.replace('$Num', num)
        sub3 = sub3.replace('$TrustBits', trustbits)

        var sub4 = "<tr class='child-row$Num'><td>&nbsp;</td><td>&nbsp;</td><td><button onclick='showDetails($Num);' class='moreButton'>View Certificates</button></td></tr>"
        sub4 = sub4.replace(/\$Num/g, num)

        var table = document.getElementById("auth_table");
        table.innerHTML += parent;
        table.innerHTML += sub1;
        table.innerHTML += sub2;
        table.innerHTML += sub3;
        table.innerHTML += sub4;
        
        $('tr.parent')
        .css("cursor","pointer")
        .attr("title","Click to expand Certificate")
        .click(function(){
            $(this).siblings('.child-'+this.id).toggle();
        });

        $('#row$Num'.replace('$Num', num)).click();
    }
);

// web, email, and software should be either "" or "checked"
self.port.on("insert_cert", function insert_cert(num, name, builtin, web, email, software){
    var parent = '<tr class="parent" id="row$Num"><td>$Name</td> <td>$Builtin</td> <td><input type="checkbox" $Web></input></td> <td><input type="checkbox" $Email></input></td> <td><input type="checkbox" $Software></input></td></tr>';
    parent = parent.replace(/\$Num/g, num);
    parent = parent.replace(/\$Name/g, name);
    parent = parent.replace(/\$Builtin/g, builtin);
    parent = parent.replace(/\$Web/g, web);
    parent = parent.replace(/\$Email/g, email);
    parent = parent.replace(/\$Software/g, software);

    var table = document.getElementById("cert_table");
    table.innerHTML += parent;
});