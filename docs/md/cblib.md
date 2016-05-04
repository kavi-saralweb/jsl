[index](/docs/html/index.html)

---

# JSL Standard Callbacks

JSL provides the following standard callbacks :

- [concat](#concat)
- [extend](#extend)
- [length](#length)
- [keys](#keys)
- [objEqual](#objequal)
- [objNotEqual](#objNotequal)
- [objGetValue](#objgetvalue)
- [parseList](#parselist)
- [isNull](#isnull)
- [notNull](#notnull)
- [log](#log)

<span id="concat">
## concat
</span>

The concat callback takes 2 or more arguments, which can be either all arrays, or all string. 

The returned value is a concatenation of all the supplied arguments, either array or string.

Returns null on failure, and can thus be used to fail a JSL rule

 ```

var JSL = require('../../..');

var ruleset = [
    [   { result : '$x' },
        { $call : [ 'concat',
            [ 1, 2 ,3 ],
            [ 4, 5, 6 ],
            ['$x']
        ]}
    ],
    [   { result : '$x' },
        { $call : [ 'concat', 
            [ 1, 2 ,{ a : 1, b : 2 } ],
            [ 4, 5, { a : 3, c : 4 } ],
            ['$x']
        ]}
    ],

    [   { result : '$x' },
        { $call : [ 'concat', 
            'a', 'b', 'c', 'd', ['$x']
        ]}
    ],

    [   { result : '$x' },
        { $call : [ 'concat', 
            ['a', 'b'], ['c', 'd'], ['e', 'f'], ['$x']
        ]}
    ],

    /* failure cases */

    /* mixing of strings and arrays not allowed */

    [   { result : '$x' },
        { $call : [ 'concat', 
            'a', 'b', 'c', ['d'], ['$x']
        ]}
    ],

    /* concat will not work with objects */
    [   { result : '$x' },
        { $call : [ 'concat',
            {a:1, b:2}, 
            {c:3, d:4}, 
            ['$x']
        ]}
    ]

];

var query =     [{result : '$result'}];
var transform = '$result';

var jsl = new JSL ({rules : ruleset, query: query, transform : transform});
var response = jsl.run();

module.exports = response;


/*
response 

[
    [
        1,
        2,
        3,
        4,
        5,
        6
    ],
    [
        1,
        2,
        {
            "a": 1,
            "b": 2
        },
        4,
        5,
        {
            "a": 3,
            "c": 4
        }
    ],
    "abcd",
    [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f"
    ]
]

*/

```

<span id="extend">
## extend
</span>

The extend callback takes 2 arguments. It merges the first object into the second object, and returns the resulting object. The second object takes priority over the first in cases of overlaps. 

extend only works when both arguments are strictly {objects}.

Returns null on failure, and can thus be used to fail a JSL rule

The following examples illustrate the semantics of extend :

 ```

var JSL = require('../../..');

var ruleset = [
    [   { result : '$x' },
        { $call : [ 'extend', 
            { a : 1, b : 2 },
            { c : 3, d : 4 },
            ['$x']
        ]}
    ],
    [   { result : '$x' },
        { $call : [  'extend', 
            { a : 1, b : 2 },
            { a : 3, d : 4 }, // <-- a will be set to 3
            ['$x']
        ]}
    ],
    [   { result : '$x' },
        { $call : [  'extend', 
            { a : { x : 'a', y : 'q'} , b : 2 },
            { a : 3, d : 4 },  // <-- a will be set to 3
            ['$x']
        ]}
    ],
    [   { result : '$x' },
        { $call : [  'extend', 
            { a : 3, d : 4 }, 
            { a : { x : 'a', y : 'q'} , b : 2 }, // <-- a will be set to {x:'a', y:'b'}
            ['$x']
        ]}
    ],
    /* extend will not work with arrays */
    [   { result : '$x' },
        { $call : [  'extend', 
            [1,2,3], 
            [4,5,6], 
            ['$x']
        ]}
    ]

];

var query =     [{result : '$result'}];
var transform = '$result';

var jsl = new JSL ({rules : ruleset, query: query, transform : transform});
var response = jsl.run();

module.exports = response;


/*
response 

[
    {
        "a": 1,
        "b": 2,
        "c": 3,
        "d": 4
    },
    {
        "a": 3,
        "b": 2,
        "d": 4
    },
    {
        "a": 3,
        "b": 2,
        "d": 4
    },
    {
        "a": {
            "x": "a",
            "y": "q"
        },
        "d": 4,
        "b": 2
    }
]

*/

```

<span id="length">
## length
</span>

Takes an object (JS Array or Object) and returns the number of keys in it. Trivial wrapper around Object.keys().length

Works only on objects, not scalars.

Returns null on failure, and can thus be used to fail a JSL rule

<span id="keys">
## keys
</span>

Takes an object (JS Array or Object) and returns its keys in an array, which can be captured with ['$outVar']. Trivial wrapper around Object.keys()

Works only on objects, not scalars.

Returns null on failure, and can thus be used to fail a JSL rule

<span id="objequal">
## objEqual
</span>

objEqual takes two objects as input parameters and returns true if they are equal, i.e. of same type and having the same values.

Returns null on failure, and can thus be used to fail a JSL rule

<span id="objNotequal">
## objNotEqual
</span>

The opposite of objEqual. Takes two objects as input parameters and returns true if they are _not_ equal, i.e. of same type and having the same values.

Returns null on failure, and can thus be used to fail a JSL rule


<span id="objgetvalue">
## objGetValue
</span>

Takes an object (JS Array or Object) and a key, returns object[key] if it exists (i.e. is not undefined)

Returns null on failure, and can thus be used to fail a JSL rule

<span id="parselist">
## parseList
</span>

The parseList callback accepts an array as input parameter, and returns an array consisting of 2 elements : 

    1. The first element of input array
    2. The remaining elements of input array

parseList can be used to work with head and tail of a list (represented as a js array) in list processing algorithms

A typical use of parseList would be as follows :

    { $call : [ 'parseList', '$list', ['$head', '$body']] } // '$head' and '$body' contain the head and body of the '$list' 

Works only on JS Arrays

Returns null on failure, and can thus be used to fail a JSL rule

<span id="isnull">
## isNull
</span>

Takes a single input parameter and tests its value to be strictly a javascript null.

Returns null on failure, and can thus be used to fail a JSL rule

<span id="notnull">
## notNull
</span>

Takes a single input paramter and tests its value to be not strictly a javascript null.

Returns null on failure, and can thus be used to fail a JSL rule

<span id="log">
## log
</span>

The log callback emits its parameters to the console log if available. It can be a useful debugging and tracing tool.

The log callback never fails, so cannot be used to fail the JSL rule.
