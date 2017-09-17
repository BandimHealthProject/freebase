/**
 * This is the file that will create the list view for the table.
 */
/* global $, odkCommon, odkData, odkTables, util */
 (function() {
'use strict';

window.listViewLogic = {
    tableId: null,
    limitKey: null,
    offsetKey: null,
    rowCountKey: null,
    queryKey: null,
    searchKey: null,
    queryStmt: 'stmt',
    queryArgs: 'args',

    rowCount: 0,  
    limit: 0,
    offset: 0,

    queryToRun: null,
    queryToRunParams: null,

    listQuery: null,

    searchParams: null,

    listElemId: null,
    searchTxtId: null,
    headerId: null,
    limitId: null,
    prevBtnId: null,
    nextBtnId: null,
    navTextLimit: null,
    navTextOffset: null,
    navTextCnt: null,
    
    setTableId: function(tableName) {
        if (tableName === null || tableName === undefined ||
            tableName.length === 0) {
            console.log('setTableId: invalid table name');
            return;
        }

        var that = this;

        that.tableId = tableName;
        that.limitKey = that.tableId + ':limit';
        that.offsetKey = that.tableId + ':offset';
        that.rowCountKey = that.tableId + ':rowCount';
        that.queryKey = that.tableId + ':query';
        that.searchKey = that.tableId + ':search';
    },
    
    setListQuery: function(queryToUse) {
        if (queryToUse === null || queryToUse === undefined ||
            queryToUse.length === 0) {
            console.log('setListQuery: invalid list query');
            return;
        }

        var that = this;

        that.listQuery = queryToUse;
    },

    setSearchParams: function(searchParamsToUse) {
        if (searchParamsToUse === null || searchParamsToUse === undefined ||
            searchParamsToUse.length === 0) {
            console.log('setSearchParams: invalid search params to use');
            return;
        }

        var that = this;

        that.searchParams = searchParamsToUse;
    },

    setListElement: function(listElemIdToUse) {
        if (listElemIdToUse === null || listElemIdToUse === undefined ||
            listElemIdToUse.length === 0) {
            console.log('setListElement: invalid list element id');
            return;
        }

        var that = this;

        that.listElemId = listElemIdToUse;
    },

    setSearchTextElement: function(searchTxtIdToUse) {
        if (searchTxtIdToUse === null || searchTxtIdToUse === undefined ||
            searchTxtIdToUse.length === 0) {
            console.log('setSearchTextElement: invalid search text id');
            return;
        }

        var that = this;

        that.searchTxtId = searchTxtIdToUse;
    },

    setHeaderElement: function(headerIdToUse) {
        if (headerIdToUse === null || headerIdToUse === undefined ||
            headerIdToUse.length === 0) {
            console.log('setHeaderElement: invalid header id');
            return;
        }

        var that = this;

        that.headerId = headerIdToUse;
    },

    setLimitElement: function(limitIdToUse) {
        if (limitIdToUse === null || limitIdToUse === undefined ||
            limitIdToUse.length === 0) {
            console.log('setLimitElement: invalid header id');
            return;
        }

        var that = this;

        that.limitId = limitIdToUse;
    },

    setPrevAndNextButtons: function(prevBtnIdToUse, nextBtnIdToUse) {
        if (prevBtnIdToUse === null || prevBtnIdToUse === undefined ||
            prevBtnIdToUse.length === 0) {
            console.log('setPrevAndNextButtons: invalid prev button id');
            return;
        }

        if (nextBtnIdToUse === null || nextBtnIdToUse === undefined || 
            nextBtnIdToUse.length === 0) {
            console.log('setPrevAndNextButtons: invalid next button id');
            return;
        }

        var that = this;

        that.prevBtnId = prevBtnIdToUse;
        that.nextBtnId = nextBtnIdToUse;
    },

    setNavTextElements: function(txtLimit, txtOffset, txtCnt) {
        if (txtLimit === null || txtLimit === undefined ||
            txtLimit.length === 0) {
            console.log('setNavTextElements: invalid text limit id');
            return;
        }

        if (txtOffset === null || txtOffset === undefined || 
            txtOffset.length === 0) {
            console.log('setNavTextElements: invalid text offset id');
            return;
        }

        if (txtCnt === null || txtCnt === undefined || 
            txtCnt.length === 0) {
            console.log('setNavTextElements: invalid text cnt id');
            return;
        }

        var that = this;

        that.navTextLimit = txtLimit;
        that.navTextOffset = txtOffset;
        that.navTextCnt = txtCnt;
    },

    makeCntQuery: function(queryToWrap) {
        if (queryToWrap !== null && queryToWrap !== undefined &&
            queryToWrap.length > 0) {
            return 'SELECT COUNT(*) AS cnt FROM (' + queryToWrap + ')';
        } else  {
            return null;
        }
    },

    makeSearchQuery: function(searchQueryToWrap) {
        var that = this;
        if (searchQueryToWrap !== null && searchQueryToWrap !== undefined &&
            searchQueryToWrap.length > 0) {
            if (searchQueryToWrap.indexOf('WHERE') >= 0) {
                return searchQueryToWrap + ' AND ' + that.searchParams;
            } else {
                return searchQueryToWrap + ' WHERE ' + that.searchParams;
            }
        } else {
            return null;
        }
    },

    processPromises: function(cntResultSet, resultSet) {
        var that = this;
        // Set the text for the number of rows
        if (cntResultSet.getCount() > 0) {
            that.rowCount = parseInt(cntResultSet.getData(0, 'cnt'));
        } else {
            that.rowCount = 0;
        }

        odkCommon.setSessionVariable(that.rowCountKey, that.rowCount);

        if (that.rowCount === 0) {
            that.offset = 0;
            odkCommon.setSessionVariable(that.offsetKey, that.offset);
        }

        // Display the results in the list
        that.updateNavButtons();
        that.updateNavText();
        that.clearRows();

        if (resultSet.getCount() === 0) {
            console.log('No ' + util.formatDisplayText(that.tableId));
            var note = $('<li>');
            note.attr('class', 'note');
            note.text('No ' + util.formatDisplayText(that.tableId));
            $(that.listElemId).append(note);

        } else {
            that.displayGroup(resultSet);
        }
    },

    resumeFn: function(fIdxStart) {
        var that = this;
        console.log('resumeFn called. fIdxStart: ' + fIdxStart);

        // Use session variables if came back from rotation
        if (fIdxStart === 'init') {
            var searchText = odkCommon.getSessionVariable(that.searchKey);
            if (searchText !== null && searchText !== undefined && searchText.length !== 0) {
                $(that.searchTxtId).val(searchText);
            } 

            that.rowCount = odkCommon.getSessionVariable(that.rowCountKey);
            if (that.rowCount === null || that.rowCount === undefined) {
                that.rowCount = 0;
                odkCommon.setSessionVariable(that.rowCountKey, that.rowCount);
            } else {
                that.rowCount = parseInt(that.rowCount); 
            }

            that.offset = odkCommon.getSessionVariable(that.offsetKey);
            if (that.offset === null ||that.offset === undefined) {
                that.offset = 0;
                odkCommon.setSessionVariable(that.offsetKey, that.offset);
            } else {
                that.offset = parseInt(that.offset);
            }
    
            that.limit = odkCommon.getSessionVariable(that.limitKey);
            if (that.limit === null || that.limit === undefined) {
                var limitSelected = that.limitId + ' option:selected';
                that.limit = parseInt($(limitSelected).text());
                odkCommon.setSessionVariable(that.limitKey, that.limit);
            } else {
                $(that.limitId).val(that.limit);
                that.limit = parseInt(that.limit);
            }

            var queryParamArg = util.getQueryParameter(util.leafRegion);

            if (queryParamArg === null) {
                $(that.headerId).text(util.formatDisplayText(that.tableId));
                console.log('No valid query param passed in');
            } else {
                $(that.headerId).text(queryParamArg);
                that.listQuery = that.listQuery + ' WHERE ' + util.leafRegion + ' = ?';
            }  

            var queryToRunParts = odkCommon.getSessionVariable(that.queryKey);
            that.queryToRun = null;
            that.queryToRunParams = null;
            if (queryToRunParts !== null && queryToRunParts !== undefined) {
                queryToRunParts = JSON.parse(queryToRunParts);
                that.queryToRun = queryToRunParts[that.queryStmt];
                that.queryToRunParams = queryToRunParts[that.queryArgs];
            } else {
                queryToRunParts = {};
            }

            if (that.queryToRun === null || that.queryToRun ===  undefined ||
                that.queryToRunParams === null || that.queryToRunParams === undefined) {
                // Init display
                that.queryToRunParams = [];
    
                if (queryParamArg === null) {
                    that.queryToRunParams = [];
                } else {
                    that.queryToRunParams = [queryParamArg];
                }  

                that.queryToRun = that.listQuery;
                queryToRunParts[that.queryStmt] = that.queryToRun;
                queryToRunParts[that.queryArgs] = that.queryToRunParams;
                odkCommon.setSessionVariable(that.queryKey, JSON.stringify(queryToRunParts));
            } 
        }

        var cntQueryToRun = that.makeCntQuery(that.queryToRun);

        var cntQueryPromise = new Promise(function(resolve, reject) {
            odkData.arbitraryQuery(that.tableId, 
                cntQueryToRun, that.queryToRunParams, null, null, resolve, reject);
        });

        var queryPromise = new Promise(function(resolve, reject)  {
            odkData.arbitraryQuery(that.tableId, 
                that.queryToRun, that.queryToRunParams, that.limit, that.offset, resolve, reject);
        });

        Promise.all([cntQueryPromise, queryPromise]).then(function(resultArray) {
            that.processPromises(resultArray[0], resultArray[1]);

        }, function(err) {
            console.log('promises failed with error: ' +  err);
        });

        if (fIdxStart === 'init') {
            // We're also going to add a click listener on the wrapper ul that will
            // handle all of the clicks on its children.
            $(that.listElemId).click(function(e) {
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
                    odkTables.openDetailView(null, that.tableId, rowId, null);
                    console.log('opened detail view');
                }
            });
        }
    },

    displayGroup: function(resultSet) {
        var that = this;
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
                        odkData.deleteRow(that.tableId, null, rowId, function(d) {
                            that.resumeFn('rowDeleted');
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

                    odkTables.editRowWithSurvey(null, that.tableId, rowId, that.tableId, null, null);
                });

                editButton.text('Edit');
            
                item.append(editButton);
            }

            var field1 = $('<li>');
            var facilityName = resultSet.getData(i, 'facility_name');
            field1.attr('class', 'detail');
            field1.text('Healthcare Facility: ' + facilityName);
            item.append(field1);

            $(that.listElemId).append(item);

            // don't append the last one to avoid the fencepost problem
            var borderDiv = $('<div>');
            borderDiv.addClass('divider');
            $(that.listElemId).append(borderDiv);
        }
    },

    clearRows: function() {
        var that = this;
        $(that.listElemId).empty();
    },

    updateNavText: function() {
        var that = this;
        $(that.navTextCnt).text(that.rowCount);
        if (that.rowCount <= 0) {
            $(that.navTextOffset).text(0);
            $(that.navTextLimit).text(0);
        } else {
            var offsetDisplay = that.offset + 1;
            $(that.navTextOffset).text(offsetDisplay);

            var limitVal = (that.offset + that.limit >= that.rowCount) ? that.rowCount : that.offset + that.limit;
            $(that.navTextLimit).text(limitVal);
        }
    },

    updateNavButtons: function() {
        var that = this;
        if (that.offset <= 0) {
            $(that.prevBtnId).prop('disabled',true);  
        } else {
            $(that.prevBtnId).prop('disabled',false);
        }

        if (that.offset + that.limit >= that.rowCount) {
            $(that.nextBtnId).prop('disabled',true);  
        } else {
            $(that.nextBtnId).prop('disabled',false);  
        }
    },

    prevResults: function() {
        var that = this;
        that.offset -= that.limit;
        if (that.offset < 0) {
            that.offset = 0;
        }

        that.updateNavButtons();

        odkCommon.setSessionVariable(that.offsetKey, that.offset);

        that.clearRows();
        that.resumeFn('prevButtonClicked');
    },

    nextResults: function() {
        var that = this;
        that.updateNavButtons();

        if (that.offset + that.limit >= that.rowCount) {  
            return;
        }

        that.offset += that.limit;

        odkCommon.setSessionVariable(that.offsetKey, that.offset);

        that.clearRows();
        that.resumeFn('nextButtonClicked');
    },

    newLimit: function() {
        var that = this;
        var limitSelected = that.limitId + ' option:selected';
        that.limit = parseInt($(limitSelected).text());
        odkCommon.setSessionVariable(that.limitKey, that.limit);

        that.clearRows();
        that.resumeFn('limitChanged');
    },

    getSearchResults :function() {
        var that = this;
        var searchText = $(that.searchTxtId).val();

        if (searchText !== null && searchText !== undefined &&
            searchText.length !== 0) {
            odkCommon.setSessionVariable(that.searchKey, searchText);
            searchText = '%' + searchText + '%';

            that.queryToRun = that.makeSearchQuery(that.listQuery);
            that.queryToRunParams = [];

            var queryParamArg = util.getQueryParameter(util.leafRegion);
            if (queryParamArg !== null) {
                that.queryToRunParams = [queryParamArg, searchText, searchText, searchText, searchText];
            } else {
                that.queryToRunParams = [searchText, searchText, searchText, searchText];
            }

            var queryToRunParts = {};
            queryToRunParts[that.queryStmt] = that.queryToRun;
            queryToRunParts[that.queryArgs] = that.queryToRunParams;
            odkCommon.setSessionVariable(that.queryKey, JSON.stringify(queryToRunParts));

            // Starting a new query - offset has to be 0
            that.offset = 0;
            odkCommon.setSessionVariable(that.offsetKey, that.offset);

            that.resumeFn('searchSelected');
        }
    },

    clearResults: function() {
        var that = this;
        var searchText = $(that.searchTxtId).val();

        if (searchText === null || searchText === undefined ||
            searchText.length === 0) {
            odkCommon.setSessionVariable(that.searchKey, '');

            that.queryToRunParams = [];
            var queryParamArg = util.getQueryParameter(util.leafRegion);
            if (queryParamArg !== null) {
                that.queryToRunParams = [queryParamArg];
            } 

            that.queryToRun = that.listQuery;

            var queryToRunParts = {};
            queryToRunParts[that.queryStmt] = that.queryToRun;
            queryToRunParts[that.queryArgs] = that.queryToRunParams;
            odkCommon.setSessionVariable(that.queryKey, JSON.stringify(queryToRunParts));

            // Starting a new query - offset has to be 0
            that.offset = 0;
            odkCommon.setSessionVariable(that.offsetKey, that.offset);

            that.resumeFn('undoSearch');  
        }  
    }
};
})();
