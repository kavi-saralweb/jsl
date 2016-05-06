var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Overview', function() {
    describe('Unification', function() {
        it('should generate a contract against the matching bid/offer pair', function(done) {
			var response = require('../../samples/overview/unification.js');
            var expectedResponse = 
                [
                    [
                        {
                            'offerer': 'sandeep',
                            'bidder': 'pradeep',
                            'symbol': 'ABC',
                            'price': 20,
                            'qty': 100
                        }
                    ]
                ]
            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
