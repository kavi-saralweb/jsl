var JSL = require('../../..');

/* a simple wrapper for those who want to "just unify two objects" */
function unify (obj1, obj2) {
    var result = null;
    var rules = null;
    var query = null;
    
    rules = [[obj1]];

    query = [obj2];

    if (rules != null && query != null) { 
        var jsl = new JSL({rules : rules, query: query});
        result = jsl.run();
    }

    return result[0][0];   
}

var x = 
[{
    a : 1, 
    b: 2, 
    c : [ 3, 4, 5], 
    d : { 
        e :  '$e' 
    } 
},
{ p :1, q:2, r:3}
]

var y = [{
    a : 1, 
    b: 2, 
    c : ['$c', '$d'], 
    d : { 
        e : [ 6, 7 ] 
    }
},
'$o'

]


var response  = unify(x, y);
//console.log(JSON.stringify(response,null,2));
module.exports = response;



