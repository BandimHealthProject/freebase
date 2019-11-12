/**
 * Responsible for rendering the select person for mother of a child
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var persons, children, visitType, cluster, assistant, region, tabanca, date, amostra;
// note that persons are the MIFs

function display() {
    console.log("Persons list loading");
    visitType = util.getQueryParameter('visitType');
    cluster = util.getQueryParameter('cluster');
    assistant = util.getQueryParameter('assistant');
    region = util.getQueryParameter('region');
    tabanca = util.getQueryParameter('tabanca');
    date = util.getQueryParameter('date');
    amostra = util.getQueryParameter('amostra')
    
    // Set the background to be a picture.
    var body = $('body').first();
    body.css('background', 'url(img/bafata.jpg) fixed');
    loadPersons();
}


// This handy SQL makes adates sortable: 
// substr(CONT, instr(CONT, 'Y:')+2, 4) || substr('00'|| trim(substr(CONT, instr(CONT, 'M:')+2, 2),","), -2, 2) || substr('00'|| trim(substr(CONT, instr(CONT, 'D:')+2, 2),","), -2, 2) AS D,

function loadPersons() {
    // SQL to get women (MIF)
    var sql = "SELECT REGID, NOME, CASA, FOGAO FROM MIF WHERE REG = " + region + " AND TAB = " + tabanca + " AND MOR = " + cluster + " GROUP BY REGID HAVING MIN(ROWID) AND ESTADO = 1 ORDER BY substr(CONT, instr(CONT, 'Y:')+2, 4) || substr('00'|| trim(substr(CONT, instr(CONT, 'M:')+2, 2),','), -2, 2) || substr('00'|| trim(substr(CONT, instr(CONT, 'D:')+2, 2),','), -2, 2) DESC, NOME";
    persons = [];
    console.log("Querying database for MIFs...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " persons");
        for (var row = 0; row < result.getCount(); row++) {
            var REGID = result.getData(row,"REGID"); // Despite obviously bad naming, this is actually the Person ID
            var NOME = titleCase(result.getData(row,"NOME"));
            var CASA = result.getData(row,"CASA");
            var FOGAO = result.getData(row,"FOGAO");
            
            var p = { type: 'mif', REGID, NOME, CASA, FOGAO };
            console.log(p);
            persons.push(p);
        }
        populateView();
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

function populateView() {
    
    console.log("MIFS:");
    console.log(persons);
    
    var personsAndChildren = [];
    persons.forEach(mif => {
        personsAndChildren.push(mif);
    });

    console.log(personsAndChildren);

    var ul = $('#persons');
    $.each(personsAndChildren, function() {
        console.log(this);
        var that = this;
        var visited = this.visited ? 'visited' : '';
        
        ul.append($("<li />").append($("<button />").attr('id',this.REGID).attr('class',visited + ' btn ' + this.type).text(this.NOME)));
        
        var btn = ul.find('#' + this.REGID);
        btn.on("click", function() {
            openForm(that.type, that);
        })
    });

    // Set values for new child with no mother on moranca
    var defaults = {};
    defaults['MOR'] = cluster;
    defaults['REG'] = region;
    defaults['TAB'] = tabanca;
    defaults['AMO'] = amostra;
    defaults['VISITTYPE'] = visitType;
    defaults['ASSISTENTE'] = assistant;
    defaults['CONT'] = date; // today's date
    defaults['REGDIA'] = date;
    defaults['REGID'] = region + tabanca + cluster; // regid ???

    // Adds button for "anoter MIF"
    ul.append($("<li />").append($("<button />").attr('id','new' + '_' + 'mif').attr('class', ' btn ' + 'mif').text('Outra mulher')));
    var btn = ul.find('#' + 'new' + '_' + 'mif');
        btn.on("click", function() {
            odkTables.addRowWithSurvey(
                null,
                'CRIANCA',
                'CRIANCA',
                null,
                defaults);
        })
}

function getDefaultsMIF(person) {
    var defaults = {};
    defaults['MOR'] = cluster;
    defaults['REG'] = region;
    defaults['TAB'] = tabanca;
    defaults['AMO'] = amostra;
    defaults['VISITTYPE'] = visitType;
    defaults['ASSISTENTE'] = assistant;
    defaults['CONT'] = date; // today's date
    defaults['REGID'] = person.REGID;
    defaults['NOMEMAE'] = person.NOME; // mother's name
    defaults['CASA'] = person.CASA;
    defaults['FOGAO'] = person.FOGAO;
    defaults['REGDIA'] = date;
    return defaults;
}

function openForm(type, person) {
    console.log("Preparing form for ", person);
    var personId = person.REGID;
    //alert("Opening " + type + " form for person id: " + personId);
    // Look up person
    // Open form
    var defaults = {};
    var tableId = "CRIANCA";
    var formId = "CRIANCA";
    if ("mif" == type) {
        // It's a MIF
        defaults = getDefaultsMIF(person);
    } 
    console.log("Opening form with:", defaults);
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