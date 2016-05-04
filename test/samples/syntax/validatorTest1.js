var validator = require('../../../validator.js');
var input = [
    [
        { wheel :  '$whell' },
        { $and : [
            { supervisor : { name : '$middle-manager',  manager : '$person'} },
            { supervisor : { name : '$x', manager : '$middle-manager' } }
        ]},
        { $call : [ 'notSeen', '$person', [[[{'world':'hello'}]]]] }
    ]
];

//console.log(validator.validateJsl(input));
module.exports = validator.validateJsl(input);
