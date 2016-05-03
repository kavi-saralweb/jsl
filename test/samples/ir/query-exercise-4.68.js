/*ui
Exercise 4.68.  Define rules to implement the reverse operation of exercise 2.18, which returns a list containing the same elements as a given list in reverse order. (Hint: Use append-to-form.) Can your rules answer both (reverse (1 2 3) ?x) and (reverse ?x (1 2 3)) ?

        for reference,

        Exercise 2.18.  Define a procedure reverse that takes a list as argument and returns a list of the same elements in reverse order:

        (reverse (list 1 4 9 16 25))
        (25 16 9 4 1)
*/

var JSL = require('../../..');

var ruleset = [];

var rules = [
    [
        { reverse : ['$list', '$reverse'] },
        { $or : [
            { $and : [
                { $call: [ 'objEqual', '$list', [], [] ] },
                {$bind : [ '$reverse', [] ] }
            ]},
            { $and : [
                { $call : [ 'parseList', '$list', [ '$head', '$tail' ] ] },
                { reverse : [ '$tail', '$tailreverse'] },
                { $call : [ 'concat', '$tailreverse', ['$head'], ['$reverse'] ] }
            ] },
            { $and : [
                { $call : [ 'parseList', '$reverse', [ '$head', '$tail' ] ] },
                { reverse : [ '$tail', '$tailreverse'] },
                { $call : [ 'concat', '$tailreverse', ['$head'], ['$list'] ] }
            ] }

        ]}
    ]
];

var response = {};
var query1 = [ { reverse : [[1,2,3], '$x'] } ];
var query2 = [ { reverse : ['$x', [1,2,3] ] } ];


var jsl = new JSL({rules : ruleset.concat(rules), query: query1});
response.query1 = jsl.run();

jsl = new JSL({rules : ruleset.concat(rules), query: query2});
response.query2 = jsl.run();

/*
    Since our callback parseList fails on non array inputs, we can make either form of reverse query work 
    by writing 2 rules: one to satisfy reversing of first argument, and the second to satisfy reversing of second argument
    We take advantage of our knowledge that unbound variables will cause the callback to return null (fail)
*/

    
module.exports = response;
