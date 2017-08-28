/**
 * Responsible for rendering the home screen.
 */
'use strict';
/* global odkTables */

function display() {

    var body = $('#main');
    // Set the background to be a picture.
    body.css('background-image', 'url(img/hallway.jpg)');

    var viewFacilitiesButton = $('#view-facilities');
    viewFacilitiesButton.on(
        'click',
        function() {
            odkTables.launchHTML(null,'config/assets/filterHealthFacilities.html');
        }
    );

    var viewRefrigeratorsButton = $('#view-refrigerators');
    viewRefrigeratorsButton.on(
        'click',
        function() {
            odkTables.openTableToListView(
                null, 
                'refrigerators',
                null,
                null,
                'config/tables/refrigerators/html/refrigerators_list.html');
        }
    );

    var viewRefrigeratorModelsButton = $('#view-models');
    viewRefrigeratorModelsButton.on(
        'click',
        function() {
            odkTables.openTableToListView(
                null,
                'refrigerator_types',
                null,
                null,
                'config/tables/refrigerator_types/html/refrigerator_types_list.html');
        }
    );

}
