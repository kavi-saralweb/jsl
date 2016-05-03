var chai = require('chai');
var chaiJSL = require('chai-jsonlogic');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Standard Callbacks', function() {
    describe('concat', function() {
        it('should return concatenated arrays using standard JSL callback', function(done) {
            var response = require('../../samples/cblib/concat.js');
            var expectedResponse = 
                [
                    [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ],
                    [
                        1,
                        2,
                        {
                            'a': 1,
                            'b': 2
                        },
                        4,
                        5,
                        {
                            'a': 3,
                            'c': 4
                        }
                    ],
                    'abcd',
                    [
                        'a',
                        'b',
                        'c',
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
