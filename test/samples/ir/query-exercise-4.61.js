/*
Exercise 4.61.  The following rules implement a next-to relation that finds adjacent elements of a list:

(rule (?x next-to ?y in (?x ?y . ?u)))

(rule (?x next-to ?y in (?v . ?z))
      (?x next-to ?y in ?z))

What will the response be to the following queries?

(?x next-to ?y in (1 (2 3) 4))

(?x next-to 1 in (2 1 3 1))

*/

var JSL = require('../../..');

var ruleset = [];

/* 
    We use the standard parseList callback included with JSL, 
    it returns the head and tail of an array
    parseList is the building block of cons/cdr style recursive list processing in JSL    
*/

var rules = [
    [
        { next_to : ['$x', '$y', '$list'] },
        { '$and' : [ 
            { $call : [ 'parseList', '$list', ['$x', '$xtail'] ] },
            { $call : [ 'parseList', '$xtail', ['$y', '$ytail'] ] }
        ]}
    ],
    [
        { next_to : ['$x', '$y', '$list'] },
        { $and : [ 
            { $call : [ 'parseList', '$list', ['$head', '$tail'] ] },
            { next_to : [ '$x', '$y', '$tail' ] }
        ] }
    ]
];

var response = {};
var query1 = [ { next_to : ['$x', '$y', [ 1 , [ 2 , 3 ] , 4 ] ] } ];
var query2 = [ { next_to : ['$x', 1 , [ 2, 1, 3, 1] ] } ];

/* we add another query to enumerate all neighbors */
var query3 = [ { next_to : ['$x', '$y' , [ 2, 1, 3, 1] ] } ];



var jsl = new JSL({rules : ruleset.concat(rules), query: query1});
response.query1 = jsl.run();
jsl = new JSL({rules : ruleset.concat(rules), query: query2});
response.query2 = jsl.run();
jsl = new JSL({rules : ruleset.concat(rules), query: query3});
response.query3 = jsl.run();

/*
 *Responses to query1 show the rules working at the topmost level only; they only find neighbors at the
 *top level of the list.
 */
module.exports = response;
