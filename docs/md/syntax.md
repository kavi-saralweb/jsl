[index](/docs/jsl/html/index.html)

---

# JSL Syntax

The JSL syntax is nothing but (constrained) JSON. The rules defining valid structure for any one item in a given JSL batch are defined below as an executable validator, using JSL itself to define the rules:

    
```


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
    {$bind : [ '$fact', []]},
    { $call : [ 'length', '$fact', [1]] },
    { $each : [ '$fact', '$x', '$index', 
        {$and : [
            { $not : [ {builtin : '$x'}] },
            {jslObject : '$x'}
        ]}
    ]},
],

[   { rule : '$rule'},
    { $call : [ 'parseList', '$rule', [ '$head', '$body' ] ] },
    { jslObject : '$head' },
    { $each : [ '$body', '$x', '$index', 
        { $or : [ { jslObject : '$x'}, { builtin : '$x' } ] } ]},
],
    
[   { builtin : '$builtin'},
    {$bind : [ '$builtin', {} ] },
    { $call : [ 'length',  '$builtin', [1] ] },
    { $each : [ '$builtin', '$x', '$key', 
        { $and : [ { builtinName : '$key' }, { builtinArguments : '$x' } ] } ] },
],
[   { builtinName : '$x'},
    { $call : ['checkType', '$x', 'builtinName'] }
],
[   { builtinArguments : '$builtinArguments'},
    {$bind : [ '$builtinArguments', [] ] },
    { $each : [ '$builtinArguments', '$x', '$index', 
        { $or : [ { builtin : '$x' } , { jslObjectValue : '$x' } 
        ] }
    ] }
],
[   { jslObject : '$jslObject' },
    { $call : [ 'checkType', '$jslObject', 'jslObject' ] },
],
[   { jslObjectValue : '$jslObjectValue' },
    { $call : [ 'checkType', '$jslObjectValue', 'jslObjectValue' ] },
]


]


function builtinName(x) {
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

function jslObjectValue (obj) {
    var result = true;
    if (typeof obj === 'object') {
        for (var x in obj) {
            if ( jslObjectKey(x) === null ||  jslObjectValue(obj[x]) === null) {
                result = null;
            }
        }
    }
    else if (typeof obj === 'string') {
        if (jslScalarValue(obj) === null) {
            result = null;
        }
    }
    else if (typeof obj === 'number' || typeof obj === 'boolean') {
        result = true; // noop
    }
    else {
        result = null;
    }
    return result;
}
            
function jslObject (obj) {
    var result = true;
    if (obj instanceof Object && !(obj instanceof Array)) {
        for (var x in obj) {
            if (jslObjectKey(x) === null ||  jslObjectValue(obj[x]) === null) {
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
    jslVariable : jslVariable,
    jslObjectKey : jslObjectKey,
    jslScalarValue : jslScalarValue,
    jslObjectValue : jslObjectValue,
    jslObject : jslObject
}


function checkType(obj, type) {
    var result = null;
    if (terminalTypes[type] != null) {
        result = terminalTypes[type](obj);
    }
    return result;
}


var callbacks = {
    checkType : checkType
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



```
The validator defines rules that constrain the structure of any one item in a JSL batch, which can be either a fact or a rule. Further constraints that define valid structure for facts and rules are defined in subsequent rules.

Terminal types have been implemented via the checkType callback, which maintains a table of recognized terminal types. These include the usual scalar types, as well as specific constrained strings such as $variable names, and $builtin names. Finally, a jslObject type is defined which contains constrained keys and values. 

The universal quantifier $each is used to compactly express rules applying to all elements of an object or array. Note that $each allows us to constrain keys as well as values of an object.


