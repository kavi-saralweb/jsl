var JSL = require('../../..');

var ruleset = [
    [   { result : '$x' },
        { $call : [ 'concat',
            [ 1, 2 ,3 ],
            [ 4, 5, 6 ],
            ['$x']
        ]}
    ],
    [   { result : '$x' },
        { $call : [ 'concat', 
            [ 1, 2 ,{ a : 1, b : 2 } ],
            [ 4, 5, { a : 3, c : 4 } ],
            ['$x']
        ]}
    ],

    [   { result : '$x' },
        { $call : [ 'concat', 
            'a', 'b', 'c', 'd', ['$x']
        ]}
    ],

    [   { result : '$x' },
        { $call : [ 'concat', 
            ['a', 'b'], ['c', 'd'], ['e', 'f'], ['$x']
        ]}
    ],

    /* failure cases */

    /* mixing of strings and arrays not allowed */

    [   { result : '$x' },
        { $call : [ 'concat', 
            'a', 'b', 'c', ['d'], ['$x']
        ]}
    ],

    /* concat will not work with objects */
    [   { result : '$x' },
        { $call : [ 'concat',
            {a:1, b:2}, 
            {c:3, d:4}, 
            ['$x']
        ]}
    ]

];

var query =     [{result : '$result'}];
var transform = '$result';

var jsl = new JSL ({rules : ruleset, query: query, transform : transform});
var response = jsl.run();

module.exports = response;
