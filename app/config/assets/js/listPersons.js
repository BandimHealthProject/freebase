/**
 * Responsible for rendering the select person (be it woman/child) for control/routine visits
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var persons, visitType, cluster, assistant, region, tabanca;

function display() {
    //visitType = util.getQueryParameter('visitType')    
    console.log("Persons list loading");
    visitType = util.getQueryParameter('visitType');
    cluster = util.getQueryParameter('cluster');
    assistant = util.getQueryParameter('assistant');
    region = util.getQueryParameter('region');
    tabanca = util.getQueryParameter('tabanca');
    
    // Set the background to be a picture.
    var body = $('#main');
    body.css('background-image', 'url(img/bafata.jpg)');
    loadPersons();
}

function loadPersons() {
    // Todo - look up in db => callback: populateView;
    persons = [
        { id: 1, type: 'child', motherId: 1, name: 'Bebé', visited: true},
        { id: 2, type: 'child', motherId: 1, name: 'Bullidur 2'},
        { id: 3, type: 'mif', motherId: 0, name: 'Miffy'},
        { id: 4, type: 'child', motherId: 2, name: 'Bebé 4'},
        { id: 5, type: 'child', motherId: 3, name: 'Aboubacar'}
    ];
    populateView();
}

function populateView() {
    console.log(persons);
    var ul = $('#persons');
    $.each(persons, function() {
        console.log(this);
        var visited = this.visited ? 'visited' : '';
        var personType = this.type;
        ul.append($("<li />").append($("<button />").attr('onclick','openForm("' + this.type + '",' + this.id + ');').attr('class',visited + ' btn group' + this.group).text(this.name)));
    });
}


function getDefaultsMIF(personId) {
    var defaults = {};
    defaults['MOR'] = cluster;
    defaults['REG'] = region;
    defaults['TAB'] = tabanca;
    //defaults['VISIT_TYPE'] = type;
    defaults['ASSISTENTE'] = assistant;
    defaults['REGID'] = personId;
    return defaults;
}

function getDefaultsChild(personId) {
    var defaults = {};
    defaults['MOR'] = cluster;
    defaults['REG'] = region;
    defaults['TAB'] = tabanca;
    //defaults['VISIT_TYPE'] = type;
    //defaults['ASSISTENTE'] = assistant;
    defaults['REGIDC'] = personId;
    return defaults;
}

function openForm(type, personId) {
    //alert("Opening " + type + " form for person id: " + personId);
    // Look up person
    // Open form
    var defaults = {};
    var tableId = "mif" == type ? "MIF" : "CRIANCA";
    var formId = "mif" == type ? "MIF" : "CRIANCA";
    if ("mif" == type) {
        // It's a MIF
        defaults = getDefaultsMIF(personId);        
    } else {
        // It's a child
        defaults = getDefaultsChild(personId);
    }

    odkTables.addRowWithSurvey(
            null,
            tableId,
            formId,
            null,
            defaults);
}
