/**
 * This is the file that will be creating the list view.
 */
/* global $, odkTables */
'use strict';

// if (JSON.parse(odkCommon.getPlatformInfo()).container === 'Chrome') {
//     console.log('Welcome to Tables debugging in Chrome!');
//     $.ajax({
//         url: odkCommon.getFileAsUrl('output/debug/health_facility_data.json'),
//         async: false,  // do it first
//         success: function(dataObj) {
//             window.data.setBackingObject(dataObj);
//         }
//     });
// }
 
// This will map types of refrigerators.
var typeNameMap = {};  
var idxStart = -1;  
var healthFacilityResultSet = {};        

// This will manage pagination
var limit = 10;
var offset = 0;
/** 
 * Use chunked list view for larger tables: We want to chunk the displays so
 * that there is less load time.
 */

var prevResults = function() {
  offset -= limit;
  if (offset < 0) {
    offset = 0;
  }

  clearRows();
  resumeFn(0);
}

var nextResults = function() {
  offset += limit;

  clearRows();
  resumeFn(0);
}

/**
 * Called when page loads to display things (Nothing to edit here)
 */
var refrigeratorTypeCBSuccess = function(result) {
    var typeData = result;

    for (var typeCntr = 0; typeCntr < typeData.getCount(); typeCntr++) {
        typeNameMap[typeData.getRowId(typeCntr)] =
            typeData.getData(typeCntr, 'Name');
    }

    return (function() {
        displayGroup(idxStart);
    }());
};

var refrigeratorTypeCBFailure = function(error) {

    console.log('health_facility_list refrigeratorTypeCBFailure: ' + error);
};

var cbSuccess = function(result) {

    healthFacilityResultSet = result;

    if (idxStart === 0) {
        odkData.query('refrigerator_types', null, null, 
            null, null, null, null, limit, offset, true, refrigeratorTypeCBSuccess, refrigeratorTypeCBFailure);
    }
};

var cbFailure = function(error) {

    console.log('health_facility_list getViewData CB error : ' + error);
};

var cbSearchSuccess = function(searchData) {
    console.log('cbSearchSuccess data is' + searchData);
    if(searchData.getCount() > 0) {
        // open filtered list view if facility found
        var rowId = searchData.getRowId(0);
        odkTables.openTableToListView(
                'health_facility',
                '_id = ?',
                [rowId],
                'config/tables/health_facility/html/health_facility_list.html');
    } else {
        document.getElementById("search").value = "";
        document.getElementsByName("query")[0].placeholder="Facility not found";
    }
}

var cbSearchFailure = function(error) {
    console.log('health_facility_list cbSearchFailure: ' + error);
}

var getSearchResults = function() {
    var searchText = document.getElementById('search').value;

    odkData.query('health_facility', 'facility_id = ?', [searchText], 
        null, null, null, null, null, null, true, cbSearchSuccess, cbSearchFailure);
}

var resumeFn = function(fIdxStart) {

    odkData.getViewData(cbSuccess, cbFailure, limit, offset);

    idxStart = fIdxStart;
    console.log('resumeFn called. idxStart: ' + idxStart);
    // The first time through we're going to make a map of typeId to
    // typeName so that we can display the name of each shop's specialty.
    if (idxStart === 0) {

        // We're also going to add a click listener on the wrapper ul that will
        // handle all of the clicks on its children.
        $('#list').click(function(e) {
            var tableId = healthFacilityResultSet.getTableId();
            // We set the rowId while as the li id. However, we may have
            // clicked on the li or anything in the li. Thus we need to get
            // the original li, which we'll do with jQuery's closest()
            // method. First, however, we need to wrap up the target
            // element in a jquery object.
            // wrap up the object so we can call closest()
            var jqueryObject = $(e.target);
            // we want the closest thing with class item_space, which we
            // have set up to have the row id
            var containingDiv = jqueryObject.closest('.item_space');
            var rowId = containingDiv.attr('rowId');
            console.log('clicked with rowId: ' + rowId);
            // make sure we retrieved the rowId
            if (rowId !== null && rowId !== undefined) {
                // we'll pass null as the relative path to use the default file
                odkTables.openDetailView(tableId, rowId, null);
            }
        });
    }
};
            
/**
 * Displays the list view in chunks or groups. Number of list entries per chunk
 * can be modified. The list view is designed so that each row in the table is
 * represented as a list item. If you touch a particular list item, it will
 * expand with more details (that you choose to include). Clicking on this
 * expanded portion will take you to the more detailed view.
*/
var displayGroup = function(idxStart) {
    // Ensure that this is the first displayed in the list
    var mapIndex = healthFacilityResultSet.getMapIndex();
    
    // Make sure that it is valid
    if (mapIndex !== null && mapIndex !== undefined) {
        // Make sure that it is not invalid 
        if (mapIndex !== -1) {
            // Make this the first item in the list
            addDataForRow(mapIndex);
        }
    }

    console.log('displayGroup called. idxStart: ' + idxStart);
    /* Number of rows displayed per 'chunk' - can modify this value */
    var chunk = 50;
    for (var i = idxStart; i < idxStart + chunk; i++) {
        console.log('Health Facility Result Count: ' + healthFacilityResultSet.getCount());
        if (i >= healthFacilityResultSet.getCount()) {
            break;
        }

        // Make sure not to repeat the selected item if one existed
        if (i === mapIndex) {
            continue;
        }

        addDataForRow(i);
        console.log('Added data for row ' + i);
    }
    if (i < healthFacilityResultSet.getCount()) {
        setTimeout(resumeFn, 0, i);
    }
};

function addDataForRow(rowNumber) {
    /*    Creating the item space    */
    /* Creates the item space */
    // We're going to select the ul and then start adding things to it.
    //var item = $('#list').append('<li>');
    var item = $('<li>');
    item.attr('id', healthFacilityResultSet.getRowId(rowNumber));
    item.attr('rowId', healthFacilityResultSet.getRowId(rowNumber));
    item.attr('class', 'item_space');
    item.text(healthFacilityResultSet.getData(rowNumber, 'facility_name'));
            
    /* Creates arrow icon (Nothing to edit here) */
    var chevron = $('<img>');
    chevron.attr('src', odkCommon.getFileAsUrl('config/assets/img/white_arrow.png'));
    chevron.attr('class', 'chevron');
    item.append(chevron);

    var field1 = $('<li>');
    field1.attr('class', 'detail');
    field1.text('Facility ID: ' + healthFacilityResultSet.getData(rowNumber, 'facility_id'));
    item.append(field1);

    $('#list').append(item);

    // don't append the last one to avoid the fencepost problem
    var borderDiv = $('<div>');
    borderDiv.addClass('divider');
    $('#list').append(borderDiv);
}

function clearRows() {
  $('#list').empty();
}
