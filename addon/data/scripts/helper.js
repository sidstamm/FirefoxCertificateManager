/*
	Any misc client side only javascript
*/

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
    $("#footer").attr("id", "footer_plain");
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
            if(found === true)
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
            if(found === true)
                $(row).show();
            else
            {
                $(row).hide();
                $(row).siblings('.child-' + $(row).attr('id')).hide();
            }
        }
    });
}