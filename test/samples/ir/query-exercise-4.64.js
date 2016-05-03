/*
...
(rule (outranked-by ?staff-person ?boss)
      (or (supervisor ?staff-person ?boss)
          (and (supervisor ?staff-person ?middle-manager)
               (outranked-by ?middle-manager ?boss))))
...
...

Exercise 4.64.  Louis Reasoner mistakenly deletes the outranked-by rule (section 4.4.1) from the data base. 
When he realizes this, he quickly reinstalls it. Unfortunately, he makes a slight change in the rule, and types it in as

(rule (outranked-by ?staff-person ?boss)
      (or (supervisor ?staff-person ?boss)
          (and (outranked-by ?middle-manager ?boss)
               (supervisor ?staff-person ?middle-manager))))

Just after Louis types this information into the system, DeWitt Aull comes by to find out who outranks Ben Bitdiddle. He issues the query

(outranked-by (Bitdiddle Ben) ?who)

After answering, the system goes into an infinite loop. Explain why.
*/

/*
    JSL $or does not work the same as the textbook implementation. It stops at the first successful object.
    Thus, it does not try to find all bosses for a given employee, it just stops at the first one.

    To enumerate all bosses of a given $name, we must include an additional object in the rule 
    which matches all employees in the database. Then our ruleset produces all bosses for a given $name

    Then we can reproduce the infinite recursion encountered by Louis by making the same rearrangement 

    The infinite recursion is caused by repeated invocation of outranked_by with an unbound variable, 
    giving the recursion no chance to terminate

    Thus one needs to be conscious of the order of evaluation of rules in JSL, just as with the textbook implementation
*/

var JSL = require('../../..');

var ruleset = require('./db.js');


var filterRules = [
    [
        { outranked_by : { name : '$name', boss : '$boss'} },
        { employee : { name : '$boss', address : '$address'}}, //<-- additional rule to enumerate all employees
        { $or : [
            { supervisor : { name : '$name', manager : '$boss' } },
            { $and : [
                { supervisor : { name : '$name', manager : '$middleManager'} },
                { outranked_by : { name : '$middleManager', boss : '$boss' } },
            ]},
        ]}
    ]
];


/* this rearrangement produces an infinite loop */

/*
var badRules = [
    [
        { outranked_by : { name : '$name', boss : '$boss'} },
        { employee : { name : '$boss', address : '$address'}},
        { $or : [
            { supervisor : { name : '$name', manager : '$boss' } },
            { $and : [
                { outranked_by : { name : '$middleManager', boss : '$boss' } },
                { supervisor : { name : '$name', manager : 'middleManager'} }
            ]},
        ]}
    ]
];
*/

var query;
var response = {}; 

query  = [ { outranked_by : { name : 'Reasoner Louis', boss : '$who' } } ];
var jsl = new JSL({rules : ruleset.concat(filterRules), query: query});
response = jsl.run();

module.exports = response;
