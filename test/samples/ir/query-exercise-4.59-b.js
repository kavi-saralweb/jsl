/*

b. Alyssa P. Hacker is unimpressed. She thinks it would be much more useful to be able to ask for her meetings by specifying her name. So she designs a rule that says that a person's meetings include all whole-company meetings plus all meetings of that person's division. Fill in the body of Alyssa's rule.

(rule (meeting-time ?person ?day-and-time)
      <rule-body>)
*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var meetings = [
    [{meeting : { department : 'accounting', day : 'Monday', hour : 9, minute : 0} }],
    [{meeting : { department : 'administration', day : 'Monday', hour : 10, minute : 0} }],
    [{meeting : { department : 'computer', day : 'Wednesday', hour : 15, minute : 0} }],
    [{meeting : { department : 'administration', day : 'Friday', hour : 13, minute : 0} }],
    [{meeting : { department : 'whole-company', day : 'Wednesday', hour : 13, minute : 0} }],
];

var filterRules = [
    [
        { meeting_time : { person : '$person', dept : '$dept', day : '$day', hour : '$hour', minute : '$minute' } },
        { job : { name : '$person', title : '$title'} },
        { meeting : { department : '$dept', day : '$day', hour : '$hour', minute : '$minute' } },
        { $or : [
            { $call : [ 'deptMatch', '$title', '$dept'] },
            {$bind : [ '$dept', 'whole-company'] }
        ]}
    ]
];

function deptMatch (title, dept) {
    var re = new RegExp('^' + dept + '\\s+');
    return title.match(re); // match returns null on failure, which is what we need callbacks to return on failure
}

var callbacks = { 
    deptMatch : deptMatch
};
// sample query to get Alyssa P Hacker's meetings for the whole week

var query = [ { meeting_time : { person : 'Hacker Alyssa P', dept : '$dept', day : '$day', hour : '$hour', minute : '$min'} } ]; 
var transform = { person : 'Hacker Alyssa P', dept : '$dept', day : '$day', hour : '$hour', minute : '$min'};

var jsl = new JSL({rules : ruleset.concat(meetings, filterRules), query: query, transform: transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;
