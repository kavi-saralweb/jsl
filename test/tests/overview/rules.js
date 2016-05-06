var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Overview', function() {
    describe('Rules', function() {
        it('should generate a list of matching bid/offer pairs', function(done) {
            var response = require('../../samples/overview/rules.js');
            var expectedResponse = [
                {
                    'offerer': 'sandeep',
                    'bidder': 'pradeep',
                    'symbol': 'ABC',
                    'price': 20,
                    'qty': 100
                },
                {
                    'offerer': 'ruchir',
                    'bidder': 'taran',
                    'symbol': 'ABC',
                    'price': 20,
                    'qty': 200
                },
                {
                    'offerer': 'sandeep',
                    'bidder': 'naveen',
                    'symbol': 'ABC',
                    'price': 20,
                    'qty': 100
                },
                {
                    'offerer': 'prachi',
                    'bidder': 'prashant',
                    'symbol': 'ABC',
                    'price': 25,
                    'qty': 200
                }
            ]
            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
