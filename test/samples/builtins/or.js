var JSL = require('../../..');

var ruleset = [
    [   { result : ['$x', '$y', '$z'] },
        { $or : [ 
            {$bind : [ { a : 1, b : 2 , c : 3 }, { a : '$x', b : '$y', c : '$z'} ]  }, // <--
            {$bind : [ { a : 4, b : 5 , c : 6 }, { a : '$x', b : '$y', c : '$z'} ]  },
            {$bind : [ { a : 7, b : 8 , c : 9 }, { a : '$x', b : '$y', c : '$z'} ]  }
        ]}
    ],


    [   { result : ['$x', '$y', '$z'] },
        { $or : [ 
            {$bind : [ { a : 1, b : 2 , c : 3 }, { a : '$x', b : '$y', c : '$z', d:10} ]  },
            {$bind : [ { a : 4, b : 5 , c : 6 }, { a : '$x', b : '$y', c : '$z'} ]  }, // <--
            {$bind : [ { a : 7, b : 8 , c : 9 }, { a : '$x', b : '$y', c : '$z'} ]  }
        ]}
    ],

    [   { result : ['$x', '$y', '$z'] },
        { $or : [ 
            {$bind : [ { a : 1, b : 2 , c : 3 }, { a : '$x', b : '$y', c : '$z', d:10} ]  },
            {$bind : [ { a : 4, b : 5 }, { a : '$x', b : '$y', c : '$z'} ]  }, 
            {$bind : [ { a : 7, b : 8 , c : 9 }, { a : '$x', b : '$y', c : '$z'} ]  } //<--
        ]}
    ]

];

var query =     [{result : '$result'}];
var transform = '$result';

var jsl = new JSL ({rules : ruleset, query: query, transform : transform});
var response = jsl.run();

module.exports = response;
