/**
 * Responsible for rendering the select region/sector/tabanca screen.
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var selReg, selTab, selAss, btnControl, btnRoutine, regNames;
var t = []; // This will hold the tabancas read from database

function display() {
    doSanityCheck();
    initButtons();
    var body = $('#main');
    // Set the background to be a picture.
    body.css('background-image', 'url(img/bafata.jpg)');
}

// SELECT REG, REGNOME, TAB, TABNOME, MOR, MORNOME, GRUPO FROM MORLIST;
// SELECT DISTINCT REG, REGNOME, TAB, TABNOME FROM MORLIST ORDER BY REGNOME, TABNOME;
function loadTabancas() {
    console.log("Querying database...");
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " tabancas");
        for (var row = 0; row < result.getCount(); row++) {
            //var id = result.getData(row,"_id"); // or _row_etag
            var REG = result.getData(row,"REG");
            var REGNOME =  result.getData(row,"REGNOME");
            var TAB =  result.getData(row,"TAB");
            var TABNOME =  result.getData(row,"TABNOME");            
            t.push({regId: REG, regName: REGNOME, tabId: TAB, tabName: TAB + ' - ' + TABNOME});
        }
        regNames = [ ...new Set(t.map(x=>x.regName)) ];
        initDrops();
        return;
    }

    var failureFn = function( errorMsg ) {
        console.error('Failed to get tabancas from database: ' + errorMsg);
        alert('Failed to get tabancas from database: ' + errorMsg);
    }

    var sql = 'SELECT DISTINCT REG, REGNOME, TAB, TABNOME FROM MORLIST ORDER BY REGNOME, TABNOME'    
    odkData.arbitraryQuery('QPS', sql, null, null, null, successFn, failureFn);
}

function doSanityCheck() {
    console.log("Checking things");
    console.log(odkData);
}

function initButtons() {
    btnRoutine = $('#btnRoutine');
    btnRoutine.on("click", function() {
        var assistant = selAss.val();
        if (!assistant || assistant < 0) {
            selAss.css('background-color','pink');
            return false;
        }
        var selected_region = selReg.val();
        var selected_tabanca = selTab.val();    
        var visitType = "routine";
        var queryParams = util.setQuerystringParams(selected_region, selected_tabanca, assistant, visitType);
        if (util.DEBUG) top.location = 'listClusters.html' + queryParams;
        odkTables.launchHTML(null,  'config/assets/listClusters.html' + queryParams);
    });

    btnControl = $('#btnControl');
    btnControl.on("click", function() {
        var selected_region = selReg.val();
        var selected_tabanca = selTab.val();    
        var assistant = selAss.val();
        if (!assistant || assistant < 0) {
            selAss.css('background-color','pink');
            return false;
        }
        var visitType = "control";
        var queryParams = util.setQuerystringParams(selected_region, selected_tabanca, assistant, visitType);
        if (DEBUG) top.location = 'listClusters.html' + queryParams;
        odkTables.launchHTML(null,  'config/assets/listClusters.html' + queryParams);
    });
    btnRoutine.attr("disabled","disabled");
    btnControl.attr("disabled","disabled");

    // var btnControl = document.createElement("button");
    // btnControl.setAttribute("id", "btnControl");
    // btnControl.innerHTML = "Rutina";

    // btnControl.onclick = function() {
    //     odkTables.launchHTML(null,  'config/assets/controlVisit.html');
    // }
    // document.getElementById("wrapper").appendChild(btnControl);

}


function initDrops() {

    //var selReg = document.getElementById('selRegion');
    selReg = $('#selRegion');
    selTab = $('#selTabanca');
    selAss = $('#selAssistant');
    selAss.append($("<option />").val(-1).text(""));
    $.each(assistants, function() {
        selAss.append($("<option />").val(this.no).text(this.name));
    })

    selReg.append($("<option />").val(-1).text(""));
    $.each(regNames, function() {
        selReg.append($("<option />").val(this).text(this));
    });

    selTab[0].options.length = 0;
    selTab.append($("<option />").val(-1).text(""));
    selTab.add(getOption("Tabanca",0));
    selTab.attr('disabled', 'disabled');
    
    selReg.on("change", function() {
        populateTabancas(selReg.val());
    });

    selTab.on("change", function() {
        console.log("Go ahead with " + selReg.val());
        btnRoutine.removeAttr("disabled");
        btnControl.removeAttr("disabled");
    });
}

function populateTabancas(reg) {
    selTab[0].options.length = 0;
    selTab.append($("<option />").val(-1).text(""));
    var tabs = t.filter(x => x.regName == reg);
    $.each(tabs, function() {
        selTab.append($("<option />").val(this.tabId).text(this.tabName));
    });
    
    selTab.removeAttr("disabled");
    
    btnRoutine.attr("disabled","disabled");
    btnControl.attr("disabled","disabled");
    
}

function getOption(name,valle) {
    var option = document.createElement("option");
    option.text = name;
    option.value = valle;
    return option;
}

// ********************************** ASSISTANT LIST BELOW **********************************
// ********************************** ASSISTANT LIST BELOW **********************************
// ********************************** ASSISTANT LIST BELOW **********************************
var assistants = [];
assistants.push({no: 1, name: 'Andy'});
assistants.push({no: 2, name: 'Carly'});

