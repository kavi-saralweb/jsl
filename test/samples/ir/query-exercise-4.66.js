/*
Exercise 4.66.  Ben has been generalizing the query system to provide statistics about the company. 
For example, to find the total salaries of all the computer programmers one will be able to say

(sum ?amount
     (and (job ?x (computer programmer))
          (salary ?x ?amount)))

In general, Ben's new system allows expressions of the form

(accumulation-function <variable>
                       <query pattern>)

where accumulation-function can be things like sum, average, or maximum. 
Ben reasons that it should be a cinch to implement this. He will simply feed the query pattern to qeval. 
This will produce a stream of frames. He will then pass this stream through a mapping function 
that extracts the value of the designated variable from each frame in the stream and feed the 
resulting stream of values to the accumulation function. Just as Ben completes the implementation and 
is about to try it out, Cy walks by, still puzzling over the wheel query result in exercise 4.65. 
When Cy shows Ben the system's response, Ben groans, ``Oh, no, my simple accumulation scheme won't work!''

What has Ben just realized? Outline a method he can use to salvage the situation.

*/

/*
    Ben's approach won't work due to duplicates in possible outputs produced by rules which feed the accumulator
    We don't bother to reproduce the problem since it was done in exercise 4.65, along with a duplicate suppressor callback
    we simply use that callback here and introduce another callback to accumulate the sum
    this time we don't discard the output of the accumulator, but$bind it to a JSL variable, allowing us to output the sum
    Finally, we use the fact that response is simply an array of all the intermediate results returned by sum and pop its last element 
    to obtain the final response from the module

    This solution illustrates the application of JS and JSl working together on non trivial problems
*/

var JSL = require('../../..');

var ruleset = require('./db.js');



var solutionRules = [
    [
        { sum :  { title : '$title', totalSalary : '$total' } },
        { $and : [ 
            { job : { name : '$x',  title : '$title'} },
            { salary : { name : '$x', amount : '$amount' } },
            { $call : [ 'notSeen', '$x'] },
            { $call : [ 'accum', '$amount', ['$total'] ] } // use $total as out variable for callback to return into
        ]}
    ]
];



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

function accum () {
    var accumVar = 0; // static variable 
    return function(x) {
        return accumVar += x;
    }
}

var callbacks = {
    notSeen : notSeen(), 
    accum :  accum() 
}


var query = [{ sum : { title : 'computer programmer', totalSalary : '$totalSalary'}  }]
var jsl = new JSL({rules : ruleset.concat(solutionRules), query: query, callbacks : callbacks}) ;
var response = jsl.run();

module.exports = response.pop(); // just get the last result of accumulation
