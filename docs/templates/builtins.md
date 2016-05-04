[index](/docs/html/index.html)

---

# JSL Builtins

JSL provides the following builtins :


- [$bind](#-bind)
- [$or](#-or)
- [$and](#-and)
- [$not](#-not)
- [$call](#-call)
- [$each](#-each)


The general shape of builtins is as follows :

    { <$xxx> : [ arg1 , arg2 ... ] }

Note that a builtin object can have only one key, and that key must be a $prefixed name of a valid builtin.

These are valid : 

    { $bind : [ x, y ] }

    { $or : [ {...}, {...}, {...} ] }

These are invalid :

    { $bind : [ x, y ], foo : 'bar' }

    { $or : [ {...}, {...}, {...} ], foo : 'bar' }


<span id="-bind">
## $bind
</span>

$bind attempts to unify two objects (or variables which are in turn bound to objects). The unification is directional, i.e. the second object should be contained in the first object. This behavior is typical when working with JSON data; it is often desirable to extract values from a (large) row into a smaller row. 

If both arguments are variables, the usual containment rules apply.

The following examples illustrate the containment semantics of $bind:

```

[% include 'test/samples/builtins/bind-1.js' %]

/*
response 

[_ builtins['bind-1'] _]

*/

```
The first argument to $bind must contain all keys of the second, recursively. Values assigned to variables during binding (unification) can be any JS object, including an array or one of its elements.


_Note: If one of the arguments to $bind is a variable, and the other a JS object, the variable behaves as if it is the first argument even if it is in the second position. This happens due to the nature of the unification algorithm (in this release) which gives priority to variables over values. When working with a variable and an object in $bind, it is advisable to put the variable in the first position to avoid apparently confusing results._

Prefer `{ $bind : [ '$var', <value> ] }` 

Avoid `{ $bind : [ <value>, '$var' ] }  // behaves like the preferred version in any case` 

The $bind builtin can also handle complex patterns of object unification, as shown below :

 ```

[% include 'test/samples/builtins/bind-2.js' %]

/*
response 

[_ builtins['bind-2'] _]

*/

```
Thus variables can be bound to complex JS objects, as well as elements of arrays; binding specifications can be lists of objects inside an array, unified against another array. As long as the second object is contained in the first, the system tries to return a reasonable JS value

      
<span id="-or">
## $or
</span>

The $or builtin takes any number of objects (or variables bound to objects) as its input array, and tries them one by one. It stops trying as soon at the first successful attempt. Remaining objects in the list are not tried after the first successful one.

The following examples illustrate the semantics of $or:

 ```

[% include 'test/samples/builtins/or.js' %]

/*
response 

[_ builtins['or'] _]

*/

```


<span id="-and">
## $and
</span>

The $and builtin takes any number of objects (or variables bound to objects) as its input array, and tries them all. It succeeds only if all the objects succeed, and fails at the first failing object. Remaining objects in the parameter list are not tried after the first failure.

The following examples illustrate the semantics of $and:

 ```

[% include 'test/samples/builtins/and.js' %]

/*
response 

[_ builtins['and'] _]

*/

```
The first example illustrates a simple case of using $and to bind 3 variables to one value each. Subsequent examples show a typical decision making structure encountered in data binding (providing a guaranteed default value to variables). The outer $or comprises of a $and and a default object; either the $and succeeds, or the default object always does.

The $and failure case in the second example was described in the documentation of $bind; i.e. the second object is not contained in the first.

                { $bind : [ { b : 5 }, { b : '$y', d: 10 } ]  }, //<-- fail

The $and failure case in the third sample is more interesting.

            { $and : [ 
                { $bind : [ { a : 7 }, { a : '$x' } ]  },
                { $bind : [ { b : 8 }, { b : '$y' } ]  },
                { $bind : [ { c : 9 }, { c : '$z' } ]  },
                { $bind : [ { d : 10 }, { d : '$x' } ]  }, //<-- fail, inconsistent binding for $x
            ]}

The fourth $bind fails because $x has already been bound to 7 in the first $bind. A conflicting binding attempt results in failure of the whole $and object.


<span id="-not">
## $not
</span>

The $not builtin takes one object (or a variable bound to an object), and succeeds if the object fails. 

The following examples illustrate $not semantics :

 ```

[% include 'test/samples/builtins/not.js' %]

/*
response 

[_ builtins['not'] _]

*/

```

The first example shows a simple case where the $bind object fails due to conflicting bindings, but the $result succeeds because $not succeeds 

The second example is more interesting. It reflects the _closed world_ assumption of logic programming, i.e. all relevant knowledge has been included in the given rules. Thus, $not will succeed on any object that is not matched (and unified) in the rules. In this example, the completely arbitray `{ $not : [ { foo : '$bar' }]}` succeeds because there is no rule with a head that looks like `{foo : something}`.

Thus $not should be used with care. It does not have the usual boolean negation semantics, but works as a filter. With `{ $not : [ <obj> ] }` we merely ask whether obj can be satisfied given all the rules in the system ? 


<span id="-call">
## $call
</span>

The $call builtin provides integration with the calling program (host) to JSL. 

The shape of the $call builtin is as follows :

    { $call : [ '<cbname>', arg1, arg2, ... ] }
    
    OR 

    { $call : [ '<cbname>', arg1, arg2, ..., ['$<outVar>'] ] }
    
    OR

    { $call : [ '<cbname>', arg1, arg2, ..., [<outObject>] ] }

The first argument to $call is the name of the callback to be called. This should be present in the callbacks parameter when the jsl object is created via `new JSL` prior to `jsl.run`. Subsequent arguments are handed to the callback by position with the exception of the last argument if, and only if, it is an array.

If the last argument to $call is an array, it is interpreted as the unification target for the callback return value (which can be imagined as being wrapped in an array itself to enable unification). The target can be a single variable, or any JS object (null, true, false, {}, []). The  outObject can contain any number of variables, and it is unified with the return value from the callback.

The outObject pattern provides a mechanism to anticipate the structure of callback return value, and to extract its components into JSL variables, or even to cause batch execution to fail or succeed (via unification) depending upon callback return.

_Note : A callback MUST return null in order to fail the JSL rule. It is very important to note that returning false will not cause $call to fail. This is important to remember when writing callbacks that essentially have a boolean behavior. They should return null instead of false to cause failure of the JSL rule where they are being used._


_Note : A callback which has an array as the last parameter, and has no need of an `['$outvar']`, must be $called with an empty array after the last argument to avoid getting its input array variable being confused as the `['$outVar']`. This only applies to callbacks that take an array as their last input parameter and do not need an `['$outVar']`._
    
For example : 

Will fail : `{$call: ['objEqual', [1,2,3] , [1,2,3] ] }` 

Will succeed : `{$call: ['objEqual', [1,2,3] , [1,2,3], [] ] }` 

_ Note : The environment in which a callback executes is transparent to JSL. The caller (host) should arrange the environment of the callback via closures before supplying the callback to JSL. _

The following examples illustrate the semantics of $call :

 ```

[% include 'test/samples/builtins/call.js' %]

/*
response 

[_ builtins['call'] _]

*/

```
All the examples illustrate using the native (host) services for manipulating dates. The "date" and "tomorrow" examples merely obtain the current and tomorrow date strings. The "addFive"  example illustrates use of a parameter which specifies how many days to add to the current date.

The "setTimestamp" example illustrates setup of callback execution environment by the host. The callback supplied to JSL contains the closure of a message object in its environment which is to be timestamped. JSL rules invoke the callback which operates upon this message object. The output of the sample demonstrates that the message object has been changed (timestamped) by JSL. Thus we see that JSL callbacks can cause side-effects upon the host environment.

The "dateParts" example illustrates the use of a complex object as the outObject, which contains variables that unify with the (matching object) returned by the callback. This ability to unify arbitrary callback returns with JSL variables completes the integration of JSL with the host; it allows the host to cause changes in the JSL environment. 


<span id="-query">
## $query
</span>

The $query builtin is basically a subquery upon the same ruleset and callbacks with which the original JSL batch was run. The shape of the $query builtin is as follows :

`{ $query : [ [{<query>}] , <transform>, '$outVar' ] }`

As can be seen, the parameters of $query are all the parameters accepted by `new JSL` prior to calling `jsl.run()`, _except_  rules and callbacks. The transform facility allows $query output to be converted into an array of desired objects that can be assigned to any JSL variable specified as '$outVar'. 

The following example illustrates $query:

```

[% include 'test/samples/builtins/query.js' %]

/*
response 

[_ builtins['query'] _]

*/

```

_Note : the result can be seen as contained within two array containers. This is a consequence of $query and jsl.run each attempting to return an array as desired by the transform. In general, if the output of a jsl.run is shaped by a $query within the batch, the user should take care to extract the first element of the returned result_

<span id="-each">
## $each
</span>

The $each builtin provides a way to work with each item in a JS array or object. It is loosely modeled on the JS forEach loop, except that it works with both [arrays] and {objects}. 

The $each builtin is used as follows :

    { $each : [ '$obj', '$value', '$key', {<some jsl object that uses $value and/or $key variables >} ] }

Intuitively (and as implemented), $each will work just like $and, over all $values of $obj, using the supplied goal (4th parameter) as a template. Any two (distinct) variable names may be used for '$value' and '$key', but they should not expected to retain their values after $each is done; these variables should be regarded as 'local' to $each. The result of using the same variable name for '$value' and '$key' is undefined.

The semantics of $each are made clearer by the following examples which use $each to implement some basic "recognizers" of complex object patterns. 


```

[% include 'test/samples/builtins/each.js' %]

/*
response 

[_ builtins['each']  _] 

*/

```

The first four examples are relatively trivial, they "recognize" Array of Arrays, Array of Objects, Object of Arrays, and Object of Objects respectively, at the first level only.

The OoO_deep example is somewhat more interesting. It implements a recursive algorithm to check an Object to make sure that it contains only Objects all the way down. The algorithm is loosely stated as follows :

    OoO_deep

    Check the input to ensure it is an {object}
    Then make sure that each value of input is either a scalar, or an OoO_deep

Please note the use of `{bind : ['$obj', {} ] }` as an idiom. Since the empty object {} is contained in any {object}, this is a convenient way to check whether a given value is a javascript object (and not an array).

Also note the use of 'checkType' callback, which provides a mechanism to implement "terminal types" when recognizing object structures. In this case, we implement just one trivial terminal type - _scalar_. The [syntax](/docs/html/syntax) validator for JSL, also given in JSL, implements a larger range of terminal types using a similar approach.



