var JSL = require('../../..');

var ruleset = [
    [   { result : ['$x', '$y', '$z'] },
        { $and : [ 
            { $not : [ {$bind : [ [ 1, 2, 3, 4], ['$x', '$y', '$z', '$x']] } ]}, //<--$bind will fail due to conflict in $x, but $not succeeds
            { $and : [ 
                {$bind : [ { a : 1 }, { a : '$x' } ]  },
                {$bind : [ { b : 2 }, { b : '$y' } ]  },
                {$bind : [ { c : 3 }, { c : '$z' } ]  }
            ]}
        ]}
    ],
    [   { result : ['$x', '$y', '$z'] },
        { $and : [ 
            { $not : [ { foo : '$bar' }]}, //<-- foo:$bar fails, but $not succeeds
            { $and : [ 
                {$bind : [ { a : 4 }, { a : '$x' } ]  },
                {$bind : [ { b : 5 }, { b : '$y' } ]  },
                {$bind : [ { c : 6 }, { c : '$z' } ]  }
            ]}
        ]}
    ],



];

var query =     [{result : '$result'}];
var transform = '$result';

var jsl = new JSL ({rules : ruleset, query: query, transform : transform});
var response = jsl.run();

module.exports = response;
