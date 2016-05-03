var JSL = require('../../..');

var ruleset = [
    [
        {
            message : {
                to : '$to',
                subject : '$subject',
                date : '$date',
                msgtext : '$msgtext'
            }
        
        },
        { row : '$row'},
        { $or : [ 
            {$bind : [ '$row', {to : '$to', subject : '$subject', msgtext : '$msgtext'}] },
            {$bind : [ ['$row', '$subject'],  [{to : '$to', subject : '$subject'}, '$msgtext'] ] },
        ]},
        { $call : [ 'getDate', ['$date'] ] }
    ]
];

var query =     [{message : '$x'}];
var transform = '$x';

var row = [
    [{ row : { 
            to : 'sales@vinod-denim.com',
            subject : 'Follow up on our order',
            //msgtext : 'Please send us an update on shipping status'
        }
    }]

];

var callbacks = {
    getDate : function() { 
                return new Date().toString()
            }
};

var jsl = new JSL({rules : ruleset.concat(row), query: query, transform : transform, callbacks : callbacks }); 
var response = jsl.run();

module.exports = response;
