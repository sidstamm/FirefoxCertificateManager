/*
	Any misc client side only javascript
*/

function showDetails(num) {
    var table = document.getElementById("cert_table");
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }

    window.listCerts(num);

    $("#main_table").toggle();
    $("#detail_table").toggle();
    $("#authName").html('<a href="#" onclick="showAuths()">&lt; Back</a> ' + $("#name" + num).text());
    $("#authName").show();
}

function showAuths() {
    $("#detail_table").toggle();
    $("#main_table").toggle();
    $("#authName").hide();
}