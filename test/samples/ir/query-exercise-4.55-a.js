/*Exercise 4.55.  Give simple queries that retrieve the following information from the data base:

a. all people supervised by Ben Bitdiddle;*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRule = [
                [   { result : ['$x'] },
                    { supervisor : { name : '$x', manager : 'Bitdiddle Ben' } }
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
