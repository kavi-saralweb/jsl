var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Builtins', function() {
    describe('bind', function() {
        it('should bind variables based on containment rule', function(done) {
            var response = require('../../samples/builtins/bind-1.js');
            var expectedResponse = [ 
                [ 1, 2, 3 ],
                  [ 4, 5, 6 ],
                  [ 7, 8, 9 ],
                  [ 10, 11, 12 ],
                  [ 'this will succeed, empty array is contained in a non empty array' ],
                  [ 'this will succeed, empty array is equal to empty array' ],
                  [ 'this will succeed, empty object is contained in a non empty object' ],
                  [ 'this will succeed, empty object is equal to empty object' ],
                  [ 106, 107, 108 ],
                  [ 109, 110, 111 ],
                  [ 13, 15, 17, 'correct $bind behavior with 1 variable' ],
                  [ 13, 15, 17, 'correct with 1 var 1 recursion' ],
                  [ 13, 15, 17, 'correct with 1 var 2 recursion' ],
                  [ 22, 24, 26, 'correct $bind behavior with 2 vars' ],
                  [ 22, 24, 26, 'correct with 2 vars 1 recursion' ],
                  [ 22, 24, 26, 'correct with 2 vars 2 recursion' ] ]

            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});

