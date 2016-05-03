var JSL = require('../../..');

var ruleset = [
    [{
        message : {
            to : 'world',
            subject : 'hello',
            msgtext : 'hello world'
        }
    
    }] 
];

var query = [{message : '$x'}];
var transform = '$x';

var jsl = new JSL({rules: ruleset, query: query, transform: transform});

var response = jsl.run();

module.exports = response;
