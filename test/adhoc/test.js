
var JSL = require('../../jsl.js');
var validator = require('../../validator.js');


var rules = [
    [{ tool : { name : 'hammer', color : 'red' } }],
    [{ tool : { name : 'hammer', color : 'blue' } }],
    [{ tool : { name : 'hammer', color : 'green' } }],
    [{ tool : { name : 'ratchet', color : 'red' } }],
    [{ tool : { name : 'ratchet', color : 'blue' } }],
    [{ tool : { name : 'ratchet', color : 'green' } }],
    /*[
        { toolSet : '$toolSet' },
        { $query : [ [{tool : { name : 'hammer', color : '$color'}}], '$toolSet' ] }
    ]*/

    [
        { hammers : '$tool'},
        { tool : '$tool'},
        { $bind : [ '$tool', { name : 'hammer' } ] }       
        
    ]
    
];
//console.log(JSON.stringify(rules, null, 2));

if (!validator.validateJsl(rules)) {
    console.log('rules validation failed');
    process.exit();
}

var callbacks = {};
//var query = [{tool : '$tool'}, { bind : [ '$tool', { color : 'red'} ] } ]; 
//var transform =  '$tool';

var query = [{ hammers : '$hammers'}];
var transform  = '$hammers';
var jsl = new JSL ({
    rules : rules,
    query : query,
    transform : transform,
    callbacks : callbacks
});
var retval = jsl.run();
console.log(JSON.stringify(retval, null,2));
