var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Overview', function() {
    describe('Builtins', function() {
        it('should generate the message record using JSL builtins', function(done) {
            var response = require('../../samples/overview/builtins.js');
             var expectedResponse = 
                [
                    {
                        'offerer': 'sandeep',
                        'bidder': 'kavi',
                        'symbol': 'ABC',
                        'price': 20,
                        'qty': 100,
                        'status': 'matched'
                    },
                    {
                        'offerer': 'N/A',
                        'bidder': 'pradeep',
                        'symbol': 'ABC',
                        'price': 30,
                        'qty': 100,
                        'status': '**unmatched**'
                    }
                ]
            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
