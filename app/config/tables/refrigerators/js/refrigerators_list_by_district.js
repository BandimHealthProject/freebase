/**
 * This is the file that will create the list view for the table.
 */
/* global $, odkCommon, odkData, odkTables, util */
'use strict';

var tableId = 'refrigerators';
var limitKey = tableId + ':limit';
var offsetKey = tableId + ':offset';
var rowCountKey = tableId + ':rowCount';
var queryKey = tableId + ':query';
var searchKey = tableId + ':search';
var queryStmt = 'stmt';
var queryArgs = 'args';

var listQuery = 'SELECT * FROM refrigerators ' + 
    'JOIN health_facility ON refrigerators.facility_row_id = health_facility._id ' +
    'JOIN refrigerator_types ON refrigerators.model_row_id = refrigerator_types._id';

var searchParams = '(facility_name LIKE ? OR facility_id LIKE ? OR tracking_id LIKE ? OR refrigerator_id LIKE ?)';

function makeCntQuery(queryToWrap) {
    if (queryToWrap !== null && queryToWrap !== undefined &&
        queryToWrap.length > 0) {
        return 'SELECT COUNT(*) AS cnt FROM (' + queryToWrap + ')';
    } else  {
        return null;
    }
}

function makeSearchQuery(searchQueryToWrap) {
    if (searchQueryToWrap !== null && searchQueryToWrap !== undefined &&
        searchQueryToWrap.length > 0) {
        if (searchQueryToWrap.indexOf('WHERE') >= 0) {
            return searchQueryToWrap + ' AND ' + searchParams;
        } else {
            return searchQueryToWrap + ' WHERE ' + searchParams;
        }
    } else {
        return null;
    }
}

function processPromises(cntResultSet, resultSet) {
    // Get session variables
    var rowCount = parseInt(odkCommon.getSessionVariable(rowCountKey));
    var offset = parseInt(odkCommon.getSessionVariable(offsetKey));    
    var limit = parseInt(odkCommon.getSessionVariable(limitKey));

    // Set the text for the number of rows
    if (cntResultSet.getCount() > 0) {
        rowCount = cntResultSet.getData(0, 'cnt');
    } else {
        rowCount = 0;
    }

    odkCommon.setSessionVariable(rowCountKey, rowCount);

    if (rowCount === 0) {
        offset = 0;
        odkCommon.setSessionVariable(offsetKey, offset);
    }

    

    // Display the results in the list
    updateNavButtons(rowCount, limit, offset);
    updateNavText(rowCount, limit, offset);
    clearRows();

    if (resultSet.getCount() === 0) {
        console.log('No ' + util.formatDisplayText(tableId));
        var note = $('<li>');
        note.attr('class', 'note');
        note.text('No ' + util.formatDisplayText(tableId));
        $('#list').append(note);

    } else {
        displayGroup(resultSet);
    }
}

function resumeFn(fIdxStart) {

    console.log('resumeFn called. fIdxStart: ' + fIdxStart);

    // Check if we came back from a rotation
    // Use the existing session variable values if 
    // they are supplied otherwise use defaults
    var searchText = odkCommon.getSessionVariable(searchKey);
    if (searchText !== null && searchText !== undefined && searchText.length !== 0) {
        $('#search').val(searchText);
    } 

    var rowCount = odkCommon.getSessionVariable(rowCountKey);
    if (rowCount === null || rowCount === undefined) {
        rowCount = 0;
        odkCommon.setSessionVariable(rowCountKey, rowCount);
    } else {
        rowCount = parseInt(rowCount); 
    }

    var offset = odkCommon.getSessionVariable(offsetKey);
    if (offset === null || offset === undefined) {
        offset = 0;
        odkCommon.setSessionVariable(offsetKey, offset);
    } else {
        offset = parseInt(offset);
    }
    
    var limit = odkCommon.getSessionVariable(limitKey);
    if (limit === null || limit === undefined) {
        limit = parseInt($('#limitDropdown option:selected').text());
        odkCommon.setSessionVariable(limitKey, limit);
    } else {
        $('#limitDropdown').val(limit);
        limit = parseInt(limit);
    }

    var queryParamArg = util.getQueryParameter(util.leafRegion);

    if (fIdxStart === 'init') {
        // Append passed in url parameters to base list query if
        // there are any
        if (queryParamArg === null) {
            $('#header').text(util.formatDisplayText(tableId));
            console.log('No valid query param passed in');
        } else {
            $('#header').text(queryParamArg);
            listQuery = listQuery + ' WHERE ' + util.leafRegion + ' = ?';
        }  
    }  

    var queryToRunParts = odkCommon.getSessionVariable(queryKey);
    var queryToRun = null;
    var queryToRunParams = null;
    if (queryToRunParts !== null && queryToRunParts !== undefined) {
        queryToRunParts = JSON.parse(queryToRunParts);
        queryToRun = queryToRunParts[queryStmt];
        queryToRunParams = queryToRunParts[queryArgs];
    } else {
        queryToRunParts = {};
    }

    if (queryToRun === null || queryToRun ===  undefined ||
        queryToRunParams === null || queryToRunParams === undefined) {
        // Init display
        queryToRunParams = [];
    
        if (queryParamArg === null) {
            queryToRunParams = [];
        } else {
            queryToRunParams = [queryParamArg];
        }  

        queryToRun = listQuery;
        queryToRunParts[queryStmt] = queryToRun;
        queryToRunParts[queryArgs] = queryToRunParams;
        odkCommon.setSessionVariable(queryKey, JSON.stringify(queryToRunParts));
        console.log('Setting queryKey with ' + JSON.stringify(queryToRunParts));
    } 

    var cntQueryToRun = makeCntQuery(queryToRun);

    var cntQueryPromise = new Promise(function(resolve, reject) {
        odkData.arbitraryQuery(tableId, 
            cntQueryToRun, queryToRunParams, null, null, resolve, reject);
    });

    var queryPromise = new Promise(function(resolve, reject)  {
        odkData.arbitraryQuery(tableId, 
            queryToRun, queryToRunParams, limit, offset, resolve, reject);
        
    });

    Promise.all([cntQueryPromise, queryPromise]).then(function(resultArray) {
        processPromises(resultArray[0], resultArray[1]);

    }, function(err) {
        console.log('promises failed with error: ' +  err);
    });

    if (fIdxStart === 'init') {
        // We're also going to add a click listener on the wrapper ul that will
        // handle all of the clicks on its children.
        $('#list').click(function(e) {
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
                odkTables.openDetailView(null, tableId, rowId, null);
                console.log('opened detail view');
            }
        });
    }
}

function displayGroup(resultSet) {
    /* Number of rows displayed per 'chunk' - can modify this value */
    for (var i = 0; i < resultSet.getCount(); i++) {

        /* Creates the item space */
        var item = $('<li>');
        var catalogID = resultSet.getData(i, 'catalog_id');
        item.attr('rowId', resultSet.getRowId(i));
        item.attr('class', 'item_space');
        item.text('Refrigerator ' + resultSet.getData(i, 'tracking_id') +
            ' | ' + catalogID);

        /* Creates arrow icon (Nothing to edit here) */
//         var chevron = $('<img>');
//         chevron.attr('src', odkCommon.getFileAsUrl('config/assets/img/white_arrow.png'));
//         chevron.attr('class', 'chevron');
//         item.append(chevron);

        // Add delete button if _effective_access has 'd'
        var access = resultSet.getData(i, '_effective_access');
        if (access.indexOf('d') !== -1) {
            var deleteButton = $('<button>');
            deleteButton.attr('id', 'delButton');
            deleteButton.attr('class', 'delBtn btn');

            deleteButton.click(function(e) {
                var jqueryObj = $(e.target);
                // get closest thing with class item_space, to get row id
                var containingDiv = jqueryObj.closest('.item_space');
                var rowId = containingDiv.attr('rowId');
                console.log('deleteButton clicked with rowId: ' + rowId);
                e.stopPropagation();

                if (confirm('Are you sure you want to delete row ' + rowId)) {
                    odkData.deleteRow(tableId, null, rowId, function(d) {
						resumeFn('rowDeleted');
				    }, function(error) {
                        console.log('Failed to delete row ' +  rowId + ' with error ' + error);
						alert('Unable to delete row - ' + rowId);
					});
                }

            });

            deleteButton.text('Delete');
            
            item.append(deleteButton);
        }

        // Add edit button if _effective_access has 'w'
        if (access.indexOf('w') !== -1) {
            var editButton = $('<button>');
            editButton.attr('id', 'editButton');
            editButton.attr('class', 'editBtn btn');

            editButton.click(function(e) {
                var jqueryObj = $(e.target);
                // get closest thing with class item_space, to get row id
                var containingDiv = jqueryObj.closest('.item_space');
                var rowId = containingDiv.attr('rowId');
                console.log('editButton clicked with rowId: ' + rowId);
                e.stopPropagation();

                odkTables.editRowWithSurvey(null, tableId, rowId, tableId, null, null);
            });

            editButton.text('Edit');
            
            item.append(editButton);
        }

        var field1 = $('<li>');
        var facilityName = resultSet.getData(i, 'facility_name');
        field1.attr('class', 'detail');
        field1.text('Healthcare Facility: ' + facilityName);
        item.append(field1);

        $('#list').append(item);

        // don't append the last one to avoid the fencepost problem
        var borderDiv = $('<div>');
        borderDiv.addClass('divider');
        $('#list').append(borderDiv);
    }
}

function clearRows() {
  $('#list').empty();
}

function updateNavText(rowCount, limit, offset) {
    $('#navTextCnt').text(rowCount);
    if (rowCount <= 0) {
        $('#navTextOffset').text(0);
        $('#navTextLimit').text(0);
    } else {
        var offsetDisplay = offset + 1;
        $('#navTextOffset').text(offsetDisplay);

        var limitVal = (offset + limit >= rowCount) ? rowCount : offset + limit;
        $('#navTextLimit').text(limitVal);
    }
}

function updateNavButtons(rowCount, limit, offset) {
  if (offset <= 0) {
    $('#prevButton').prop('disabled',true);  
  } else {
    $('#prevButton').prop('disabled',false);
  }

  if (offset + limit >= rowCount) {
    $('#nextButton').prop('disabled',true);  
  } else {
     $('#nextButton').prop('disabled',false);  
  }
}

function prevResults() {
    var rowCount = parseInt(odkCommon.getSessionVariable(rowCountKey));
    var offset = parseInt(odkCommon.getSessionVariable(offsetKey));    
    var limit = parseInt(odkCommon.getSessionVariable(limitKey));

    offset -= limit;
    if (offset < 0) {
        offset = 0;
    }

    updateNavButtons(rowCount, limit, offset);

    odkCommon.setSessionVariable(offsetKey, offset);

    clearRows();
    resumeFn('prevButtonClicked');
}

function nextResults() {
    var rowCount = parseInt(odkCommon.getSessionVariable(rowCountKey));
    var offset = parseInt(odkCommon.getSessionVariable(offsetKey));    
    var limit = parseInt(odkCommon.getSessionVariable(limitKey));

    updateNavButtons(rowCount, limit, offset);

    if (offset + limit >= rowCount) {  
        return;
    }

    offset += limit;

    odkCommon.setSessionVariable(offsetKey, offset);

    clearRows();
    resumeFn('nextButtonClicked');
}

function newLimit() {

    var limit = parseInt($('#limitDropdown option:selected').text());
    odkCommon.setSessionVariable(limitKey, limit);

    clearRows();
    resumeFn('limitChanged');
}

function getSearchResults () {

    var searchText = $('#search').val();

    if (searchText !== null && searchText !== undefined &&
        searchText.length !== 0) {
        odkCommon.setSessionVariable(searchKey, searchText);
        searchText = '%' + searchText + '%';

        var queryToRun = makeSearchQuery(listQuery);
        var queryToRunParams = [];

        var queryParamArg = util.getQueryParameter(util.leafRegion);
        if (queryParamArg !== null) {
            queryToRunParams = [queryParamArg, searchText, searchText, searchText, searchText];
        } else {
            queryToRunParams = [searchText, searchText, searchText, searchText];
        }

        var offset = 0;
        odkCommon.setSessionVariable(offsetKey, offset);

        var queryToRunParts = {};
        queryToRunParts[queryStmt] = queryToRun;
        queryToRunParts[queryArgs] = queryToRunParams;
        odkCommon.setSessionVariable(queryKey, JSON.stringify(queryToRunParts));
        console.log('Setting queryKey with ' + JSON.stringify(queryToRunParts));

        resumeFn('searchSelected');
    }
}

function clearResults() {

    var searchText = $('#search').val();

    if (searchText === null || searchText === undefined ||
        searchText.length === 0) {
        odkCommon.setSessionVariable(searchKey, '');

        var queryToRunParams = [];
        var queryParamArg = util.getQueryParameter(util.leafRegion);
        if (queryParamArg !== null) {
            queryToRunParams = [queryParamArg];
        } 

        var queryToRun = listQuery;

        var queryToRunParts = {};
        queryToRunParts[queryStmt] = queryToRun;
        queryToRunParts[queryArgs] = queryToRunParams;
        odkCommon.setSessionVariable(queryKey, JSON.stringify(queryToRunParts));
        console.log('Setting queryKey with ' + JSON.stringify(queryToRunParts));

        var offset = 0;
        odkCommon.setSessionVariable(offsetKey, offset);
        resumeFn('undoSearch');  
    }  
}
