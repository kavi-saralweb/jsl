[index](/docs/jsl/html/index.html)

---

# Example : Information Retrieval

JSL borrows heavily from the reference implementation of a logic programming language described in _Structure and Interpretation of Computer Programs, MIT Press, Abelson, Sussman and Sussman_ in [section 4.4](https://mitpress.mit.edu/sicp/full-text/book/book-Z-H-29.html#%_sec_4.4).

The motivational example in the textbook describes a small personnel database along with some typical queries. The following exercises are given here with solutions, along with the [database](#database) itself, translated from Scheme to JSL.

- [exercise 4.55 a, b, c](#exercise-455)
- [exercise 4.56 a, b, c](#exercise-456)
- [exercise 4.57 a, b](#exercise-457)
- [exercise 4.58](#exercise-458)
- [exercise 4.59 a, b, c](#exercise-459)
- [exercise 4.60](#exercise-460)
- [exercise 4.61](#exercise-461)
- [exercise 4.62](#exercise-462)
- [exercise 4.63](#exercise-463)
- [exercise 4.64](#exercise-464)
- [exercise 4.65](#exercise-465)
- [exercise 4.66](#exercise-466)
- exercise 4.67
- [exercise 4.68](#exercise-468)
- exercise 4.69
- exercise 4.70 thru 4.79

### Notes : 

    
1. **Omissions** The omitted exercises : 4.67,4.70 thru 4.79  were focused on internals of the implementation, or posed deeper questions about implementation strategy. They will probably get picked up in subsequent iterations of JSL. Exercise 4.69 was omitted due to schedule constraints.

1. **Lists vs RegExp** for processing strings : The scheme version regards job titles as lists, where the first element gives the department. Since JSL does not have this kind of list processing included, we have instead used strings for titles, with the first (whitespace delimited) token indicating the department. As such, extensive use of $call has  been made to define callbacks that use JS RegExp facilities for working with string valued department names (e.g. Exercise 4.55 b)

1. **Short circuit $or and $and** : JSL implements shortcircuit evaluation of $or and $and. These operators stop at the first success or failure respectively. This makes the infinite loop in exercise 4.64 harder to reproduce. Explicit rearrangement of rules is required to force the recursive portion of the rule to be evaluated first.

1. **Callbacks** : several intersting problems relating to duplicate suppression and accumulation (exercises 4.65, 4.66) were easily solved using callbacks in JS, with static variables in closures to hold state. This is natural for an embedded library.


<span id="the-database">
## The database
</span>

The scheme database given in the book was translated into JSL (basically a set of JSON serializable JS objects).
Note that "column names" were invented for each relationship in the database to represent data in JS key/value objects
JSL deductions also use keys for unification between JS objects.

```

module.exports = [
//The personnel data base for Microshaft contains assertions about company personnel. 
// Here is the information about Ben Bitdiddle, the resident computer wizard:

[ { employee : { name : 'Bitdiddle Ben', address : ['Slumerville' , 'Ridge Road', 10] } } ],
[ { job :  { name : 'Bitdiddle Ben' , title :  'computer wizard' } } ],
[ { salary : { name : 'Bitdiddle Ben' , amount :  60000 } } ],

//As resident wizard, Ben is in charge of the company's computer division, and he supervises two programmers and one technician. 
// Here is the information about them:

[ { employee : { name : 'Hacker Alyssa P', address : ['Cambridge', 'Mass Ave', 78] } } ],
[ { job : { name : 'Hacker Alyssa P', title :  'computer programmer' } } ],
[ { salary : { name : 'Hacker Alyssa P', amount : 40000 } } ],
[ { supervisor : { name : 'Hacker Alyssa P' , manager :  'Bitdiddle Ben' } } ],
[ { employee : { name : 'Fect Cy D' , address : [  'Cambridge',  'Ames Street', 3 ] } } ],
[ { job : { name : 'Fect Cy D' , title :  'computer programmer' } } ],
[ { salary : { name : 'Fect Cy D' , amount :  35000 } } ],
[ { supervisor : { name : 'Fect Cy D' , manager :  'Bitdiddle Ben' } } ],
[ { employee : { name : 'Tweakit Lem E' , address :  ['Boston', 'Bay State Road', 22 ] } } ],
[ { job : { name : 'Tweakit Lem E' , title :  'computer technician' } } ],
[ { salary : { name : 'Tweakit Lem E' , amount : 25000 } } ],
[ { supervisor : { name : 'Tweakit Lem E' , manager  :  'Bitdiddle Ben' } } ],

//There is also a programmer trainee, who is supervised by Alyssa:

[ { employee : { name : 'Reasoner Louis' , address :  ['Slumerville', 'Pine Tree Road', 80] } } ],
[ { job : { name : 'Reasoner Louis' , title : 'computer programmer trainee' } } ],
[ { salary : { name : 'Reasoner Louis' , amount :  30000 } } ],
[ { supervisor : { name : 'Reasoner Louis' , manager : 'Hacker Alyssa P' } } ],

//All of these people are in the computer division, as indicated by the word computer as the first item in their job descriptions.

//Ben is a high-level employee. His supervisor is the company's big wheel himself:

[ { supervisor : { name : 'Bitdiddle Ben' , manager :  'Warbucks Oliver' } } ],
[ { employee : { name : 'Warbucks Oliver' , address :  ['Swellesley', 'Top Heap Road'] } } ],
[ { job : {  name : 'Warbucks Oliver' , title :  'administration big wheel' } } ],
[ { salary : { name : 'Warbucks Oliver' , amount : 150000 } } ],

//Besides the computer division supervised by Ben, the company has an accounting division, consisting of a chief accountant and his assistant:

[ { employee : { name : 'Scrooge Eben' , address :  ['Weston', 'Shady Lane', 10 ] } } ],
[ { job : { name : 'Scrooge Eben' , title : 'accounting chief accountant' } } ],
[ { salary : { name : 'Scrooge Eben' , amount : 75000 } } ],
[ { supervisor : { name : 'Scrooge Eben' , manager :  'Warbucks Oliver' } } ],
[ { employee : { name : 'Cratchet Robert' , address : ['Allston', 'N Harvard Street', 16] } } ],
[ { job : { name : 'Cratchet Robert' , title : 'accounting scrivener' } } ],
[ { salary : { name : 'Cratchet Robert' , amount :  18000 } } ],
[ { supervisor : {name : 'Cratchet Robert' , manager : 'Scrooge Eben' } } ],

//There is also a secretary for the big wheel:

[ { employee : {name : 'Aull DeWitt' , address : ['Slumerville', 'Onion Square', 5] } } ],
[ { job : { name : 'Aull DeWitt' , title :  'administration secretary' } }  ],
[ { salary : { name : 'Aull DeWitt' , amount :  25000 } } ],
[ { supervisor : { name : 'Aull DeWitt' , manager :  'Warbucks Oliver' } } ],

//The data base also contains assertions about which kinds of jobs can be done by people holding other kinds of jobs. 
// For instance, a computer wizard can do the jobs of both a computer programmer and a computer technician:

[ { can_do_job : { who : 'computer wizard' , whose :  'computer programmer' } } ],
[ { can_do_job : { who : 'computer wizard' , whose :  'computer technician' } } ],

//A computer programmer could fill in for a trainee:

[ { can_do_job : { who : 'computer programmer' , whose : 'computer programmer trainee' } } ],

//Also, as is well known,

[ { can_do_job : { who : 'administration secretary' , whose : 'administration big wheel' } } ]

]



```

<span id="exercise-455">
## Exercise 4.55
</span>

```

/*Exercise 4.55.  Give simple queries that retrieve the following information from the data base:

a. all people supervised by Ben Bitdiddle;*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRule = [
                [   { result : ['$x'] },
                    { supervisor : { name : '$x', manager : 'Bitdiddle Ben' } }
                ] ];
var query = [ { result : '$result' } ]; 
var transform = '$result';

function match (x,y) {
    return x.match(new RegExp(y));
}

var callbacks = {
    match : match
}
var jsl = new JSL({rules : ruleset.concat(filterRule), query: query, transform : transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;


/*
response  

[
    [
        "Hacker Alyssa P"
    ],
    [
        "Fect Cy D"
    ],
    [
        "Tweakit Lem E"
    ]
]

*/

```

```

/*Exercise 4.55.  Give simple queries that retrieve the following information from the data base:

b. the names and jobs of all people in the accounting division;*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRule = [
                [   { result : ['$x', '$y'] },
                    { job : { name : '$x', title : '$y' } },
                    { $call : [ 'match', '$y', '^account' ] } 
                ] ];
var query = [ { result : '$result' } ]; 
var transform = '$result';

function match (x,y) {
    return x.match(new RegExp(y));
}

var callbacks = {
    match : match
}
var jsl = new JSL({rules : ruleset.concat(filterRule), query: query, transform : transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;


/*
response  

[
    [
        "Scrooge Eben",
        "accounting chief accountant"
    ],
    [
        "Cratchet Robert",
        "accounting scrivener"
    ]
]

*/

```

```

/*Exercise 4.55.  Give simple queries that retrieve the following information from the data base:

c. the names and addresses of all people who live in Slumerville.
*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRule = [
                [   { result : ['$x', ['$y', '$z', '$w']] },
                    { employee : { name : '$x', address : ['$y', '$z', '$w'] } }, //<-- extract first element of address array into $y
                    { $call : [ 'match', '$y', '^Slumerville'] } 
                ] ];
var query = [ { result : '$result' } ]; 
var transform = '$result';

function match (x,y) {
    return x.match(new RegExp(y));
}

var callbacks = {
    match : match
}
var jsl = new JSL({rules : ruleset.concat(filterRule), query: query, transform : transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;


/*
response  


[
    [
        "Bitdiddle Ben",
        [
            "Slumerville",
            "Ridge Road",
            10
        ]
    ],
    [
        "Reasoner Louis",
        [
            "Slumerville",
            "Pine Tree Road",
            80
        ]
    ],
    [
        "Aull DeWitt",
        [
            "Slumerville",
            "Onion Square",
            5
        ]
    ]
]

*/

```

<span id="exercise-456">
## Exercise 4.56
</span>

```

/*Exercise 4.56.  Formulate compound queries that retrieve the following information:

a. the names of all people who are supervised by Ben Bitdiddle, together with their addresses;

*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRule = [
                [   { result : ['$x', ['$y', '$z', '$w']] },
                    { supervisor : { name : '$x', manager: 'Bitdiddle Ben' } },
                    { employee : { name : '$x', address : ['$y', '$z', '$w'] } }
                ] ];
var query = [ { result : '$result' } ]; 
var transform = '$result';


var jsl = new JSL({rules : ruleset.concat(filterRule), query: query, transform: transform});
var response = jsl.run();

module.exports = response;


/*
response  

[
    [
        "Hacker Alyssa P",
        [
            "Cambridge",
            "Mass Ave",
            78
        ]
    ],
    [
        "Fect Cy D",
        [
            "Cambridge",
            "Ames Street",
            3
        ]
    ],
    [
        "Tweakit Lem E",
        [
            "Boston",
            "Bay State Road",
            22
        ]
    ]
]

*/

```


```

/*Exercise 4.56.  Formulate compound queries that retrieve the following information:

b. all people whose salary is less than Ben Bitdiddle's, together with their salary and Ben Bitdiddle's salary;
*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRules = [
               [   { benSalary : '$benSalary'},
                   { salary : { name : 'Bitdiddle Ben', amount : '$benSalary'} }
               ], 
               [   { result : { name : '$x', salary : '$y', benSalary : '$z'} },
                    { benSalary : '$z'},
                    { salary : { name : '$x', amount : '$y' } }, 
                    { $call : [ 'lt', '$y', '$z'] } 
                ] ];
var query = [ { result : '$result' } ]; 
var transform = '$result';

function lt (x,y) {
    return x < y ? true : null
}

var callbacks = {
    lt : lt
}
var jsl = new JSL({rules : ruleset.concat(filterRules), query: query, transform: transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;


/*
response  

[
    {
        "name": "Hacker Alyssa P",
        "salary": 40000,
        "benSalary": 60000
    },
    {
        "name": "Fect Cy D",
        "salary": 35000,
        "benSalary": 60000
    },
    {
        "name": "Tweakit Lem E",
        "salary": 25000,
        "benSalary": 60000
    },
    {
        "name": "Reasoner Louis",
        "salary": 30000,
        "benSalary": 60000
    },
    {
        "name": "Cratchet Robert",
        "salary": 18000,
        "benSalary": 60000
    },
    {
        "name": "Aull DeWitt",
        "salary": 25000,
        "benSalary": 60000
    }
]

*/

```


```

/*Exercise 4.56.  Formulate compound queries that retrieve the following information:

c. all people who are supervised by someone who is not in the computer division, together with the supervisor's name and job.
*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRules = [
               [    { result : { name : '$x', supervisor : '$y', supervisorTitle : '$z'} },
                    { supervisor : { name : '$x', manager : '$y'} },
                    { job : { name : '$y', title : '$z'} },
                    { $call : [ 'nomatch', '$z', '^computer'] } 
                ] ];
var query = [ { result : '$result' } ]; 
var transform = '$result';

function nomatch (x,y) {
    return x.match(new RegExp(y)) != null ? null : true; 
}

var callbacks = {
    nomatch : nomatch
}
var jsl = new JSL({rules : ruleset.concat(filterRules), query: query, transform: transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;


/*
response  

[
    {
        "name": "Bitdiddle Ben",
        "supervisor": "Warbucks Oliver",
        "supervisorTitle": "administration big wheel"
    },
    {
        "name": "Scrooge Eben",
        "supervisor": "Warbucks Oliver",
        "supervisorTitle": "administration big wheel"
    },
    {
        "name": "Cratchet Robert",
        "supervisor": "Scrooge Eben",
        "supervisorTitle": "accounting chief accountant"
    },
    {
        "name": "Aull DeWitt",
        "supervisor": "Warbucks Oliver",
        "supervisorTitle": "administration big wheel"
    }
]

*/

```

<span id="exercise-457">
## Exercise 4.57
</span>

```

/*Exercise 4.57.  Define a rule that says that person 1 can replace person 2 
    if either person 1 does the same job as person 2 
        or someone who does person 1's job can also do person 2's job, 
        and if person 1 and person 2 are not the same person. 

        Using your rule, give queries that find the following:

        a.  all people who can replace Cy D. Fect;
*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRules = [
                    [
                        { replace : { name : '$x', replacement : '$y'} },
                        { employee : { name : '$x' } },
                        { employee : { name : '$y' } },
                        { $not : [ {$bind : [ '$x', '$y'] } ] },
                        { $or : [ 
                            { $and : [ 
                                { job : { name : '$x', title : '$t'} },
                                { job : { name : '$y', title : '$t'} },
                            ]},
                            { $and : [
                                { job : { name : '$x', title : '$tx' } },
                                { job : { name : '$y', title : '$ty' } },
                                { can_do_job : { who : '$ty', whose : '$tx' } }
                            ]}
                        ]}
                    ],
                ];
var query = [ { replace : '$replace' } ]; 
var transform = '$replace';


var jsl = new JSL({rules : ruleset.concat(filterRules), query: query, transform: transform});
var response = jsl.run();

module.exports = response;


/*
response  

[
    {
        "name": "Hacker Alyssa P",
        "replacement": "Bitdiddle Ben"
    },
    {
        "name": "Hacker Alyssa P",
        "replacement": "Fect Cy D"
    },
    {
        "name": "Fect Cy D",
        "replacement": "Bitdiddle Ben"
    },
    {
        "name": "Fect Cy D",
        "replacement": "Hacker Alyssa P"
    },
    {
        "name": "Tweakit Lem E",
        "replacement": "Bitdiddle Ben"
    },
    {
        "name": "Reasoner Louis",
        "replacement": "Hacker Alyssa P"
    },
    {
        "name": "Reasoner Louis",
        "replacement": "Fect Cy D"
    },
    {
        "name": "Warbucks Oliver",
        "replacement": "Aull DeWitt"
    }
]

*/

```

```

/*Exercise 4.57.  Define a rule that says that person 1 can replace person 2 
    if either person 1 does the same job as person 2 
        or someone who does person 1's job can also do person 2's job, 
        and if person 1 and person 2 are not the same person. 

        Using your rule, give queries that find the following:

b.  all people who can replace someone who is being paid more than they are, together with the two salaries.

*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRules = [
                    [
                        { replace : { name : '$x', replacement : '$y'} },
                        { employee : { name : '$x' } },
                        { employee : { name : '$y' } },
                        { $not : [ {$bind : [ '$x', '$y'] } ] },
                        { $or : [ 
                            { $and : [ 
                                { job : { name : '$x', title : '$t'} },
                                { job : { name : '$y', title : '$t'} },
                            ]},
                            { $and : [
                                { job : { name : '$x', title : '$tx' } },
                                { job : { name : '$y', title : '$ty' } },
                                { can_do_job : { who : '$ty', whose : '$tx' } }
                            ]}
                        ]}
                    ],
                    [ 
                        { result : { name : '$x', replacement : '$y', salary : '$sx', replSalary : '$sy' } },
                        { replace : { name : '$x', replacement : '$y' } },
                        { salary : { name : '$x', amount : '$sx' } },
                        { salary : { name : '$y', amount : '$sy' } },
                        { $call : [ 'gt', '$sx', '$sy'] }
                    ]
                ];
var query = [ { result : '$result' } ]; 
var transform = '$result';

function gt (x,y) {
    return x > y ? true : null;
}

var callbacks = { gt : gt };
var jsl = new JSL({rules : ruleset.concat(filterRules), query: query, transform: transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;


/*
response  

[
    {
        "name": "Hacker Alyssa P",
        "replacement": "Fect Cy D",
        "salary": 40000,
        "replSalary": 35000
    },
    {
        "name": "Warbucks Oliver",
        "replacement": "Aull DeWitt",
        "salary": 150000,
        "replSalary": 25000
    }
]

*/

```

<span id="exercise-458">
## Exercise 4.58
</span>

```
/*
Exercise 4.58.  Define a rule that says that a person is a ``big shot'' in a division 
if the person works in the division but does not have a supervisor who works in the division.
*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var filterRules = [
                    [
                        { bigShot : { name : '$x', title : '$tx', supervisor : '$y', supervisorTitle : '$ty' } },
                        { employee : { name : '$x'} },
                        { supervisor : { name : '$x', manager : '$y'} },
                        { job : { name : '$x', title : '$tx' } },
                        { job : { name : '$y', title : '$ty' } },
                        { $call : [ 'noMatchFirst', '$tx', '$ty'] }
                    ],
                ];
var query = [ { bigShot : { name : '$name', title : '$title' , supervisor : '$y', supervisorTitle : '$ty' } } ]; 
var transform = { name : '$name', title : '$title' , supervisor : '$y', supervisorTitle : '$ty' }; 

function noMatchFirst (x,y) {
    var x1 = (x.split(/\s+/)).shift();
    var y1 = (y.split(/\s+/)).shift();
    return x1 !== y1 ? true : null;
}

var callbacks = { noMatchFirst : noMatchFirst };
var jsl = new JSL({rules : ruleset.concat(filterRules), query: query, transform: transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;


/*
response  

[
    {
        "name": "Bitdiddle Ben",
        "title": "computer wizard",
        "supervisor": "Warbucks Oliver",
        "supervisorTitle": "administration big wheel"
    },
    {
        "name": "Scrooge Eben",
        "title": "accounting chief accountant",
        "supervisor": "Warbucks Oliver",
        "supervisorTitle": "administration big wheel"
    }
]

*/

```

<span id="exercise-459">
## Exercise 4.59
</span>

```
/*
Exercise 4.59.  Ben Bitdiddle has missed one meeting too many. Fearing that his habit of forgetting meetings could cost him his job, Ben decides to do something about it. He adds all the weekly meetings of the firm to the Microshaft data base by asserting the following:

(meeting accounting (Monday 9am))
(meeting administration (Monday 10am))
(meeting computer (Wednesday 3pm))
(meeting administration (Friday 1pm))

Each of the above assertions is for a meeting of an entire division. Ben also adds an entry for the company-wide meeting that spans all the divisions. All of the company's employees attend this meeting.

(meeting whole-company (Wednesday 4pm))

a. On Friday morning, Ben wants to query the data base for all the meetings that occur that day. What query should he use?
*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var meetings = [
    [{meeting : { department : 'accounting', day : 'Monday', hour : 9, minute : 0} }],
    [{meeting : { department : 'administration', day : 'Monday', hour : 10, minute : 0} }],
    [{meeting : { department : 'computer', day : 'Wednesday', hour : 15, minute : 0} }],
    [{meeting : { department : 'administration', day : 'Friday', hour : 13, minute : 0} }],
    [{meeting : { department : 'whole-company', day : 'Wednesday', hour : 13, minute : 0} }],
];

var query = [ { meeting : { department : '$d', day : 'Friday', hour : '$h', minute : '$m'} } ]; 
var transform = { department : '$d', day : 'Friday', hour : '$h', minute : '$m'}; 

var jsl = new JSL({rules : ruleset.concat(meetings), query: query, transform: transform});
var response = jsl.run();

module.exports = response;


/*
response  

[
    {
        "department": "administration",
        "day": "Friday",
        "hour": 13,
        "minute": 0
    }
]

*/

```

```
/*

b. Alyssa P. Hacker is unimpressed. She thinks it would be much more useful to be able to ask for her meetings by specifying her name. So she designs a rule that says that a person's meetings include all whole-company meetings plus all meetings of that person's division. Fill in the body of Alyssa's rule.

(rule (meeting-time ?person ?day-and-time)
      <rule-body>)
*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var meetings = [
    [{meeting : { department : 'accounting', day : 'Monday', hour : 9, minute : 0} }],
    [{meeting : { department : 'administration', day : 'Monday', hour : 10, minute : 0} }],
    [{meeting : { department : 'computer', day : 'Wednesday', hour : 15, minute : 0} }],
    [{meeting : { department : 'administration', day : 'Friday', hour : 13, minute : 0} }],
    [{meeting : { department : 'whole-company', day : 'Wednesday', hour : 13, minute : 0} }],
];

var filterRules = [
    [
        { meeting_time : { person : '$person', dept : '$dept', day : '$day', hour : '$hour', minute : '$minute' } },
        { job : { name : '$person', title : '$title'} },
        { meeting : { department : '$dept', day : '$day', hour : '$hour', minute : '$minute' } },
        { $or : [
            { $call : [ 'deptMatch', '$title', '$dept'] },
            {$bind : [ '$dept', 'whole-company'] }
        ]}
    ]
];

function deptMatch (title, dept) {
    var re = new RegExp('^' + dept + '\\s+');
    return title.match(re); // match returns null on failure, which is what we need callbacks to return on failure
}

var callbacks = { 
    deptMatch : deptMatch
};
// sample query to get Alyssa P Hacker's meetings for the whole week

var query = [ { meeting_time : { person : 'Hacker Alyssa P', dept : '$dept', day : '$day', hour : '$hour', minute : '$min'} } ]; 
var transform = { person : 'Hacker Alyssa P', dept : '$dept', day : '$day', hour : '$hour', minute : '$min'};

var jsl = new JSL({rules : ruleset.concat(meetings, filterRules), query: query, transform: transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;


/*
response  

[
    {
        "person": "Hacker Alyssa P",
        "dept": "computer",
        "day": "Wednesday",
        "hour": 15,
        "minute": 0
    },
    {
        "person": "Hacker Alyssa P",
        "dept": "whole-company",
        "day": "Wednesday",
        "hour": 13,
        "minute": 0
    }
]

*/

```

```
/*
c. Alyssa arrives at work on Wednesday morning and wonders what meetings she has to attend that day. 
Having defined the above rule, what query should she make to find this out?


*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var meetings = [
    [{meeting : { department : 'accounting', day : 'Monday', hour : 9, minute : 0} }],
    [{meeting : { department : 'administration', day : 'Monday', hour : 10, minute : 0} }],
    [{meeting : { department : 'computer', day : 'Wednesday', hour : 15, minute : 0} }],
    [{meeting : { department : 'administration', day : 'Friday', hour : 13, minute : 0} }],
    [{meeting : { department : 'whole-company', day : 'Wednesday', hour : 13, minute : 0} }],
];

var filterRules = [
    [
        { meeting_time : { person : '$person', dept : '$dept', day : '$day', hour : '$hour', minute : '$minute' } },
        { job : { name : '$person', title : '$title'} },
        { meeting : { department : '$dept', day : '$day', hour : '$hour', minute : '$minute' } },
        { $or : [
            { $call : [ 'deptMatch', '$title', '$dept'] },
            {$bind : [ '$dept', 'whole-company'] }
        ]}
    ]
];

function deptMatch (title, dept) {
    var re = new RegExp('^' + dept + '\\s+');
    return title.match(re); // match returns null on failure, which is what we need callbacks to return on failure
}

var callbacks = { 
    deptMatch : deptMatch
};
// sample query to get Alyssa P Hacker's meetings for the whole week

var query = [ { meeting_time : { person : 'Hacker Alyssa P', dept : '$dept', day : 'Wednesday', hour : '$hour', minute : '$min'} } ]; 
var transform = { person : 'Hacker Alyssa P', dept : '$dept', day : 'Wednesday', hour : '$hour', minute : '$min'};

var jsl = new JSL({rules : ruleset.concat(meetings, filterRules), query: query, transform: transform, callbacks : callbacks});
var response = jsl.run();

module.exports = response;


/*
response  

[
    {
        "person": "Hacker Alyssa P",
        "dept": "computer",
        "day": "Wednesday",
        "hour": 15,
        "minute": 0
    },
    {
        "person": "Hacker Alyssa P",
        "dept": "whole-company",
        "day": "Wednesday",
        "hour": 13,
        "minute": 0
    }
]

*/

```

<span id="exercise-460">
## Exercise 4.60
</span>

```
/*
...
(rule (lives-near ?person-1 ?person-2)
      (and (address ?person-1 (?town . ?rest-1))
           (address ?person-2 (?town . ?rest-2))
           (not (same ?person-1 ?person-2))))
...
...
Exercise 4.60.  By giving the query

(lives-near ?person (Hacker Alyssa P))

Alyssa P. Hacker is able to find people who live near her, with whom she can ride to work. 
On the other hand, when she tries to find all pairs of people who live near each other by querying

(lives-near ?person-1 ?person-2)

she notices that each pair of people who live near each other is listed twice; for example,

(lives-near (Hacker Alyssa P) (Fect Cy D))
(lives-near (Fect Cy D) (Hacker Alyssa P))

Why does this happen? Is there a way to find a list of people who live near each other, in which each pair appears only once? Explain.

*/

var JSL = require('../../..');

var ruleset = require ('./db.js');

var problemRules = [
    [
        { lives_near : { person1 : '$person1', person2: '$person2' } },
        { $and : [ 
            { employee : { name : '$person1', address : ['$town', '$street1', '$number1']} },
            { employee : { name : '$person2', address : ['$town', '$street2', '$number2']} },
            { $not : [ {$bind : [ '$person1', '$person2']  } ]  }            
        ]}
    ]
];

var query;
var response = {};
query = [ { lives_near : { person1 : '$person1', person2: '$person2' } } ];


var pjsl = new JSL({rules : ruleset.concat(problemRules), query: query});
response.problem = pjsl.run();

/*
    We solve the duplicate suppression problem easily using a callback
*/
var solutionRules = [
    [
        { lives_near : { person1 : '$person1', person2: '$person2' } },
        { $and : [ 
            { employee : { name : '$person1', address : ['$town', '$street1', '$number1']} },
            { employee : { name : '$person2', address : ['$town', '$street2', '$number2']} },
            { $not : [ {$bind : [ '$person1', '$person2']  } ]  },
            { $call : [ 'str_gt', '$person1', '$person2'] }
        ]}
    ]
];

function str_gt (x,y) {
    return x > y ? true : null;
}

var callbacks = { 
    str_gt : str_gt
};


var sjsl = new JSL({rules : ruleset.concat(solutionRules), query: query, callbacks : callbacks});
response.solution = sjsl.run();
module.exports = response;


/*
response  

{
    "problem": [
        [
            {
                "lives_near": {
                    "person1": "Bitdiddle Ben",
                    "person2": "Reasoner Louis"
                }
            }
        ],
        [
            {
                "lives_near": {
                    "person1": "Bitdiddle Ben",
                    "person2": "Aull DeWitt"
                }
            }
        ],
        [
            {
                "lives_near": {
                    "person1": "Hacker Alyssa P",
                    "person2": "Fect Cy D"
                }
            }
        ],
        [
            {
                "lives_near": {
                    "person1": "Fect Cy D",
                    "person2": "Hacker Alyssa P"
                }
            }
        ],
        [
            {
                "lives_near": {
                    "person1": "Reasoner Louis",
                    "person2": "Bitdiddle Ben"
                }
            }
        ],
        [
            {
                "lives_near": {
                    "person1": "Reasoner Louis",
                    "person2": "Aull DeWitt"
                }
            }
        ],
        [
            {
                "lives_near": {
                    "person1": "Aull DeWitt",
                    "person2": "Bitdiddle Ben"
                }
            }
        ],
        [
            {
                "lives_near": {
                    "person1": "Aull DeWitt",
                    "person2": "Reasoner Louis"
                }
            }
        ]
    ],
    "solution": [
        [
            {
                "lives_near": {
                    "person1": "Bitdiddle Ben",
                    "person2": "Aull DeWitt"
                }
            }
        ],
        [
            {
                "lives_near": {
                    "person1": "Hacker Alyssa P",
                    "person2": "Fect Cy D"
                }
            }
        ],
        [
            {
                "lives_near": {
                    "person1": "Reasoner Louis",
                    "person2": "Bitdiddle Ben"
                }
            }
        ],
        [
            {
                "lives_near": {
                    "person1": "Reasoner Louis",
                    "person2": "Aull DeWitt"
                }
            }
        ]
    ]
}

*/

```

<span id="exercise-461">
## Exercise 4.61
</span>

```
/*
Exercise 4.61.  The following rules implement a next-to relation that finds adjacent elements of a list:

(rule (?x next-to ?y in (?x ?y . ?u)))

(rule (?x next-to ?y in (?v . ?z))
      (?x next-to ?y in ?z))

What will the response be to the following queries?

(?x next-to ?y in (1 (2 3) 4))

(?x next-to 1 in (2 1 3 1))

*/

var JSL = require('../../..');

var ruleset = [];

/* 
    We use the standard parseList callback included with JSL, 
    it returns the head and tail of an array
    parseList is the building block of cons/cdr style recursive list processing in JSL    
*/

var rules = [
    [
        { next_to : ['$x', '$y', '$list'] },
        { '$and' : [ 
            { $call : [ 'parseList', '$list', ['$x', '$xtail'] ] },
            { $call : [ 'parseList', '$xtail', ['$y', '$ytail'] ] }
        ]}
    ],
    [
        { next_to : ['$x', '$y', '$list'] },
        { $and : [ 
            { $call : [ 'parseList', '$list', ['$head', '$tail'] ] },
            { next_to : [ '$x', '$y', '$tail' ] }
        ] }
    ]
];

var response = {};
var query1 = [ { next_to : ['$x', '$y', [ 1 , [ 2 , 3 ] , 4 ] ] } ];
var query2 = [ { next_to : ['$x', 1 , [ 2, 1, 3, 1] ] } ];

/* we add another query to enumerate all neighbors */
var query3 = [ { next_to : ['$x', '$y' , [ 2, 1, 3, 1] ] } ];



var jsl = new JSL({rules : ruleset.concat(rules), query: query1});
response.query1 = jsl.run();
jsl = new JSL({rules : ruleset.concat(rules), query: query2});
response.query2 = jsl.run();
jsl = new JSL({rules : ruleset.concat(rules), query: query3});
response.query3 = jsl.run();

/*
 *Responses to query1 show the rules working at the topmost level only; they only find neighbors at the
 *top level of the list.
 */
module.exports = response;


/*
response  

{
    "query1": [
        [
            {
                "next_to": [
                    1,
                    [
                        2,
                        3
                    ],
                    [
                        1,
                        [
                            2,
                            3
                        ],
                        4
                    ]
                ]
            }
        ],
        [
            {
                "next_to": [
                    [
                        2,
                        3
                    ],
                    4,
                    [
                        1,
                        [
                            2,
                            3
                        ],
                        4
                    ]
                ]
            }
        ]
    ],
    "query2": [
        [
            {
                "next_to": [
                    2,
                    1,
                    [
                        2,
                        1,
                        3,
                        1
                    ]
                ]
            }
        ],
        [
            {
                "next_to": [
                    3,
                    1,
                    [
                        2,
                        1,
                        3,
                        1
                    ]
                ]
            }
        ]
    ],
    "query3": [
        [
            {
                "next_to": [
                    2,
                    1,
                    [
                        2,
                        1,
                        3,
                        1
                    ]
                ]
            }
        ],
        [
            {
                "next_to": [
                    1,
                    3,
                    [
                        2,
                        1,
                        3,
                        1
                    ]
                ]
            }
        ],
        [
            {
                "next_to": [
                    3,
                    1,
                    [
                        2,
                        1,
                        3,
                        1
                    ]
                ]
            }
        ]
    ]
}

*/

```

<span id="exercise-462">
## Exercise 4.62
</span>

```
/*ui
Exertcise 4.62.  Define rules to implement the last-pair operation of exercise 2.17, which returns a list containing the last element of a nonempty list. Check your rules on queries such as (last-pair (3) ?x), (last-pair (1 2 3) ?x), and (last-pair (2 ?x) (3)). Do your rules work correctly on queries such as (last-pair ?x (3)) ?

        for reference,

        Exercise 2.17.  Define a procedure last-pair that returns the list that contains only the last element of a given (nonempty) list:

        (last-pair (list 23 72 149 34))
        (34)

*/

var JSL = require('../../..');

var ruleset = [];

/* 
    We take the liberty to translate the problem to last_element
    Since JS arrays are not lists of pairs

    We use the standard  callback 'parseList' included with JSL, 
    it returns the head and tail of an array
    parseList is the building block of cons/cdr style recursive list processing in JSL    

    We also use the standard callback 'objEqual' included with JSL,
    it tests two JS values (null, String, Object, Array) to check if they are equal
*/


var rules = [
    [
        { last_element : ['$list', '$x'] },
        { $or : [
            { $and : [
                { $call: [ 'objEqual', '$list', [], [] ] }, //<-- must give an empty array at end to avoid confusing outObj interpretation
                {$bind : [ '$x', [] ] }
            ]},
            { $and : [
                { $call : [ 'parseList', '$list', [ '$head', '$tail' ] ] },
                { $call : [ 'objEqual', '$tail', [], [] ] }, //<-- must give an empty array at end to avoid confusing outObj interpretation
                {$bind : [ '$x', '$head' ] }
            ] },
            { $and : [ 
                { $call : [ 'parseList', '$list', [ '$head', '$tail' ] ] },
                { last_element : [ '$tail', '$x' ] }
            ] }
        ]}
    ]
];

var response = {};
var query1 = [ { last_element : [[3], '$x'] } ];
var query2 = [ { last_element : [[1,2,3], '$x'] } ];
var query3 = [ { last_element : ['$x', [3]] } ];

/*
    query1 and query2 work as expected, reporting the last element of the given list
    query3 fortunately fails due to the implementation of parseList which returns null if the given input list is not an array
    Since $x is an unbound variable when parseList is $called in query3, it simply returns null
    so we get an empty list in the response

    It is possible to imagine the correct result of query3 being an infinite set of all lists with 3 at the end 
    but we do not obtain that result in our implementation

*/
var jsl = new JSL({rules : ruleset.concat(rules), query: query1});
response.query1 = jsl.run();
jsl = new JSL({rules : ruleset.concat(rules), query: query2});
response.query2 = jsl.run();
jsl = new JSL({rules : ruleset.concat(rules), query: query3});
response.query3 = jsl.run();

module.exports = response;


/*
response  

{
    "query1": [
        [
            {
                "last_element": [
                    [
                        3
                    ],
                    3
                ]
            }
        ]
    ],
    "query2": [
        [
            {
                "last_element": [
                    [
                        1,
                        2,
                        3
                    ],
                    3
                ]
            }
        ]
    ],
    "query3": [
        [
            {
                "last_element": [
                    [
                        3
                    ],
                    [
                        3
                    ]
                ]
            }
        ]
    ]
}

*/

```

<span id="exercise-463">
## Exercise 4.63
</span>

```
/*
Exercise 4.63.  The following data base (see Genesis 4) traces the genealogy of the descendants of Ada back to Adam, by way of Cain:

(son Adam Cain)
(son Cain Enoch)
(son Enoch Irad)
(son Irad Mehujael)
(son Mehujael Methushael)
(son Methushael Lamech)
(wife Lamech Ada)
(son Ada Jabal)
(son Ada Jubal)

Formulate rules such as ``If S is the son of F, and F is the son of G, then S is the grandson of G'' and 
``If W is the wife of M, and S is the son of W, then S is the son of M'' (which was supposedly more true in biblical times 
than today) that will enable the query system to find the grandson of Cain; 
the sons of Lamech; 
the grandsons of Methushael. (See exercise 4.69 for some rules to deduce more complicated relationships.)

*/

var JSL = require('../../..');

var ruleset = [
    [{son : { parent : 'Adam' , name : 'Cain' } } ],
    [{son : { parent: 'Cain' , name :  'Enoch' } } ],
    [{son : { parent : 'Enoch' , name : 'Irad' } } ],
    [{son : { parent : 'Irad' , name : 'Mehujael' } } ],
    [{son : { parent : 'Mehujael' , name : 'Methushael' } } ],
    [{son : { parent : 'Methushael' , name : 'Lamech' } } ],
    [{wife :{ husband : 'Lamech' , name : 'Ada' } } ],
    [{son : { parent : 'Ada' , name : 'Jabal' } } ],
    [{son : { parent : 'Ada' , name : 'Jubal' } } ]
]

var filterRules = [
    [
        { grandson : { grandfather : '$grandfather', name : '$grandson'} },
        { son_of : { parent : '$grandfather', name : '$father'} },
        { son_of : { parent : '$father', name : '$grandson'} }
    ],
    [
        { son_of : { parent : '$parent', name : '$name' } },
        { son : { parent : '$x', name : '$name'} },
        { $or : [
            {$bind : [ '$x', '$parent'] },
            { wife : { husband : '$x', name : '$parent'} },
            { wife : { husband : '$parent', name : '$x' } }
        ]}
    ]
];

var query;
var response = {}; 

query  = [ { grandson : { grandfather : 'Cain', name: '$name' } } ];
var jsl = new JSL({rules : ruleset.concat(filterRules), query: query});
response.grandson_of_Cain = jsl.run(); 

query = [ { son_of : { parent : 'Lamech', name : '$name'} } ];
jsl = new JSL({rules : ruleset.concat(filterRules), query: query});
response.sons_of_Lamech = jsl.run();

query = [ { grandson : { grandfather : 'Methushael', name: '$name' } } ];
jsl = new JSL({rules : ruleset.concat(filterRules), query: query});
response.grandsons_of_Methushael = jsl.run();

module.exports = response;


/*
response  

{
    "grandson_of_Cain": [
        [
            {
                "grandson": {
                    "grandfather": "Cain",
                    "name": "Irad"
                }
            }
        ]
    ],
    "sons_of_Lamech": [
        [
            {
                "son_of": {
                    "parent": "Lamech",
                    "name": "Jabal"
                }
            }
        ],
        [
            {
                "son_of": {
                    "parent": "Lamech",
                    "name": "Jubal"
                }
            }
        ]
    ],
    "grandsons_of_Methushael": [
        [
            {
                "grandson": {
                    "grandfather": "Methushael",
                    "name": "Jabal"
                }
            }
        ],
        [
            {
                "grandson": {
                    "grandfather": "Methushael",
                    "name": "Jubal"
                }
            }
        ]
    ]
}

*/

```

<span id="exercise-464">
## Exercise 4.64
</span>

``` 
/*
...
(rule (outranked-by ?staff-person ?boss)
      (or (supervisor ?staff-person ?boss)
          (and (supervisor ?staff-person ?middle-manager)
               (outranked-by ?middle-manager ?boss))))
...
...

Exercise 4.64.  Louis Reasoner mistakenly deletes the outranked-by rule (section 4.4.1) from the data base. 
When he realizes this, he quickly reinstalls it. Unfortunately, he makes a slight change in the rule, and types it in as

(rule (outranked-by ?staff-person ?boss)
      (or (supervisor ?staff-person ?boss)
          (and (outranked-by ?middle-manager ?boss)
               (supervisor ?staff-person ?middle-manager))))

Just after Louis types this information into the system, DeWitt Aull comes by to find out who outranks Ben Bitdiddle. He issues the query

(outranked-by (Bitdiddle Ben) ?who)

After answering, the system goes into an infinite loop. Explain why.
*/

/*
    JSL $or does not work the same as the textbook implementation. It stops at the first successful object.
    Thus, it does not try to find all bosses for a given employee, it just stops at the first one.

    To enumerate all bosses of a given $name, we must include an additional object in the rule 
    which matches all employees in the database. Then our ruleset produces all bosses for a given $name

    Then we can reproduce the infinite recursion encountered by Louis by making the same rearrangement 

    The infinite recursion is caused by repeated invocation of outranked_by with an unbound variable, 
    giving the recursion no chance to terminate

    Thus one needs to be conscious of the order of evaluation of rules in JSL, just as with the textbook implementation
*/

var JSL = require('../../..');

var ruleset = require('./db.js');


var filterRules = [
    [
        { outranked_by : { name : '$name', boss : '$boss'} },
        { employee : { name : '$boss', address : '$address'}}, //<-- additional rule to enumerate all employees
        { $or : [
            { supervisor : { name : '$name', manager : '$boss' } },
            { $and : [
                { supervisor : { name : '$name', manager : '$middleManager'} },
                { outranked_by : { name : '$middleManager', boss : '$boss' } },
            ]},
        ]}
    ]
];


/* this rearrangement produces an infinite loop */

/*
var badRules = [
    [
        { outranked_by : { name : '$name', boss : '$boss'} },
        { employee : { name : '$boss', address : '$address'}},
        { $or : [
            { supervisor : { name : '$name', manager : '$boss' } },
            { $and : [
                { outranked_by : { name : '$middleManager', boss : '$boss' } },
                { supervisor : { name : '$name', manager : 'middleManager'} }
            ]},
        ]}
    ]
];
*/

var query;
var response = {}; 

query  = [ { outranked_by : { name : 'Reasoner Louis', boss : '$who' } } ];
var jsl = new JSL({rules : ruleset.concat(filterRules), query: query});
response = jsl.run();

module.exports = response;


/*
response  

[
    [
        {
            "outranked_by": {
                "name": "Reasoner Louis",
                "boss": "Bitdiddle Ben"
            }
        }
    ],
    [
        {
            "outranked_by": {
                "name": "Reasoner Louis",
                "boss": "Hacker Alyssa P"
            }
        }
    ],
    [
        {
            "outranked_by": {
                "name": "Reasoner Louis",
                "boss": "Warbucks Oliver"
            }
        }
    ]
]

*/

```

<span id="exercise-465">
## Exercise 4.65
</span>

```
/*
...
(rule (wheel ?person)
      (and (supervisor ?middle-manager ?person)
           (supervisor ?x ?middle-manager)))

...
...

Cy D. Fect, looking forward to the day when he will rise in the organization, 
gives a query to find all the wheels (using the wheel rule of section 4.4.1):

(wheel ?who)

To his surprise, the system responds

;;; Query results:
(wheel (Warbucks Oliver))
(wheel (Bitdiddle Ben))
(wheel (Warbucks Oliver))
(wheel (Warbucks Oliver))
(wheel (Warbucks Oliver))

Why is Oliver Warbucks listed four times?


*/

var JSL = require('../../..');

var ruleset = require('./db.js');


var problemRules = [
    [
        { wheel :  '$person' },
        { $and : [ 
            { supervisor : { name : '$middle-manager',  manager : '$person'} },
            { supervisor : { name : '$x', manager : '$middle-manager' } } 
        ]}
    ]
];

var solutionRules = [
    [
        { wheel :  '$person' },
        { $and : [ 
            { supervisor : { name : '$middle-manager',  manager : '$person'} },
            { supervisor : { name : '$x', manager : '$middle-manager' } } 
        ]},
        { $call : [ 'notSeen', '$person'] }
    ]
];

var query;
var response = {}; 

query  = [ { wheel : '$who' } ];
var jsl = new JSL({rules : ruleset.concat(problemRules), query: query});
response.problem = jsl.run();

/*  to solve the duplication problem, we simply invent a callback which keeps (in its environment), a list of
    names already "seen", and returns null for duplicates.
    A $call object added to the end of the rule effecively filters out duplicates
    The callback is given an array to work with during its construction

    The solution illustrates the ease of cooperation betweeh JSL rules and JS host environment
*/

function notSeen () {
    var list = []; // static variable
    return function(x) {
        var result = null;
        if (list.indexOf(x) < 0) {
            result = true;
            list.push(x);
        }
        return result;
    }
}

var callbacks = {
    notSeen : notSeen()
}


jsl = new JSL({rules : ruleset.concat(solutionRules), query: query, callbacks : callbacks});
response.solution = jsl.run();

module.exports = response;


/*
response  

{
    "problem": [
        [
            {
                "wheel": "Bitdiddle Ben"
            }
        ],
        [
            {
                "wheel": "Warbucks Oliver"
            }
        ],
        [
            {
                "wheel": "Warbucks Oliver"
            }
        ],
        [
            {
                "wheel": "Warbucks Oliver"
            }
        ],
        [
            {
                "wheel": "Warbucks Oliver"
            }
        ]
    ],
    "solution": [
        [
            {
                "wheel": "Bitdiddle Ben"
            }
        ],
        [
            {
                "wheel": "Warbucks Oliver"
            }
        ]
    ]
}

*/

```

<span id="exercise-466">
## Exercise 4.66
</span>

```
/*
Exercise 4.66.  Ben has been generalizing the query system to provide statistics about the company. 
For example, to find the total salaries of all the computer programmers one will be able to say

(sum ?amount
     (and (job ?x (computer programmer))
          (salary ?x ?amount)))

In general, Ben's new system allows expressions of the form

(accumulation-function <variable>
                       <query pattern>)

where accumulation-function can be things like sum, average, or maximum. 
Ben reasons that it should be a cinch to implement this. He will simply feed the query pattern to qeval. 
This will produce a stream of frames. He will then pass this stream through a mapping function 
that extracts the value of the designated variable from each frame in the stream and feed the 
resulting stream of values to the accumulation function. Just as Ben completes the implementation and 
is about to try it out, Cy walks by, still puzzling over the wheel query result in exercise 4.65. 
When Cy shows Ben the system's response, Ben groans, ``Oh, no, my simple accumulation scheme won't work!''

What has Ben just realized? Outline a method he can use to salvage the situation.

*/

/*
    Ben's approach won't work due to duplicates in possible outputs produced by rules which feed the accumulator
    We don't bother to reproduce the problem since it was done in exercise 4.65, along with a duplicate suppressor callback
    we simply use that callback here and introduce another callback to accumulate the sum
    this time we don't discard the output of the accumulator, but$bind it to a JSL variable, allowing us to output the sum
    Finally, we use the fact that response is simply an array of all the intermediate results returned by sum and pop its last element 
    to obtain the final response from the module

    This solution illustrates the application of JS and JSl working together on non trivial problems
*/

var JSL = require('../../..');

var ruleset = require('./db.js');



var solutionRules = [
    [
        { sum :  { title : '$title', totalSalary : '$total' } },
        { $and : [ 
            { job : { name : '$x',  title : '$title'} },
            { salary : { name : '$x', amount : '$amount' } },
            { $call : [ 'notSeen', '$x'] },
            { $call : [ 'accum', '$amount', ['$total'] ] } // use $total as out variable for callback to return into
        ]}
    ]
];



function notSeen () {
    var list = []; // static variable
    return function(x) {
        var result = null;
        if (list.indexOf(x) < 0) {
            result = true;
            list.push(x);
        }
        return result;
    }
}

function accum () {
    var accumVar = 0; // static variable 
    return function(x) {
        return accumVar += x;
    }
}

var callbacks = {
    notSeen : notSeen(), 
    accum :  accum() 
}


var query = [{ sum : { title : 'computer programmer', totalSalary : '$totalSalary'}  }]
var jsl = new JSL({rules : ruleset.concat(solutionRules), query: query, callbacks : callbacks}) ;
var response = jsl.run();

module.exports = response.pop(); // just get the last result of accumulation


/*
response  

[
    {
        "sum": {
            "title": "computer programmer",
            "totalSalary": 75000
        }
    }
]

*/

```

<span id="exercise-468">
## Exercise 4.68
</span>

```
/*ui
Exercise 4.68.  Define rules to implement the reverse operation of exercise 2.18, which returns a list containing the same elements as a given list in reverse order. (Hint: Use append-to-form.) Can your rules answer both (reverse (1 2 3) ?x) and (reverse ?x (1 2 3)) ?

        for reference,

        Exercise 2.18.  Define a procedure reverse that takes a list as argument and returns a list of the same elements in reverse order:

        (reverse (list 1 4 9 16 25))
        (25 16 9 4 1)
*/

var JSL = require('../../..');

var ruleset = [];

var rules = [
    [
        { reverse : ['$list', '$reverse'] },
        { $or : [
            { $and : [
                { $call: [ 'objEqual', '$list', [], [] ] },
                {$bind : [ '$reverse', [] ] }
            ]},
            { $and : [
                { $call : [ 'parseList', '$list', [ '$head', '$tail' ] ] },
                { reverse : [ '$tail', '$tailreverse'] },
                { $call : [ 'concat', '$tailreverse', ['$head'], ['$reverse'] ] }
            ] },
            { $and : [
                { $call : [ 'parseList', '$reverse', [ '$head', '$tail' ] ] },
                { reverse : [ '$tail', '$tailreverse'] },
                { $call : [ 'concat', '$tailreverse', ['$head'], ['$list'] ] }
            ] }

        ]}
    ]
];

var response = {};
var query1 = [ { reverse : [[1,2,3], '$x'] } ];
var query2 = [ { reverse : ['$x', [1,2,3] ] } ];


var jsl = new JSL({rules : ruleset.concat(rules), query: query1});
response.query1 = jsl.run();

jsl = new JSL({rules : ruleset.concat(rules), query: query2});
response.query2 = jsl.run();

/*
    Since our callback parseList fails on non array inputs, we can make either form of reverse query work 
    by writing 2 rules: one to satisfy reversing of first argument, and the second to satisfy reversing of second argument
    We take advantage of our knowledge that unbound variables will cause the callback to return null (fail)
*/

    
module.exports = response;


/*
response  

{
    "query1": [
        [
            {
                "reverse": [
                    [
                        1,
                        2,
                        3
                    ],
                    [
                        3,
                        2,
                        1
                    ]
                ]
            }
        ]
    ],
    "query2": [
        [
            {
                "reverse": [
                    [
                        3,
                        2,
                        1
                    ],
                    [
                        1,
                        2,
                        3
                    ]
                ]
            }
        ]
    ]
}

*/

```
