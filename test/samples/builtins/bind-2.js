var JSL = require('../../..');

var ruleset = [
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ { a : 1, b : 2 , c : { p : 1, q : 2 } }, { a : '$x', b : '$y', c : '$z'} ]  }
    ] ,
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ { a : '$x', b : '$y', c : '$z'}, { a : 4, b : 5 , c : ['arrays', 'also', 'work'] } ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ [{ a : '$x', b : '$y'}, '$z'],  [ { a : 'list', b : 'of' }, 'objects'  ] ] }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ ['array', 'with', 'several', 'values', 'by', 'position' ], ['$discard1', '$discard2', '$discard3', '$x', '$y', '$z'] ] }
    ]
];

var query =     [{result : '$result'}];
var transform = '$result';

var jsl = new JSL ({rules : ruleset, query: query, transform : transform});
var response = jsl.run();

module.exports = response;
