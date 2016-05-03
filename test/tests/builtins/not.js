var chai = require('chai');
var chaiJSL = require('chai-jsonlogic');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Builtins', function() {
    describe('$not', function() {
        it('should succeed when the rule fails', function(done) {
            var response = require('../../samples/builtins/not.js');
            var expectedResponse = 
                [
                    [
                        1,
                        2,
                        3
                    ],
                    [
                        4,
                        5,
                        6
                    ]
                ]
            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
