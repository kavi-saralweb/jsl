/*Exercise 4.56.  Formulate compound queries that retrieve the following information:

b. all people whose salary is less than Ben Bitdiddle's, together with their salary and Ben Bitdiddle's salary;
*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRules = [
               [   { benSalary : '$benSalary'},
                   { salary : { name : 'Bitdiddle Ben', amount : '$benSalary'} }
               ], 
               [   { result : { name : '$x', salary : '$y', benSalary : '$z'} },
                    { benSalary : '$z'},
                    { salary : { name : '$x', amount : '$y' } }, 
                    { $call : [ 'lt', '$y', '$z'] } 
                ] ];
var query = [ { result : '$result' } ]; 
var transform = '$result';

function lt (x,y) {
    return x < y ? true : null
}

var callbacks = {
    lt : lt
}
var jsl = new JSL({rules : ruleset.concat(filterRules), query: query, transform: transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;
