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
    $("#certsSearch").toggle();
    $("#authsSearch").toggle();
    $("#authName").html('<a href="#" onclick="showAuths()">&lt; Back</a> ' + $("#name" + num).text());
	$("#viewButton").show();
	$("#exportButton").show();
    $("#authName").show();
    $("#delete").show();
}

function distrust(num) {
    window.distrustAuth(num);

    $("#distrust-"+num).attr('onclick', '').unbind().click(function() { entrust(num); })
    $("#distrust-"+num).text("Trust");
    $("#distrust-"+num).attr('id', 'entrust-'+num);
}

function entrust(num) {    
    window.entrustAuth(num);

    $("#entrust-"+num).attr('onclick', '').unbind().click(function() { distrust(num); })
    $("#entrust-"+num).text("Distrust");
    $("#entrust-"+num).attr('id', 'distrust-'+num);
}

function showAuths() {
    $("#detail_table").toggle();
    $("#certsSearch").toggle();
    $("#authsSearch").toggle();
    $("#main_table").toggle();
	$("#viewButton").hide();
	$("#exportButton").hide();
    $("#authName").hide();
    $("#back_button").hide();
    $("#delete").hide();
    $("#editTrustButton").hide();
}

function updateCertTrust(check) {
    var classId = check.attr('class');
    var allChecks = $("."+classId);
    window.editCertTrust(classId.split('-')[0], classId.split('-')[1], allChecks[0].checked, allChecks[1].checked, allChecks[2].checked);
}

function searchMainTable(inputVal)
{
    $('#main_table > tbody > .parent').each(function(index, row)
    {
        var allCells = $(row).find('td:nth-child(2)');
        var countryCell = $($($(row).siblings('.child-' + $(row).attr('id'))[1]).children()[2]);
        allCells.push(countryCell);
        if(allCells.length > 0)
        {
            var found = false;
            allCells.each(function(index, td)
            {
                var regExp = new RegExp(inputVal, 'i');
                if(regExp.test($(td).text()))
                {
                    found = true;
                    return;
                }
            });
            if(found == true)
                $(row).show();
            else
            {
                $(row).hide();
                $(row).siblings('.child-' + $(row).attr('id')).hide();
            }
        }
    });
}

function searchDetailTable(inputVal)
{
    $('#detail_table > tbody > .parent').each(function(index, row)
    {
        var allCells = $(row).find('td:nth-child(1)');
        if(allCells.length > 0)
        {
            var found = false;
            allCells.each(function(index, td)
            {
                var regExp = new RegExp(inputVal, 'i');
                if(regExp.test($(td).text()))
                {
                    found = true;
                    return false;
                }
            });
            if(found == true)
                $(row).show();
            else
            {
                $(row).hide();
                $(row).siblings('.child-' + $(row).attr('id')).hide();
            }
        }
    });
}