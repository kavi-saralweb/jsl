var JSL = require('../../..');

function unify2objects(obj1, obj2) {
    var jsl = new JSL({
        rules : [[obj1]],
        query: [obj2],
    });
    return jsl.run();
}

var response = {};

var obj1 = {
    a : 1 ,
    b : 2 , 
    c : [ 3, 4, 5 ],
    d : { e : 6, f : 7 }
}

var obj2 = {
    a : 1 ,
    b : '$x' , 
    c : [ 3, '$y', 5 ],
    d : { e : 6, f : '$z' }
}

response.u12 = unify2objects(obj1, obj2);

var obj3 = {
    a : 1 ,
    b : 2 , 
    c : '$x',
    d : '$y'
}

response.u13 = unify2objects(obj1, obj3);

var obj5 = {
    a : 1 ,
    b : 2 , 
    c : '$x',
    d : { e : 6, f : 7 }
}

response.u15 = unify2objects(obj1, obj5);

var obj6 = {
    a : 1 ,
    b : 2 , 
    c : [ 3, 4, 5 ],
    d : '$y'
}

response.u56 = unify2objects(obj5, obj6);

var obj7 = {
    a : 1 ,
    b : 2 , 
    c : '$x',
}


response.u67 = unify2objects(obj6, obj7);
response.u76 = unify2objects(obj7, obj6);

module.exports = response;
