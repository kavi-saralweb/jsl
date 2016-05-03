/*Exercise 4.57.  Define a rule that says that person 1 can replace person 2 
    if either person 1 does the same job as person 2 
        or someone who does person 1's job can also do person 2's job, 
        and if person 1 and person 2 are not the same person. 

        Using your rule, give queries that find the following:

b.  all people who can replace someone who is being paid more than they are, together with the two salaries.

*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRules = [
                    [
                        { replace : { name : '$x', replacement : '$y'} },
                        { employee : { name : '$x' } },
                        { employee : { name : '$y' } },
                        { $not : [ {$bind : [ '$x', '$y'] } ] },
                        { $or : [ 
                            { $and : [ 
                                { job : { name : '$x', title : '$t'} },
                                { job : { name : '$y', title : '$t'} },
                            ]},
                            { $and : [
                                { job : { name : '$x', title : '$tx' } },
                                { job : { name : '$y', title : '$ty' } },
                                { can_do_job : { who : '$ty', whose : '$tx' } }
                            ]}
                        ]}
                    ],
                    [ 
                        { result : { name : '$x', replacement : '$y', salary : '$sx', replSalary : '$sy' } },
                        { replace : { name : '$x', replacement : '$y' } },
                        { salary : { name : '$x', amount : '$sx' } },
                        { salary : { name : '$y', amount : '$sy' } },
                        { $call : [ 'gt', '$sx', '$sy'] }
                    ]
                ];
var query = [ { result : '$result' } ]; 
var transform = '$result';

function gt (x,y) {
    return x > y ? true : null;
}

var callbacks = { gt : gt };
var jsl = new JSL({rules : ruleset.concat(filterRules), query: query, transform: transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;
