exports = module.exports = {}

var formulas = require('./formulas.js');
var RenamedVarsObject = require('./renamed-vars.js');

exports.isRenamedVarsObject = function(obj) {
    return ( obj != null && obj.constructor != null && obj.constructor.name === 'RenamedVarsObject' )
}

exports.isVariable = function(x) {
    return typeof x === 'string' && x.match(/^\$/) && formulas[x] == null
}

exports.isObject = function(x) {
    var obj = (exports.isRenamedVarsObject(x) ? x.obj : x);
    return ( obj instanceof Object && !(obj instanceof Array) )
}

exports.isEmptyObject = function(x) {
    var obj = (exports.isRenamedVarsObject(x) ? x.obj : x);
    return ( obj instanceof Object && !(obj instanceof Array)  && Object.keys(obj).length === 0 )
}

exports.isArray = function(x) {
    var obj = (exports.isRenamedVarsObject(x) ? x.obj : x);
    return (obj instanceof Array)
}


exports.isEmptyArray = function(x) {
    var obj = (exports.isRenamedVarsObject(x) ? x.obj : x);
    return ( obj instanceof Array && obj.length === 0)
}


exports.envcopy = function(exp) {
    var result;
    var x;
    if (exp != null && typeof exp === 'object') {
        if (exports.isRenamedVarsObject(exp)) {
            result = new RenamedVarsObject(exp.obj, exp.level);
        }
        else  {
            result = exp instanceof Array ? [] : {};
            for (x in exp) {
                result[x] = exports.envcopy(exp[x]);
            }
        }
    }
    else {
        result = exp;
    }
    return result;
}

exports.renameVariables = function(obj, level) { 
    var result;
    if (obj instanceof Array) {
        result = [];
        for (var i=0; i<obj.length; i++) {
            result.push(new RenamedVarsObject(obj[i], level));
        }
    }
    else {
        result =  new RenamedVarsObject(obj, level);
    }
    return result;
}

exports.getFinalValue = function(exp, env) {
    var result;
    if (exports.isVariable(exp)) {
        if (typeof env[exp] !== 'undefined') {
            result = exports.getFinalValue(env[exp], env);
        }
        else {
            //result = '**unbound**' + exp; 
            result = (exp.split(/\./)).shift(); // allow unbound variables in result
        }
    }
    else if (exp != null && exports.isRenamedVarsObject(exp)) {
        result = exp.obj instanceof Array ? [] : (exp.obj === null ? null : {});
        for (var x in exp.obj) {
            result[x] = exports.getFinalValue(exp.get(x), env);
        }
    }
    else {
        result = exp;
    }
    return result;
}

/*exports.incrementLevel = function(level) {
    var tokens =  level.toString().split(/\./);
    tokens[tokens.length-1] = parseInt(tokens[tokens.length-1])+1;
    return tokens.join('.');
}*/

exports.objCompare = function(obj1, obj2, func) {
    //console.log('objCompare: ', obj1, obj2);
    var result;
    if ( exports.isRenamedVarsObject(obj2) &&  exports.isRenamedVarsObject(obj1) ) {
        /* boundary cases of nulls or empty objects on both sides, or in second position */
        /*if ((obj1.obj === null && obj2.obj === null) ||
            (obj1.obj instanceof Array && obj2.obj instanceof Array && obj1.obj.length === 0 && obj1.obj.length === 0) || 
            (obj1.obj instanceof Object && obj2.obj instanceof Object && Object.keys(obj1.obj).length === 0 && Object.keys(obj2.obj).length === 0)
            ) {
            result = func(obj1, obj2);
        }*/
        if (obj1.obj === null && obj2.obj === null) {
            result = func(obj1, obj2);
        }
        else if ( exports.isArray(obj1.obj) && exports.isEmptyArray(obj2.obj)) {
            result = func(obj1, obj2);
        }
        else if (exports.isObject(obj1.obj) && exports.isEmptyObject(obj2.obj)) {
            result = func(obj1, obj2);
        }
        else {
            for (var x in obj2.obj) {
                if (obj1.obj !== null && typeof obj1.obj[x] !== 'undefined') {
                    result = exports.objCompare(obj1.get(x), obj2.get(x), func);
                    if (result === null) {
                        break;
                    }
                }
                else {
                    result = null;
                    break;
                }
            }
        }
    }
    else if (result !== null){
        result = func(obj1, obj2);
    }
    return result;
}

function matchFunc(x, y) {
    var result;
    if ( exports.isRenamedVarsObject(x) && exports.isRenamedVarsObject(y) ) {
        if (   
                ( x.obj instanceof Array && y.obj instanceof Array && x.obj.length === 0 && y.obj.length === 0) ||
                ( x.obj instanceof Object && y.obj instanceof Object && Object.keys(x.obj).length === 0 && Object.keys(y.obj).length === 0)
        ) {
            result = true;
        }
        else {
            result = x.obj === y.obj;
        }
    }
    else {
        result = x===y ;
    }
    result = result ? true : null;
    return result;
}

exports.objMatch = function(obj1, obj2) {
    var result =  exports.objCompare(obj1, obj2, matchFunc);
    //console.log('objMatch', obj1, obj2, result);
    return result;
}

exports.objEqual = function(obj1, obj2) {
    return exports.objMatch(obj1, obj2) && exports.objMatch(obj2, obj1);
}

exports.objMerge = function(a, b) {
    if ( a == null || b == null ) {
        return a;
    }

    var keys = Object.keys(b);

    for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        if( Object.prototype.toString.call(b[key]) === '[object Object]' ) {
            if( Object.prototype.toString.call(a[key]) !== '[object Object]' ) {
                a[key] = b[key];
            }
            else {
                a[key] = exports.objMerge( a[key], b[key] );
            }
        }
        else {
            a[key] = b[key];
        }
    }
    return a;
}

exports.objMap = function(obj, func, path, result) { // call with 2 args only
    function typedNew(obj) {
        var result;
        if (obj instanceof Array) {
            result = [];
        }
        else if (obj instanceof Object) {
            result = {};
        }
        else if (obj === null) {
            result = null;
        }
        else {
            result = obj;
        }
        return result;
    }

    if (typeof path === 'undefined') { 
        path = [];
        result = typedNew(obj);
    }

    if (obj instanceof Array) {
        for (var i=0; i<obj.length; i++) {
            if (typeof obj[i] === 'object') {
                path.push(i);
                result[i] = exports.objMap(obj[i], func, path,typedNew(obj[i]));
            }
            else {
                result[i] = func(obj[i]);
            }
        }
    }
    else if (obj instanceof Object) {
        for (var x in obj) {
            if (typeof obj[x] === 'object') {
                path.push(x);
                result[x] = exports.objMap(obj[x], func, path, typedNew(obj[x]));
            }
            else {
                result[x] = func(obj[x]);
            }
        }
    }
    else {
        result = func(obj); /* end condition, called on the top with a scalar  */
    }
    return result;
}

exports.objRewriteVariables = function objRewriteVariables(obj, vars,  n) {
    function mapFunc (x) {
        var result = x;
        if (vars.indexOf(x) >= 0) {
            result = x + (n);
        }
        return result;
    }
    var result = null;
    if (vars instanceof Array) {
        result = exports.objMap(obj, mapFunc);
    }
    return result;
}

/* returns an single level object with dot-notation paths corresponding to obj structure, one path per leaf */
exports.objectToPaths = function objectToPaths(source, path, retval, prevIsArray) {
    retval = retval == null ? {}: retval;
    path = path == null ? '': path;
    prevIsArray = prevIsArray == null ? false: prevIsArray;
    

    if ( source != null && typeof source === 'object' ) {
        var slen = ( source instanceof Array ) ? source.length : Object.keys(source).length;

        if ( slen > 0 ) {
            for ( var key in source ) {
                var isArray = false;
                var recurse = false;
                var obj = source[key];
                var nlevel; 
                if ( prevIsArray ){
                    nlevel = path + '[' + key + ']';
                }
                else {
                    nlevel = path !== '' ? path + '.' + key : key;
                }
                

                if ( obj instanceof Array ) {
                    recurse = true;
                    isArray = true;
                }
                else if ( obj != null && obj instanceof Object ) {
                    recurse = true;
                } 

                if ( recurse ) {
                    objectToPaths(obj, nlevel, retval, isArray);
                }
                else {
                    retval[nlevel] = obj;
                }
            }
        }
        else {
            retval[path] = source;
        }
    }
    else {
        retval[path] = source;
    }
    return retval;
}


