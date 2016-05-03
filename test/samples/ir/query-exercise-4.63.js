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
