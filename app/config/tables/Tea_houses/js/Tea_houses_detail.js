/**
 * The file for displaying detail views of the Tea Houses table.
 */
/* global $, control */
'use strict';

// Handle the case where we are debugging in chrome.
// if (JSON.parse(common.getPlatformInfo()).container === 'Chrome') {
//     console.log('Welcome to Tables debugging in Chrome!');
//     $.ajax({
//         url: common.getFileAsUrl('output/debug/Tea_houses_data.json'),
//         async: false,  // do it first
//         success: function(dataObj) {
//             window.data.setBackingObject(dataObj);
//         }
//     });
// }

var teaHouseResultSet = {}; 
var typeData = {};

function onLinkClick() {

    if (!$.isEmptyObject(teaHouseResultSet))
    {
        control.openTableToListView(
          'Tea_inventory',
          'House_id = ?',
          [teaHouseResultSet.get('House_id')],
          'config/tables/Tea_inventory/html/Tea_inventory_list.html');
    }
}

function cbSuccess(result) {

    teaHouseResultSet = result;

    datarsp.query('Tea_types', 'Type_id = ?', [teaHouseResultSet.get('Specialty_Type_id')], 
        null, null, null, null, true, teaTypeCBSuccess, teaTypeCBFailure, null, false);

    datarsp.query('Tea_inventory', 'House_id = ?', [teaHouseResultSet.get('House_id')], 
        null, null, null, null, true, teaInvCBSuccess, teaInvCBFailure, null, false);
}

function cbFailure(error) {

    console.log('Tea_houses_detail getViewData CB error : ' + error);
}

var display = function() {

    datarsp.getViewData(cbSuccess, cbFailure);
}

function teaTypeCBSuccess(result) {

    console.log('Tea_houses_detail tea type query CB success');
    typeData = result;
}

function teaTypeCBFailure(error ) {

    console.log('Tea_houses_detail tea type query CB error : ' + error);
}

function teaInvCBSuccess(invData) {

    $('#TITLE').text(teaHouseResultSet.get('Name'));
    $('#FIELD_2').text(teaHouseResultSet.get('State'));
    $('#FIELD_3').text(teaHouseResultSet.get('Region'));
    $('#FIELD_4').text(teaHouseResultSet.get('District'));
    $('#FIELD_5').text(teaHouseResultSet.get('Neighborhood'));

    // We're going to get the type name from the Tea Types table.
//     var typeData = control.query(
//             'Tea_types',
//             'Type_id = ?',
//             [data.get('Specialty_Type_id')]);

    $('#FIELD_6').text(typeData.getData(0, 'Name'));

    $('#FIELD_13').text(teaHouseResultSet.get('Date_Opened'));
    $('#FIELD_7').text(teaHouseResultSet.get('Customers'));
    $('#FIELD_18').text(teaHouseResultSet.get('Visits'));

    // The latitude and longitude are stored in a single column as GeoPoint.
    // We need to extract the lat/lon from the GeoPoint.
    var lat = teaHouseResultSet.get('Location.latitude');
    var lon = teaHouseResultSet.get('Location.longitude');
    $('#FIELD_8').text(lat);
    $('#FIELD_9').text(lon);
    $('#FIELD_17').text(teaHouseResultSet.get('House_id'));

    if(teaHouseResultSet.get('Iced') === 'Yes') {
        $('#FIELD_10').attr('checked', true);
    }
    $('#FIELD_10').attr('disabled', true);
    if(teaHouseResultSet.get('Hot') === 'Yes') {
        $('#FIELD_11').attr('checked', true);
    }
    $('#FIELD_11').attr('disabled', true);
    if(teaHouseResultSet.get('WiFi') === 'Yes') {
        $('#FIELD_12').attr('checked', true);
    }
    $('#FIELD_12').attr('disabled', true);

    $('#FIELD_14').text(teaHouseResultSet.get('Owner'));
    $('#FIELD_15').text(teaHouseResultSet.get('Phone_Number'));

//     var results = control.query(
//             'Tea_inventory',
//             'House_id = ?',
//             [data.get('House_id')]);
    $('#FIELD_16').text(invData.getCount());

}

function teaInvCBFailure(error ) {
    console.log('Tea_houses_detail tea inv query CB error : ' + error);
}
