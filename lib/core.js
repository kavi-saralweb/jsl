exports = module.exports = {};

var utils = require('./utils.js');
var utilRules = require('./util-rules.js');
var formulas = require('./formulas.js');

function ExtensionWrapper () {
}

var envWrapper = new ExtensionWrapper();

function getFormula(x) {
    var result = null;
    if (x != null && x.obj instanceof Object) {
        var keys = Object.keys(x.obj);
        if (keys.length === 1 && keys[0].match(/^\$/)) {
            if (typeof formulas[keys[0]] !== 'undefined') {
                if (formulas[keys[0]] != null) { /* allow builtins defined via rules, e.g. $bind */
                    result = {
                        name : keys[0],
                        params : x.get(keys[0])
                    }
                }
            }
            else {
                throw ('unknown formula: ' + keys[0]);
            }
        }
    }
    return result;
}

function getUniFunc (goalList, env, rules, accum) { 
    return  function(x,y) {
        var result = null;
        if (utils.isArray(x) && utils.isEmptyArray(y)) { 
            result = env;
        }
        if (utils.isObject(x) && utils.isEmptyObject(y)) { 
            result = env;
        }
        else if (utils.objEqual(x,y)) {
            result = env;
        }
        else if (utils.isVariable(x)) {
            result = exports.setValue(x, y, goalList, env, rules,  accum);
        }
        else if (utils.isVariable(y)) {
            result = exports.setValue(y, x, goalList, env, rules,  accum);
        }
        else if ( getFormula(x) ) {
            throw ('cannot embed formulas in object', x);
        }
        else if ( getFormula(y) ) {
            throw ('cannot embed formulas in object', y);
        }
        return result;
    }
}


exports.setValue = function(variable, value, goalList, env, rules,  accum) {
    var result = null;
    var v;
    if (v = env[variable]) { // binding already exists
        result = exports.unify(v, value, goalList, env, rules,  accum);
    }
    else if ( utils.isVariable(value) ) {
        if (v = env[variable]) {
            result = exports.unify(variable, v, goalList, env, rules,  accum);        
        }
        else {
            result = env;
            result[variable] = value;
        }
    }
    else {
        result = env;
        result[variable] = value;
    }
    return result;
}

function applyFormula(formula, goalList, env, rules,  accum) {
    //console.log('formula ', JSON.stringify(env, null,2));
    var result = null;
    result = formulas[formula.name].apply(this, [formula.params, goalList, env, rules,  accum])
    return result;
}

exports.unify = function(obj1, obj2, goalList, env, rules,  accum) {
    var unifunc = getUniFunc(goalList, env, rules, accum);
    var retval = utils.objCompare(obj1, obj2, unifunc);
    if (retval == null) {
        exports.envClone(env, false); 
    }
    return retval;
}


/* iterates over db and utilRules arrays */
function makeIterator(list1, list2) {
    var i = 0;
    var len = list1.length + list2.length;
    return function() {
        var result;
        if (i < list1.length) {
            result = list1[i];
        }
        else if ( i < len) {
            result = list2[i-list1.length];
        }
        else {
            result = null;
        }
        i++;
        return result;
    }
}

exports.qeval = function(goalList, env, db,  accum, inFormula) {
    //console.log('qeval' , exports.level);
    var formula = getFormula(goalList[0]);
    var ret;
    var k;
    var restGoals = [];
    for (k=1; k<goalList.length; k++) {
        restGoals.push(goalList[k]);
    }
    if (goalList.length === 0) {
        accum.apply(this, [env]);
        ret = env;
    }
    else if (formula != null) {
        ret = applyFormula.apply(this, [formula, restGoals, env, db,  accum]);
    }
    else {
        var iter = makeIterator(db, utilRules);
        var rule;
        while(rule = iter()){

            var renamedRule = utils.renameVariables(rule, this.level);
            var renamedHead = renamedRule[0];
            var wrapEnv = exports.envWrap(env);
        
            ret = exports.unify(renamedHead, goalList[0], restGoals, wrapEnv, db,  accum);
            if (ret != null) {
                var newGoals = [];
                for (k=1; k<renamedRule.length;k++){
                    newGoals.push(renamedRule[k]);
                }
                for (k=1; k<goalList.length; k++) {
                    newGoals.push(goalList[k]);
                }
                 var xenv = exports.envClone(ret, true);
                this.level++;
                ret = exports.qeval.apply(this, [newGoals, xenv, db,  accum, inFormula]);
            }
        }
    }
    return ret;
}

exports.envWrap = function(env) {
    envWrapper.__proto__ = env; // jshint ignore: line
    return envWrapper;
}

exports.envClone = function(env, success) {
    var retval = null;
    success = ( success == null ) ? false : success;
    if ( success ) {
        retval = utils.envcopy(env);
    }
    Object.keys(env).forEach(function(x) {
        delete env[x];
    });
    return retval;
}

