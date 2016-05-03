var chai = require('chai');
var chaiJSL = require('chai-jsonlogic');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Builtins', function() {
    describe('$and', function() {
        it('should try all the rules', function(done) {
            var response = require('../../samples/builtins/and.js');
            var expectedResponse = 
                [
                    [
                        1,
                        2,
                        3
                    ],
                    [
                        'a',
                        'b',
                        'c'
                    ],
                    [
                        'd',
                        'e',
                        'f'
                    ]
                ]
            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
