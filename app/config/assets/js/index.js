/**
 * Responsible for rendering the select region/sector/tabanca screen.
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var selReg, selTab, selAss, btnControl, btnRoutine, regions;
var t = []; // This will hold the tabancas read from database

function display() {    
    selReg = $('#selRegion');
    selTab = $('#selTabanca');
    selAss = $('#selAssistant');
    doSanityCheck();
    loadTabancas();
    initButtons();
    // Set the background to be a picture.
    // var body = $('#main');
    // body.css('background-image', 'url(img/bafata.jpg)');
    $('body').first().css('background', 'url(img/bafata.jpg) fixed');
    
    console.log("We got:" + ass + ", " + tab + ", "+ reg);
    var ass = window.localStorage.getItem('ass');
    if (ass) selAss.val(ass);
    var tab = window.localStorage.getItem('tab');
    if (tab) selTab.val(tab);
    var reg = window.localStorage.getItem('reg');
    if (reg) selReg.val(reg);
}

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
        var regNames = [ ...new Set(t.map(x=>x.regName)) ];
        var regIds = [ ...new Set(t.map(x=>x.regId)) ];
        regions = []
        if (regNames.length != regIds.length) {
            alert('Unable to load regions (duplicate region id with different region name?)');
            return;
        }
        for (var i=0;i<regNames.length;i++) {
            regions.push({REG: regIds[i], REGNOME: regNames[i]});
        }
        initDrops();
        return;
    }

    var failureFn = function( errorMsg ) {
        console.error('Failed to get tabancas from database: ' + errorMsg);
        alert('Failed to get tabancas from database: ' + errorMsg);
    }

    var sql = 'SELECT DISTINCT REG, REGNOME, TAB, TABNOME FROM MORLIST ORDER BY REGNOME, TAB';
    odkData.arbitraryQuery('MORLIST', sql, null, null, null, successFn, failureFn);
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
        var region = selReg.val();
        var tabanca = selTab.val();    
        var visitType = "routine";
        var queryParams = util.setQuerystringParams(region, tabanca, assistant, visitType);
        if (util.DEBUG) top.location = 'listClusters.html' + queryParams;
        odkTables.launchHTML(null,  'config/assets/listClusters.html' + queryParams);
    });

    btnControl = $('#btnControl');
    btnControl.on("click", function() {
        var region = selReg.val();
        var tabanca = selTab.val();    
        var assistant = selAss.val();
        if (!assistant || assistant < 0) {
            selAss.css('background-color','pink');
            return false;
        }
        var visitType = "control";
        var queryParams = util.setQuerystringParams(region, tabanca, assistant, visitType);
        if (util.DEBUG) top.location = 'listClusters.html' + queryParams;
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
    
    selAss.append($("<option />").val(-1).text(""));
    $.each(assistants, function() {
        selAss.append($("<option />").val(this.no).text(this.name));
    })

    selReg.append($("<option />").val(-1).text(""));
    $.each(regions, function() {
        // console.log("REGIONS:");
        // console.log(this);
        selReg.append($("<option />").val(this.REG).text(this.REGNOME));
    });

    selTab[0].options.length = 0;
    selTab.append($("<option />").val(-1).text(""));
    selTab.add(getOption("Tabanca",0));
    selTab.attr('disabled', 'disabled');
    
    selReg.on("change", function() {
        populateTabancas(selReg.val());
        console.log("Setting reg..");
        window.localStorage.setItem('reg', selReg.val());
    });

    selTab.on("change", function() {
        // console.log("Go ahead with " + selReg.val());
        window.localStorage.setItem('tab', selTab.val());
        window.localStorage.setItem('ass', selAss.val());
        btnRoutine.removeAttr("disabled");
        btnControl.removeAttr("disabled");
    });
}

function populateTabancas(reg) {
    selTab[0].options.length = 0;
    selTab.append($("<option />").val(-1).text(""));
    var tabs = t.filter(x => x.regId == reg);
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
assistants.push({no: 'Andy', name: 'Andy'});
assistants.push({no: 'Carly', name: 'Carly'});
