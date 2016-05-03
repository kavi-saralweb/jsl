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

