/*
Exercise 4.59.  Ben Bitdiddle has missed one meeting too many. Fearing that his habit of forgetting meetings could cost him his job, Ben decides to do something about it. He adds all the weekly meetings of the firm to the Microshaft data base by asserting the following:

(meeting accounting (Monday 9am))
(meeting administration (Monday 10am))
(meeting computer (Wednesday 3pm))
(meeting administration (Friday 1pm))

Each of the above assertions is for a meeting of an entire division. Ben also adds an entry for the company-wide meeting that spans all the divisions. All of the company's employees attend this meeting.

(meeting whole-company (Wednesday 4pm))

a. On Friday morning, Ben wants to query the data base for all the meetings that occur that day. What query should he use?
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

var query = [ { meeting : { department : '$d', day : 'Friday', hour : '$h', minute : '$m'} } ]; 
var transform = { department : '$d', day : 'Friday', hour : '$h', minute : '$m'}; 

var jsl = new JSL({rules : ruleset.concat(meetings), query: query, transform: transform});
var response = jsl.run();

module.exports = response;
