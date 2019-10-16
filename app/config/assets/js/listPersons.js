/**
 * Responsible for rendering the select person (be it woman/child) for control/routine visits
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var persons, children, visitType, cluster, assistant, region, tabanca, date;
// note that persons are the MIFs

function display() {
    console.log("Persons list loading");
    visitType = util.getQueryParameter('visitType');
    cluster = util.getQueryParameter('cluster');
    assistant = util.getQueryParameter('assistant');
    region = util.getQueryParameter('region');
    tabanca = util.getQueryParameter('tabanca');
    date = util.getQueryParameter('date');
    
    // Set the background to be a picture.
    var body = $('body').first();
    body.css('background', 'url(img/bafata.jpg) fixed');
    loadPersons();
}


// This handy SQL makes adates sortable: 
// substr(CONT, instr(CONT, 'Y:')+2, 4) || substr('00'|| trim(substr(CONT, instr(CONT, 'M:')+2, 2),","), -2, 2) || substr('00'|| trim(substr(CONT, instr(CONT, 'D:')+2, 2),","), -2, 2) AS D,

function loadPersons() {
    // SQL to get women (MIF)
    var sql = "SELECT REGID, NOME, gr, estadovis, CART, cont, MIFDNASC, MOR, CASA, FOGAO, RELA1, RELA1NOME, VAC1TIPO, VAC1DATA, VAC1INF, VAC2TIPO, VAC2DATA, VAC2INF, VAC3TIPO, VAC3DATA, VAC3INF, VAC4TIPO, VAC4DATA, VAC4INF, VAC5TIPO, VAC5DATA, VAC5INF, VAC6TIPO, VAC6DATA, VAC6INF, VAC7TIPO, VAC7DATA, VAC7INF, VAC8TIPO, VAC8DATA, VAC8INF, VAC9TIPO, VAC9DATA, VAC9INF, VAC10TIPO, VAC10DATA, VAC10INF, VAC11TIPO, VAC11DATA, VAC11INF, VAC12TIPO, VAC12DATA, VAC12INF, VAC13TIPO, VAC13DATA, VAC13INF, VAC14TIPO, VAC14DATA, VAC14INF, VAC15TIPO, VAC15DATA, VAC15INF, VAC16TIPO, VAC16DATA, VAC16INF, VAC17TIPO, VAC17DATA, VAC17INF, VAC18TIPO, VAC18DATA, VAC18INF, VAC19TIPO, VAC19DATA, VAC19INF, VAC20TIPO, VAC20DATA, VAC20INF FROM MIF WHERE REG = " + region + " AND TAB = " + tabanca + " AND MOR = " + cluster + " GROUP BY REGID HAVING MIN(ROWID) AND ESTADO = 1 ORDER BY substr(CONT, instr(CONT, 'Y:')+2, 4) || substr('00'|| trim(substr(CONT, instr(CONT, 'M:')+2, 2),','), -2, 2) || substr('00'|| trim(substr(CONT, instr(CONT, 'D:')+2, 2),','), -2, 2) DESC, NOME";
    // Todo - look up in db => callback: populateView;
    persons = [];
    console.log("Querying database for MIFs...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " persons");
        for (var row = 0; row < result.getCount(); row++) {
            var REGID = result.getData(row,"REGID"); // Despite obviously bad naming, this is actually the Person ID
            var NOME = titleCase(result.getData(row,"NOME"));
            var estadovis = result.getData(row,"ESTADOVIS");
            var CART = result.getData(row,"CART");
            var cont = result.getData(row,"CONT");
            var MIFDNASC = result.getData(row,"MIFDNASC");
            var MOR = result.getData(row,"MOR");
            var CASA = result.getData(row,"CASA");
            var FOGAO = result.getData(row,"FOGAO");
            var RELA1 = result.getData(row,"RELA1");
            var RELA1NOME = result.getData(row,"RELA1NOME");
            var gr = result.getData(row,"GR");
            
            var VAC1TIPO = result.getData(row,"VAC1TIPO");
            var VAC1DATA = result.getData(row,"VAC1DATA");
            var VAC1INF = result.getData(row,"VAC1INF");
            var VAC2TIPO = result.getData(row,"VAC2TIPO");
            var VAC2DATA = result.getData(row,"VAC2DATA");
            var VAC2INF = result.getData(row,"VAC2INF");
            var VAC3TIPO = result.getData(row,"VAC3TIPO");
            var VAC3DATA = result.getData(row,"VAC3DATA");
            var VAC3INF = result.getData(row,"VAC3INF");
            var VAC4TIPO = result.getData(row,"VAC4TIPO");
            var VAC4DATA = result.getData(row,"VAC4DATA");
            var VAC4INF = result.getData(row,"VAC4INF");
            var VAC5TIPO = result.getData(row,"VAC5TIPO");
            var VAC5DATA = result.getData(row,"VAC5DATA");
            var VAC5INF = result.getData(row,"VAC5INF");
            var VAC6TIPO = result.getData(row,"VAC6TIPO");
            var VAC6DATA = result.getData(row,"VAC6DATA");
            var VAC6INF = result.getData(row,"VAC6INF");
            var VAC7TIPO = result.getData(row,"VAC7TIPO");
            var VAC7DATA = result.getData(row,"VAC7DATA");
            var VAC7INF = result.getData(row,"VAC7INF");
            var VAC8TIPO = result.getData(row,"VAC8TIPO");
            var VAC8DATA = result.getData(row,"VAC8DATA");
            var VAC8INF = result.getData(row,"VAC8INF");
            var VAC9TIPO = result.getData(row,"VAC9TIPO");
            var VAC9DATA = result.getData(row,"VAC9DATA");
            var VAC9INF = result.getData(row,"VAC9INF");
            var VAC10TIPO = result.getData(row,"VAC10TIPO");
            var VAC10DATA = result.getData(row,"VAC10DATA");
            var VAC10INF = result.getData(row,"VAC10INF");
            var VAC11TIPO = result.getData(row,"VAC11TIPO");
            var VAC11DATA = result.getData(row,"VAC11DATA");
            var VAC11INF = result.getData(row,"VAC11INF");
            var VAC12TIPO = result.getData(row,"VAC12TIPO");
            var VAC12DATA = result.getData(row,"VAC12DATA");
            var VAC12INF = result.getData(row,"VAC12INF");
            var VAC13TIPO = result.getData(row,"VAC13TIPO");
            var VAC13DATA = result.getData(row,"VAC13DATA");
            var VAC13INF = result.getData(row,"VAC13INF");
            var VAC14TIPO = result.getData(row,"VAC14TIPO");
            var VAC14DATA = result.getData(row,"VAC14DATA");
            var VAC14INF = result.getData(row,"VAC14INF");
            var VAC15TIPO = result.getData(row,"VAC15TIPO");
            var VAC15DATA = result.getData(row,"VAC15DATA");
            var VAC15INF = result.getData(row,"VAC15INF");
            var VAC16TIPO = result.getData(row,"VAC16TIPO");
            var VAC16DATA = result.getData(row,"VAC16DATA");
            var VAC16INF = result.getData(row,"VAC16INF");
            var VAC17TIPO = result.getData(row,"VAC17TIPO");
            var VAC17DATA = result.getData(row,"VAC17DATA");
            var VAC17INF = result.getData(row,"VAC17INF");
            var VAC18TIPO = result.getData(row,"VAC18TIPO");
            var VAC18DATA = result.getData(row,"VAC18DATA");
            var VAC18INF = result.getData(row,"VAC18INF");
            var VAC19TIPO = result.getData(row,"VAC19TIPO");
            var VAC19DATA = result.getData(row,"VAC19DATA");
            var VAC19INF = result.getData(row,"VAC19INF");
            var VAC20TIPO = result.getData(row,"VAC20TIPO");
            var VAC20DATA = result.getData(row,"VAC20DATA");
            var VAC20INF = result.getData(row,"VAC20INF");

            var p = { type: 'mif', REGID, NOME, gr, estadovis, CART, cont, MIFDNASC, MOR, CASA, FOGAO, RELA1, RELA1NOME, VAC1TIPO, VAC1DATA, VAC1INF, VAC2TIPO, VAC2DATA, VAC2INF, VAC3TIPO, VAC3DATA, VAC3INF, VAC4TIPO, VAC4DATA, VAC4INF, VAC5TIPO, VAC5DATA, VAC5INF, VAC6TIPO, VAC6DATA, VAC6INF, VAC7TIPO, VAC7DATA, VAC7INF, VAC8TIPO, VAC8DATA, VAC8INF, VAC9TIPO, VAC9DATA, VAC9INF, VAC10TIPO, VAC10DATA, VAC10INF, VAC11TIPO, VAC11DATA, VAC11INF, VAC12TIPO, VAC12DATA, VAC12INF, VAC13TIPO, VAC13DATA, VAC13INF, VAC14TIPO, VAC14DATA, VAC14INF, VAC15TIPO, VAC15DATA, VAC15INF, VAC16TIPO, VAC16DATA, VAC16INF, VAC17TIPO, VAC17DATA, VAC17INF, VAC18TIPO, VAC18DATA, VAC18INF, VAC19TIPO, VAC19DATA, VAC19INF, VAC20TIPO, VAC20DATA, VAC20INF };
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
    var sql = "SELECT REGIDC, NOME, REGID, pres, CARTVAC, CONT, OUTDATE, SEX, NOMEMAE, MOR, CASA, FOGAO, BCG, POLIONAS, POLIO1, PENTA1, PCV1, ROX1, POLIO2, PENTA2, PCV2, ROX2, POLIO3, PENTA3, PCV3, VPI, SARAMPO1, FEBAMAREL FROM CRIANCA  WHERE REG = " + region + " AND TAB = " + tabanca + " AND MOR = " + cluster + " GROUP BY REGIDC HAVING MIN(ROWID) AND ESTADO = 1  ORDER BY substr(CONT, instr(CONT, 'Y:')+2, 4) || substr('00'|| trim(substr(CONT, instr(CONT, 'M:')+2, 2),','), -2, 2) || substr('00'|| trim(substr(CONT, instr(CONT, 'D:')+2, 2),','), -2, 2) DESC, NOME";
    children = [];
    console.log("Querying database for CRIANCAs...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " children");
        for (var row = 0; row < result.getCount(); row++) {

            var REGIDC = result.getData(row,"REGIDC");
            var NOME = titleCase(result.getData(row,"NOME"));
            var REGID = result.getData(row,"REGID"); // This is now the mother's id (go figure)
            var pres = result.getData(row,"PRES");
            var CARTVAC = result.getData(row,"CARTVAC");
            var CONT = result.getData(row,"CONT");
            var OUTDATE = result.getData(row,"OUTDATE");
            var SEX = result.getData(row,"SEX");
            var NOMEMAE = result.getData(row,"NOMEMAE");
            var MOR = result.getData(row,"MOR");
            var CASA = result.getData(row,"CASA");
            var FOGAO = result.getData(row,"FOGAO");
           
            var BCG = result.getData(row,"BCG");
            var POLIONAS = result.getData(row,"POLIONAS");
            var POLIO1 = result.getData(row,"POLIO1");
            var PENTA1 = result.getData(row,"PENTA1");
            var PCV1 = result.getData(row,"PCV1");
            var ROX1 = result.getData(row,"ROX1");
            var POLIO2 = result.getData(row,"POLIO2");
            var PENTA2 = result.getData(row,"PENTA2");
            var PCV2 = result.getData(row,"PCV2");
            var ROX2 = result.getData(row,"ROX2");
            var POLIO3 = result.getData(row,"POLIO3");
            var PENTA3 = result.getData(row,"PENTA3");
            var PCV3 = result.getData(row,"PCV3");
            var VPI = result.getData(row,"VPI");
            var SARAMPO1 = result.getData(row,"SARAMPO1");
            var FEBAMAREL = result.getData(row,"FEBAMAREL");

            var p = { type: 'crianca', REGIDC, NOME, REGID, pres, CARTVAC, CONT, OUTDATE, SEX, NOMEMAE, MOR, CASA, FOGAO, BCG, POLIONAS, POLIO1, PENTA1, PCV1, ROX1, POLIO2, PENTA2, PCV2, ROX2, POLIO3, PENTA3, PCV3, VPI, SARAMPO1, FEBAMAREL };
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

function loadPregnancies() {
    // SQL to load pregnancies
    var sql = "SELECT LMP_M, OUTSTATUS  FROM GRAVIDA_VISIT  WHERE REGID = " + REGID + " GROUP BY REGID HAVING MIN(ROWID) AND  ORDER BY substr(CONT, instr(CONT, 'Y:')+2, 4) || substr('00'|| trim(substr(CONT, instr(CONT, 'M:')+2, 2),','), -2, 2) || substr('00'|| trim(substr(CONT, instr(CONT, 'D:')+2, 2),','), -2, 2) DESC";
    pregnancies = [];
    console.log("Querying database for GRAVIDA_VISIT...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " pregnancies");
        for (var row = 0; row < result.getCount(); row++) {

            //var REGID = result.getData(row,"REGID"); // This is now the mother's id (go figure)
            var LMP_M = result.getData(row,"LMP_M");
            var OUTSTATUS = result.getData(row,"OUTSTATUS");

            var p = { type: 'gravida', LMP_M, OUTSTATUS };
            console.log(p);
            pregnancies.push(p);
        }
        populateView();
        return;
    }
    var failureFn = function( errorMsg ) {
        console.error('Failed to get pregnancies from database: ' + errorMsg);
        console.error('Trying to execute the following SQL:');
        console.error(sql);
        alert("Program error Unable to look up pregnancies.");
    }

    odkData.arbitraryQuery('GRAVIDA_VISIT', sql, null, null, null, successFn, failureFn);
}

function populateView() {
    
    console.log("MIFS:");
    console.log(persons);
    
    console.log("CHILDREN:");
    console.log(children);
    
    var personsAndChildren = [];
    persons.forEach(mif => {
        personsAndChildren.push(mif);
        var thisMifsChildren = children.splice(children.findIndex(child => child.REGID == mif.REGID),1); // this also removes the matched children from the children list
        thisMifsChildren.forEach(child => {
            personsAndChildren.push(child);
        });
    });

    console.log(personsAndChildren);

    // Add any remaining (orphaned) children (to the beginning of the list - hence 'unshift')
    children.forEach(child => {
        personsAndChildren.unshift(child);        
    });

    var ul = $('#persons');
    $.each(personsAndChildren, function() {
        console.log(this);
        var that = this;
        var visited = this.visited ? 'visited' : '';
        
        ul.append($("<li />").append($("<button />").attr('id',this.REGID + '_' + this.REGIDC).attr('class',visited + ' btn ' + this.type).text(this.NOME)));
        
        var btn = ul.find('#' + this.REGID + '_' + this.REGIDC);
        btn.on("click", function() {
            openForm(that.type, that);
        })
    });
// Set values for new child/mif
    var defaults = {};
    defaults['MOR'] = cluster;
    defaults['REG'] = region;
    defaults['TAB'] = tabanca;
    defaults['VISITTYPE'] = visitType;
    defaults['ASSISTENTE'] = assistant;
    defaults['CONT'] = date; // today's date

// Adds button for new MIF
    ul.append($("<li />").append($("<button />").attr('id','new' + '_' + 'mif').attr('class', ' btn ' + 'mif').text('Nova Mulher')));
    var btn = ul.find('#' + 'new' + '_' + 'mif');
        btn.on("click", function() {
            odkTables.addRowWithSurvey(
                null,
                'MIF',
                'MIF',
                null,
                defaults);
        })

// Adds buttin for new CRIANCA
    ul.append($("<li />").append($("<button />").attr('id','new' + '_' + 'crianca').attr('class', ' btn ' + 'crianca').text('Novo Crianca')));
    var btn = ul.find('#' + 'new' + '_' + 'crianca');
        btn.on("click", function() {
            odkTables.addRowWithSurvey(
                null,
                'CRIANCA',
                'CRIANCA',
                null,
                defaults);
        })
    console.log("Opening form with:", defaults);
 
}


function getDefaultsMIF(person) {
    var defaults = {};
    defaults['MOR'] = cluster;
    defaults['REG'] = region;
    defaults['TAB'] = tabanca;
    defaults['VISITTYPE'] = visitType;
    defaults['ASSISTENTE'] = assistant;
    defaults['CONT'] = date; // today's date
    defaults['REGID'] = person.REGID;
    defaults['NOME'] = person.NOME;
    defaults['gr'] = person.gr;
    
    defaults['estadovis'] = person.estadovis;
    defaults['CART'] = person.CART;
    defaults['cont'] = person.cont; // date of last visit TODO: rename in form: lastvisitdate
    defaults['MIFDNASC'] = person.MIFDNASC;
    defaults['MOR'] = person.MOR;
    defaults['CASA'] = person.CASA;
    defaults['FOGAO'] = person.FOGAO;
    defaults['RELA1'] = person.RELA1;
    defaults['RELA1NOME'] = person.RELA1NOME;
    defaults['VAC1TIPO'] = person.VAC1TIPO;
    defaults['VAC1DATA'] = person.VAC1DATA;
    defaults['VAC1INF'] = person.VAC1INF;
    defaults['VAC2TIPO'] = person.VAC2TIPO;
    defaults['VAC2DATA'] = person.VAC2DATA;
    defaults['VAC2INF'] = person.VAC2INF;
    defaults['VAC3TIPO'] = person.VAC3TIPO;
    defaults['VAC3DATA'] = person.VAC3DATA;
    defaults['VAC3INF'] = person.VAC3INF;
    defaults['VAC4TIPO'] = person.VAC4TIPO;
    defaults['VAC4DATA'] = person.VAC4DATA;
    defaults['VAC4INF'] = person.VAC4INF;
    defaults['VAC5TIPO'] = person.VAC5TIPO;
    defaults['VAC5DATA'] = person.VAC5DATA;
    defaults['VAC5INF'] = person.VAC5INF;
    defaults['VAC6TIPO'] = person.VAC6TIPO;
    defaults['VAC6DATA'] = person.VAC6DATA;
    defaults['VAC6INF'] = person.VAC6INF;
    defaults['VAC7TIPO'] = person.VAC7TIPO;
    defaults['VAC7DATA'] = person.VAC7DATA;
    defaults['VAC7INF'] = person.VAC7INF;
    defaults['VAC8TIPO'] = person.VAC8TIPO;
    defaults['VAC8DATA'] = person.VAC8DATA;
    defaults['VAC8INF'] = person.VAC8INF;
    defaults['VAC9TIPO'] = person.VAC9TIPO;
    defaults['VAC9DATA'] = person.VAC9DATA;
    defaults['VAC9INF'] = person.VAC9INF;
    defaults['VAC10TIPO'] = person.VAC10TIPO;
    defaults['VAC10DATA'] = person.VAC10DATA;
    defaults['VAC10INF'] = person.VAC10INF;
    defaults['VAC11TIPO'] = person.VAC11TIPO;
    defaults['VAC11DATA'] = person.VAC11DATA;
    defaults['VAC11INF'] = person.VAC11INF;
    defaults['VAC12TIPO'] = person.VAC12TIPO;
    defaults['VAC12DATA'] = person.VAC12DATA;
    defaults['VAC12INF'] = person.VAC12INF;
    defaults['VAC13TIPO'] = person.VAC13TIPO;
    defaults['VAC13DATA'] = person.VAC13DATA;
    defaults['VAC13INF'] = person.VAC13INF;
    defaults['VAC14TIPO'] = person.VAC14TIPO;
    defaults['VAC14DATA'] = person.VAC14DATA;
    defaults['VAC14INF'] = person.VAC14INF;
    defaults['VAC15TIPO'] = person.VAC15TIPO;
    defaults['VAC15DATA'] = person.VAC15DATA;
    defaults['VAC15INF'] = person.VAC15INF;
    defaults['VAC16TIPO'] = person.VAC16TIPO;
    defaults['VAC16DATA'] = person.VAC16DATA;
    defaults['VAC16INF'] = person.VAC16INF;
    defaults['VAC17TIPO'] = person.VAC17TIPO;
    defaults['VAC17DATA'] = person.VAC17DATA;
    defaults['VAC17INF'] = person.VAC17INF;
    defaults['VAC18TIPO'] = person.VAC18TIPO;
    defaults['VAC18DATA'] = person.VAC18DATA;
    defaults['VAC18INF'] = person.VAC18INF;
    defaults['VAC19TIPO'] = person.VAC19TIPO;
    defaults['VAC19DATA'] = person.VAC19DATA;
    defaults['VAC19INF'] = person.VAC19INF;
    defaults['VAC20TIPO'] = person.VAC20TIPO;
    defaults['VAC20DATA'] = person.VAC20DATA;
    defaults['VAC20INF'] = person.VAC20INF;
    return defaults;
}

function getDefaultsChild(person) {
    var defaults = {};
    defaults['MOR'] = cluster;
    defaults['REG'] = region;
    defaults['TAB'] = tabanca;
    defaults['VISITTYPE'] = visitType;
    defaults['ASSISTENTE'] = assistant;
    defaults['CONT'] = date; // today's date
    defaults['REGIDC'] = person.REGIDC;
    defaults['NOME'] = person.NOME;
    defaults['REGID'] = person.REGID;
    
    defaults['pres'] = person.pres;
    defaults['CARTVAC'] = person.CARTVAC;
    defaults['lastvisitdate'] = person.CONT; // date of last visit
    defaults['OUTDATE'] = person.OUTDATE;
    defaults['SEX'] = person.SEX;
    defaults['NOMEMAE'] = person.NOMEMAE;
    defaults['MOR'] = person.MOR;
    defaults['CASA'] = person.CASA;
    defaults['FOGAO'] = person.FOGAO;
    defaults['BCG'] = person.BCG;
    defaults['POLIONAS'] = person.POLIONAS;
    defaults['POLIO1'] = person.POLIO1;
    defaults['PENTA1'] = person.PENTA1;
    defaults['PCV1'] = person.PCV1;
    defaults['ROX1'] = person.ROX1;
    defaults['POLIO2'] = person.POLIO2;
    defaults['PENTA2'] = person.PENTA2;
    defaults['PCV2'] = person.PCV2;
    defaults['ROX2'] = person.ROX2;
    defaults['POLIO3'] = person.POLIO3;
    defaults['PENTA3'] = person.PENTA3;
    defaults['PCV3'] = person.PCV3;
    defaults['VPI'] = person.VPI;
    defaults['SARAMPO1'] = person.SARAMPO1;
    defaults['FEBAMAREL'] = person.FEBAMAREL;
    defaults['VISITTYPE'] = visitType;
    return defaults;
}

function getDefaultsPregnancy(person) {
    var defaults = {};
    defaults['outdate'] = person.OUTDATE;
    defaults['outstatus'] = person.OUTSTATUS;
    return defaults;
}

function openForm(type, person) {
    console.log("Preparing form for ", person);
    var personId = person.REGID;
    //alert("Opening " + type + " form for person id: " + personId);
    // Look up person
    // Open form
    var defaults = {};
    var pregnancy = {};
    var mif = {};
    var tableId = "mif" == type ? "MIF" : "CRIANCA";
    var formId = "mif" == type ? "MIF" : "CRIANCA";
    if ("mif" == type) {
        // It's a MIF
        mif = getDefaultsMIF(person);
        pregnancy = getDefaultsPregnancy(person);
        defaults = Object.assign({}, mif, pregnancy);
    } else {
        // It's a child
        defaults = getDefaultsChild(person);
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