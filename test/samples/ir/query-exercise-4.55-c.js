/*Exercise 4.55.  Give simple queries that retrieve the following information from the data base:

c. the names and addresses of all people who live in Slumerville.
*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRule = [
                [   { result : ['$x', ['$y', '$z', '$w']] },
                    { employee : { name : '$x', address : ['$y', '$z', '$w'] } }, //<-- extract first element of address array into $y
                    { $call : [ 'match', '$y', '^Slumerville'] } 
                ] ];
var query = [ { result : '$result' } ]; 
var transform = '$result';

function match (x,y) {
    return x.match(new RegExp(y));
}

var callbacks = {
    match : match
}
var jsl = new JSL({rules : ruleset.concat(filterRule), query: query, transform : transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;
