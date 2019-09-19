/**
 * Responsible for rendering the select region/sector/tabanca screen.
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var selReg, selTab, selAss, btnControl, btnRoutine;

function display() {
    doSanityCheck();
    initDrops();
    initButtons();
    var body = $('#main');
    // Set the background to be a picture.
    body.css('background-image', 'url(img/bafata.jpg)');
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


// *********************************** TABANCA LIST BELOW ***********************************
// *********************************** TABANCA LIST BELOW ***********************************
// *********************************** TABANCA LIST BELOW ***********************************
var t = [];
t.push({regId:1, regName:'Oio', tabId:1, tabName:'1 - Ntchugal'});
t.push({regId:1, regName:'Oio', tabId:2, tabName:'2 - Blas'});
t.push({regId:1, regName:'Oio', tabId:3, tabName:'3 - Colicunda'});
t.push({regId:1, regName:'Oio', tabId:4, tabName:'4 - Wanquilim'});
t.push({regId:1, regName:'Oio', tabId:5, tabName:'5 - Mandingara'});
t.push({regId:1, regName:'Oio', tabId:6, tabName:'6 - Cutia'});
t.push({regId:1, regName:'Oio', tabId:7, tabName:'7 - Rossum'});
t.push({regId:1, regName:'Oio', tabId:9, tabName:'9 - Amedalae'});
t.push({regId:1, regName:'Oio', tabId:10, tabName:'10 - Ntchane'});
t.push({regId:1, regName:'Oio', tabId:11, tabName:'11 - Quinhaque Mansoa'});
t.push({regId:1, regName:'Oio', tabId:12, tabName:'12 - Ntchangue Bideta'});
t.push({regId:1, regName:'Oio', tabId:13, tabName:'13 - Ntchangue Subal'});
t.push({regId:1, regName:'Oio', tabId:14, tabName:'14 - Jogudul Com'});
t.push({regId:1, regName:'Oio', tabId:15, tabName:'15 - Joaquim Com'});
t.push({regId:1, regName:'Oio', tabId:16, tabName:'16 - Cangha Ntchugal'});
t.push({regId:1, regName:'Oio', tabId:17, tabName:'17 - Cangha Cocry'});
t.push({regId:1, regName:'Oio', tabId:18, tabName:'18 - Encheia'});
t.push({regId:1, regName:'Oio', tabId:19, tabName:'19 - Cadjque'});
t.push({regId:1, regName:'Oio', tabId:20, tabName:'20 - Mpas'});
t.push({regId:1, regName:'Oio', tabId:21, tabName:'21 - Quinhaque Ncor'});
t.push({regId:1, regName:'Oio', tabId:22, tabName:'22 - Quinhaque'});
t.push({regId:1, regName:'Oio', tabId:23, tabName:'23 - Untche'});
t.push({regId:1, regName:'Oio', tabId:24, tabName:'24 - Cumbidjam'});
t.push({regId:1, regName:'Oio', tabId:25, tabName:'25 - Sintcham'});
t.push({regId:1, regName:'Oio', tabId:26, tabName:'26 - Sansancutoto'});
t.push({regId:1, regName:'Oio', tabId:27, tabName:'27 - Bironque'});
t.push({regId:1, regName:'Oio', tabId:28, tabName:'28 - Gendo'});
t.push({regId:1, regName:'Oio', tabId:29, tabName:'29 - Mansaba'});
t.push({regId:1, regName:'Oio', tabId:30, tabName:'30 - Sanaia'});
t.push({regId:1, regName:'Oio', tabId:31, tabName:'31 - Galenque'});
t.push({regId:1, regName:'Oio', tabId:32, tabName:'32 - Demba So'});
t.push({regId:2, regName:'Biombo', tabId:1, tabName:'1 - Bilma'});
t.push({regId:2, regName:'Biombo', tabId:2, tabName:'2 - Gua'});
t.push({regId:2, regName:'Biombo', tabId:3, tabName:'3 - Ntusse'});
t.push({regId:2, regName:'Biombo', tabId:4, tabName:'4 - Ponta Vicente'});
t.push({regId:2, regName:'Biombo', tabId:5, tabName:'5 - Incaite'});
t.push({regId:2, regName:'Biombo', tabId:6, tabName:'6 - Qindinga'});
t.push({regId:2, regName:'Biombo', tabId:7, tabName:'7 - Intuzinho'});
t.push({regId:2, regName:'Biombo', tabId:8, tabName:'8 - Bambadinca'});
t.push({regId:2, regName:'Biombo', tabId:9, tabName:'9 - Iem'});
t.push({regId:2, regName:'Biombo', tabId:10, tabName:'10 - Buno'});
t.push({regId:2, regName:'Biombo', tabId:11, tabName:'11 - Prite'});
t.push({regId:2, regName:'Biombo', tabId:12, tabName:'12 - Reino Quicete'});
t.push({regId:2, regName:'Biombo', tabId:13, tabName:'13 - Betafte'});
t.push({regId:2, regName:'Biombo', tabId:14, tabName:'14 - Bissa'});
t.push({regId:2, regName:'Biombo', tabId:15, tabName:'15 - Reino Tor'});
t.push({regId:2, regName:'Biombo', tabId:16, tabName:'16 - Dorse'});
t.push({regId:2, regName:'Biombo', tabId:17, tabName:'17 - Blim Blim'});
t.push({regId:2, regName:'Biombo', tabId:18, tabName:'18 - Quinsana'});
t.push({regId:2, regName:'Biombo', tabId:19, tabName:'19 - Quita'});
t.push({regId:2, regName:'Biombo', tabId:20, tabName:'20 - Ondame'});
t.push({regId:2, regName:'Biombo', tabId:21, tabName:'21 - Blom'});
t.push({regId:2, regName:'Biombo', tabId:22, tabName:'22 - Bocomul'});
t.push({regId:2, regName:'Biombo', tabId:23, tabName:'23 - Ome'});
t.push({regId:2, regName:'Biombo', tabId:24, tabName:'24 - Quinhamel'});
t.push({regId:2, regName:'Biombo', tabId:25, tabName:'25 - Ponta Augusto Vicente'});
t.push({regId:2, regName:'Biombo', tabId:26, tabName:'26 - Bilmate'});
t.push({regId:5, regName:'Gabu', tabId:1, tabName:'1 - Badjefa'});
t.push({regId:5, regName:'Gabu', tabId:2, tabName:'2 - Gundjur'});
t.push({regId:5, regName:'Gabu', tabId:3, tabName:'3 - Carabele'});
t.push({regId:5, regName:'Gabu', tabId:4, tabName:'4 - Nema'});
t.push({regId:5, regName:'Gabu', tabId:5, tabName:'5 - Dobanla'});
t.push({regId:5, regName:'Gabu', tabId:6, tabName:'6 - Sintcham Delo Mamado'});
t.push({regId:5, regName:'Gabu', tabId:7, tabName:'7 - Sintcham Delo Malam'});
t.push({regId:5, regName:'Gabu', tabId:8, tabName:'8 - Sintcham Delo Umaro'});
t.push({regId:5, regName:'Gabu', tabId:9, tabName:'9 - Ponhe Maunde'});
t.push({regId:5, regName:'Gabu', tabId:10, tabName:'10 - Candjufa'});
t.push({regId:5, regName:'Gabu', tabId:11, tabName:'11 - Olocunda'});
t.push({regId:5, regName:'Gabu', tabId:12, tabName:'12 - Funtufuntula'});
t.push({regId:5, regName:'Gabu', tabId:13, tabName:'13 - Sintcham Iero Djadja'});
t.push({regId:5, regName:'Gabu', tabId:14, tabName:'14 - Buruntuma'});
t.push({regId:5, regName:'Gabu', tabId:15, tabName:'15 - Dara Braima'});
t.push({regId:5, regName:'Gabu', tabId:16, tabName:'16 - Padjama'});
t.push({regId:5, regName:'Gabu', tabId:17, tabName:'17 - Sintcham Cunadi (Camedina)'});
t.push({regId:5, regName:'Gabu', tabId:18, tabName:'18 - Djebacunda'});
t.push({regId:5, regName:'Gabu', tabId:19, tabName:'19 - Afia'});
t.push({regId:5, regName:'Gabu', tabId:20, tabName:'20 - Camanca'});
t.push({regId:5, regName:'Gabu', tabId:21, tabName:'21 - Fasse (Bairo Ii)'});
t.push({regId:5, regName:'Gabu', tabId:22, tabName:'22 - Mafonco'});
t.push({regId:5, regName:'Gabu', tabId:23, tabName:'23 - Samba Canda'});
t.push({regId:5, regName:'Gabu', tabId:24, tabName:'24 - Sintcham Nhapo'});
t.push({regId:5, regName:'Gabu', tabId:25, tabName:'25 - Tabadjenque'});
t.push({regId:5, regName:'Gabu', tabId:26, tabName:'26 - Tchetche'});
t.push({regId:7, regName:'Cacheu', tabId:9, tabName:'9 - Bula (Pobos De Baixo)'});
t.push({regId:7, regName:'Cacheu', tabId:10, tabName:'10 - Djolmete'});
t.push({regId:7, regName:'Cacheu', tabId:11, tabName:'11 - Quissas'});
t.push({regId:7, regName:'Cacheu', tabId:12, tabName:'12 - Balile'});
t.push({regId:7, regName:'Cacheu', tabId:13, tabName:'13 - Peledje'});
t.push({regId:7, regName:'Cacheu', tabId:14, tabName:'14 - Cabienque'});
t.push({regId:7, regName:'Cacheu', tabId:15, tabName:'15 - Pendai'});
t.push({regId:7, regName:'Cacheu', tabId:16, tabName:'16 - Pelundo (Watche)'});
t.push({regId:7, regName:'Cacheu', tabId:17, tabName:'17 - Dapitai'});
t.push({regId:7, regName:'Cacheu', tabId:22, tabName:'22 - Cacanda'});
t.push({regId:7, regName:'Cacheu', tabId:23, tabName:'23 - Djopa'});
t.push({regId:7, regName:'Cacheu', tabId:24, tabName:'24 - Cajuguite'});
t.push({regId:7, regName:'Cacheu', tabId:27, tabName:'27 - Batucar'});
t.push({regId:7, regName:'Cacheu', tabId:28, tabName:'28 - Pocumal'});
t.push({regId:7, regName:'Cacheu', tabId:29, tabName:'29 - Ponta Pedra'});
t.push({regId:7, regName:'Cacheu', tabId:30, tabName:'30 - Ponta Campo'});
t.push({regId:7, regName:'Cacheu', tabId:31, tabName:'31 - Tubebe'});
t.push({regId:7, regName:'Cacheu', tabId:44, tabName:'44 - Cassenate'});
t.push({regId:7, regName:'Cacheu', tabId:45, tabName:'45 - Dungur'});
t.push({regId:7, regName:'Cacheu', tabId:46, tabName:'46 - Sao Vicente'});
t.push({regId:7, regName:'Cacheu', tabId:47, tabName:'47 - Bucucur'});
t.push({regId:7, regName:'Cacheu', tabId:48, tabName:'48 - Batau'});
t.push({regId:7, regName:'Cacheu', tabId:49, tabName:'49 - Barame'});
t.push({regId:7, regName:'Cacheu', tabId:50, tabName:'50 - Barala'});
t.push({regId:7, regName:'Cacheu', tabId:51, tabName:'51 - Mato Dinghal'});
t.push({regId:7, regName:'Cacheu', tabId:54, tabName:'54 - Fei'});
t.push({regId:7, regName:'Cacheu', tabId:55, tabName:'55 - Capo'});
t.push({regId:8, regName:'Bafata', tabId:1, tabName:'1 - Anambe'});
t.push({regId:8, regName:'Bafata', tabId:2, tabName:'2 - Ponta Novo'});
t.push({regId:8, regName:'Bafata', tabId:3, tabName:'3 - Bricama'});
t.push({regId:8, regName:'Bafata', tabId:4, tabName:'4 - Djada'});
t.push({regId:8, regName:'Bafata', tabId:5, tabName:'5 - Biana'});
t.push({regId:8, regName:'Bafata', tabId:6, tabName:'6 - Nhambanham'});
t.push({regId:8, regName:'Bafata', tabId:7, tabName:'7 - Sintcham Sene'});
t.push({regId:8, regName:'Bafata', tabId:8, tabName:'8 - Cumuda'});
t.push({regId:8, regName:'Bafata', tabId:9, tabName:'9 - Bambadinca'});
t.push({regId:8, regName:'Bafata', tabId:10, tabName:'10 - Gambiel'});
t.push({regId:8, regName:'Bafata', tabId:11, tabName:'11 - Samba Silate'});
t.push({regId:8, regName:'Bafata', tabId:12, tabName:'12 - Onco'});
t.push({regId:8, regName:'Bafata', tabId:13, tabName:'13 - Cumuda'});
t.push({regId:8, regName:'Bafata', tabId:14, tabName:'14 - Madina Batanghel'});
t.push({regId:8, regName:'Bafata', tabId:15, tabName:'15 - Sauiam'});
t.push({regId:8, regName:'Bafata', tabId:16, tabName:'16 - Cancubandje Maunde'});
t.push({regId:8, regName:'Bafata', tabId:17, tabName:'17 - Tabanani'});
t.push({regId:8, regName:'Bafata', tabId:18, tabName:'18 - Galomaro Cosse'});
t.push({regId:8, regName:'Bafata', tabId:19, tabName:'19 - Sintcham Nhobo'});
t.push({regId:8, regName:'Bafata', tabId:20, tabName:'20 - Missira'});
t.push({regId:8, regName:'Bafata', tabId:21, tabName:'21 - Fode Sana '});
t.push({regId:8, regName:'Bafata', tabId:22, tabName:'22 - Pacua'});
t.push({regId:8, regName:'Bafata', tabId:23, tabName:'23 - Sare Ndjobo'});
t.push({regId:8, regName:'Bafata', tabId:24, tabName:'24 - Cancodia'});
t.push({regId:8, regName:'Bafata', tabId:25, tabName:'25 - Sintcham Mole '});
t.push({regId:8, regName:'Bafata', tabId:26, tabName:'26 - Samaro'});
t.push({regId:8, regName:'Bafata', tabId:27, tabName:'27 - Sintcham Dado'});
t.push({regId:8, regName:'Bafata', tabId:28, tabName:'28 - Sintcham Dembel'});
t.push({regId:8, regName:'Bafata', tabId:29, tabName:'29 - Ga Fati'});
t.push({regId:11, regName:'Quinara', tabId:1, tabName:'1 - Mbunga'});
t.push({regId:11, regName:'Quinara', tabId:2, tabName:'2 - Gambil'});
t.push({regId:11, regName:'Quinara', tabId:3, tabName:'3 - Ntughane'});
t.push({regId:11, regName:'Quinara', tabId:4, tabName:'4 - Banta'});
t.push({regId:11, regName:'Quinara', tabId:5, tabName:'5 - Bulensaba'});
t.push({regId:11, regName:'Quinara', tabId:6, tabName:'6 - Dutadjara'});
t.push({regId:11, regName:'Quinara', tabId:7, tabName:'7 - Ponta Nobo'});
t.push({regId:11, regName:'Quinara', tabId:8, tabName:'8 - Ncassol'});
t.push({regId:11, regName:'Quinara', tabId:9, tabName:'9 - Ndjassan'});
t.push({regId:11, regName:'Quinara', tabId:10, tabName:'10 - Batabali'});
t.push({regId:11, regName:'Quinara', tabId:11, tabName:'11 - Empada Mandinga'});
t.push({regId:11, regName:'Quinara', tabId:12, tabName:'12 - Madina Baixo'});
t.push({regId:11, regName:'Quinara', tabId:13, tabName:'13 - Darsalam'});
t.push({regId:11, regName:'Quinara', tabId:14, tabName:'14 - Ga Tchuma Beafada'});
t.push({regId:11, regName:'Quinara', tabId:15, tabName:'15 - Ga Ntchuma Manjaco'});
t.push({regId:11, regName:'Quinara', tabId:16, tabName:'16 - Ga Cumba Balanta'});
t.push({regId:11, regName:'Quinara', tabId:17, tabName:'17 - Ga Cumba Beafada'});
t.push({regId:11, regName:'Quinara', tabId:18, tabName:'18 - Farancunda'});
t.push({regId:11, regName:'Quinara', tabId:19, tabName:'19 - Bissassima'});
t.push({regId:11, regName:'Quinara', tabId:20, tabName:'20 - Nan Balanta'});
t.push({regId:11, regName:'Quinara', tabId:21, tabName:'21 - Djufa'});
t.push({regId:11, regName:'Quinara', tabId:22, tabName:'22 - Madina'});
t.push({regId:11, regName:'Quinara', tabId:23, tabName:'23 - Boduco Sinho'});
t.push({regId:11, regName:'Quinara', tabId:24, tabName:'24 - Fulacunda Baixo'});
t.push({regId:11, regName:'Quinara', tabId:25, tabName:'25 - Mbassa'});
t.push({regId:11, regName:'Quinara', tabId:26, tabName:'26 - Ga Mamudo'});
t.push({regId:11, regName:'Quinara', tabId:27, tabName:'27 - Ga Djatra'});
t.push({regId:11, regName:'Quinara', tabId:28, tabName:'28 - Ga Mole'});
t.push({regId:11, regName:'Quinara', tabId:29, tabName:'29 - Lamane'});
t.push({regId:11, regName:'Quinara', tabId:30, tabName:'30 - Ga Perto'});
t.push({regId:12, regName:'Tombali', tabId:1, tabName:'1 - Gadamael Porto'});
t.push({regId:12, regName:'Tombali', tabId:2, tabName:'2 - Cassaca'});
t.push({regId:12, regName:'Tombali', tabId:3, tabName:'3 - Camiconde'});
t.push({regId:12, regName:'Tombali', tabId:4, tabName:'4 - Camiconde Almame'});
t.push({regId:12, regName:'Tombali', tabId:5, tabName:'5 - Cafal'});
t.push({regId:12, regName:'Tombali', tabId:6, tabName:'6 - Cadique Mbitna'});
t.push({regId:12, regName:'Tombali', tabId:7, tabName:'7 - Cadique Nalu'});
t.push({regId:12, regName:'Tombali', tabId:8, tabName:'8 - Iemberem'});
t.push({regId:12, regName:'Tombali', tabId:9, tabName:'9 - Botche Cul'});
t.push({regId:12, regName:'Tombali', tabId:10, tabName:'10 - Flak Ndjam'});
t.push({regId:12, regName:'Tombali', tabId:11, tabName:'11 - Bedanda Baixo'});
t.push({regId:12, regName:'Tombali', tabId:12, tabName:'12 - Calima'});
t.push({regId:12, regName:'Tombali', tabId:13, tabName:'13 - Catungo Nalu'});
t.push({regId:12, regName:'Tombali', tabId:14, tabName:'14 - Ga Sala '});
t.push({regId:12, regName:'Tombali', tabId:15, tabName:'15 - Canjola Porto'});
t.push({regId:12, regName:'Tombali', tabId:16, tabName:'16 - Tchugue'});
t.push({regId:12, regName:'Tombali', tabId:17, tabName:'17 - Cubumba Mato'});
t.push({regId:12, regName:'Tombali', tabId:18, tabName:'18 - Cabilol'});
t.push({regId:12, regName:'Tombali', tabId:19, tabName:'19 - Cantone'});
t.push({regId:12, regName:'Tombali', tabId:20, tabName:'20 - Botche Mendi'});
t.push({regId:12, regName:'Tombali', tabId:21, tabName:'21 - Unal'});
t.push({regId:12, regName:'Tombali', tabId:22, tabName:'22 - Cumbidjam'});
t.push({regId:12, regName:'Tombali', tabId:23, tabName:'23 - Contabane'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:1, tabName:'1 - Bruce'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:2, tabName:'2 - Murcunda'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:3, tabName:'3 - Bejante'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:4, tabName:'4 - Ancadona'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:5, tabName:'5 - Timbato'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:6, tabName:'6 - Ambanha'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:7, tabName:'7 - Bidjena'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:8, tabName:'8 - Baixada'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:9, tabName:'9 - Buba Luanda'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:10, tabName:'10 - Bairo Comercial'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:11, tabName:'11 - Estancia'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:12, tabName:'12 - An Onho (Uno)'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:13, tabName:'13 - Ancamona'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:14, tabName:'14 - Anhimago'});
t.push({regId:13, regName:'Bolama Bijagos', tabId:15, tabName:'15 - Ancope'});
t.push({regId:14, regName:'Bolama', tabId:1, tabName:'1 - Praca'});
t.push({regId:14, regName:'Bolama', tabId:2, tabName:'2 - Sanssala'});
t.push({regId:14, regName:'Bolama', tabId:3, tabName:'3 - Telegra'});
t.push({regId:14, regName:'Bolama', tabId:4, tabName:'4 - Bairo 14'});
t.push({regId:14, regName:'Bolama', tabId:5, tabName:'5 - Ntatcha'});
t.push({regId:14, regName:'Bolama', tabId:6, tabName:'6 - Sintcham'});
t.push({regId:14, regName:'Bolama', tabId:7, tabName:'7 - Ga Beafada'});
t.push({regId:14, regName:'Bolama', tabId:8, tabName:'8 - Cassucai'});
t.push({regId:14, regName:'Bolama', tabId:9, tabName:'9 - Assumada'});
t.push({regId:14, regName:'Bolama', tabId:10, tabName:'10 - Castelo'});
t.push({regId:14, regName:'Bolama', tabId:11, tabName:'11 - Luanda'});
t.push({regId:14, regName:'Bolama', tabId:12, tabName:'12 - Portugal'});
t.push({regId:14, regName:'Bolama', tabId:13, tabName:'13 - Wato'});
t.push({regId:14, regName:'Bolama', tabId:14, tabName:'14 - Bolama Baixo'});
t.push({regId:14, regName:'Bolama', tabId:15, tabName:'15 - Calege'});
t.push({regId:14, regName:'Bolama', tabId:16, tabName:'16 - Pontia'});
t.push({regId:14, regName:'Bolama', tabId:17, tabName:'17 - Lala'});
t.push({regId:14, regName:'Bolama', tabId:18, tabName:'18 - Ga Balanta'});
t.push({regId:14, regName:'Bolama', tabId:19, tabName:'19 - Marssas'});
t.push({regId:14, regName:'Bolama', tabId:20, tabName:'20 - Madina'});
t.push({regId:14, regName:'Bolama', tabId:21, tabName:'21 - Canema'});
t.push({regId:14, regName:'Bolama', tabId:22, tabName:'22 - Alto Cabral'});
t.push({regId:14, regName:'Bolama', tabId:23, tabName:'23 - Ponta Apili'});
t.push({regId:15, regName:'Sao Domigos', tabId:1, tabName:'1 - Amone'});
t.push({regId:15, regName:'Sao Domigos', tabId:2, tabName:'2 - Apilho'});
t.push({regId:15, regName:'Sao Domigos', tabId:3, tabName:'3 - Blansan'});
t.push({regId:15, regName:'Sao Domigos', tabId:4, tabName:'4 - N`Daia'});
t.push({regId:15, regName:'Sao Domigos', tabId:5, tabName:'5 - Capal'});
t.push({regId:15, regName:'Sao Domigos', tabId:6, tabName:'6 - Mansacunda'});
t.push({regId:15, regName:'Sao Domigos', tabId:7, tabName:'7 - Djebacunda'});
t.push({regId:15, regName:'Sao Domigos', tabId:8, tabName:'8 - Faredjanto'});
t.push({regId:15, regName:'Sao Domigos', tabId:18, tabName:'18 - Arame'});
t.push({regId:15, regName:'Sao Domigos', tabId:19, tabName:'19 - Djamosso'});
t.push({regId:15, regName:'Sao Domigos', tabId:20, tabName:'20 - Ngud Grande'});
t.push({regId:15, regName:'Sao Domigos', tabId:21, tabName:'21 - Ossor'});
t.push({regId:15, regName:'Sao Domigos', tabId:25, tabName:'25 - Lokpas'});
t.push({regId:15, regName:'Sao Domigos', tabId:26, tabName:'26 - Carabane Cherife'});
t.push({regId:15, regName:'Sao Domigos', tabId:32, tabName:'32 - Antotinha Zinho'});
t.push({regId:15, regName:'Sao Domigos', tabId:33, tabName:'33 - Aquintcha'});
t.push({regId:15, regName:'Sao Domigos', tabId:34, tabName:'34 - Binta Balanta'});
t.push({regId:15, regName:'Sao Domigos', tabId:35, tabName:'35 - Bucucur'});
t.push({regId:15, regName:'Sao Domigos', tabId:36, tabName:'36 - Canjande'});
t.push({regId:15, regName:'Sao Domigos', tabId:37, tabName:'37 - Gendem'});
t.push({regId:15, regName:'Sao Domigos', tabId:38, tabName:'38 - Atanque'});
t.push({regId:15, regName:'Sao Domigos', tabId:39, tabName:'39 - Bulol'});
t.push({regId:15, regName:'Sao Domigos', tabId:40, tabName:'40 - Budjim'});
t.push({regId:15, regName:'Sao Domigos', tabId:41, tabName:'41 - Catom'});
t.push({regId:15, regName:'Sao Domigos', tabId:42, tabName:'42 - Campada Namoante'});
t.push({regId:15, regName:'Sao Domigos', tabId:43, tabName:'43 - Djegue Ii'});
t.push({regId:15, regName:'Sao Domigos', tabId:52, tabName:'52 - Quissir'});
t.push({regId:15, regName:'Sao Domigos', tabId:53, tabName:'53 - Djifungo'});
t.push({regId:16, regName:'MSF Bafata', tabId:21, tabName:'21 - Binate M\'bana'});
t.push({regId:16, regName:'MSF Bafata', tabId:22, tabName:'22 - Curura'});
t.push({regId:16, regName:'MSF Bafata', tabId:23, tabName:'23 - Sare Iero Ba'});
t.push({regId:16, regName:'MSF Bafata', tabId:24, tabName:'24 - Sintchan N\'ghalem'});
t.push({regId:16, regName:'MSF Bafata', tabId:25, tabName:'25 - Sintchan Sori'});
t.push({regId:16, regName:'MSF Bafata', tabId:26, tabName:'26 - Embalocunda'});
t.push({regId:16, regName:'MSF Bafata', tabId:27, tabName:'27 - Djada'});
t.push({regId:16, regName:'MSF Bafata', tabId:28, tabName:'28 - Bairro welingara'});
t.push({regId:16, regName:'MSF Bafata', tabId:29, tabName:'29 - Colinto'});
t.push({regId:16, regName:'MSF Bafata', tabId:30, tabName:'30 - Sta Mamado Bobo'});
t.push({regId:16, regName:'MSF Bafata', tabId:31, tabName:'31 - Sta Naunde Nhada'});
t.push({regId:16, regName:'MSF Bafata', tabId:32, tabName:'32 - Bantamdjam'});
t.push({regId:16, regName:'MSF Bafata', tabId:33, tabName:'33 - Sta-Sarfo'});
t.push({regId:16, regName:'MSF Bafata', tabId:34, tabName:'34 - Ga-Djai-1'});
t.push({regId:16, regName:'MSF Bafata', tabId:35, tabName:'35 - Candombe Mane'});
t.push({regId:16, regName:'MSF Bafata', tabId:36, tabName:'36 - Sare Besse'});
t.push({regId:16, regName:'MSF Bafata', tabId:37, tabName:'37 - Sare-Nhanhala'});
t.push({regId:16, regName:'MSF Bafata', tabId:38, tabName:'38 - Embalocunda'});
t.push({regId:16, regName:'MSF Bafata', tabId:39, tabName:'39 - Sare-Tchumo'});
t.push({regId:16, regName:'MSF Bafata', tabId:40, tabName:'40 - Sintcham Dico'});
t.push({regId:16, regName:'MSF Bafata', tabId:41, tabName:'41 - Sintcham Samuna'});
t.push({regId:16, regName:'MSF Bafata', tabId:42, tabName:'42 - Sintcham Dulo I'});
t.push({regId:16, regName:'MSF Bafata', tabId:43, tabName:'43 - Sintcham Cantaba'});
t.push({regId:16, regName:'MSF Bafata', tabId:44, tabName:'44 - Madina Mansona'});
t.push({regId:16, regName:'MSF Bafata', tabId:45, tabName:'45 - Canhamina'});
t.push({regId:16, regName:'MSF Bafata', tabId:46, tabName:'46 - Dar Salam'});
t.push({regId:16, regName:'MSF Bafata', tabId:47, tabName:'47 - Fafabe'});
t.push({regId:16, regName:'MSF Bafata', tabId:48, tabName:'48 - Sintcha Ganha'});
t.push({regId:16, regName:'MSF Bafata', tabId:49, tabName:'49 - Sibidjan Mandinga'});
t.push({regId:16, regName:'MSF Bafata', tabId:50, tabName:'50 - Madina Sael'});
t.push({regId:16, regName:'MSF Bafata', tabId:51, tabName:'51 - Canquinto'});
t.push({regId:16, regName:'MSF Bafata', tabId:52, tabName:'52 - Ioroindi 1'});
t.push({regId:16, regName:'MSF Bafata', tabId:53, tabName:'53 - Sare Saba'});
t.push({regId:16, regName:'MSF Bafata', tabId:54, tabName:'54 - Cambedare'});
t.push({regId:16, regName:'MSF Bafata', tabId:55, tabName:'55 - Tabato'});
t.push({regId:16, regName:'MSF Bafata', tabId:56, tabName:'56 - Brincassa'});
t.push({regId:16, regName:'MSF Bafata', tabId:57, tabName:'57 - Sare-Bailo'});
t.push({regId:16, regName:'MSF Bafata', tabId:58, tabName:'58 - Manta Seidi'});
t.push({regId:16, regName:'MSF Bafata', tabId:59, tabName:'59 - Walicunda'});
t.push({regId:16, regName:'MSF Bafata', tabId:60, tabName:'60 - Coboto'});
t.push({regId:16, regName:'MSF Bafata', tabId:61, tabName:'61 - Ga-Mamudo'});
t.push({regId:16, regName:'MSF Bafata', tabId:62, tabName:'62 - Bambadinca Cossara'});
t.push({regId:16, regName:'MSF Bafata', tabId:63, tabName:'63 - Baria'});
t.push({regId:16, regName:'MSF Bafata', tabId:64, tabName:'64 - Quere-wane'});
t.push({regId:16, regName:'MSF Bafata', tabId:65, tabName:'65 - Sint Sori'});
t.push({regId:16, regName:'MSF Bafata', tabId:66, tabName:'66 - Missira Cuta'});
t.push({regId:16, regName:'MSF Bafata', tabId:67, tabName:'67 - Sint Aliu'});
t.push({regId:16, regName:'MSF Bafata', tabId:68, tabName:'68 - Tininto'});
t.push({regId:16, regName:'MSF Bafata', tabId:69, tabName:'69 - Tininto Mandjaco'});
t.push({regId:16, regName:'MSF Bafata', tabId:70, tabName:'70 - Sint Samadeia'});
t.push({regId:16, regName:'MSF Bafata', tabId:71, tabName:'71 - Sint Mussa'});
t.push({regId:16, regName:'MSF Bafata', tabId:72, tabName:'72 - Sint  Ansumane'});
t.push({regId:16, regName:'MSF Bafata', tabId:73, tabName:'73 - Campampe'});
t.push({regId:16, regName:'MSF Bafata', tabId:74, tabName:'74 - Sare Midjaca'});
t.push({regId:16, regName:'MSF Bafata', tabId:75, tabName:'75 - Sare Demanda'});
t.push({regId:16, regName:'MSF Bafata', tabId:76, tabName:'76 - Madina Ioba'});
t.push({regId:16, regName:'MSF Bafata', tabId:77, tabName:'77 - Sare Djata'});
t.push({regId:16, regName:'MSF Bafata', tabId:78, tabName:'78 - Sint Biron'});
t.push({regId:16, regName:'MSF Bafata', tabId:79, tabName:'79 - Sint Dembadjau'});
t.push({regId:16, regName:'MSF Bafata', tabId:80, tabName:'80 - Sint Umaro'});
t.push({regId:16, regName:'MSF Bafata', tabId:81, tabName:'81 - Djinane'});
t.push({regId:16, regName:'MSF Bafata', tabId:82, tabName:'82 - Sare Tchican'});
t.push({regId:16, regName:'MSF Bafata', tabId:83, tabName:'83 - Cansamina'});
t.push({regId:16, regName:'MSF Bafata', tabId:84, tabName:'84 - Sint Fina'});
t.push({regId:16, regName:'MSF Bafata', tabId:85, tabName:'85 - Sabalencunda'});
t.push({regId:16, regName:'MSF Bafata', tabId:86, tabName:'86 - Querowane'});
t.push({regId:16, regName:'MSF Bafata', tabId:87, tabName:'87 - Lenquel'});
t.push({regId:16, regName:'MSF Bafata', tabId:88, tabName:'88 - Sanghare'});
t.push({regId:16, regName:'MSF Bafata', tabId:89, tabName:'89 - Caira Sane '});
t.push({regId:16, regName:'MSF Bafata', tabId:90, tabName:'90 - Candemba Uri'});
t.push({regId:16, regName:'MSF Bafata', tabId:91, tabName:'91 - Sare Bamba'});
t.push({regId:16, regName:'MSF Bafata', tabId:92, tabName:'92 - Wadje Mandinga'});
t.push({regId:16, regName:'MSF Bafata', tabId:93, tabName:'93 - Mamacono'});
t.push({regId:16, regName:'MSF Bafata', tabId:94, tabName:'94 - Sint MFali'});
t.push({regId:16, regName:'MSF Bafata', tabId:95, tabName:'95 - Wadje Fula'});
t.push({regId:16, regName:'MSF Bafata', tabId:96, tabName:'96 - Sint Djae'});
t.push({regId:16, regName:'MSF Bafata', tabId:97, tabName:'97 - Sint Samba'});
t.push({regId:16, regName:'MSF Bafata', tabId:98, tabName:'98 - Sint Bambe'});
t.push({regId:16, regName:'MSF Bafata', tabId:99, tabName:'99 - Sint Sira'});
t.push({regId:16, regName:'MSF Bafata', tabId:100, tabName:'100 - Sare Salum'});
t.push({regId:16, regName:'MSF Bafata', tabId:101, tabName:'101 - Sint Demba'});
t.push({regId:16, regName:'MSF Bafata', tabId:102, tabName:'102 - Moro'});
t.push({regId:16, regName:'MSF Bafata', tabId:103, tabName:'103 - Fanca Sancule'});
t.push({regId:16, regName:'MSF Bafata', tabId:104, tabName:'104 - Sare Peta'});
t.push({regId:16, regName:'MSF Bafata', tabId:105, tabName:'105 - Sare Canta'});
t.push({regId:16, regName:'MSF Bafata', tabId:106, tabName:'106 - Lamoy'});
t.push({regId:16, regName:'MSF Bafata', tabId:107, tabName:'107 - Campra Jauba'});
t.push({regId:16, regName:'MSF Bafata', tabId:108, tabName:'108 - Sare Coli Embalo'});
t.push({regId:16, regName:'MSF Bafata', tabId:109, tabName:'109 - Sare Mamudo'});
t.push({regId:16, regName:'MSF Bafata', tabId:110, tabName:'110 - Sint Damiro'});
t.push({regId:16, regName:'MSF Bafata', tabId:111, tabName:'111 - Sint Asse'});
t.push({regId:16, regName:'MSF Bafata', tabId:112, tabName:'112 - Sint Coli Binta'});
t.push({regId:16, regName:'MSF Bafata', tabId:113, tabName:'113 - Sintcham Aliu'});
t.push({regId:16, regName:'MSF Bafata', tabId:114, tabName:'114 - Panalitcha'});
t.push({regId:16, regName:'MSF Bafata', tabId:115, tabName:'115 - Sintcham Sambael'});
t.push({regId:16, regName:'MSF Bafata', tabId:116, tabName:'116 - Sintcham Djaie'});
t.push({regId:16, regName:'MSF Bafata', tabId:117, tabName:'117 - Sibidjam Fula'});
t.push({regId:16, regName:'MSF Bafata', tabId:118, tabName:'118 - Sore Mali'});
t.push({regId:16, regName:'MSF Bafata', tabId:119, tabName:'119 - Sitcham Niede'});
t.push({regId:16, regName:'MSF Bafata', tabId:120, tabName:'120 - Bairro Nema'});
t.push({regId:16, regName:'MSF Bafata', tabId:121, tabName:'121 - Djana'});
var regNames = [ ...new Set(t.map(x=>x.regName)) ];
