[index](/docs/html/index.html)

---

# JSL Overview

JSL is a JSON based logic programming library. It is meant to be used as an embedded rules engine in JS applications which use JSON as their data format.

We introduce JSL with a simple example that generates a trivial 'hello world' message record when queried:

```

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


/*  
response 

[
    {
        "to": "world",
        "subject": "hello",
        "msgtext": "hello world"
    }
]

*/

```
The example shows some important characteristics of JSL.

- JSL rules and query are nothing but (JSON serializable) JS objects. 

- A set of JSL rules is an array of array of objects.

- Variables are allowed in both rules and query as values of keys in JS objects. Any value string which starts with '$' is a variable. 

- JSL execution proceeds by unifying the query object with rules.

- JSL execution produces one or more fully instantiated versions of the given query object, i.e. all variables in the query are replaced with matching structures from the ruleset.

- JSL output can be shaped using a transform specification, which guides JSL to produce an array of the shape desired. In the example, `var transform = '$x'`  caused the output to be an array of whatever '$x' was instantiated with, i.e. message records. If the transform is left unspecified, the result is an array of arrays, i.e. a valid JSL batch, with each element of the outer array becoming a fully instantiated version of the query object.


<span id="unification">
## Unification
</span>

We introduce some data binding in our message record:

```

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


/*
response 

[
    {
        "to": "sales@vinod-denim.com",
        "subject": "Follow up on our order",
        "msgtext": "Please send us an update on shipping status"
    }
]

*/

```

The ruleset array now contains a single rule which is an array of objects;  The first object is the _head_, and the remaining objects, if any, constitute the _body_ of the rule.

The row array also has a single rule which is an array of objects; in this case there is only one object in the array (the row). It has a _head_, but no _body_. This type of rule is a _fact_ ; it has a _head_ but no _body_ . 

Finally, note that we concatenate ruleset and row before calling Jsl, combining all rules (including facts) into one array.

For any given rule, the _head_ is _satisfied_ if each part of the _body_ is _satisfied_. Thus _facts_ are always _satisfied_. Each part of the _body_ is _unified_ against the set of rules, to find a rule where the _head_ of the rule _matches_ the body part.

Since we are dealing with JS objects, we define _match_ to mean containment, i.e. the body part must be fully contained in the head of the _matched_ rule. In this example, the body part `{ row : {to : '$to'} }` is completely contained in the supplied row as a path. The variable '$to' is thus _unified_ against the corresponding value in the row: 'sales@vinod-denim.com'.

Query execution proceeds by attempting to _satisfy_ the query object by _unifying_ it against the rules. If any rule _matches_ the query, the unification proceeds recursively into its _body_ parts, until there are no more _body_ parts to be _satisfied_ , or a _body_ part fails to _unify_. All rules that _match_ the query are tried. Thus a query can produce multiple results.

In this example, the query _matches_ the first message rule, and each _body_ part of the message rule successfully unifies against the supplied row; so  we obtain a fully instantiated message object.


<span id="unify2objects">
## Simple 2 object unification
</span>

It is often desirable to unify two JS objects to check for containment, equality, or to merge their contents. The example below shows this pattern of usage.


```

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


/*
response 

{
    "u12": [
        [
            {
                "a": 1,
                "b": 2,
                "c": [
                    3,
                    4,
                    5
                ],
                "d": {
                    "e": 6,
                    "f": 7
                }
            }
        ]
    ],
    "u13": [
        [
            {
                "a": 1,
                "b": 2,
                "c": [
                    3,
                    4,
                    5
                ],
                "d": {
                    "e": 6,
                    "f": 7
                }
            }
        ]
    ],
    "u15": [
        [
            {
                "a": 1,
                "b": 2,
                "c": [
                    3,
                    4,
                    5
                ],
                "d": {
                    "e": 6,
                    "f": 7
                }
            }
        ]
    ],
    "u56": [
        [
            {
                "a": 1,
                "b": 2,
                "c": [
                    3,
                    4,
                    5
                ],
                "d": {
                    "e": 6,
                    "f": 7
                }
            }
        ]
    ],
    "u67": [
        [
            {
                "a": 1,
                "b": 2,
                "c": [
                    3,
                    4,
                    5
                ]
            }
        ]
    ],
    "u76": []
}

*/

```
The examples show that it is possible to have variables in both objects being unified. The result yields a merged object with variables instantiated on both sides to the extent possible.

The last two examples `unify2objects(obj6,obj7)` and `unify2objects(obj7,obj6)` show the one sided nature of unification in Jsl, as defined by object containment. Since obj7 is contained in obj6, but not the other way round, we get a result in the first case but not the second.

It is possible to extend this example to check for unification in both directions to implement a more general purpose unifier that succeeds irrespective of the order of arguments. Object equality can be checked by unifying in both directions and checking for success. The transform parameter can be defined upon any variables in obj2 (which is used as the query in the function unify2objects) to shape output results.

<span id="builtins">
## Builtins
</span>

JSL supports a few important builtins as part of the language. Please refer to the [builtins chapter](/docs/html/builtins.html) for a complete description. We introduce builtins here by extending our message template to supply the subject as default msgtext in case msgtext is not supplied. 

We also simplify the unification of the various variables (to, subject, msgtext) against supplied row by using the **$bind**  builtin.

```

var JSL = require('../../..');

var ruleset = [
    [
        {
            message : {
                to : '$to',
                subject : '$subject',
                msgtext : '$msgtext'
            }
        
        },
        { row : '$row'},
        { $or : [ 
            {$bind : [ '$row', {to : '$to', subject : '$subject', msgtext : '$msgtext'}] },
            {$bind : [ ['$row', '$msgtext'],  [{to : '$to', subject : '$subject'}, '$subject'] ] },
        ]}
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

var jsl = new JSL({rules : ruleset.concat(row), query: query, transform: transform});
var response = jsl.run();

module.exports = response;


/*
response 

[
    {
        "to": "sales@vinod-denim.com",
        "subject": "Follow up on our order",
        "msgtext": "Follow up on our order"
    }
]

*/

```
The extraction of data from the row is now done with **$bind** objects, each handling a "pattern" of row expected within an overall **$or** object. Both **$bind** and **$or** are builtins provided by JSL. 

As the example shows, the row has its msgtext commented out, but the response contains msgtext properly forced to be subject text.

This relatively non-trivial example works as follows :

- The head of the message rule specifies the structure of the message record as usual

- The first body part `{ row : '$row'}`  simply extracts all possible rows in the dataset. Contrast this with the earlier approach where we focused on extracting individual data items (to, subject, msgtext). The reader can try the earlier approach with multiple rows as shown below, and verify that it yields an explosion of results, one for each possible way to find any value for each variable.

- The next body part is a binding specification. It uses the **$or** builtin to support two possible scenarios :

        { $or : [
            { $bind : [ '$row', {to : '$to', subject : '$subject', msgtext : '$msgtext'}] },
            { $bind : [ ['$row', '$msgtext'],  [{to : '$to', subject : '$subject'}, '$subject'] ] },
        ]}

    - a fully formed row with to, subject, and msgtext present
    - a partial row with only to and subject present; the **$bind** util rule is used to bind the partial row with expected variables, and another binding is provided to force $msgtext to unify with $subject. Note how **$bind** is used to unify an array of objects to another array of objects. In general, **$bind** can be used to attempt unification of any js object to any other js object.



The general shape of builtins is as follows :

```
    { <$xxx> : [ arg1 , arg2 ... ] }
```

The **$bind** utility rule has the following (internal) implementation:

```
    { $bind : [ '$x', '$x' ] }
```

Note that a builtin object can have only one key, which must be a $prefixed name of a valid builtin. In this example, we used two builtins : **$or**, **$and**.

Also note that **$bind** is nothing but the equivalent of the familiar _unify_ utility in logic programming languages. It succeeds if the two arguments unify with each other (JSL defines unification as first argument containing the second at all levels). So the first call to **$bind** succeeds if the $row has all 3 specified keys. The second call to **$bind** will succeed with just 2 keys in the $row. It should be obvious that the more restrictive condition (3 keys) should be checked first.

The number of arguments to a builtin can vary depending upon the builtin. For example, **$or** and **$and** can have any number;  **$bind**  can have only 2.



<span id="callbacks">
## Callbacks
</span>

Since JSL is intended to be an embedded logic programming library, it supports callbacks into the host. This is done using a special builtin: **$call**

We illustrate the use of callbacks by applying a timestamp to our message object :

```

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


/*
response 

[
    {
        "to": "sales@vinod-denim.com",
        "subject": "Follow up on our order",
        "date": "Tue May 03 2016 18:57:22 GMT-0700 (PDT)",
        "msgtext": "Follow up on our order"
    }
]

*/

```

As the example shows, there is now a date key in the head of the message rule, whose value is obtained by an additional body object at the end: `{ $call : [ 'getDate', ['$date'] ] }`,  which uses the **$call** builtin to call the supplied callback getDate and bind its return value to the $date variable.

The callback itself is supplied as a function valued key in the callbacks object given to Jsl as part of its parameters.

    var jsl = new JSL({rules : ruleset.concat(row), query: query, transform : transform, callbacks : callbacks});

The shape of the **$call** builtin is as follows :

```
    { $call : [ <'cbname'>, arg1, arg2, ..., ['$outvar'] ] }

```

The first argument to $call is the name of the callback to be called. This callback function should be present in the callbacks parameter when running Jsl. Subsequent arguments are handed to the callback by position with the exception of ['$outvar'] if present. Note that an array object at the end of the parameters list is assumed to specify the $outvar. Any value returned by the callback is _unified_ with the $outvar. Typically there are two ways to use $outvar:

1. Supply a variable, so it captures the return value of the callback

    -  `{$call : [ 'getTime', ['$x'] ]}` will return the current time in $x.

2. Supply a literal value, so that the callback succeeds only if it returns something that can be _unified_ with it

    -  `{$call : [ 'getDay', ['Monday'] ]}` will fail unless getDay returns 'Monday', assuming getDay needs no arguments

_Please note that if the callback requires an array valued parameter at the end, it must be supplied at least an empty array as the last parameter in the **$call** parameter list in order to avoid confusing the last input parameter as the $outvar._

<span id="query">
## Querying multiple rows of data, with varying structures
</span>

So far we have worked with one row of data. We can now try our message generation sample on multiple rows as follows:

```

var JSL = require('../../..');

var ruleset = [
    [
        {
            message : {
                to : '$to',
                subject : '$subject',
                date : '$date',
                msgtext : '$msgtext',
            }
        
        },
        { row : '$row'},
        { $or : [ 
            {$bind : [ '$row', {to : '$to', subject : '$subject', msgtext : '$msgtext'}] },
            {$bind : [ ['$row', '$subject'],  [{to : '$to', subject : '$subject'}, '$msgtext'] ] },
        ]},
        { $call : [ 'getDate', ['$date'] ] }
    ],
        
    
];

var query =     [{message : '$x'}];
var transform = '$x';

var row = [
    [{ row : { 
            to : 'sales@vinod-denim.com',
            subject : 'Follow up on our order',
            msgtext : 'Please send us an update on shipping status'
        }
    }],
    [{ row : { 
            to : 'sales@agarwal-textiles.com',
            subject : 'Request for quotation',
            //msgtext : 'Please quote your best price for 1500 meters of gray cotton fabric'
        }
    }]


];

var callbacks = {
    getDate : function() { 
                return new Date().toString()
            }
};

var jsl = new JSL({rules : ruleset.concat(row), query: query, transform: transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;


/*
response 

[
    {
        "to": "sales@vinod-denim.com",
        "subject": "Follow up on our order",
        "date": "Tue May 03 2016 18:57:22 GMT-0700 (PDT)",
        "msgtext": "Please send us an update on shipping status"
    },
    {
        "to": "sales@agarwal-textiles.com",
        "subject": "Request for quotation",
        "date": "Tue May 03 2016 18:57:22 GMT-0700 (PDT)",
        "msgtext": "Request for quotation"
    }
]
 
*/

```
Note that we only needed to add another array to the array of arrays containing rows. We could add any number of rows, possibly fetching them from a database.

The response shows expected results, one for each supplied row. It correctly detects and handles both possible "shapes" of row. Also note the effect of the trssansform specification; we get an array of objects, each object was the unified value of '$x'.

<span id="why-jsl">
## Why JSL
</span>

We have found JSL useful for the following tasks :

- Data binding 
  * As described in [this overview](/docs/html/overview.html), data binding involves filling out "holes" in a JS object using data supplied as another set of JS objects (i.e. parsed JSON)

- Information Retrieval
  * Maintain and query small, in-memory databases of non trivial complexity such as configurations, dependencies, etc. See  [information retrieval example](/docs/html/ir.html). The chapter is based on a textbook example, but covers salient concepts of information retrieval.

- Test automation 
  * Specification of expected output from a JSON returning api, see  [test automation example ](/docs/html/test.html)

We expect JSL to find more applications over time as an embedded logic-programming library for JS/JSON.

