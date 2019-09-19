/**
 * Responsible for rendering the select region/sector/tabanca screen.
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var clusters, visitType;

function display() {
    visitType = util.getQueryParameter('visitType')    
    console.log(visitType + " visit: cluster list loading");
    
    // Set the background to be a picture.
    var body = $('#main');
    body.css('background-image', 'url(img/bafata.jpg)');

    loadClusters();
}

function loadClusters() {
    // Todo - look up in db => callback: populateView;
    clusters = [
        { id: 1, group: 1, name: 'cluster 1', visited: true},
        { id: 2, group: 1, name: 'cluster 2'},
        { id: 3, group: 2, name: 'cluster 3'},
        { id: 4, group: 2, name: 'cluster 4'},
        { id: 5, group: 3, name: 'cluster 5'}
    ];
    populateView();
}

function go(clusterId) {
    console.log("Going with " + visitType + " in " + clusterId);

    var region = util.getQueryParameter('region');
    var tabanca = util.getQueryParameter('tabanca');
    var assistant = util.getQueryParameter('assistant');

    var queryParams = util.setQuerystringParams(region, tabanca, assistant, visitType, clusterId);
        if (util.DEBUG) top.location = 'listPersons.html' + queryParams;
        odkTables.launchHTML(null,  'config/assets/listPersons.html' + queryParams);
}

function populateView() {
    console.log(clusters);
    var ul = $('#clusters');
    $.each(clusters, function() {
        console.log(this);
        var visited = this.visited ? 'visited' : '';
        ul.append($("<li />").append($("<button />").attr('onclick','go(' + this.id + ');').attr('class',visited + ' btn group' + this.group).text(this.name)));
    });
}