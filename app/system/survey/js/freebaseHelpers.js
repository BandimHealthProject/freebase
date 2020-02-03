define(['opendatakit','database','jquery','underscore','moment'],
function(opendatakit,  database,  $,       _, moment) {
return {
    echo: function(str) {
        console.log("****** ECHO CALLED ******");
        alert(str);
    },
    decimalPlaces: function(num) {
        // function for counting decimals
        // https://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number
        var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) { return 0; }
        return Math.max(
            0,
            // Number of digits right of decimal point.
            (match[1] ? match[1].length : 0)
            // Adjust for scientific notation.
            - (match[2] ? +match[2] : 0));
    },
    studyNumber: function(letters,zeros,num) {
        var number = num + ""
        while (number.length < zeros) {
            number = "0" + number
        };
        return letters + number;
    },
    getNoc: function(reg, tab) {
    noc = [];   
    var sql = "select MAX(NOC) AS NOC FROM CRIANCA WHERE REG == " + reg + " AND TAB == "+ tab;
    console.log("Querying database for getNoc...");
    console.log(sql);
    var successFn = function(result) {
        var maxNoc = Number(result.getData(0,"NOC")) + 1;
        console.log("maxNoc:", maxNoc);
        noc[0] = maxNoc
        console.log("test:", noc);
        console.log("noc:", noc[0]);
        return;
    }
    var failureFn = function( errorMsg ) {
        console.error('Failed to get mul from database: ' + errorMsg);
        console.error('Trying to execute the following SQL:');
        console.error(sql);
        alert("Program error Unable to look up getNoc.");
    }
    odkData.arbitraryQuery('CRIANCA', sql, null, null, null, successFn, failureFn);
    console.log("test2:", noc);
    console.log("noc2:", noc[0]);
    return;
    }
}
});