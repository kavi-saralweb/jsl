var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Overview', function() {
    describe('Callbacks', function() {
        it('should generate best matched pairs of bid/offers', function(done) {
            var response = require('../../samples/overview/callbacks.js');
            var expectedResponse = 

                [
                    {
                        'offerer': 'prachi',
                        'bidder': 'kavi',
                        'symbol': 'ABC',
                        'price': 16,
                        'qty': 100
                    },
                    {
                        'offerer': 'sandeep',
                        'bidder': 'pradeep',
                        'symbol': 'ABC',
                        'price': 18,
                        'qty': 100
                    },
                    {
                        'offerer': 'avantika',
                        'bidder': 'taran',
                        'symbol': 'ABC',
                        'price': 20,
                        'qty': 200
                    },
                    {
                        'offerer': 'ruchir',
                        'bidder': 'naveen',
                        'symbol': 'ABC',
                        'price': 20,
                        'qty': 100
                    }
                ]


            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
