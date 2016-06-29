exports = module.exports = {};
exports.intersection = function intersection(a, b) {
    var x,y, retval;
    if ( a instanceof Array && b instanceof Array ) {
        if ( a.length >= b.length ) {
            x = a;
            y = b;
        }
        else {
            x = b;
            y = a;
        }

        retval = [];
        x.filter(function(e) { return y.indexOf(e) >= 0  })
        .forEach(function(e) {
            if ( retval.indexOf(e) < 0 ) {
                retval.push(e);
            }
        })
    }
    return retval == null || retval.length === 0 ? null : retval;
}


exports.union = function union(a, b) {
    var retval;
    if ( a instanceof Array && b instanceof Array ) {
        retval = [];
        var union = [].concat(a,b);
        union.forEach(function(e) {
            if ( retval.indexOf(e) < 0 ) {
                retval.push(e);
            }
        })
    }
    return retval == null || retval.length === 0 ? null : retval;
}

exports.difference = function difference(a, b) {
    var retval;
    if ( a instanceof Array && b instanceof Array ) {
        retval = [];
        a.filter(function(e) { return b.indexOf(e) < 0  })
        .forEach(function(e) {
            if ( retval.indexOf(e) < 0 ) {
                retval.push(e);
            }
        })
    }
    return retval == null || retval.length === 0 ? null : retval;
}

exports.subset = function subset(a, b) {
    var retval;
    if ( a instanceof Array && b instanceof Array ) {
        retval = a.every(function(e) { return b.indexOf(e) >= 0  })
    }
    return retval == null || retval.length === 0 ? null : retval;
}
