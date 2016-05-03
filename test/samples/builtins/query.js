var JSL = require('../../..');

var ruleset = [
    [{ row : { a : 1, b :2 } } ],
    [{ row : { a : 3, b :4 } } ],
    [{ row : { a : 5, b :6 } } ],
    [{ row : { a : 7, b :8 } } ],
    [{ row : { a : 9, b :10 } } ],
    [{ rowset : '$x' },
     { $query : [ [{row : '$row'}], '$row', '$x'] }]
    
];

var query = [{rowset : '$rowset'}];
var transform = '$rowset';
var jsl = new JSL({rules : ruleset, query: query, transform : transform});
var response = jsl.run();

module.exports = response;
