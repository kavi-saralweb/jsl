
var JSL = new require('./jsl.js');
var formulas = require('./lib/formulas');

var rules  = [
[   { item : '$item'},
    { $or : [ 
        { fact : '$item'},
        { rule : '$item'}
    ] }
],
[   { fact : '$fact'},
    { $bind : [ '$fact', []]},
    { $call : [ 'length', '$fact', [1]] },
    { $each : [ '$fact', '$x', '$index', 
        {$and : [
            { $not : [ {builtin : '$x'}] },
            {jslObject : '$x'}
        ]}
    ]}
],

[   { rule : '$rule'},
    { $call : [ 'parseList', '$rule', ['$head', '$body']] },
    { jslObject : '$head'},
    { $each : [ '$body', '$x', '$index', 
        { $or : [ { jslObject : '$x'}, { builtin : '$x' } ] } ]}

],

[   { builtin : '$builtin'},
    { $bind : [ '$builtin', {} ] },
    { $call : [ 'length',  '$builtin', [1] ] },
    { $each : [ '$builtin', '$x', '$key', 
        { $and : [ { builtinName : '$key' }, { builtinArguments : '$x' } ] } ] }
],
[   { builtinName : '$x'},
    { $call : ['checkType', '$x', 'builtinName'] }
],
[   { builtinArguments : '$builtinArguments'},
    { $bind : [ '$builtinArguments', [] ] },
    { $each : [ '$builtinArguments', '$x', '$index', 
        { $or : [ { builtin : '$x' } , { jslObjectValue : '$x' } 
        ] }
    ] }
],
[   { jslObject : '$jslObject' },
    { $bind : ['$jslObject', {}] },
    { $each : ['$jslObject', '$x', '$key', 
        { $and : [
            { $call : [ 'checkType', '$key', 'jslObjectKey' ] },
            { jslObjectValue : '$x' } 
        ] }
    ] }
],
[   { jslObjectValue : '$jslObjectValue'},
    { $or : [ 
        { $call : [ 'checkType', '$jslObjectValue', 'number' ] },
        { $call : [ 'checkType', '$jslObjectValue', 'boolean' ] },
        { $call : [ 'objEqual', '$jslObjectValue', null ] },
        { $and : [ 
            { $call : [ 'checkType', '$jslObjectValue', 'string' ] }, 
            { jslScalarValue : '$jslObjectValue' }
        ] },
        { $and : [ 
            { $or : [ { $bind : [ '$jslObjectValue', {} ] }, { $bind : [ '$jslObjectValue', [] ] } ] },
            { $each : [ '$jslObjectValue', '$x', '$key', 
                { $call : ['checkType', '$key', 'jslObjectKey' ] },
                { jslObjectValue : '$x'} ] }
        ] },
    ] }
],
    
[   { jslScalarValue : '$jslScalarValue' },
    { $call : [ 'checkType', '$jslScalarValue', 'jslScalarValue' ] },
]

]


function builtinName(x) {
    //console.log('builtinName ' , x , Object.keys(formulas).indexOf(x) );
    return Object.keys(formulas).indexOf(x) >= 0 ? true : null;
}

function number(x) {
    return x instanceof Number ? true : null;
}

function string(x) {
    return typeof x === 'string' ? true : null;
}

function boolean (x) {
    return typeof x === 'boolean' ? true : null;
}

function jslObjectKey(x) {
    var result = true;
    if (typeof x === 'string') {
        if (x.match(/^\$/)) {
            result = null;
        }
    }
    return result;
}


function jslVariable(x) {
    var result = null;
    if (typeof x === 'string') {
        if (x.match(/^\$/)) {
            if (builtinName(x) === null) {
                result = true;
            }
        }
    }
    return result;
}

function jslScalarValue(x) {
    var result = true;
    if (typeof x === 'string') {
        if (x.match(/^\$/)) {
            if (jslVariable(x) === null) {
                result = null;
            }
        }
    }
    else {
        result = null;
    }
    return result;

}
var terminalTypes = {
    builtinName : builtinName,
    number : number,
    string : string,
    boolean : boolean,
    jslObjectKey : jslObjectKey,
    jslScalarValue : jslScalarValue,
    jslVariable : jslVariable,
}


function checkType(obj, type) {
    var result = null;
    if (terminalTypes[type] != null) {
        result = terminalTypes[type](obj);
    }
    //console.log ('checkType ', obj , type , ' returning ' , result);
    return result;
}

var callbacks = {
    checkType : checkType,
};

function validateJsl (input) { 
    var response = [];
    var query ;
    if (input instanceof Array && input.length > 0) {
        for (var i=0; i<input.length; i++) {
            query = [{item : input[i]}];
            var jsl = new JSL({rules: rules, query: query, callbacks : callbacks});
            var ret = jsl.run();
            if (ret instanceof Array && ret.length > 0 ) {
                response.push(ret);
            }
            else {
                console.log('validation failed on', input[i]);
                response = null;
                break;
            }
        }
    }
    return (response != null);
}

module.exports = {
    validateJsl : validateJsl
};
