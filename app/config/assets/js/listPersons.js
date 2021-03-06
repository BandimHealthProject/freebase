/**
 * Responsible for rendering the select person (be it woman/child) for control/routine visits
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var persons, children, mul, visitType, cluster, assistant, region, tabanca, date, amostra;
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
    body.css('background-size', 'cover');
    getMul();
    loadPersons();
}


// This handy SQL makes adates sortable: 
// substr(CONT, instr(CONT, 'Y:')+2, 4) || substr('00'|| trim(substr(CONT, instr(CONT, 'M:')+2, 2),","), -2, 2) || substr('00'|| trim(substr(CONT, instr(CONT, 'D:')+2, 2),","), -2, 2) AS D,

function loadPersons() {
    // SQL to get women (MIF)
    var varNames = "_savepoint_type, _id, REGID, CART, CASA, CICA, CONSENTSIG, CONT, ESTADO, ESTADOVIS, FOGAO, GR, MIFDNASC, MUL, NOME, RELA1, RELA1NOME, VAC1TIPO, VAC1DATA, VAC1INF, VAC2TIPO, VAC2DATA, VAC2INF, VAC3TIPO, VAC3DATA, VAC3INF, VAC4TIPO, VAC4DATA, VAC4INF, VAC5TIPO, VAC5DATA, VAC5INF, VAC6TIPO, VAC6DATA, VAC6INF, VAC7TIPO, VAC7DATA, VAC7INF, VAC8TIPO, VAC8DATA, VAC8INF, VAC9TIPO, VAC9DATA, VAC9INF, VAC10TIPO, VAC10DATA, VAC10INF, VAC11TIPO, VAC11DATA, VAC11INF, VAC12TIPO, VAC12DATA, VAC12INF, VAC13TIPO, VAC13DATA, VAC13INF, VAC14TIPO, VAC14DATA, VAC14INF, VAC15TIPO, VAC15DATA, VAC15INF, VAC16TIPO, VAC16DATA, VAC16INF, VAC17TIPO, VAC17DATA, VAC17INF, VAC18TIPO, VAC18DATA, VAC18INF, VAC19TIPO, VAC19DATA, VAC19INF, VAC20TIPO, VAC20DATA, VAC20INF";
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
        " GROUP BY REGID" +
        " ORDER BY CASA, FOGAO, MUL ASC";
    // Todo - look up in db => callback: populateView;
    persons = [];
    console.log("Querying database for MIFs...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " persons");
        for (var row = 0; row < result.getCount(); row++) {
            var savePoint = result.getData(row,"_savepoint_type");

            var rowId = result.getData(row,"_id").slice(5); // rowId from sql table
            var REGID = result.getData(row,"REGID"); // Despite obviously bad naming, this is actually the Person ID
            
            var CART = result.getData(row,"CART");
            var CASA = result.getData(row,"CASA");
            var CICA = result.getData(row,"CICA");
            var CONSENTSIG = result.getData(row,"CONSENTSIG");
            var CONT = result.getData(row,"CONT");
            var ESTADO = result.getData(row,"ESTADO");
            var ESTADOVIS = result.getData(row,"ESTADOVIS");
            var FOGAO = result.getData(row,"FOGAO");
            var GR = result.getData(row,"GR");
            var MIFDNASC = result.getData(row,"MIFDNASC");
            var MUL = result.getData(row,"MUL");
            var NOME = titleCase(result.getData(row,"NOME"));
            var RELA1 = result.getData(row,"RELA1");
            var RELA1NOME = titleCase(result.getData(row,"RELA1NOME"));
            
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
            
            var p = {type: 'mif', savePoint, rowId, REGID, CART, CASA, CICA, CONSENTSIG, CONT, ESTADO, ESTADOVIS, FOGAO, GR, MIFDNASC, MUL, NOME, RELA1, RELA1NOME, VAC1TIPO, VAC1DATA, VAC1INF, VAC2TIPO, VAC2DATA, VAC2INF, VAC3TIPO, VAC3DATA, VAC3INF, VAC4TIPO, VAC4DATA, VAC4INF, VAC5TIPO, VAC5DATA, VAC5INF, VAC6TIPO, VAC6DATA, VAC6INF, VAC7TIPO, VAC7DATA, VAC7INF, VAC8TIPO, VAC8DATA, VAC8INF, VAC9TIPO, VAC9DATA, VAC9INF, VAC10TIPO, VAC10DATA, VAC10INF, VAC11TIPO, VAC11DATA, VAC11INF, VAC12TIPO, VAC12DATA, VAC12INF, VAC13TIPO, VAC13DATA, VAC13INF, VAC14TIPO, VAC14DATA, VAC14INF, VAC15TIPO, VAC15DATA, VAC15INF, VAC16TIPO, VAC16DATA, VAC16INF, VAC17TIPO, VAC17DATA, VAC17INF, VAC18TIPO, VAC18DATA, VAC18INF, VAC19TIPO, VAC19DATA, VAC19INF, VAC20TIPO, VAC20DATA, VAC20INF };
            
            if (ESTADO == 1 | CONT == date) {
                persons.push(p);
            }
            
        }
        console.log("loadPersons:", persons);
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
    var varNames = "_savepoint_type, _id, REGID, REGIDC, CARTVAC, CASA, COMSUP, CONT, ESTADO, FOGAO, MOMA, NOC, NOME, NOMEMAE, ONEYEAR, OUTDATE, PAMA, PRES, SEX, BCG, POLIONAS, POLIO1, PENTA1, PCV1, ROX1, POLIO2, PENTA2, PCV2, ROX2, POLIO3, PENTA3, PCV3, VPI, SARAMPO1, FEBAMAREL, VACOU1, VACOU1TIPO, VACOU2, VACOU2TIPO, VACOU3, VACOU3TIPO, VACOU4, VACOU4TIPO, VACOU5, VACOU5TIPO";
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
            var savePoint = result.getData(row,"_savepoint_type");
            
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
            var NOC = result.getData(row,"NOC");
            var NOME = titleCase(result.getData(row,"NOME"));
            var NOMEMAE = titleCase(result.getData(row,"NOMEMAE"));
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

            var p = {type: 'crianca', savePoint, rowId, REGID, REGIDC, CARTVAC, CASA, COMSUP, CONT, ESTADO, FOGAO, MOMA, NOC, NOME, NOMEMAE, ONEYEAR, OUTDATE, PAMA, PRES, SEX, BCG, POLIONAS, POLIO1, PENTA1, PCV1, ROX1, POLIO2, PENTA2, PCV2, ROX2, POLIO3, PENTA3, PCV3, VPI, SARAMPO1, FEBAMAREL, VACOU1, VACOU1TIPO, VACOU2, VACOU2TIPO, VACOU3, VACOU3TIPO, VACOU4, VACOU4TIPO, VACOU5, VACOU5TIPO};
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
    // New function for matching women and children
    console.log("MIFS:", persons);
    console.log("CHILDREN:", children); // this array will only contain non-matched children, because of 'splice'
    
    var personList = [];
    persons.forEach(function(woman) {
        personList.push(woman);
        var thisWomansChildren = children.filter(function(obj) {
            return obj.REGID == woman.REGID;
        });
        thisWomansChildren.forEach(function(child) {
            personList.push(child);
            children.splice(children.findIndex(function(obj) {
                return obj.REGID == woman.REGID;
            }), 1);
        });
    });

    // Add any remaining (orphaned) children to the beginning of the list - hence 'unshift'
    children.forEach(function(child) {  
        personList.unshift(child);     
    });
    console.log('personList', personList);

    var ul = $('#persons');
    $.each(personList, function() {
        console.log(this);
        var that = this;
        var visited = '';
        if (this.CONT == date & this.savePoint === "COMPLETE") {
            visited = "visited";
        };

        // set text to display
        var displayText = setDisplayText(this);
        
        
        // Assigning diffrent buttons
        if (this.type == "mif") {
            if (this.GR == "1") {
                ul.append($("<li />").append($("<button />").attr('id',this.REGID + '_' + this.REGIDC).attr('class',visited + this.type + 'gr' + ' btn ' + this.type + 'gr').append(displayText)));
            } else {
                ul.append($("<li />").append($("<button />").attr('id',this.REGID + '_' + this.REGIDC).attr('class',visited + this.type + ' btn ' + this.type).append(displayText)));
            }
        } else if (this.type == "crianca" & (this.SEX == "1" | this.SEX == "2")) {
            ul.append($("<li />").append($("<button />").attr('id',this.REGID + '_' + this.REGIDC).attr('class',visited + this.type + ' btn ' + this.type + this.SEX).append(displayText)));
        } else {
            ul.append($("<li />").append($("<button />").attr('id',this.REGID + '_' + this.REGIDC).attr('class',visited + this.type + ' btn ' + this.type).append(displayText)));
        }
                
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
    defaults['AMO'] = amostra;
    defaults['VISITTYPE'] = visitType;
    defaults['ASSISTENTE'] = assistant;
    defaults['CONT'] = date; // today's date
    defaults['REGDIA'] = date;
    defaults['MUL'] = mul;

// Add button for new MIF
    ul.append($("<li />").append($("<button />").attr('id','new' + '_' + 'mif').attr('class', ' btn ' + 'mifnew').text('Nova mulher')));
    var btn = ul.find('#' + 'new' + '_' + 'mif');
        btn.on("click", function() {
            console.log("Opening form with:", defaults);
            odkTables.addRowWithSurvey(
                null,
                'MIF',
                'MIF',
                null,
                defaults);
        })
// Add button for new CRIANCA
    ul.append($("<li />").append($("<button />").attr('id','new' + '_' + 'crianca').attr('class', ' btn ' + 'criancanew').text('Novo criança')));
    var btn = ul.find('#' + 'new' + '_' + 'crianca');
        btn.on("click", function() {
            var queryParams = util.setQuerystringParams(region, tabanca, assistant, visitType, date, amostra, cluster);
            odkTables.launchHTML(null, 'config/assets/listWomen.html' + queryParams);
        })
// Add button for moving CRIANCA to other woman
    ul.append($("<li />").append($("<button />").attr('id','move' + '_' + 'crianca').attr('class', ' btn ' + 'criancanew').text('Mudar criança para outra mulher')));
    var btn = ul.find('#' + 'move' + '_' + 'crianca');
        btn.on("click", function() {
            var queryParams = util.setQuerystringParams(region, tabanca, assistant, visitType, date, amostra, cluster);
            odkTables.launchHTML(null, 'config/assets/moveChild.html' + queryParams);
        })
}

function getMul() {
    var sql = "select MAX(MUL) AS MUL FROM MIF WHERE REG==" + region + 
        " AND TAB == "+ tabanca +" AND MOR ==" + cluster;
    //console.log("Querying database for getMul...");
    //console.log(sql);
    var successFn = function(result) {
        var maxMul = Number(result.getData(0,"MUL")) + 1;
        mul = maxMul;
        //console.log("maxMul:", maxMul);
        return;
    }
    var failureFn = function( errorMsg ) {
        //console.error('Failed to get mul from database: ' + errorMsg);
        //console.error('Trying to execute the following SQL:');
        //console.error(sql);
        //alert("Program error Unable to look up getMul.");
    }
    odkData.arbitraryQuery('MIF', sql, null, null, null, successFn, failureFn);
    return;
}

function setDisplayText(person) {
    var displayText;
    if (person.type == 'mif') {
        var nome = person.NOME === null ? "Não sabe" : person.NOME;
        var casa = person.CASA === null ? "??" : person.CASA;
        var fogao = person.FOGAO === null ? "??" : person.FOGAO;
        var mul = person.MUL === null ? "??" : person.MUL;
        var relanome = person.RELA1NOME === null ? "????" : person.RELA1NOME;
        var rela;
        if (person.RELA1 == 1) {
            rela = "Mãe";
        } else if (person.RELA1 == 2) {
            rela = "Pai";
        } else if (person.RELA1 == 3) {
            rela = "Marido";
        } else if (person.RELA1 == 4) {
            rela = "Irmã/irmão";
        } else if (person.RELA1 == 5) {
            rela = "Tia/tio";
        } else if (person.RELA1 == 6) {
            rela = "Outra/o";
        } else {
            rela = "??";
        };
       
        displayText = "Nome: <b>" + nome + "</b> [" + mul + "] | Casa: " + casa + ", Fogao: " + fogao + "<br />" +
            "Relação: " + rela + ": " + relanome;
            
    }
    if (person.type == 'crianca') {
        var nome = person.NOME === null ? "Não sabe" : person.NOME; 
        var noc = person.NOC === null ? "??" : person.NOC;
        var nasc;
        if (person.OUTDATE == "D:NS,M:NS,Y:NS" | person.OUTDATE == null) {
            nasc = "Não sabe";
        } else {
            var d = person.OUTDATE.slice(2, person.OUTDATE.search("M")-1);
            var m = person.OUTDATE.slice(person.OUTDATE.search("M")+2, person.OUTDATE.search("Y")-1);
            var y = person.OUTDATE.slice(person.OUTDATE.search("Y")+2);   
            nasc = d + "/" + m + "/" + y;
        };
    
        displayText = "Nome: <b>" + nome + "</b> [" + noc + "]" + "<br />" +  
            "Nascimento: " + nasc + "<br />";
    }    
    return displayText;
}

function getDefaultsMIF(person) {
    var defaults = {};
    defaults['REGID'] = person.REGID;
    
    defaults['AMO'] = amostra;    
    defaults['ASSISTENTE'] = assistant;
    defaults['CONT'] = date; // today's date
    defaults['MOR'] = cluster;
    defaults['REG'] = region;
    defaults['TAB'] = tabanca;
    defaults['VISITTYPE'] = visitType;

    defaults['CART'] = person.CART;
    defaults['CASA'] = person.CASA;
    defaults['CICA'] = person.CICA;
    defaults['CONSENTSIG'] = person.CONSENTSIG;
    defaults['FOGAO'] = person.FOGAO;
    defaults['gr'] = person.GR;
    defaults['LASTVISITDATE'] = person.CONT; // date of last visit
    defaults['lastvisitestado'] = person.ESTADOVIS;
    defaults['MIFDNASC'] = person.MIFDNASC;
    defaults['MUL'] = person.MUL;
    defaults['NOME'] = person.NOME;
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
    defaults['LASTVISITDATE'] = person.CONT; // date of last visit
    defaults['moma'] = person.MOMA;
    defaults['NOC'] = person.NOC;
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
    //alert("Opening " + type + " form for person id: " + personId);
    // Look up person
    // Open form
    var defaults = {};
    var tableId = "mif" == type ? "MIF" : "CRIANCA";
    var formId = "mif" == type ? "MIF" : "CRIANCA";
    var rowId = "uuid:" + person.rowId;
    if ("mif" == type) {
        // It's a MIF
        defaults = getDefaultsMIF(person);
    } else {
        // It's a child
        defaults = getDefaultsChild(person);
    }
    console.log("Opening form with:", defaults);
    if (person.CONT == date) {
        odkTables.editRowWithSurvey(
            null,
            tableId,
            rowId,
            formId,
            null,);
    } else {
        odkTables.addRowWithSurvey(
            null,
            tableId,
            formId,
            null,
            defaults);
    }
}

function titleCase(str) {
    if (!str) return str;
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }