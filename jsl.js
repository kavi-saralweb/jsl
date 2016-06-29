var utils = require('./lib/utils.js');
var core = require('./lib/core.js');
var cblib = require('./lib/cblib.js');
var setscb = require('./includes/set-operations.js');

function cleanup() {
    Object.keys(this.env).forEach(function(k) {
        delete this.env[k];
    })
}

function accumResultQuery(query) {
    return function (environment) {
        var func = function(x) {
            var result = x;
            if (utils.isVariable(x)) {
                result = utils.getFinalValue(x+'.0', environment);
            }
            return result;
        }
        var result = utils.objMap(this.transform, func);
        this.finalResult.push(result);
    }
}

var JSL = function(opts) {
    if ( !(this instanceof JSL) ) {
        return new JSL(opts);
    }
    opts = opts != null ? opts : {};

    var includes = {
        set: setscb
    }    


    this.env = {};
    this.rules = opts.rules || [];
    this.subquery = opts.subquery;
    this.query = opts.query || [];
    this.transform = opts.transform || this.query;
    var internalCallbacks = utils.objMerge(cblib, utils.objectToPaths(includes));
    this.callbacks = utils.objMerge(internalCallbacks, opts.callbacks);
    this.finalResult = [];

    if ( opts.ctrlScope != null ) {
        this.ctrlScope = opts.ctrlScope;
    }
    this.level = 0;
}

JSL.prototype.run = function() {
    var accumFn = accumResultQuery();
    this.level = 0;
    core.qeval.apply(this, [utils.renameVariables(this.query,0), this.env, this.rules, accumFn, false]);
    cleanup.apply(this);

    return this.finalResult;
}


exports = module.exports = JSL;
