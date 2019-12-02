/**
 * Responsible for rendering the children to move
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var persons, visitType, cluster, assistant, region, tabanca, date, amostra;
var children
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
    loadChildren();
}


// This handy SQL makes adates sortable: 
// substr(CONT, instr(CONT, 'Y:')+2, 4) || substr('00'|| trim(substr(CONT, instr(CONT, 'M:')+2, 2),","), -2, 2) || substr('00'|| trim(substr(CONT, instr(CONT, 'D:')+2, 2),","), -2, 2) AS D,

function loadChildren() {
    // SQL to load children
    var varNames = "REGIDC, NOME, SEX";
    var sql = "SELECT " + varNames + 
        " FROM (" +
        " SELECT " + varNames + ", REG, TAB, MOR, ESTADO" +
        " FROM CRIANCA " + 
        " ORDER BY " +
        " substr(CONT, instr(CONT, 'Y:')+2, 4) || " +
        " substr('00'|| trim(substr(CONT, instr(CONT, 'M:')+2, 2),','), -2, 2) || " +
        " substr('00'|| trim(substr(CONT, instr(CONT, 'D:')+2, 2),','), -2, 2) ASC " + // For some reason this shold be ASC, but DESC when putting the code in SQL-database viewer
        " ) " +
        " WHERE REG = " + region + " AND TAB = " + tabanca + " AND MOR = " + cluster +
        " GROUP BY REGIDC HAVING ESTADO = 11" + 
        " ORDER BY NOME ASC";
    children = [];
    console.log("Querying database for CRIANCAs...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " children");
        for (var row = 0; row < result.getCount(); row++) {
            var REGIDC = result.getData(row,"REGIDC");
            var NOME = titleCase(result.getData(row,"NOME"));
            var SEX = result.getData(row,"SEX");

            var p = { type: 'crianca', REGIDC, NOME, SEX};
            console.log(p);
            children.push(p);
        }
        console.log("loadChildren:", children);
        populateView();
        return;
    }
    var failureFn = function( errorMsg ) {
        console.error('Failed to get persons from database: ' + errorMsg);
        console.error('Trying to execute the following SQL:');
        console.error(sql);
        alert("Program error Unable to look up persons.");
    }

    odkData.arbitraryQuery('CRIANCA', sql, null, null, null, successFn, failureFn);
}

function populateView() {
    
    console.log("CRIANCA:", children);

    var ul = $('#persons');
    $.each(children, function() {
        console.log(this);
        var that = this;
        var visited = this.visited ? 'visited' : '';
        
        if (this.SEX == "1" | this.SEX == "2") {
            ul.append($("<li />").append($("<button />").attr('id', this.REGIDC).attr('class',visited + this.type + ' btn ' + this.type + this.SEX).text(this.NOME)));
        } else {
            ul.append($("<li />").append($("<button />").attr('id', this.REGIDC).attr('class',visited + this.type + ' btn ' + this.type).text(this.NOME)));
        }
        
        var btn = ul.find('#' + this.REGIDC);
        btn.on("click", function() {
            var regidc = this.id
            console.log(regidc);
            var queryParams = util.setQuerystringParams(region, tabanca, assistant, visitType, date, amostra, cluster, regidc);
            odkTables.launchHTML(null, 'config/assets/moveToWoman.html' + queryParams);
            console.log(queryParams);
        })
    });
}

function getDefaultsChild(person) {
    var defaults = {};
    defaults['REGIDC'] = person.REGIDC;
    defaults['NOME'] = person.NOME;
    defaults['SEX'] = person.SEX;
    return defaults;
}

function titleCase(str) {
    if (!str) return str;
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }