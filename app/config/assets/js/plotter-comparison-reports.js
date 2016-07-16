/**
 * Responsible for rendering the home screen.
 */
'use strict';
/* global odkTables */
var visitData = {};
var plotData = {};

function visitCBSuccess(result) {

    visitData = result;

    return (function() {
        render();
    }());

}

function visitCBFailure(error) {

    console.log('visitCBFailure: failed with error: ' + error);

}

function plotCBSuccess(result) {
    plotData = result;

    return (function() {
        render();
    }());
}

function plotCBFailure(error) {

    console.log('plotFailure: failed with error: ' + error);

}

function display() {
    odkData.query('plot', null, null, null, null, null, null, true, 
        plotCBSuccess, plotCBFailure);

    odkData.query('visit', null, null, null, null, null, null, true, 
        visitCBSuccess, visitCBFailure);
}

function render() {
    if (_.isEmpty(plotData) || _.isEmpty(visitData)) {
        return;
    }

    var compareType = util.getQueryParameter('compareType');
    var compareTypeVal = util.getQueryParameter('compareTypeVal');
    console.log('Compare Type: ' + compareType);
    console.log('Compare Type Val: '+ compareTypeVal);

    $('#NAME').text('Plots with ' + compareTypeVal + ' ' + compareType);

    var plotName = null;
    var plotId = null;
    var plotIdArray = [];
    for (var i = 0; i < visitData.getCount(); i++) {
        if (visitData.getData(i, compareType) === compareTypeVal) {
            plotId = visitData.getData(i, 'plot_id');
            plotIdArray.push(plotId);
        }
    }

    var uniqPlotIdArray = [];
    uniqPlotIdArray = _.uniq(plotIdArray);

    console.log('Plot Id array: ' + plotIdArray.toString());
    console.log('Uniq plot id array: ' + uniqPlotIdArray.toString());

    // This should be changed to not be nested!
    // Consider reversing the loops
    for (var i = 0; i < plotData.getCount(); i++) {
        for (var j = 0; j < uniqPlotIdArray.length; j++) {
            if (plotData.getRowId(i) === uniqPlotIdArray[j]) {
                plotName = plotData.getData(i, 'plot_name');
                graphPlot(uniqPlotIdArray[j], plotName,j);
                console.log('Found plot ' + plotName + ' with ' + compareType + ': ' + compareTypeVal);
                break;
            }
        } 
    }

}

function graphPlot(plotId, plotName, j) {
    var plotGraphHeader = $('<h2>');
    plotGraphHeader.text(plotName + " Plot");
    $('#graph-div').append(plotGraphHeader);

    var plotGraphDiv = $('<div>');
    var plotNameID = 'plotName' + plotName;
    var plotNameUUID = '#plotName' + plotName;
    plotGraphDiv.attr('id', plotNameID);
    plotGraphDiv.attr('plotName',plotName);
    $('#graph-div').append(plotGraphDiv);

    // Maybe add in more text html elements to plotGraphDiv after this works
    //$('#NAME').text('Plot Data for ' + plotName);      
    //var maizeVariety = plotData.getData(i, 'planting');
    //$('#maize-variety').text('Crop: ' + maizeVariety);
    bargraphColAgainstDate(plotName, 'plant_height', plotNameUUID, 'Height');
    console.log('After bargraph');
}

function bargraphColAgainstDate(plotName, colName, divName, yAxisText) {
    var paramWidth = 500;
    var paramHeight = 500;

    var margin = {top: 20, right: 20, bottom: 100, left: 78},
        width = paramWidth - margin.left - margin.right,
        height = paramHeight - margin.top - margin.bottom;

    var plot_id = null;
    for (var i = 0; i < plotData.getCount(); i++) {
        var name = plotData.getData(i, 'plot_name');
        if (name === plotName) {
            plot_id = plotData.getRowId(i);
            break;
        }
    }
        
    if (plot_id === null || plot_id === undefined) {
        console.log('plot_id is null - cannot continue');
        return;
    }

    // Parse the date / time
    var parseDate = d3.time.format("%Y-%m-%d").parse;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%Y-%m-%d"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var data = [];
    for (var i = 0; i < visitData.getCount(); i++) {
        var visit_plot_id = visitData.getData(i, 'plot_id');
        if (visit_plot_id === plot_id) {
            var visit = {};
            var fullDateString = visitData.getData(i,'date');
            var dateTimeSplit = fullDateString.split('T');
            if (dateTimeSplit[0] === null || dateTimeSplit[0] === undefined) {
                // Use default string
                visit.date = "0001-01-01";
            } else {
                visit.date = dateTimeSplit[0];
            }
            //visit.x =  visitData.getData(i,'date');
            visit.value = visitData.getData(i, colName);
            data.push(visit);
        }
    }

    var data = _.sortBy(data, 'date');
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });
    
    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    var svg = d3.select(divName).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.6em")
        .attr("transform", "rotate(-90)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -100)
        .attr("dy", "-.6em")
        .style("text-anchor", "end")
        .text(yAxisText);

    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .style("fill", "YellowGreen")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
}
