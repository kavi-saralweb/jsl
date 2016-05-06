[Full documentation](http://kavi-saralweb.github.io/docs/html/index.html)

---

# JSL Overview

JSL is a JSON based logic programming library. It is meant to be used as an embedded rules engine in JS applications.

We introduce JSL with a simple object unification example that produces a contract out of a matching bid and offer.

```

var JSL = require('lib-jsl');

var offer = {
    offerer : 'sandeep',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 10,
    qty : 100
} 

var bid = [{
    offerer : '$offerer',
    bidder : 'kavi',
    symbol : 'ABC',
    price : 10,
    qty : 100
}]

var jsl = new JSL({
    rules: [bid],
    query: [offer]
});

var response = jsl.run();
console.log('contract: ', response);

module.exports = response;


/*  
response 

[
    [
        {
            "offerer": "sandeep",
            "bidder": "kavi",
            "symbol": "ABC",
            "price": 10,
            "qty": 100
        }
    ]
]

*/

```

The bid and offer records are the same except that they both leave one of bidder / offerer as variables (indicated by string values which start with '$'). We use JSL to unify these two objects and produce a merged object with the same keys and all variables instantiated.

The example shows some important characteristics of JSL.

- JSL rules and query are nothing but (JSON serializable) JS objects. 

- A set of JSL rules is an array of array of objects. (This is why the bid variable is an array containing just one object).

- Variables are allowed in both rules and query. Any value string which starts with '$' is a variable. 

- JSL execution proceeds by unifying the query object with rules.

- JSL execution produces one or more fully instantiated versions of the given query object, i.e. all variables in the query are replaced with matching structures from the ruleset.



<span id="unification">

## Unification

</span>

We extend our example by introducing multiple bids, and asking the system to produce a contract for the one which matches a given offer. The bids variable is now an array of arrays, i.e. a valid JSl batch of facts (data). It can be given directly as rules to JSL.

```

var JSL = require('lib-jsl');

var offer = {
    offerer : 'sandeep',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 20,
    qty : 100
} 

var bids = [
[{
    offerer : '$offerer',
    bidder : 'kavi',
    symbol : 'ABC',
    price : 10,
    qty : 100
}],
[{
    offerer : '$offerer',
    bidder : 'pradeep',
    symbol : 'ABC',
    price : 20,
    qty : 100
}],
[{
    offerer : '$offerer',
    bidder : 'taran',
    symbol : 'ABC',
    price : 20,
    qty : 200
}]

]

var jsl = new JSL({
    rules: bids,
    query: [offer]
});

var response = jsl.run();
console.log('contract: ', response);

module.exports = response;


/*
response 

[
    [
        {
            "offerer": "sandeep",
            "bidder": "pradeep",
            "symbol": "ABC",
            "price": 20,
            "qty": 100
        }
    ]
]

*/

```

The system produces a completed contract based on the one matching bid in the set of bids.

<span id="transform">

## Data transformation

</span>

We now introduce multiple matching bids, and ask the system to produce just a list of names of matching bidders. 

```

var JSL = require('lib-jsl');

var offer = {
    offerer : 'sandeep',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 20,
    qty : 100
} 

var bids = [
[{
    offerer : '$offerer',
    bidder : 'kavi',
    symbol : 'ABC',
    price : 10,
    qty : 100
}],
[{
    offerer : '$offerer',
    bidder : 'pradeep',
    symbol : 'ABC',
    price : 20,
    qty : 100
}],
[{
    offerer : '$offerer',
    bidder : 'taran',
    symbol : 'ABC',
    price : 20,
    qty : 200
}],
[{
    offerer : '$offerer',
    bidder : 'naveen',
    symbol : 'ABC',
    price : 20,
    qty : 100
}],
[{
    offerer : '$offerer',
    bidder : 'prashant',
    symbol : 'ABC',
    price : 25,
    qty : 200
}]

]

var jsl = new JSL({
    rules: bids,
    query: [offer],
    transform: '$bidder'
});

var response = jsl.run();
console.log('matching bidders ', response);

module.exports = response;


/*
response 

[
    "pradeep",
    "naveen"
]

*/

```
We used the query variable '$bidder' to transform (shape) the result. By indicating `transform : '$bidder'` we asked the system to produce an array of values which were assigned to the variable '$bidder'. The transform can  be an arbitrary JS object containing any of the variables from the query.

_Note: If the transform is left unspecified, the result is an array of arrays, i.e. a valid JSL batch, with each element of the outer array becoming a fully instantiated version of the query object._

<span id="rules">

## Logic programming / Rules

</span>

We complete our basic example by introducing multiple bids as well as offers, and ask the system to produce a set of possible matches (contracts).

```

var JSL = require('lib-jsl');

var offers = [
[{
    type : 'offer',
    offerer : 'sandeep',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 20,
    qty : 100
}],
 [{
    type : 'offer',
    offerer : 'shekhar',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 25,
    qty : 100
}],
[{
    type : 'offer',
    offerer : 'ruchir',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 20,
    qty : 200
}],
[{
    type : 'offer',
    offerer : 'prachi',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 25,
    qty : 200
}]
]


var bids = [
[{
    type : 'bid',
    offerer : '$offerer',
    bidder : 'kavi',
    symbol : 'ABC',
    price : 10,
    qty : 100
}],
[{
    type : 'bid',
    offerer : '$offerer',
    bidder : 'pradeep',
    symbol : 'ABC',
    price : 20,
    qty : 100
}],
[{
    type : 'bid',
    offerer : '$offerer',
    bidder : 'taran',
    symbol : 'ABC',
    price : 20,
    qty : 200
}],
[{
    type : 'bid',
    offerer : '$offerer',
    bidder : 'naveen',
    symbol : 'ABC',
    price : 20,
    qty : 100
}],
[{
    type : 'bid',
    offerer : '$offerer',
    bidder : 'prashant',
    symbol : 'ABC',
    price : 25,
    qty : 200
}]

]

var rules = [
    [   //head
        { match : {offerer : '$offerer', bidder : '$bidder', symbol : '$symbol', price : '$price', qty : '$qty'}},
        //body
        { type: 'bid', bidder : '$bidder', symbol : '$symbol', price : '$price', qty : '$qty'},
        { type : 'offer', offerer : '$offerer', symbol : '$symbol', price : '$price', qty : '$qty'},
    ]
];

var jsl = new JSL({
    rules: rules.concat(bids, offers),
    query: [{match: '$match'}],
    transform: '$match'
});

var response = jsl.run();
console.log('contracts: ', response);

module.exports = response;


/*
response 

[
    {
        "offerer": "sandeep",
        "bidder": "pradeep",
        "symbol": "ABC",
        "price": 20,
        "qty": 100
    },
    {
        "offerer": "ruchir",
        "bidder": "taran",
        "symbol": "ABC",
        "price": 20,
        "qty": 200
    },
    {
        "offerer": "sandeep",
        "bidder": "naveen",
        "symbol": "ABC",
        "price": 20,
        "qty": 100
    },
    {
        "offerer": "prachi",
        "bidder": "prashant",
        "symbol": "ABC",
        "price": 25,
        "qty": 200
    }
]

*/

```


The rules array now contains a full JSL batch comprising of a rule as well as facts (data). Bids and offers have been given a type attribute which identifies them.

### rules

The first object in the matching rule is the _head_, and the remaining objects, are the _body_. The rule specifies that it is looking for a combination of bid and offer records where '$symbol', '$price', and '$qty' are the same. The '$bidder' and '$offerer' are extracted from the appropriate type of record to construct the final output in the head of the rule.

    [   //head
        { match : {bidder : '$bidder', offerer : '$offerer', symbol : '$symbol', price : '$price', qty : '$qty'}},
        //body
        { type: 'bid', bidder : '$bidder', symbol : '$symbol', price : '$price', qty : '$qty'},
        { type : 'offer', offerer : '$offerer', symbol : '$symbol', price : '$price', qty : '$qty'},
    ]

### facts

The bids and offers are both an array of arrays containing a single object each; Each bid and offer is a _fact_ : it has a _head_ but no _body_. 

    // head only
    [{  
        type : 'bid',
        bidder : '$bidder',
        offerer : 'prashant',
        symbol : 'ABC',
        price : 25,
        qty : 200
    }]


### query

The query can also be seen as a rule :

    query: [{match: '$match'}]

Finally, note that we concatenate rules and facts (data) before calling Jsl, combining all rules and facts into one array.


<span id="algorithm">

## JSL algorithm

</span>

For any given rule, the _head_ is _satisfied_ if each part of the _body_ is _satisfied_. Thus _facts_ are always _satisfied_. Each part of the _body_ is _unified_ against the set of rules, to find a rule where the _head_ of the rule _matches_ the body part.

Since we are dealing with JS objects, we define _match_ to mean containment, i.e. the body part must be fully contained in the head of the _matched_ rule. In this example, the query object `{ match: ... }` is completely contained in the head of the matching rule as a path (only the keys/paths matter for _matching_).

Query execution proceeds by attempting to _satisfy_ the query object by _unifying_ it against the rules. If any rule _matches_ the query, the unification proceeds recursively into its _body_ parts, until there are no more _body_ parts to be _satisfied_ , or a _body_ part fails to _unify_. All rules that _match_ the query are tried. Thus a query can produce multiple results.

In this example, the query _matches_ the matching rule, and each _body_ part of the matching rule successfully unifies against pairs of bid and offer records; so  we obtain a set of fully instantiated '$match' values in the result.

<span id="summary">

## Summary

</span>

This overview showed a naive bid/offer matching procedure which started by merging two objects, and progressed in complexity to produce matching pairs from multiple types of records.

The [next chapter](http://kavi-saralweb.github.io/docs/html/features.html) introduces features of JSL (builtins, callbacks) which allow refinement of the matching procedure to make it more capable.

We have found JSL useful for the following tasks :

- Data binding 
  * As described in [this overview](http://kavi-saralweb.github.io/docs/html/overview.html), data binding involves filling out "holes" in a JS object using data supplied as another set of JS objects. Bids and Offers are merely unbound objects waiting to be bound to a "matching" object. 

- Information Retrieval
  * Maintain and query small, in-memory databases of non trivial complexity such as configurations, dependencies, etc. See  [information retrieval example](http://kavi-saralweb.github.io/docs/html/ir.html). The chapter is based on a textbook example, but covers salient concepts of information retrieval.

- Test automation 
  * Specification of expected output from a JSON returning api, see  [test automation example ](http://kavi-saralweb.github.io/docs/html/example-ta.html)

We expect JSL to find more applications over time as an embedded logic-programming library for JS/JSON.


