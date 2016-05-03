var JSL = require('../../..');

var ruleset = [
    [ //head
     {
        message : {
            to : '$to',
            subject : '$subject',
            msgtext : '$msgtext'
        }
    
    }, 
    //body
    { row : { to : '$to' } },
    { row : { subject : '$subject' } },
    { row : { msgtext : '$msgtext' } }
    ] 
];

var query = [{message : '$x'}];
var transform = '$x';

// facts (or data)
var row = [
    [{ row : { 
            to : 'sales@vinod-denim.com',
            subject : 'Follow up on our order',
            msgtext : 'Please send us an update on shipping status'
        }
    }]
];

var jsl = new JSL({rules : ruleset.concat(row), query: query, transform: transform});
var response = jsl.run();

module.exports = response;
