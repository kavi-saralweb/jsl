[index](/docs/html/index.html)

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

[% include 'test/samples/ir/db.js' %]

```

<span id="exercise-455">
## Exercise 4.55
</span>

```

[% include 'test/samples/ir/query-exercise-4.55-a.js' %]

/*
response  

[_ ir['query-exercise-4.55-a'] _]

*/

```

```

[% include 'test/samples/ir/query-exercise-4.55-b.js' %]

/*
response  

[_ ir['query-exercise-4.55-b'] _]

*/

```

```

[% include 'test/samples/ir/query-exercise-4.55-c.js' %]

/*
response  

[_ response_4_55_c _]
[_ ir['query-exercise-4.55-c'] _]

*/

```

<span id="exercise-456">
## Exercise 4.56
</span>

```

[% include 'test/samples/ir/query-exercise-4.56-a.js' %]

/*
response  

[_ ir['query-exercise-4.56-a'] _]

*/

```


```

[% include 'test/samples/ir/query-exercise-4.56-b.js' %]

/*
response  

[_ ir['query-exercise-4.56-b'] _]

*/

```


```

[% include 'test/samples/ir/query-exercise-4.56-c.js' %]

/*
response  

[_ ir['query-exercise-4.56-c'] _]

*/

```

<span id="exercise-457">
## Exercise 4.57
</span>

```

[% include 'test/samples/ir/query-exercise-4.57-a.js' %]

/*
response  

[_ ir['query-exercise-4.57-a'] _]

*/

```

```

[% include 'test/samples/ir/query-exercise-4.57-b.js' %]

/*
response  

[_ ir['query-exercise-4.57-b'] _]

*/

```

<span id="exercise-458">
## Exercise 4.58
</span>

```
[% include 'test/samples/ir/query-exercise-4.58.js' %]

/*
response  

[_ ir['query-exercise-4.58'] _]

*/

```

<span id="exercise-459">
## Exercise 4.59
</span>

```
[% include 'test/samples/ir/query-exercise-4.59-a.js' %]

/*
response  

[_ ir['query-exercise-4.59-a'] _]

*/

```

```
[% include 'test/samples/ir/query-exercise-4.59-b.js' %]

/*
response  

[_ ir['query-exercise-4.59-b'] _]

*/

```

```
[% include 'test/samples/ir/query-exercise-4.59-c.js' %]

/*
response  

[_ ir['query-exercise-4.59-c'] _]

*/

```

<span id="exercise-460">
## Exercise 4.60
</span>

```
[% include 'test/samples/ir/query-exercise-4.60.js' %]

/*
response  

[_ ir['query-exercise-4.60'] _]

*/

```

<span id="exercise-461">
## Exercise 4.61
</span>

```
[% include 'test/samples/ir/query-exercise-4.61.js' %]

/*
response  

[_ ir['query-exercise-4.61'] _]

*/

```

<span id="exercise-462">
## Exercise 4.62
</span>

```
[% include 'test/samples/ir/query-exercise-4.62.js' %]

/*
response  

[_ ir['query-exercise-4.62'] _]

*/

```

<span id="exercise-463">
## Exercise 4.63
</span>

```
[% include 'test/samples/ir/query-exercise-4.63.js' %]

/*
response  

[_ ir['query-exercise-4.63'] _]

*/

```

<span id="exercise-464">
## Exercise 4.64
</span>

``` 
[% include 'test/samples/ir/query-exercise-4.64.js' %]

/*
response  

[_ ir['query-exercise-4.64'] _]

*/

```

<span id="exercise-465">
## Exercise 4.65
</span>

```
[% include 'test/samples/ir/query-exercise-4.65.js' %]

/*
response  

[_ ir['query-exercise-4.65'] _]

*/

```

<span id="exercise-466">
## Exercise 4.66
</span>

```
[% include 'test/samples/ir/query-exercise-4.66.js' %]

/*
response  

[_ ir['query-exercise-4.66'] _]

*/

```

<span id="exercise-468">
## Exercise 4.68
</span>

```
[% include 'test/samples/ir/query-exercise-4.68.js' %]

/*
response  

[_ ir['query-exercise-4.68'] _]

*/

```
