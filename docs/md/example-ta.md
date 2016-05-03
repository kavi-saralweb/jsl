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

var auth = require('./auth-module.js');
var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Simple auth test', function() { 
    describe('Using pattern method', function() { 
        it('should successfully login', function(done) { 

            var response = auth.login({
                username : 'mohan', 
                password : 'xyzw'
            });

            var expectedResponse = { 
                status: '$s', 
                logged_in: true 
            };
            expect(response).to.have.pattern(expectedResponse);
            done();
        }); 
    });
});



```
<span id="rules-test">
## A rules based test specification using _patternFromRules_
</span>

A more complete specification of expected module behavior is given below. The set of JSL rules support a query of the form `[{expectedResponse : '$expectedResponse}]`. The specific inputs are supplied as facts (txn, username, and password). The test specification also maintains a set of callbacks and state variables to track failed login attempts, as well as a set of facts to remember known (test) usernames/passwords. 

As can be seen, the test specification is entirely independent of the actual implementation of the module. It can predict the expectedResponse of the server given any (reasonable) combination and sequence of inputs.

A series of tests is defined as an array by giving values to the inputs : txn, username, password. The tests are run under mocha/chai-jsl, using the patternFromRules method.

Thus JSL is used to build a high level logical model of the api being tested. The model is used to verify output generated from various combination of input parameters, and can be maintained as the api evolves. 


```

var auth = require('./auth-module.js');
var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);


/* the rules which specify module response given some inputs (txn, username, password) */

var expectedResponseRules = [
    [
        { expectedResponse : '$response' },
        { txn : 'login'},
        { checkLogin : '$response'}
    ],
    [
        { expectedResponse : '$response' },
        { txn : 'logout'},
        { checkLogout : '$response'}
    ],

    [ 
        { checkLogin : '$response' },
        { username : '$username'},
        { password : '$password'},
        { $or : [ 
            { $and : [ 
                {$call : [ 'checkBlocked', '$username' ] },
                { $bind : [ '$response', { status: 200, logged_in: false, msg : 'Account blocked' } ] }
            ] },
            { $and : [ 
                { testDb : [ '$username', '$password'] },
                { $call : [ 'zeroCtr', '$username' ] },
                { $bind : [ '$response', { status: 200, logged_in: true } ] }
            ] },
            { $and : [ 
                { $not : [ { testDb : [ '$username' ] } ] },
                { $bind : [ '$response', { status: 200, logged_in: false, msg : 'Incorrect username' } ] }
            ] },
            { $and : [
                { $call : [ 'incrementCtr', '$username' ] },
                { $bind : [ '$response', { status: 200, logged_in: false, msg : 'Incorrect password' } ] }
            ] }
        ] }
    ],
    [ 
        { checkLogout : '$response' },
        { username : '$username'},
        { $or : [ 
            { $and : [ 
                { $not : [ { testDb : [ '$username' ] } ] },
                { $bind : [ '$response', { status: 200, msg : 'Incorrect logout attempt' } ] }
            ] },
            { $bind : [ '$response', { status: 200, logged_in: false, msg : 'Successfully logged out' } ] }
        ] }
    ],
    
    /* known test users with their passwords */
    [ { testDb : [ 'mohan' , 'xyzw' ] } ],
    [ { testDb : [ 'shyam' , 'abcd' ] } ]
];

/* state keeping machinery to track failed login attempts when running tests */
var counters = {};
var callbacks = {
    zeroCtr : function(username) {
        counters[username] = 0;
        return true;
    },
    incrementCtr : function(username) {
        if (counters[username] != null) {
            counters[username]++;
        }
        else {
            counters[username] = 1;
        }
        return true;
    },
    checkBlocked : function(username) {
        /* callback should return null to fail the JSL rule */
        return counters[username] != null && counters[username] >= 3 ? true : null
    }
}

var tests = [
    {
        name : 'login',
        description : 'should successfully login',
        txn : 'login',
        username : 'mohan',
        password : 'xyzw'
    },
    {
        name : 'login-incorrect-pwd1',
        description : 'incorrect password should fail login (1)',
        txn : 'login',
        username : 'mohan',
        password : 'xxx'
    },
    {
        name : 'login-incorrect-pwd2',
        description : 'incorrect password should fail login (2)',
        txn : 'login',
        username : 'mohan',
        password : 'yyy'
    },
    {
        name : 'login-incorrect-pwd3',
        description : 'incorrect password should fail login (3)',
        txn : 'login',
        username : 'mohan',
        password : 'zzz'
    },
    {
        name : 'login-blocked1',
        description : 'incorrect pwd, but account should be blocked',
        txn : 'login',
        username : 'mohan',
        password : 'xxx'
    },
    {
        name : 'login-blocked2',
        description : 'correct pwd, but account should be blocked',
        txn : 'login',
        username : 'mohan',
        password : 'xyzw'
    },
    {
        name : 'logout',
        description : 'logout attempt on blocked account, should succeed',
        txn : 'logout',
        username : 'mohan',
    },
    {
        name : 'login-blocked3',
        description : 'login with correct pwd after logout on blocked account, but should still be blocked',
        txn : 'login',
        username : 'mohan',
        password : 'xyzw'
    },

];


tests.forEach(function(t) {
    describe(t.name, function() { 
            it(t.description, function(done) { 
                var response = auth[t.txn]({
                    username : t.username, 
                    password : t.password
                });

                var rules = expectedResponseRules.concat([
                    [{txn : t.txn}],
                    [{username : t.username}],
                    [{password : t.password}]
                ]);

                expect(response).to.have.patternFromRules(rules, callbacks);
                done();
            });
    });
});




```

