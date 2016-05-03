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

