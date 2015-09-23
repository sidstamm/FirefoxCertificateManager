
self.port.on("insert_row",function insert_row(num, source, name, trust, last, country, trustbits){
		console.log("ASDSDASDSAD");
		
        console.log(num);
		console.log(source);
		console.log(name);
		console.log(trust);
		console.log(last);
		var parent = '<tr class="parent" id="row$Num"><td>$Source</td> <td colspan="2">$Name</td> <td>$Trust</td></tr>';
        parent = parent.replace('$Source', source);
        parent = parent.replace('$Name', name);
        parent = parent.replace('$Trust', trust);
        parent = parent.replace('$Num', num);

        var sub1 = '<tr class="child-row$Num"><td>&nbsp;</td><td>Last Audit: </td><td>$Last</td></tr>';

        sub1 = sub1.replace('$Num', num)
        sub1 = sub1.replace('$Last', last)

        var sub2 = "<tr class='child-row$Num'><td>&nbsp;</td><td>Country: </td><td>$Country</td></tr>"
        sub2 = sub2.replace('$Num', num)
        sub2 = sub2.replace('$Country', country)
        var sub3 = "<tr class='child-row$Num'><td>&nbsp;</td><td>TrustBits: </td><td>$TrustBits</td></tr>"
        sub3 = sub3.replace('$Num', num)
        sub3 = sub3.replace('$TrustBits', trustbits)

        var table = document.getElementById("cert_table");
        table.innerHTML += parent;
        table.innerHTML += sub1;
        table.innerHTML += sub2;
        table.innerHTML += sub3;
        

        $('tr.parent')
        .css("cursor","pointer")
        .attr("title","Click to expand Certificate")
        .click(function(){
            $(this).siblings('.child-'+this.id).toggle();
        });
    }
);

// //Need to get cert data here somehow
// var certs = ['Wells Fargo WellsSecure', 'Certificate Issuer Organization', 'Hellenic Academic and Research Institutions Cert. Authority'];
    // for(var i = 0; i<certs.length; i++){
        // insert_row(i, 'Firefox', certs[i], 100, certManagerJson[certs[i]]['auditDate'], 'USA', certManagerJson[certs[i]]['trustBits']);
    // }