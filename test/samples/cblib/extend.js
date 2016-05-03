var JSL = require('../../..');

var ruleset = [
    [   { result : '$x' },
        { $call : [ 'extend', 
            { a : 1, b : 2 },
            { c : 3, d : 4 },
            ['$x']
        ]}
    ],
    [   { result : '$x' },
        { $call : [  'extend', 
            { a : 1, b : 2 },
            { a : 3, d : 4 }, // <-- a will be set to 3
            ['$x']
        ]}
    ],
    [   { result : '$x' },
        { $call : [  'extend', 
            { a : { x : 'a', y : 'q'} , b : 2 },
            { a : 3, d : 4 },  // <-- a will be set to 3
            ['$x']
        ]}
    ],
    [   { result : '$x' },
        { $call : [  'extend', 
            { a : 3, d : 4 }, 
            { a : { x : 'a', y : 'q'} , b : 2 }, // <-- a will be set to {x:'a', y:'b'}
            ['$x']
        ]}
    ],
    /* extend will not work with arrays */
    [   { result : '$x' },
        { $call : [  'extend', 
            [1,2,3], 
            [4,5,6], 
            ['$x']
        ]}
    ]

];

var query =     [{result : '$result'}];
var transform = '$result';

var jsl = new JSL ({rules : ruleset, query: query, transform : transform});
var response = jsl.run();

module.exports = response;
