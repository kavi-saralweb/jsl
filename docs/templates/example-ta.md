[index](/docs/jsl/html/index.html)

---

# Example: Test Automation

<span id="problem-overview">
## Test output verification
</span>

Consider a module which takes a JSON structure as input, and returns a JSON structure as output. Our task is to write a runnable test program which exercises this module and verifies whether it produces the correct (expected) output for a given set of inputs.

We propose using JSL to solve the output verification problem, i.e. check whether a given JSON structure returned by the module matches some expectation we have. We can code our expectation of the output result in two ways : 

1. Use the equivalent of [unify2objects](/docs/jsl/html/overview.html#unify2objects) approach to specify a pattern (js object) which matches the server result

2. Model the behavior of the module using a set of JSL rules (and possibly callbacks), then write multiple tests whose response is checked against teh JSL model.

The first approach is quick and sufficient for many testing  requirements. The second approach is more powerful and offers better api coverage since all possible combinations of inputs can be (potentially programatically) tested against a single model which can be maintained as a testable specification.

<span id="chai-jsl-intro">
## Chai-JSL plugin
</span>

The chai-jsl plugin implements both approaches as two methods (pattern and patternFromRules) which can be used within a mocha/chai test automation framework. 

To illustrate these methods by example, we consider a (somewhat naive) authentication module which validates a given userid password combination and logs-in the user if valid, emits an error message if not, blocks the user after 3 invalid logins, etc.

_Note: the JSL library uses chai-jsl for its own test automation suite._

<span id="auth-module">
## The authentication module
</span>

A simplistic implementation of this module can be reviewed in [auth-module.js](/docs/jsl/js/auth-module.js). The module maintains a list of known users and their passwords in a table, and implements trivial username/password checking upon it. The module also keeps track of failed login attempts via the ctr attribute in user table and blocks a user after 3 failed login attempts.

<span id="simple-test">
## A simple test with _pattern_
</span>

A simple login test is shown below. It invokes the login transaction with a known username/password, and expects to succeed. The expected object is given to the chai plugin as a pattern which must be contained in the server result. Note that the pattern can contain variables to indicate portions of the returned JSON structure which are not (or cannot be) known to the test. In this case, the status code has been assigned a variable value. Typically the timestamp returned by the server would be a variable value in the expected pattern since it is impossible to predict its exact value.

```

[% include 'test/samples/ta/auth-test-simple.js' %]


```
<span id="rules-test">
## A rules based test specification using _patternFromRules_
</span>

A more complete specification of expected module behavior is given below. The set of JSL rules support a query of the form `[{expectedResponse : '$expectedResponse}]`. The specific inputs are supplied as facts (txn, username, and password). The test specification also maintains a set of callbacks and state variables to track failed login attempts, as well as a set of facts to remember known (test) usernames/passwords. 

As can be seen, the test specification is entirely independent of the actual implementation of the module. It can predict the expectedResponse of the server given any (reasonable) combination and sequence of inputs.

A series of tests is defined as an array by giving values to the inputs : txn, username, password. The tests are run under mocha/chai-jsl, using the patternFromRules method.

Thus JSL is used to build a high level logical model of the api being tested. The model is used to verify output generated from various combination of input parameters, and can be maintained as the api evolves. 


```

[% include 'test/samples/ta/auth-test.js' %]


```

