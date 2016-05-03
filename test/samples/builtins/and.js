var JSL = require('../../..');

var ruleset = [
    [   { result : ['$x', '$y', '$z'] },
        { $and : [ 
            {$bind : [ { a : 1 }, { a : '$x' } ]  },
            {$bind : [ { b : 2 }, { b : '$y' } ]  },
            {$bind : [ { c : 3 }, { c : '$z' } ]  }
        ]}
    ],

    [   { result : ['$x', '$y', '$z'] },
        { $or : [
            { $and : [ 
                {$bind : [ { a : 4 }, { a : '$x' } ]  },
                {$bind : [ { b : 5 }, { b : '$y', d: 10 } ]  }, //<-- fail
                {$bind : [ { c : 6 }, { c : '$z' } ]  }
            ]},
            {$bind : [ ['a', 'b', 'c'], ['$x', '$y', '$z'] ] } //<-- succeed
        ]}
        
    ],

    [   { result : ['$x', '$y', '$z'] },
        { $or : [
            { $and : [ 
                {$bind : [ { a : 7 }, { a : '$x' } ]  },
                {$bind : [ { b : 8 }, { b : '$y' } ]  }, 
                {$bind : [ { c : 9 }, { c : '$z' } ]  },
                {$bind : [ { d : 10 }, { d : '$x' } ]  }, //<-- fail, inconsistent binding for $x
            ]},
            {$bind : [ ['d', 'e', 'f'], ['$x', '$y', '$z'] ] } //<-- succeed
        ]}
        
    ],

];

var query =     [{result : '$result'}];
var transform = '$result';

var jsl = new JSL ({rules : ruleset, query: query, transform : transform});
var response = jsl.run();

module.exports = response;
