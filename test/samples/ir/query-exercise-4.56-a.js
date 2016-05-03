/*Exercise 4.56.  Formulate compound queries that retrieve the following information:

a. the names of all people who are supervised by Ben Bitdiddle, together with their addresses;

*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRule = [
                [   { result : ['$x', ['$y', '$z', '$w']] },
                    { supervisor : { name : '$x', manager: 'Bitdiddle Ben' } },
                    { employee : { name : '$x', address : ['$y', '$z', '$w'] } }
                ] ];
var query = [ { result : '$result' } ]; 
var transform = '$result';


var jsl = new JSL({rules : ruleset.concat(filterRule), query: query, transform: transform});
var response = jsl.run();

module.exports = response;
