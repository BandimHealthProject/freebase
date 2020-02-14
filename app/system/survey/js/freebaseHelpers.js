define(['opendatakit','database','jquery','underscore','moment'],
function(opendatakit,  database,  $,       _, moment) {
    var noc={};
    var test2={};


    return {
    testRun: function(obj) {
        console.log("obj", obj);
        console.log("obj.maxNoc",obj.maxNoc);
        var p = { value: obj.maxNoc};
        console.log("p",p);
        test2 = JSON.parse(JSON.stringify(p));
        console.log("testRun",test2);
        return test2;
    },
    successFn: function(result) {
        var maxNoc;
        console.log("result",result)
        for (var row = 0; row < result.getCount(); row++) {
            maxNoc = Number(result.getData(0,"NOC")) + 1;
        
            var p = { type: 'mif', maxNoc};
            noc = JSON.parse(JSON.stringify(p));
        }
        console.log("noc",noc);
        this.testRun(noc);
        return noc;
    },
    nocGet: function(reg,tab) {
    var sql = "select MAX(NOC) AS NOC FROM CRIANCA WHERE REG == " + reg + " AND TAB == "+ tab;
    var failureFn = function( errorMsg ) {
        console.error('Failed to get mul from database: ' + errorMsg);
        console.error('Trying to execute the following SQL:');
        console.error(sql);
        alert("Program error Unable to look up getNoc.");
    };
    odkData.arbitraryQuery('CRIANCA', sql, null, null, null, this.successFn, failureFn);
    console.log("nocGet",Object.keys(noc));
    return noc;
    },
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
    getNoc2: function(reg, tab) {
        var noc =[];
        var sql = "select MAX(NOC) AS NOC FROM CRIANCA WHERE REG == " + reg + " AND TAB == "+ tab;
        console.log("Querying database for getNoc...");
        console.log(sql);
        var successFn = function(result) {
            var maxNoc = Number(result.getData(0,"NOC")) + 1;
            console.log("maxNoc:", maxNoc);
            noc[0] = maxNoc;
            console.log("test:", noc);
        };
        var failureFn = function( errorMsg ) {
            console.error('Failed to get mul from database: ' + errorMsg);
            console.error('Trying to execute the following SQL:');
            console.error(sql);
            alert("Program error Unable to look up getNoc.");
        };
        odkData.arbitraryQuery('CRIANCA', sql, null, null, null, successFn, failureFn);
        console.log("test2:", noc); // returns array
        console.log("test3:", noc[0]); // returns undefined
        return noc[0];
    },
    getNoc3: function(reg,tab) {
        var sql = "select MAX(NOC) AS NOC FROM CRIANCA WHERE REG == " + reg + " AND TAB == "+ tab;
        var maxNoc, noc;
        let p = new Promise((resolve,reject) => {
            function successFn(result) {
                maxNoc = Number(result.getData(0,"NOC")) + 1;
                console.log("maxNoc:", maxNoc);
                returnNoc(maxNoc)
            };
            function failureFn(errorMsg) {
                console.error('Failed to get mul from database: ' + errorMsg);
                console.error('Trying to execute the following SQL:');
                console.error(sql);
                alert("Program error Unable to look up getNoc.");
            };
            odkData.arbitraryQuery('CRIANCA', sql, null, null, null, successFn, failureFn);
            if (maxNoc != null) {
                resolve(maxNoc);
            } else {
                reject();
            }
        })
        p.then((val) => {
            console.log("then:", val)
            noc = maxNoc;
        }).catch(() => {
            console.log("Promise failed")
        })
        console.log("noc2:",noc)
        return noc;
    },
    getNoc: function(reg, tab) {
        console.log("getNoc",Object.keys(noc));
        var test = this.nocGet(reg,tab);
        console.log("test",test);
        console.log("test2",Object.keys(test2));

        
        return test2;
    }
}
});