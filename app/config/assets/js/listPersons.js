/**
 * Responsible for rendering the select person (be it woman/child) for control/routine visits
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var persons, children, visitType, cluster, assistant, region, tabanca;
// note that persons are the MIFs

function display() {
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


// This handy SQL makes adates sortable: 
// substr(CONT, instr(CONT, 'Y:')+2, 4) || substr('00'|| trim(substr(CONT, instr(CONT, 'M:')+2, 2),","), -2, 2) || substr('00'|| trim(substr(CONT, instr(CONT, 'D:')+2, 2),","), -2, 2) AS D,

function loadPersons() {
    // SQL to get women (MIF)
    var sql = "SELECT REGID, NOME, GR,ESTADOVIS, CART, CONT, MIFDNASC FROM MIF WHERE REG = " + region + " AND TAB = " + tabanca + " AND MOR = " + cluster + " GROUP BY REGID HAVING MIN(ROWID) AND ESTADO = 1 ORDER BY substr(CONT, instr(CONT, 'Y:')+2, 4) || substr('00'|| trim(substr(CONT, instr(CONT, 'M:')+2, 2),','), -2, 2) || substr('00'|| trim(substr(CONT, instr(CONT, 'D:')+2, 2),','), -2, 2) DESC, NOME"
    // Todo - look up in db => callback: populateView;
    persons = [];
    console.log("Querying database for MIFs...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " persons");
        for (var row = 0; row < result.getCount(); row++) {
            var REGID = result.getData(row,"REGID"); // Despite obviously bad naming, this is actually the Person ID
            var NOME = titleCase(result.getData(row,"NOME"));
            var GR = result.getData(row,"GR");
            var ESTADOVIS = result.getData(row,"ESTADOVIS");
            var CART = result.getData(row,"CART");
            var CONT = result.getData(row,"CONT");
            var MIFDNASC = result.getData(row,"MIFDNASC");
            
            var p = { type: 'mif', REGID, NOME, GR, ESTADOVIS, CART, CONT, MIFDNASC };
            console.log(p);
            persons.push(p);
        }
        loadChildren(); // Get children too!
        return;
    }
    var failureFn = function( errorMsg ) {
        console.error('Failed to get persons from database: ' + errorMsg);
        console.error('Trying to execute the following SQL:');
        console.error(sql);
        alert("Program error Unable to look up persons.");
    }

    odkData.arbitraryQuery('MIF', sql, null, null, null, successFn, failureFn);
}

function loadChildren() {
    // SQL to load children
    var sql = "SELECT REGIDC, NOME, REGID, PRES, CARTVAC, CONT, OUTDATE FROM CRIANCA  WHERE REG = " + region + " AND TAB = " + tabanca + " AND MOR = " + cluster + " GROUP BY REGIDC HAVING MIN(ROWID) AND ESTADO = 1  ORDER BY substr(CONT, instr(CONT, 'Y:')+2, 4) || substr('00'|| trim(substr(CONT, instr(CONT, 'M:')+2, 2),','), -2, 2) || substr('00'|| trim(substr(CONT, instr(CONT, 'D:')+2, 2),','), -2, 2) DESC, NOME";
    children = [];
    console.log("Querying database for CRIANCAs...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " children");
        for (var row = 0; row < result.getCount(); row++) {

            var REGIDC = result.getData(row,"REGIDC");
            var NOME = titleCase(result.getData(row,"NOME"));
            var REGID = result.getData(row,"REGID"); // This is now the mother's id (go figure)
            var PRES = result.getData(row,"PRES");
            var CARTVAC = result.getData(row,"CARTVAC");
            var CONT = result.getData(row,"CONT");
            var OUTDATE = result.getData(row,"OUTDATE");
            
            var p = { type: 'crianca', REGIDC, NOME, REGID, PRES, CARTVAC, CONT, OUTDATE };
            console.log(p);
            children.push(p);
        }
        populateView();
        return;
    }
    var failureFn = function( errorMsg ) {
        console.error('Failed to get children from database: ' + errorMsg);
        console.error('Trying to execute the following SQL:');
        console.error(sql);
        alert("Program error Unable to look up children.");
    }

    odkData.arbitraryQuery('CRIANCA', sql, null, null, null, successFn, failureFn);
}


function populateView() {
    
    // console.log("MIFS:");
    // console.log(persons);
    
    // console.log("CHILDREN:");
    // console.log(children);
    
    var personsAndChildren = [];
    persons.forEach(mif => {
        personsAndChildren.push(mif);
        var thisMifsChildren = children.splice(children.findIndex(child => child.REGID == mif.REGID),1); // this also removes the matched children from the children list
        thisMifsChildren.forEach(child => {
            personsAndChildren.push(child);
        });
    });

    // Add any remaining (orphaned) children
    children.forEach(child => {
        personsAndChildren.push(chlid);        
    });

    var ul = $('#persons');
    $.each(personsAndChildren, function() {
        console.log(this);
        var visited = this.visited ? 'visited' : '';
        ul.append($("<li />").append($("<button />").attr('onclick','openForm("' + this.type + '",' + this + ');').attr('class',visited + ' btn ' + this.type).text(this.NOME)));
    });
}


function getDefaultsMIF(person) {
    var defaults = {};
    defaults['MOR'] = cluster;
    defaults['REG'] = region;
    defaults['TAB'] = tabanca;
    //defaults['VISIT_TYPE'] = visitType;
    defaults['ASSISTENTE'] = assistant;
    defaults['REGID'] = person.REGID;
    defaults['NOME'] = person.NOME;
    defaults['GR'] = person.GR;
    
    defaults['ESTADOVIS'] = person.ESTADOVIS;
    defaults['CART'] = person.CART;
    defaults['CONT'] = person.CONT;
    defaults['MIFDNASC'] = person.MIFDNASC;

    return defaults;
}

function getDefaultsChild(person) {
    var defaults = {};
    defaults['MOR'] = cluster;
    defaults['REG'] = region;
    defaults['TAB'] = tabanca;
    defaults['REGIDC'] = person.REGIDC;
    defaults['NOME'] = person.NOME;
    defaults['REGID'] = person.REGID;
    defaults['PRES'] = person.PRES;
    defaults['CARTVAC'] = person.CARTVAC;
    defaults['CONT'] = person.CONT;
    defaults['OUTDATE'] = person.OUTDATE;
    return defaults;
}

function openForm(type, person) {
    var personId = person.REGID;
    //alert("Opening " + type + " form for person id: " + personId);
    // Look up person
    // Open form
    var defaults = {};
    var tableId = "mif" == type ? "MIF" : "CRIANCA";
    var formId = "mif" == type ? "MIF" : "CRIANCA";
    if ("mif" == type) {
        // It's a MIF
        defaults = getDefaultsMIF(person); 
    } else {
        // It's a child
        defaults = getDefaultsChild(person);
    }

    odkTables.addRowWithSurvey(
            null,
            tableId,
            formId,
            null,
            defaults);
}

function titleCase(str) {
    if (!str) return str;
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }