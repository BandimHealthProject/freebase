/**
 * Responsible for rendering the select person to move child to
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var persons, children, visitType, cluster, assistant, region, tabanca, date, amostra, regidc;

function display() {
    console.log("Persons list loading");
    visitType = 'move' // Different type of visit   
    cluster = util.getQueryParameter('cluster');
    assistant = util.getQueryParameter('assistant');
    region = util.getQueryParameter('region');
    tabanca = util.getQueryParameter('tabanca');
    date = util.getQueryParameter('date');
    amostra = util.getQueryParameter('amostra');
    regidc = util.getQueryParameter('regidc');
    
    // Set the background to be a picture.
    var body = $('body').first();
    body.css('background', 'url(img/bafata.jpg) fixed');
    body.css('background-size', 'cover');
    loadPersons();
}


// This handy SQL makes adates sortable: 
// substr(CONT, instr(CONT, 'Y:')+2, 4) || substr('00'|| trim(substr(CONT, instr(CONT, 'M:')+2, 2),","), -2, 2) || substr('00'|| trim(substr(CONT, instr(CONT, 'D:')+2, 2),","), -2, 2) AS D,
function loadPersons() {
    // SQL to get women (MIF)
    var varNames = "REGID, NOME, CASA, FOGAO, CONT, ESTADO";
    var sql = "SELECT " + varNames + 
        " FROM (" +
        " SELECT " + varNames + ", REG, TAB, MOR, ESTADO" +
        " FROM MIF " + 
        " ORDER BY " +
        " substr(CONT, instr(CONT, 'Y:')+2, 4) || " +
        " substr('00'|| trim(substr(CONT, instr(CONT, 'M:')+2, 2),','), -2, 2) || " +
        " substr('00'|| trim(substr(CONT, instr(CONT, 'D:')+2, 2),','), -2, 2) ASC" + // For some reason this shold be ASC, but DESC when putting the code in SQL-database viewer
        " ) " +
        " WHERE REG = " + region + " AND TAB = " + tabanca + " AND MOR = " + cluster +
        " GROUP BY REGID HAVING ESTADO = 1" +
        " ORDER BY NOME ASC";
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
            var CONT = result.getData(row,"CONT");
            var ESTADO = result.getData(row,"ESTADO");
            
            var p = { type: 'mif', REGID, NOME, CASA, FOGAO, CONT, ESTADO };
            console.log(p);
            if (ESTADO == 1 | CONT == date) {
                persons.push(p);
            }
        }
        loadChildren(); // Get info about child
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
    var varNames = "_id, REGID, REGIDC, CARTVAC, CASA, COMSUP, CONT, ESTADO, FOGAO, MOMA, NOME, NOMEMAE, ONEYEAR, OUTDATE, PAMA, PRES, SEX, BCG, POLIONAS, POLIO1, PENTA1, PCV1, ROX1, POLIO2, PENTA2, PCV2, ROX2, POLIO3, PENTA3, PCV3, VPI, SARAMPO1, FEBAMAREL, VACOU1, VACOU1TIPO, VACOU2, VACOU2TIPO, VACOU3, VACOU3TIPO, VACOU4, VACOU4TIPO, VACOU5, VACOU5TIPO";
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
        " GROUP BY REGIDC" + 
        " ORDER BY NOME DESC";
    children = [];
    console.log("Querying database for CRIANCAs...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " children");
        for (var row = 0; row < result.getCount(); row++) {
            var rowId = result.getData(row,"_id").slice(5); // rowId from sql table
            var REGID = result.getData(row,"REGID"); // This is now the mother's id (go figure)
            var REGIDC = result.getData(row,"REGIDC");
            
            var CARTVAC = result.getData(row,"CARTVAC");
            var CASA = result.getData(row,"CASA");
            var COMSUP = result.getData(row,"COMSUP");
            var CONT = result.getData(row,"CONT");
            var ESTADO = result.getData(row,"ESTADO");
            var FOGAO = result.getData(row,"FOGAO");
            var MOMA = result.getData(row,"MOMA");
            var NOME = titleCase(result.getData(row,"NOME"));
            var NOMEMAE = result.getData(row,"NOMEMAE");
            var ONEYEAR = result.getData(row,"ONEYEAR");
            var OUTDATE = result.getData(row,"OUTDATE");
            var PAMA = result.getData(row,"PAMA");
            var PRES = result.getData(row,"PRES");
            var SEX = result.getData(row,"SEX");
           
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
            var VACOU1 = result.getData(row,"VACOU1");
            var VACOU1TIPO = result.getData(row,"VACOU1TIPO");
            var VACOU2 = result.getData(row,"VACOU2");
            var VACOU2TIPO = result.getData(row,"VACOU2TIPO");
            var VACOU3 = result.getData(row,"VACOU3");
            var VACOU3TIPO = result.getData(row,"VACOU3TIPO");
            var VACOU4 = result.getData(row,"VACOU4");
            var VACOU4TIPO = result.getData(row,"VACOU4TIPO");
            var VACOU5 = result.getData(row,"VACOU5");
            var VACOU5TIPO = result.getData(row,"VACOU5TIPO");

            var p = {type: 'crianca', rowId, REGID, REGIDC, CARTVAC, CASA, COMSUP, CONT, ESTADO, FOGAO, MOMA, NOME, NOMEMAE, ONEYEAR, OUTDATE, PAMA, PRES, SEX, BCG, POLIONAS, POLIO1, PENTA1, PCV1, ROX1, POLIO2, PENTA2, PCV2, ROX2, POLIO3, PENTA3, PCV3, VPI, SARAMPO1, FEBAMAREL, VACOU1, VACOU1TIPO, VACOU2, VACOU2TIPO, VACOU3, VACOU3TIPO, VACOU4, VACOU4TIPO, VACOU5, VACOU5TIPO};
            console.log(p);
            // If control visit: list children <12m at last visit (variable ONEYEAR !=1)
            if (ESTADO == 11 | CONT == date) {
                if (visitType == "control" & (ONEYEAR != 1 | CONT == date)) {
                    children.push(p);
                }
                else if (visitType == 'routine') {
                    children.push(p);
                }
            }
        }
        console.log("loadChildren:", children);
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
    
    console.log("MIFS:", persons);

    var ul = $('#persons');
    $.each(persons, function() {
        console.log(this);
        var that = this;
        var visited = this.visited ? 'visited' : '';
        
        ul.append($("<li />").append($("<button />").attr('id',this.REGID).attr('class',visited + ' btn ' + this.type).text(this.NOME)));
        
        var btn = ul.find('#' + this.REGID);
        btn.on("click", function() {
            openForm(that.type, that);
        })
    });

    // Set values for new child with no mother or moranca
    var defaults = {};
    defaults['MOR'] = cluster;
    defaults['REG'] = region;
    defaults['TAB'] = tabanca;
    defaults['AMO'] = amostra;
    defaults['VISITTYPE'] = visitType;
    defaults['ASSISTENTE'] = assistant;
    defaults['CONT'] = date; // today's date
    defaults['REGDIA'] = date;
    defaults['REGID'] = "Outro"; // regid på "anden" mor ???

    // Adds button for "anoter MIF"
    ul.append($("<li />").append($("<button />").attr('id','new' + '_' + 'mif').attr('class', ' btn ' + 'mifnew').text('Outro')));
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
    defaults['newregid'] = person.REGID;
    defaults['newnomemae'] = person.NOME; // mother's name
    defaults['newcasa'] = person.CASA;
    defaults['newfogao'] = person.FOGAO;
    defaults['newmor'] = cluster;
    return defaults;
}

function statusMother(MIFid) {
    var statusMIF = null;
    persons.forEach(function(MIF) {
        if (MIF.REGID == MIFid & MIF.CONT == date) {
            statusMIF = MIF.ESTADOVIS;
        }
    });
    return statusMIF;
} 

function getDefaultsChild(person) {
    var defaults = {};
    defaults['REGID'] = person.REGID;
    defaults['REGIDC'] = person.REGIDC;
    
    defaults['AMO'] = amostra;
    defaults['ASSISTENTE'] = assistant;
    defaults['CONT'] = date; // today's date
    defaults['MOR'] = cluster;
    defaults['REG'] = region;
    defaults['TAB'] = tabanca;
    defaults['VISITTYPE'] = visitType;
    
    defaults['CARTVAC'] = person.CARTVAC;
    defaults['CASA'] = person.CASA;
    defaults['comsup'] = person.COMSUP;
    defaults['FOGAO'] = person.FOGAO;
    defaults['lastvisitdate'] = person.CONT; // date of last visit
    defaults['moma'] = person.MOMA;
    defaults['NOME'] = person.NOME;
    defaults['NOMEMAE'] = person.NOMEMAE;
    defaults['ONEYEAR'] = person.ONEYEAR;
    defaults['OUTDATE'] = person.OUTDATE;
    defaults['pama'] = person.PAMA;
    defaults['pres'] = person.PRES;
    defaults['PRESMAE'] = statusMother(person.REGID);
    defaults['SEX'] = person.SEX;
    
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
    defaults['VACOU1'] = person.VACOU1;
    defaults['VACOU1TIPO'] = person.VACOU1TIPO;
    defaults['VACOU2'] = person.VACOU2;
    defaults['VACOU2TIPO'] = person.VACOU2TIPO;
    defaults['VACOU3'] = person.VACOU3;
    defaults['VACOU3TIPO'] = person.VACOU3TIPO;
    defaults['VACOU4'] = person.VACOU4;
    defaults['VACOU4TIPO'] = person.VACOU4TIPO;
    defaults['VACOU5'] = person.VACOU5;
    defaults['VACOU5TIPO'] = person.VACOU5TIPO;
    return defaults;
}

function openForm(type, person) {
    console.log("Preparing form for ", person);
    // Look up person
    // Open form
    var defaults = {};
    var tableId = "CRIANCA";
    var formId = "CRIANCA";
    
    var mifData = getDefaultsMIF(person);
    var childData = getDefaultsChild(children[0]);
    defaults = Object.assign(mifData, childData);
   
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