/*
...
(rule (wheel ?person)
      (and (supervisor ?middle-manager ?person)
           (supervisor ?x ?middle-manager)))

...
...

Cy D. Fect, looking forward to the day when he will rise in the organization, 
gives a query to find all the wheels (using the wheel rule of section 4.4.1):

(wheel ?who)

To his surprise, the system responds

;;; Query results:
(wheel (Warbucks Oliver))
(wheel (Bitdiddle Ben))
(wheel (Warbucks Oliver))
(wheel (Warbucks Oliver))
(wheel (Warbucks Oliver))

Why is Oliver Warbucks listed four times?


*/

var JSL = require('../../..');

var ruleset = require('./db.js');


var problemRules = [
    [
        { wheel :  '$person' },
        { $and : [ 
            { supervisor : { name : '$middle-manager',  manager : '$person'} },
            { supervisor : { name : '$x', manager : '$middle-manager' } } 
        ]}
    ]
];

var solutionRules = [
    [
        { wheel :  '$person' },
        { $and : [ 
            { supervisor : { name : '$middle-manager',  manager : '$person'} },
            { supervisor : { name : '$x', manager : '$middle-manager' } } 
        ]},
        { $call : [ 'notSeen', '$person'] }
    ]
];

var query;
var response = {}; 

query  = [ { wheel : '$who' } ];
var jsl = new JSL({rules : ruleset.concat(problemRules), query: query});
response.problem = jsl.run();

/*  to solve the duplication problem, we simply invent a callback which keeps (in its environment), a list of
    names already "seen", and returns null for duplicates.
    A $call object added to the end of the rule effecively filters out duplicates
    The callback is given an array to work with during its construction

    The solution illustrates the ease of cooperation betweeh JSL rules and JS host environment
*/

function notSeen () {
    var list = []; // static variable
    return function(x) {
        var result = null;
        if (list.indexOf(x) < 0) {
            result = true;
            list.push(x);
        }
        return result;
    }
}

var callbacks = {
    notSeen : notSeen()
}


jsl = new JSL({rules : ruleset.concat(solutionRules), query: query, callbacks : callbacks});
response.solution = jsl.run();

module.exports = response;
