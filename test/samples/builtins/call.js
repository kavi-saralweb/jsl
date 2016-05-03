var JSL = require('../../..');

var ruleset = [
    [   { date : '$x' },
        { $call : [ 'getDate', ['$x']] }
    ],
    [   { tomorrow : '$x' },
        { $call : [ 'getTomorrow', ['$x']] }
    ],
    [   { addFive : '$x' },
        { $call : [ 'addDays', 5, ['$x']] }
    ],
    [   { setTimestamp : '$x' },
        { $call : [ 'setTimestamp', ['$x']] }
    ],
    [   { dateParts : {date : '$date', m : '$m', d : '$d', y : '$y' } },
        { $call : [ 'getDate', 'parts', ['$date', {month : '$m', date : '$d', year : '$y' }] ] }
    ],


];


function getDate(param) {
    var result; 
    var date = new Date();
    if (param === 'parts') {
        result = [date.toString(), { month : date.getUTCMonth()+1, date : date.getUTCDate(), year : date.getUTCFullYear()}]
    }
    else {
        result = date.toString();
    }
    return result;
}

function getTomorrow() { 
    var dt = new Date();
    dt.setDate(dt.getDate()+1)
    return dt.toString();
}

function addDays(n) {
    var dt = new Date();
    dt.setDate(dt.getDate()+n)
    return dt.toString();
}

function setTimestamp(record) {
    return function() {
        record.timestamp = (new Date()).toString();
        return record;
    }
}
 
var  message = {
    to : 'sales@vinod-denim.com',
    subject : 'test subject',
    msgtext : 'test message'
};

var callbacks = {
    getDate : getDate,
    getTomorrow : getTomorrow,
    addDays : addDays,
    setTimestamp : setTimestamp(message)   
};

var response = {};
var transform = '$result';
var query;
query =     [{date : '$result'}];
var jsl = new JSL({rules : ruleset, query: query, transform : transform, callbacks : callbacks});
response.date = jsl.run();

query =     [{tomorrow : '$result'}];
jsl = new JSL ({rules : ruleset, query: query,  transform : transform, callbacks : callbacks});
response.tomorrow = jsl.run();

query =     [{addFive : '$result'}];
jsl = new JSL ({rules : ruleset, query: query,  transform : transform, callbacks : callbacks});
response.addFive = jsl.run();

query =     [{setTimestamp : '$result'}];
jsl = new JSL({rules : ruleset, query: query,  transform : transform, callbacks : callbacks});
response.setTimestamp = jsl.run();

query =     [{dateParts : '$result'}];
jsl = new JSL({rules : ruleset, query: query,  transform : transform, callbacks : callbacks});
response.dateParts = jsl.run();


module.exports = { response : response, message : message };
