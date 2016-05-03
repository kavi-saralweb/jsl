var utils = require('./utils.js');

function concat() {
    var result = null;
    if (arguments.length > 1) {
        var i;
        var isArray = true;
        var isString = true;
        /* all arguments must be either arrays or strings*/
        for (i=0; i<arguments.length; i++) {
            if (typeof arguments[i] === 'string') {
                isString = isString && true;
                isArray = false;
            }
            else if (arguments[i] instanceof Array) {
                isArray = isArray && true;
                isString = false;
            }
            else {
                isArray = false;
                isString = false;
                break;
            }
        }

        if (isArray) {
            result = [];
            for (i=0; i<arguments.length; i++) {
                result.push.apply(result, arguments[i]);
            }
        }
        else if (isString) {
            result = '';
            for (i=0; i<arguments.length; i++) {
                result += arguments[i];
            }
        }
    }
    return result;
}

function extend(obj1, obj2) {
    var result = null;
    if (obj1 instanceof Object && obj2 instanceof Object && !(obj1 instanceof Array) && !(obj2 instanceof Array)) {
        result = utils.objMerge(obj1, obj2);
    }
    return result;
}

function length (obj) {
    var result = null;
    if (typeof obj === 'object') {
        result = Object.keys(obj).length
    }
    //console.log('length ', obj , ' returning ' , result);
    return result;
}

function keys (obj) {
    var result = null;
    if (obj != null && typeof obj === 'object') {
        result = Object.keys(obj);
    }
    return result;
}

function objEqual(obj1, obj2) {
    var result = null;
    if (obj1 instanceof Array && obj2 instanceof Array && obj1.length === 0 && obj2.length === 0) {
        result = true;
    }
    else if ( obj1 instanceof Object && obj2 instanceof Object && Object.keys(obj1).length === 0 && Object.keys(obj2).length === 0) {
        result = true;
    }
    else {
        result = utils.objEqual(obj1, obj2);
    }
    return result;
}

function objNotEqual(obj1, obj2) {
    return objEqual(obj1, obj2) ? null : true;
}


function objGetValue(obj, key) {
    var result = null;
    if (obj != null && typeof obj === 'object') {
        if (typeof obj[key] !== 'undefined') {
            result = obj[key];
        }
    }
    return result;
}

function parseList (list) {
    var result = null; // make sure to return null if we can't parse the list, fails the rule
    if (list instanceof Array) {
        result = [];
        if (list[0] != null) {
            result.push(list.shift());
            result.push(list);
        }
    }
    //console.log('parseList ' , list , ' returning ' , result );
    return result;
}

function isNull(obj) {
    return obj === null ? true : null;
}

function notNull (obj) {
    return obj !== null ? true : null;
}


function log () {
    var logstring = '';
    for (var i=0; i<arguments.length; i++) {
        var arg = arguments[i];

        if (typeof arg === 'string') {
            logstring += arg + ' , ';
        }
        else {
            logstring += JSON.stringify(arg) + ' , ';
        }
        logstring.replace(/ , $/, '');
    }
    typeof console !== 'undefined' ? console.log(logstring) : null; // alternative logger here
    return true; // never fail
}

module.exports = {
    concat : concat,
    extend : extend,
    length : length,
    keys : keys,
    objEqual : objEqual,
    objNotEqual : objNotEqual,
    objGetValue : objGetValue,
    parseList : parseList,
    isNull : isNull,
    notNull : notNull,
    log : log
    
};
