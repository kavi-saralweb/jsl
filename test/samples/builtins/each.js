var JSL = require('../../..');

var ruleset = [
    [ 
        { AoA : '$input'},
        { $bind : [ '$input', [] ] },
        { $each : [ '$input', '$value', '$key', { $bind : [ '$value', [] ] } ] } 
    ],
    [ 
        { AoO : '$input'},
        { $bind : [ '$input', [] ] },
        { $each : [ '$input', '$value', '$key', { $bind : [ '$value', {} ] } ] } 
    ],
    [ 
        { OoA : '$input'},
        { $bind : [ '$input', {} ] },
        { $each : [ '$input', '$value', '$key', { $bind : [ '$value', [] ] } ] } 
    ],
    [ 
        { OoO : '$input'},
        { $bind : [ '$input', {} ] },
        { $each : [ '$input', '$value', '$key', { $bind : [ '$value', {} ] } ] } 
    ],
    [ 
        { OoO_deep : '$input'},
        { $bind : [ '$input', {} ] },
        { $each : [ '$input', '$value', '$key', 
            { $or : [
                { $call : [ 'checkType', '$value', 'scalar' ] },
                { OoO_deep :  '$value' }
            ] }
        ] }
    ],


];


var AoA = [ [ 1 ], [ 2 ] , [ 3 ] , [ 4 ] ] ;
var AoO = [ { a : 1 } , { b : 2 } , { c : 3 } , { d : 4 } ];
var OoA = { a : [ 1 ] , b : [ 2 ] , c : [ 3 ] , d : [ 4 ] };
var OoO = { a : { a : 1 } , b : { b : 2 } , c : { c : 3 } , d : { d : 4 } } ;
var OoO_deep = { a : { b : { c : { d : 1 } , e : { f : 2 } } } };
var OoO_deep_fail = { a : { b : { c : [ 1 ], d : [ 2 ] } } };

function scalar (x) {
    var result =  ( typeof x === 'string' || typeof x === 'number' || typeof x === 'boolean' || x === null) ? true : null;
    return result;
}

function checkType (x, type) {
    var typesTable = {
        scalar : scalar
    }
    var result = null;
    if (typesTable[type] != null) {
        result = typesTable[type](x)
    }
    return result;
}

var callbacks = {
    checkType : checkType
}

var response = {};
var query;

query =     [{AoA : AoA}];
var jsl = new JSL ({rules : ruleset, query: query, callbacks : callbacks});
response.AoA = jsl.run();

query =     [{AoO : AoO}];
jsl = new JSL ({rules : ruleset, query: query, callbacks : callbacks});
response.AoO = jsl.run();

query =     [{OoA : OoA}];
jsl = new JSL({rules : ruleset, query: query, callbacks : callbacks});
response.OoA = jsl.run();

query =     [{OoO : OoO}];
jsl = new JSL({rules : ruleset, query: query, callbacks : callbacks});
response.OoO = jsl.run();

query =     [{OoO_deep : OoO_deep}];
jsl = new JSL({rules : ruleset, query: query, callbacks : callbacks});
response.OoO_deep = jsl.run();

query =     [{OoO_deep : OoO_deep_fail}];
jsl = new JSL({rules : ruleset, query: query, callbacks : callbacks});
response.OoO_deep_fail = jsl.run();

module.exports = response ;
