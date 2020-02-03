/**
 * Responsible for rendering the select list of cluster (morancas) screen.
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var visitType, region, tabanca, date;
var clusters = [];

function display() {
    visitType = util.getQueryParameter('visitType');
    region = util.getQueryParameter('region');
    tabanca = util.getQueryParameter('tabanca');
    date = util.getQueryParameter('date');
    console.log(visitType + " visit: cluster list loading");
    
    // Set the background to be a picture.
    //var body = $('#main');
    $('body').first().css('background', 'url(img/bafata.jpg) fixed');
    $('body').css('background-size', 'cover');

    loadPersons();
}

function loadPersons() {

    // SELECT MOR, MORNOME, GRUPO FROM MORLIST WHERE REGNOME = 'Gabu' AND TAB = 1 ORDER BY GRUPO, MOR
    console.log("Querying database...");
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " morancas");
        for (var row = 0; row < result.getCount(); row++) {
            //var id = result.getData(row,"_id"); // or _row_etag
            var MOR = result.getData(row,"MOR");
            var MORNOME =  result.getData(row,"MORNOME");
            var GRUPO =  result.getData(row,"GRUPO");
            var AMOSTRA = result.getData(row,"AMOSTRA");
            var VISITED = false;
            clusters.push({ id: MOR, visited: VISITED, group: GRUPO, amostra: AMOSTRA, mor: MORNOME, name: MOR + " - " + MORNOME + " (" + GRUPO + ")"});
        }        
        populateView();
        return;
    }

    var failureFn = function( errorMsg ) {
        console.error('Failed to get morancas from database: ' + errorMsg);
        alert('Failed to get morancas from database: ' + errorMsg);
    }

    var sql = "SELECT DISTINCT AMOSTRA, MOR, MORNOME, GRUPO FROM MORLIST WHERE REG = '" + region + "' AND TAB = " + tabanca + " ORDER BY GRUPO, MOR";
    odkData.arbitraryQuery('MORLIST', sql, null, null, null, successFn, failureFn);
    
}

function populateView() {
    console.log("Popuplating view with " + clusters.length + " clusters.");
    var ul = $('#clusters');
    $.each(clusters, function() {
        console.log(this);
        var visited = this.visited ? 'visited' : '';
        if (this.group == 1 | this.group == 2 | this.group == 3 | this.group == 4 ) {
            ul.append($("<li />").append($("<button />").attr('onclick','go(' + this.id + ',' + this.amostra + ');').attr('class',visited + ' btn group' + this.group).text(this.name)));
        } else {
            this.name = this.id + " - " + this.mor + " (NS)";
            ul.append($("<li />").append($("<button />").attr('onclick','go(' + this.id + ',' + this.amostra + ');').attr('class',visited + ' btn groupOther').text(this.name)));
        }
        
    });
}

function go(clusterId, amostra) {
    console.log("Going with " + visitType + " in " + clusterId);

    var region = util.getQueryParameter('region');
    var tabanca = util.getQueryParameter('tabanca');
    var assistant = util.getQueryParameter('assistant');
    var date = util.getQueryParameter('date');

    var queryParams = util.setQuerystringParams(region, tabanca, assistant, visitType, date, amostra, clusterId);
        if (util.DEBUG) top.location = 'listPersons.html' + queryParams;
        odkTables.launchHTML(null,  'config/assets/listPersons.html' + queryParams);
}
