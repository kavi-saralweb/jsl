var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Standard Callbacks', function() {
    describe('extend', function() {
        it('should return extended object using standard JSL callback', function(done) {
            var response = require('../../samples/cblib/extend.js');
            var expectedResponse = 
                [
                    {
                        "a": 1,
                        "b": 2,
                        "c": 3,
                        "d": 4
                    },
                    {
                        "a": 3,
                        "b": 2,
                        "d": 4
                    },
                    {
                        "a": 3,
                        "b": 2,
                        "d": 4
                    },
                    {
                        "a": {
                            "x": "a",
                            "y": "q"
                        },
                        "d": 4,
                        "b": 2
                    }
                ]
            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
