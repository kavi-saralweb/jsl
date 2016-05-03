var utils = require('./utils.js');

var RenamedVarsObject = function RenamedVarsObject(obj, level) {
    if (level == null) {
        throw ('RenamedVarsObject cannot have an undefined level', new Error().stack);
    }
    this.obj  = obj;
    this.level = level;
}


RenamedVarsObject.prototype.get = function get(x) {
    var result = typeof this.obj === 'object' ? this.obj[x] : x === this.obj ? x : null;
    if (typeof result === 'object') {
        result = new RenamedVarsObject(result, this.level);
    }
    else if (utils.isVariable(result)) {
        result = result + '.' + this.level;
    }
    return result;
}

RenamedVarsObject.prototype.makeArray = function makeArray() {
    var result = null;
    if (this.obj instanceof Array) {
        var level = this.level;
        result = [];
        for (var i=0; i<this.obj.length; i++) {
            result.push(new RenamedVarsObject(this.obj[i], level));
        }
    }
    return result;
}

module.exports = RenamedVarsObject;
