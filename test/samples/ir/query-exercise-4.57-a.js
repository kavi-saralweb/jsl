/*Exercise 4.57.  Define a rule that says that person 1 can replace person 2 
    if either person 1 does the same job as person 2 
        or someone who does person 1's job can also do person 2's job, 
        and if person 1 and person 2 are not the same person. 

        Using your rule, give queries that find the following:

        a.  all people who can replace Cy D. Fect;
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
                ];
var query = [ { replace : '$replace' } ]; 
var transform = '$replace';


var jsl = new JSL({rules : ruleset.concat(filterRules), query: query, transform: transform});
var response = jsl.run();

module.exports = response;
