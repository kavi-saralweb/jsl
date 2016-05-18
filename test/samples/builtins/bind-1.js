var JSL = require('../../..');

var ruleset = [
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


    /* boundary cases */

    [   { result : ['this will succeed, empty array is contained in a non empty array'] },
        {$bind : [ [1,2,3], []  ] }
    ],
    [   { result : ['this will succeed, empty array is equal to empty array'] },
        {$bind : [ [], []  ] }
    ],

    [   { result : ['this will succeed, empty object is contained in a non empty object'] },
        {$bind : [ { a : 1 , b : 2 , c : 3 }, {}  ] },
        { $bind : [ '$x', {} ] }
    ],
    [   { result : ['this will succeed, empty object is equal to empty object'] },
        {$bind : [ {}, {}  ] }
    ],

    /*  cases involving variables
    */

    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 106 , b : 107 , c : 108 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z', d : 1}, '$p'  ]  }
    ],
    [   { result : ['$x', '$y', '$z'] },
        {$bind : [ '$p', { a : 109 , b : 110 , c : 111, d: 112 } ] },
        {$bind : [  '$p', { a : '$x', b : '$y', c : '$z'} ]  }
    ],

    [   { result : ['$x', '$y', '$z', 'correct $bind behavior with 1 variable'] },
        {$bind : [ '$p', { a : 13 , b : 15 , c : 17, d:19 } ] },
        {$bind : [  '$p', { a : '$x', b : '$y', c : '$z'}]  }
    ],
    [   { result : ['$x', '$y', '$z', 'correct with 1 var 1 recursion'] },
        {$bind : [ '$p', { a : 13 , b : 15 , c : 17, d:19 } ] },
        {$bind : [ '$q', '$p' ] },
        {$bind : [  '$q', { a : '$x', b : '$y', c : '$z'}]  }
    ],
    [   { result : ['$x', '$y', '$z', 'correct with 1 var 2 recursion'] },
        {$bind : [ '$p', { a : 13 , b : 15 , c : 17, d:19 } ] },
        {$bind : [ '$q', '$p' ] },
        {$bind : [ '$r', '$q' ] },
        {$bind : [  '$r', { a : '$x', b : '$y', c : '$z'}]  }
    ],

    [   { result : ['$x', '$y', '$z', 'incorrect $bind behavior with 1 variable'] },
        {$bind : [ '$p', { a : 14 , b : 16 , c : 18, d:20 } ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z'}, '$p'  ]  }
    ],

    [   { result : ['$x', '$y', '$z', 'incorrect with 1 var 1 recursion'] },
        {$bind : [ '$p', { a : 14 , b : 16 , c : 18, d:20 } ] },
        { $bind : [ '$q', '$p' ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z'}, '$q'  ]  }
    ],
    [   { result : ['$x', '$y', '$z', 'incorrect with 1 var 2 recursion'] },
        {$bind : [ '$p', { a : 14 , b : 16 , c : 18, d:20 } ] },
        { $bind : [ '$q', '$p' ] },
        { $bind : [ '$r', '$q' ] },
        {$bind : [  { a : '$x', b : '$y', c : '$z'}, '$r'  ]  }
    ],


    [   { result : ['$x', '$y', '$z', 'correct $bind behavior with 2 vars'] },
        {$bind : [ '$p', { a : 22 , b : 24 , c : 26, d:28 } ] },
        {$bind : [ '$q', { a : '$x', b : '$y', c : '$z'} ] },
        {$bind : [  '$p',  '$q' ]  }
    ],
    [   { result : ['$x', '$y', '$z', 'correct with 2 vars 1 recursion'] },
        {$bind : [ '$p', { a : 22 , b : 24 , c : 26, d:28 } ] },
        {$bind : [ '$q', { a : '$x', b : '$y', c : '$z'} ] },
        {$bind : [  '$r',  '$q' ]  },
        {$bind : [  '$p',  '$r' ]  }
    ],
    [   { result : ['$x', '$y', '$z', 'correct with 2 vars 2 recursion'] },
        {$bind : [ '$p', { a : 22 , b : 24 , c : 26, d:28 } ] },
        {$bind : [ '$q', { a : '$x', b : '$y', c : '$z'} ] },
        {$bind : [  '$r',  '$q' ]  },
        {$bind : [  '$s',  '$r' ]  },
        {$bind : [  '$p',  '$s' ]  }
    ],

    [   { result : ['$x', '$y', '$z', 'incorrect $bind behavior with 2 vars'] },
        {$bind : [ '$p', { a : 21 , b : 23 , c : 25, d:27 } ] },
        {$bind : [ '$q', { a : '$x', b : '$y', c : '$z'} ] },
        {$bind : [  '$q',  '$p' ]  }
    ],
    [   { result : ['$x', '$y', '$z', 'incorrect with 2 vars 1 recursion'] },
        {$bind : [ '$p', { a : 21 , b : 23 , c : 25, d:27 } ] },
        {$bind : [ '$q', { a : '$x', b : '$y', c : '$z'} ] },
        {$bind : [  '$r',  '$p' ]  },
        {$bind : [  '$q',  '$r' ]  }
    ],
    [   { result : ['$x', '$y', '$z', 'incorrect with 2 vars 1 recursion'] },
        {$bind : [ '$p', { a : 21 , b : 23 , c : 25, d:27 } ] },
        {$bind : [ '$q', { a : '$x', b : '$y', c : '$z'} ] },
        {$bind : [  '$r',  '$p' ]  },
        {$bind : [  '$s',  '$r' ]  },
        {$bind : [  '$q',  '$s' ]  }
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
    [   { result : ['$x', '$y', '$z', 'should fail as second object is not contained in first (1)'] },
        {$bind : [ { a : 100, b : 101 , c : 102 }, { a : '$x', b : '$y', c : '$z', d : 10} ]  }
    ],
    [   { result : ['$x', '$y', '$z', 'should fail as second object is not contained in first (2)'] },
        {$bind : [ { a : '$x', b : '$y', c : { p : 1, q : '$z', r : 3} , d : 10}, { a : 103, b : 104 , c : {p : 1,  q : 105, r : 3, w : 4} }  ]  }
    ],



];

var query =     [{result : '$result'}];
var transform = '$result';

var jsl = new JSL ({rules : ruleset, query: query, transform : transform});
var response = jsl.run();
console.log(response)
module.exports = response;
