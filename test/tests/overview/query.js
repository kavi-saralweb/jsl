var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Overview', function() {
    describe('Query', function() {
        it('should generate multiple message records based on query', function(done) {
            var response = require('../../samples/overview/query.js');
            var expectedResponse = [
                    {
                        to: 'sales@vinod-denim.com',
                        subject: 'Follow up on our order',
                        date: '$date1',
                        msgtext : 'Please send us an update on shipping status'
                    },
                    {
                        to: 'sales@agarwal-textiles.com',
                        subject: 'Request for quotation',
                        date: '$date2',
                        msgtext: 'Request for quotation'
                    }
            ];

            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
