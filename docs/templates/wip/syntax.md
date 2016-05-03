[index](/docs/jsl/html/index.html)

---

# JSL Syntax

The JSL syntax is nothing but (constrained) JSON. The rules defining valid structure for any one item in a given JSL batch are defined below as an executable validator, using JSL itself to define the rules:

    
```

[% include 'jslvalidator.js' %]


```
The validator defines rules that constrain the structure of any one item in a JSL batch, which can be either a fact or a rule. Further constraints that define valid structure for facts and rules are defined in subsequent rules.

Terminal types have been implemented via the checkType callback, which maintains a table of recognized terminal types. These include the usual scalar types, as well as specific constrained strings such as $variable names, and $builtin names. Finally, a jslObject type is defined which contains constrained keys and values. 

The universal quantifier $each is used to compactly express rules applying to all elements of an object or array. Note that $each allows us to constrain keys as well as values of an object.


