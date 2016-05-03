/*ui
Exertcise 4.62.  Define rules to implement the last-pair operation of exercise 2.17, which returns a list containing the last element of a nonempty list. Check your rules on queries such as (last-pair (3) ?x), (last-pair (1 2 3) ?x), and (last-pair (2 ?x) (3)). Do your rules work correctly on queries such as (last-pair ?x (3)) ?

        for reference,

        Exercise 2.17.  Define a procedure last-pair that returns the list that contains only the last element of a given (nonempty) list:

        (last-pair (list 23 72 149 34))
        (34)

*/

var JSL = require('../../..');

var ruleset = [];

/* 
    We take the liberty to translate the problem to last_element
    Since JS arrays are not lists of pairs

    We use the standard  callback 'parseList' included with JSL, 
    it returns the head and tail of an array
    parseList is the building block of cons/cdr style recursive list processing in JSL    

    We also use the standard callback 'objEqual' included with JSL,
    it tests two JS values (null, String, Object, Array) to check if they are equal
*/


var rules = [
    [
        { last_element : ['$list', '$x'] },
        { $or : [
            { $and : [
                { $call: [ 'objEqual', '$list', [], [] ] }, //<-- must give an empty array at end to avoid confusing outObj interpretation
                {$bind : [ '$x', [] ] }
            ]},
            { $and : [
                { $call : [ 'parseList', '$list', [ '$head', '$tail' ] ] },
                { $call : [ 'objEqual', '$tail', [], [] ] }, //<-- must give an empty array at end to avoid confusing outObj interpretation
                {$bind : [ '$x', '$head' ] }
            ] },
            { $and : [ 
                { $call : [ 'parseList', '$list', [ '$head', '$tail' ] ] },
                { last_element : [ '$tail', '$x' ] }
            ] }
        ]}
    ]
];

var response = {};
var query1 = [ { last_element : [[3], '$x'] } ];
var query2 = [ { last_element : [[1,2,3], '$x'] } ];
var query3 = [ { last_element : ['$x', [3]] } ];

/*
    query1 and query2 work as expected, reporting the last element of the given list
    query3 fortunately fails due to the implementation of parseList which returns null if the given input list is not an array
    Since $x is an unbound variable when parseList is $called in query3, it simply returns null
    so we get an empty list in the response

    It is possible to imagine the correct result of query3 being an infinite set of all lists with 3 at the end 
    but we do not obtain that result in our implementation

*/
var jsl = new JSL({rules : ruleset.concat(rules), query: query1});
response.query1 = jsl.run();
jsl = new JSL({rules : ruleset.concat(rules), query: query2});
response.query2 = jsl.run();
jsl = new JSL({rules : ruleset.concat(rules), query: query3});
response.query3 = jsl.run();

module.exports = response;
