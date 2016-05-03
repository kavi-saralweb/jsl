/*
...
(rule (lives-near ?person-1 ?person-2)
      (and (address ?person-1 (?town . ?rest-1))
           (address ?person-2 (?town . ?rest-2))
           (not (same ?person-1 ?person-2))))
...
...
Exercise 4.60.  By giving the query

(lives-near ?person (Hacker Alyssa P))

Alyssa P. Hacker is able to find people who live near her, with whom she can ride to work. 
On the other hand, when she tries to find all pairs of people who live near each other by querying

(lives-near ?person-1 ?person-2)

she notices that each pair of people who live near each other is listed twice; for example,

(lives-near (Hacker Alyssa P) (Fect Cy D))
(lives-near (Fect Cy D) (Hacker Alyssa P))

Why does this happen? Is there a way to find a list of people who live near each other, in which each pair appears only once? Explain.

*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var problemRules = [
    [
        { lives_near : { person1 : '$person1', person2: '$person2' } },
        { $and : [ 
            { employee : { name : '$person1', address : ['$town', '$street1', '$number1']} },
            { employee : { name : '$person2', address : ['$town', '$street2', '$number2']} },
            { $not : [ {$bind : [ '$person1', '$person2']  } ]  }            
        ]}
    ]
];

var query;
var response = {};
query = [ { lives_near : { person1 : '$person1', person2: '$person2' } } ];


var pjsl = new JSL({rules : ruleset.concat(problemRules), query: query});
response.problem = pjsl.run();

/*
    We solve the duplicate suppression problem easily using a callback
*/
var solutionRules = [
    [
        { lives_near : { person1 : '$person1', person2: '$person2' } },
        { $and : [ 
            { employee : { name : '$person1', address : ['$town', '$street1', '$number1']} },
            { employee : { name : '$person2', address : ['$town', '$street2', '$number2']} },
            { $not : [ {$bind : [ '$person1', '$person2']  } ]  },
            { $call : [ 'str_gt', '$person1', '$person2'] }
        ]}
    ]
];

function str_gt (x,y) {
    return x > y ? true : null;
}

var callbacks = { 
    str_gt : str_gt
};


var sjsl = new JSL({rules : ruleset.concat(solutionRules), query: query, callbacks : callbacks});
response.solution = sjsl.run();
module.exports = response;
