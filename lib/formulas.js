exports = module.exports = {};
var core = require('./core.js');
var utils = require('./utils.js');
var RenamedVarsObject = require('./renamed-vars.js');

function resolveArgument(arg, env) {
    //var result = arg;
    //if (arg instanceof RenamedVarsObject) { /* this happens when someone throws in a literal value to $call arguments */
    //    result = arg.obj;
    //}
    //else {
    //if (utils.isVariable(arg)) {
     var result = utils.getFinalValue(arg, env);
    //}
    return result;
}

exports.$not = function not(list,  goalList, env, rules,  accum) {
    var result = null;
    var startResultLength = this.finalResult.length;
    var newList = list.makeArray();
    if (newList.length === 1) { // not is unary
        var k;
        var newGoals = [];
        newGoals.push(newList[0]);
        for (k=0; k<goalList.length;k++) {
            newGoals.push(goalList[k]);
        }
        this.level++;
        result = core.qeval.apply(this, [newGoals, env, rules,  accum, true]);
        if (this.finalResult.length > startResultLength) {
            result = null;
            this.finalResult = this.finalResult.slice(0, startResultLength); // slice extracts upto but not including the end index
        }
        else { // skip the goal which was the argument of not and continue the recursion
            this.level++;
            result = core.qeval.apply(this, [goalList, env, rules,  accum, true]);
        }
    }
    return result;
}

exports.$or = function or (list, goalList, env, rules, accum) {
    //console.log('or : ', list , env );
    var startingResultLength = this.finalResult.length;
    var result = null;
    var newList = list.makeArray();
    var i,k;
    for (i=0; i < newList.length; i++) {
        var newGoals = [];
        newGoals.push(newList[i]);
        for (k=0; k<goalList.length;k++) {
            newGoals.push(goalList[k]);
        }
        this.level++;
        var xenv = utils.envcopy(env);
        result = core.qeval.apply(this, [newGoals, xenv, rules,  accum, true]);
        if (this.finalResult.length > startingResultLength) {
            result = xenv;
            break;
        }
    }
    return result;
}


exports.$and = function and (list, goalList, env, rules, accum) {
    //console.log('and ', list, env);
    var startResultLength = this.finalResult.length;
    var newList = list.makeArray();
    var k;
    var newGoals = [];
    for (k=0; k<newList.length;k++) {
        newGoals.push(newList[k]);
    }
    for (k=0; k<goalList.length;k++) {
        newGoals.push(goalList[k]);
    }
    this.level++;
    var result = core.qeval.apply(this, [newGoals, env, rules,  accum, true]);
    if (this.finalResult.length > startResultLength) {
        result = env;
    }
    else { 
        result = null;
    }

    return result;
}

exports.$each = function each (list, goalList, env, rules,  accum) {
    var startResultLength = this.finalResult.length;
    var newGoals = [];

    var obj = resolveArgument(list.get(0), env);
    var val = resolveArgument(list.get(1), env);
    var key = resolveArgument(list.get(2), env);
    var goal = resolveArgument(list.get(3), env);

    //console.log('obj' , obj);
    //console.log('val' , val);
    //console.log('key' , key);
    //console.log('goal' , goal);

    var result = null;
    if (obj != null && typeof obj === 'object' &&
        goal != null && goal instanceof Object && !(goal instanceof Array) &&
        utils.isVariable(val) && 
        utils.isVariable(key)
    ) {
            for (var x in obj) {
                //console.log('x =' , x);
                var rand = Math.trunc((Math.random()*1000000));

                /*core.setValue(new RenamedVarsObject(val+(rand), this.level), obj[x], goalList, env, rules,  accum); 
                core.setValue(new RenamedVarsObject(key+(rand), this.level), x, goalList, env, rules,  accum);*/
                core.setValue(val+(rand)+'.'+this.level, obj[x], false, goalList, env, rules,  accum); 
                core.setValue(key+(rand)+'.'+this.level, x, false, goalList, env, rules,  accum);

                newGoals.push(new RenamedVarsObject(utils.objRewriteVariables(goal, [val,key], rand), this.level) );
            }
            for (var k=0; k<goalList.length;k++) {
                newGoals.push(goalList[k]);
            }
            //console.log(JSON.stringify(newGoals, null,2));

            this.level++;
            result = core.qeval.apply(this, [newGoals, env, rules,  accum, true]);
            if (this.finalResult.length > startResultLength) {
                result = env;
            }
            else { 
                result = null;
            }
    }
    return result;
}

exports.$call = function call (list,  goalList, env, rules,  accum) {
    var result = null;
    if (list.obj.length > 0) { // we need at least one argument, which function to call
        var fname = list.get(0)
        
        //console.log('\n\n\n$call ' , fname , JSON.stringify(env, null, 2));
        var callbackFn = this.callbacks[fname];

        if (callbackFn != null && typeof callbackFn === 'function') {
            var args = [];
            var outvar;
            for(var i=1; i < list.obj.length; i++) {
                var arg = list.get(i);
                if ( i < list.obj.length-1 ) {
                    args.push(resolveArgument(arg, env));
                }
                else { // special handling of last argument
                    if (arg.obj instanceof Array || arg === null) {
                        if (arg.obj.length === 1) {
                            outvar = new RenamedVarsObject({obj : arg.obj[0]}, list.level);
                        }
                        else if (arg.obj.length > 1) {
                            outvar = new RenamedVarsObject({obj : arg.obj}, list.level);
                        }   
                    }
                    else {
                        args.push(resolveArgument(arg, env));
                    }
                }
            }
            var retObj;
            try {
                retObj = { obj : callbackFn.apply(this.ctrlScope, args) };
            }
            catch(err) {
                throw ('callback failed: '+ fname + '\n' + err);
            }
            if (retObj.obj != null) {
                if ( outvar != null) {
                    var val = new RenamedVarsObject(retObj, list.level);
                    result = core.unify.apply(this, [val, outvar, goalList, core.envWrap(env), rules,  accum]);
                }
                else {
                    result = env;
                }
            }
            
        }
        else {
            var err = new Error('unknown callback : ' + fname);
            throw err.stack;
        }
        if (result != null) {// continue the recursion
            this.level++;
            result = core.qeval.apply(this, [goalList, core.envClone(result, true), rules,  accum, true]);
        }
    }
    return result;
}

 
/*
 *query is the moral eqvt of bagOf in prolog. It collects results obtained by the given,  query
 *and makes an array of objects out of them. As with bagOf, it should be used to collect multiple
 *results from a query without exploding the final result
 */

exports.$query = function query (list, goalList, env, rules, accum) {
    var result = null;
    /* $query takes 3 params: query goal, transform, outvar */
            
    if (list.obj.length === 3) { 
        var JSL = require('../jsl.js');
        var obj1 = resolveArgument(list.get(0),env);
        var obj2 = resolveArgument(list.get(1),env);
        var config ={
            query : obj1,
            callbacks : this.callbacks,
            rules : rules,
            //subquery : true
        };
        if (obj2 != null) {
            config.transform = obj2
        }

        var jsl = new JSL(config);
        var retObj = jsl.run();
        if (retObj != null) {
            var outvar;
            var obj3 = resolveArgument(list.get(2),env);
            if (obj3 != null) { 
                outvar = new RenamedVarsObject({obj : obj3}, list.level);
            }   
            if ( outvar != null) {
                var val = new RenamedVarsObject({obj : retObj}, list.level);
                result = core.unify.apply(this, [val, outvar, goalList, core.envWrap(env), rules,  accum]);
            }
        }
        if (result != null) { //continue the recursion
            this.level++;
            result = core.qeval.apply(this, [goalList, core.envClone(result, true), rules,  accum, true]);
        }
    }
    return result;  
}


exports.$bind = function bind (list,  goalList, env, rules,  accum) {
    var result = null;

    if (list.obj.length === 2) {  //bind is strictly binary

        var arg1 = list.get(0);
        var arg2 = list.get(1);       

        result = core.unify.apply(this, [arg1, arg2, goalList, core.envWrap(env), rules, accum]);
        //console.log('$bindresult: ', result);

        if (result != null) { //continue the recursion
            this.level++;
            result = core.qeval.apply(this, [goalList, core.envClone(result, true), rules,  accum, true]);
        }
    }
    return result;
}

