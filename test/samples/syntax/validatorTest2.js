var validator = require('../../../jslvalidator-naive.js');
/*var input = [
    [
        { wheel :  '$wheel' },
        { $and : [
            { supervisor : { name : '$middle-manager',  manager : '$person'} },
            { supervisor : { name : '$x', manager : '$middle-manager' } }
        ]},
        { $call : [ 'notSeen', '$person', [[[{'world':'hello'}]]]] }
    ]
];*/
var input = [
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ { a : 1, b : 2 , c : 3 }, { a : '$x', b : '$y', c : '$z'} ]  }
    ] ,
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ { a : '$x', b : '$y', c : '$z', d : 10}, { a : 4, b : 5 , c : 6 } ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, { a : 7 , b : 8 , c : 9 }  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ { a : '$x', b : '$y', c : { p : 1, q : '$z', r : 3} , d : 10}, { a : 10, b : 11 , c : {q : 12} }  ]  }
    ],

    /* this will work even though $p is second object and apparently not contained in first object, 
        because $p is a variable, it is considered as the first object
    */
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 13 , b : 14 , c : 15, d:10 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z'}, '$p'  ]  }
    ],

    /* boundary cases */

    [   { result : ['this will succeed, empty array is contained in a non empty array'] },
        {$bind : [ [1,2,3], []  ] }
    ],
    [   { result : ['this will succeed, empty array is equal to empty array'] },
        {$bind : [ [], []  ] }
    ],

    [   { result : ['this will succeed, empty object is contained in a non empty object'] },
        {$bind : [ { a : 1 , b : 2 , c : 3 }, {}  ] }
    ],
    [   { result : ['this will succeed, empty object is equal to empty object'] },
        {$bind : [ {}, {}  ] }
    ],

    /* failing cases */

    /* boundary cases, type mismatch */
    [   { result : ['this will fail, empty array is not contained in a non empty object'] },
        {$bind : [ {a:1,b:2,c:3}, []  ] }
    ],
    [   { result : ['this will fail, empty array is not equal to empty object'] },
        {$bind : [ {}, []  ] }
    ],

    [   { result : ['this will fail, empty object is not contained in a non empty array'] },
        {$bind : [ [1,2,3], {}  ] }
    ],
    [   { result : ['this will fail, empty object is not equal to empty array'] },
        {$bind : [ [], {}  ] }
    ],

    /* these won't work since second object is not contained in the first object */
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ { a : 100, b : 101 , c : 102 }, { a : '$x', b : '$y', c : '$z', d : 10} ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ { a : '$x', b : '$y', c : { p : 1, q : '$z', r : 3} , d : 10}, { a : 103, b : 104 , c : {p : 1,  q : 105, r : 3, w : 4} }  ]  }
    ],

    /* this won't work since $p is a variable, and is thus considered as the first object */
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],




];



//console.log(JSON.stringify(validator.validateJsl(input), null, 2));
module.exports = validator.validateJsl(input);
