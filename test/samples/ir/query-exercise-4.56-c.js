/*Exercise 4.56.  Formulate compound queries that retrieve the following information:

c. all people who are supervised by someone who is not in the computer division, together with the supervisor's name and job.
*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRules = [
               [    { result : { name : '$x', supervisor : '$y', supervisorTitle : '$z'} },
                    { supervisor : { name : '$x', manager : '$y'} },
                    { job : { name : '$y', title : '$z'} },
                    { $call : [ 'nomatch', '$z', '^computer'] } 
                ] ];
var query = [ { result : '$result' } ]; 
var transform = '$result';

function nomatch (x,y) {
    return x.match(new RegExp(y)) != null ? null : true; 
}

var callbacks = {
    nomatch : nomatch
}
var jsl = new JSL({rules : ruleset.concat(filterRules), query: query, transform: transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;
