/**
 * The file for displaying the detail view of the tea inventory table.
 */
/* global $, control, data */
'use strict';

// Handle the case where we are debugging in chrome.
// if (JSON.parse(common.getPlatformInfo()).container === 'Chrome') {
//     console.log('Welcome to Tables debugging in Chrome!');
//     $.ajax({
//         url: common.getFileAsUrl('output/debug/Tea_inventory_data.json'),
//         async: false,  // do it first
//         success: function(dataObj) {
//             window.data.setBackingObject(dataObj);
//         }
//     });
// }

var teaInvResultSet = {};
var typeData = {};

function cbTypeSuccess(result) {

    typeData = result;

    $('#TITLE').text(teaInvResultSet.get('Name'));

    // We're going to get the type name from the Tea Types table.
//     var typeData = control.query(
//             'Tea_types',
//             'Type_id = ?',
//             [data.get('Type_id')]);

    $('#FIELD_1').text(typeData.getData(0, 'Name'));
    $('#FIELD_2').text(teaInvResultSet.get('Price_8oz'));
    $('#FIELD_3').text(teaInvResultSet.get('Price_12oz'));
    $('#FIELD_4').text(teaInvResultSet.get('Price_16oz'));

    if(teaInvResultSet.get('Hot') === 'Yes') {
        $('#FIELD_8').attr('checked', true);
    }
    $('#FIELD_8').attr('disabled', true);

    if(teaInvResultSet.get('Cold') === 'Yes') {
        $('#FIELD_9').attr('checked', true);
    }
    $('#FIELD_9').attr('disabled', true);

    if(teaInvResultSet.get('Loose_Leaf') === 'Yes') {
        $('#FIELD_11').attr('checked', true);
    }
    $('#FIELD_11').attr('disabled', true);

    if(teaInvResultSet.get('Bags') === 'Yes') {
        $('#FIELD_12').attr('checked', true);
    }
    $('#FIELD_12').attr('disabled', true);

}

function cbTypeFailure(error) {

    console.log('cbTypeFailue: query for Type_id failed with message: ' + error);

}


function cbSuccess(result) {

    teaInvResultSet = result;
    
    datarsp.query('Tea_types', 'Type_id = ?', [teaInvResultSet.get('Type_id')],
        null, null, null, null, true, cbTypeSuccess, cbTypeFailure, null, false);
}

function cbFailure(error) {

    console.log('cbFailure: getViewData failed with message: ' + error);

}

var display = function() {

    datarsp.getViewData(cbSuccess, cbFailure);

}

