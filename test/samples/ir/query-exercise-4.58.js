/*
Exercise 4.58.  Define a rule that says that a person is a ``big shot'' in a division 
if the person works in the division but does not have a supervisor who works in the division.
*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRules = [
                    [
                        { bigShot : { name : '$x', title : '$tx', supervisor : '$y', supervisorTitle : '$ty' } },
                        { employee : { name : '$x'} },
                        { supervisor : { name : '$x', manager : '$y'} },
                        { job : { name : '$x', title : '$tx' } },
                        { job : { name : '$y', title : '$ty' } },
                        { $call : [ 'noMatchFirst', '$tx', '$ty'] }
                    ],
                ];
var query = [ { bigShot : { name : '$name', title : '$title' , supervisor : '$y', supervisorTitle : '$ty' } } ]; 
var transform = { name : '$name', title : '$title' , supervisor : '$y', supervisorTitle : '$ty' }; 

function noMatchFirst (x,y) {
    var x1 = (x.split(/\s+/)).shift();
    var y1 = (y.split(/\s+/)).shift();
    return x1 !== y1 ? true : null;
}

var callbacks = { noMatchFirst : noMatchFirst };
var jsl = new JSL({rules : ruleset.concat(filterRules), query: query, transform: transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;
