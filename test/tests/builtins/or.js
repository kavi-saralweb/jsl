var chai = require('chai');
var chaiJSL = require('chai-jsonlogic');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Builtins', function() {
    describe('$or', function() {
        it('should stop trying the rules after first successful attempt', function(done) {
            var response = require('../../samples/builtins/or.js');
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
                    ],
                    [
                        7,
                        8,
                        9
                    ]
                ]

            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
