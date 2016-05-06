var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Overview', function() {
    describe('Introduction', function() {
        it('should generate a completed contract object', function(done) {
            var response = require('../../samples/overview/introduction.js');
            var expectedResponse = 
                [
                    [
                        {
                            "offerer": "sandeep",
                            "bidder": "kavi",
                            "symbol": "ABC",
                            "price": 10,
                            "qty": 100
                        }
                    ]
                ]
            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
