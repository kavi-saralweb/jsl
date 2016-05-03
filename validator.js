var formulas = require('./lib/formulas');
function CheckResult() {
    this.msglist = [];
    this.check = function (result, msg, obj) {
        if (!result) {
            this.msglist.push(['validation failed at :' , msg , obj]);
        }
    }
    this.clear = function() {
        this.msglist.length = 0;
    };
    this.dump = function() {
        console.log(JSON.stringify(this.msglist, null, 4));
    }
}

var checkResult = new CheckResult();

function getJslBuiltins() {
    return Object.keys(formulas);
}

function validateJslVariable(x) {
    var result = false;
    if (typeof x === 'string') {
        if (x.match(/^\$/)) {
            if ((getJslBuiltins()).indexOf(x) < 0) {
                result = true;
            }
        }
    }
    checkResult.check(result, 'VARIABLE', x);
    return result;
}

function validateJslScalarValue(x) {
    var result = true;
    if (typeof x === 'string') {
        if (x.match(/^\$/)) {
            result = result && validateJslVariable(x);
        }
    }
    else {
        result = false;
    }
    checkResult.check(result, 'SCALARVALUE', x);
    return result;
}

function validateJslKey(x) {
    var result = true;
    if (typeof x === 'string') {
        if (x.match(/^\$/)) {
            result = false;
        }
    }
    checkResult.check(result, 'KEY', x);
    return result;
}


function validateJslObjectValue (obj) {
    var result = true;
    if (typeof obj === 'object') {
        for (var x in obj) {
            result = result && validateJslKey(x) && validateJslObjectValue(obj[x]);
        }
    }
    else if (typeof obj === 'string') {
        result = result && validateJslScalarValue(obj);
    }
    else if (typeof obj === 'number' || typeof obj === 'boolean') {
        result = true; // prevent empty block errors
    }
    else {
        result = false;
    }
    checkResult.check(result, 'OBJECTVALUE', obj);
    return result;
   
}
            
function validateJslObject (obj) {
    var result = true;
    if (obj instanceof Object && !(obj instanceof Array)) {
        for (var x in obj) {
            result = result && validateJslKey(x) && validateJslObjectValue(obj[x]);
        }
    }
    else {
        result = false;
    }
    checkResult.check(result, 'OBJECT', obj);
    return result;
}

function validateJslBuiltin(obj) {
    var result = true;
    if (obj instanceof Object && !(obj instanceof Array)) {
        if (Object.keys(obj).length === 1) {
            var key = Object.keys(obj)[0];
            result = result && ((getJslBuiltins()).indexOf(key) >= 0);
            result = result && obj[key] instanceof Array && obj[key].length >= 1;
            if (result) {
                obj[key].forEach(function(arg) {
                    result = result && (validateJslBuiltin(arg) || validateJslObjectValue(arg));
                });
            }
        }
        else {
            result = false;
        }
    }
    checkResult.check(result, 'BUILTIN', obj);
    return result;
}

function validateFact(item) {
    var result = true;
    if (item instanceof Array) {
        if (item.length === 1 && item[0] instanceof Object && !(item[0] instanceof Array)) {
            result = result && !(validateJslBuiltin(item[0])) && validateJslObject(item[0]);
        }
        else {
            result = false;
        }
    }
    else {
        result = false;
    }
    checkResult.check(result, 'FACT', item);
    return result;
}

function validateJslRule(item) {
    var result = true;
    if (item instanceof Array) {
        if (item.length > 1) {
            result = result && validateJslObject(item[0]);
            if (result) { 
                item.forEach(function(part, index) {
                    if (index > 0) {
                        result = result && ( validateJslObject(part) || validateJslBuiltin(part) );
                    }

                });
            }
        }
        else {
            result = false;
        }
    }
    else {
        result = false;
    }
    checkResult.check(result, 'RULE', item);
    return result;
}

function validateJsl(input) {
    var result = true;
    if (input instanceof Array) {
        input.forEach(function(item) {
            checkResult.clear();
            result = result &&  ( validateFact(item) || validateJslRule(item) );
            checkResult.check(result, 'ITEM', item);
            if (!result) {
                checkResult.dump();
                process.exit();
            }
        })
    }
    else {
        result = false;
    }
    return result;
}


module.exports = {
    validateJsl : validateJsl
}
