var chai = require('chai');
var chaiJSL = require('chai-jsonlogic');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Overview', function() {
    describe('Callbacks', function() {
        it('should generate the message record with date property using callback', function(done) {
            var response = require('../../samples/overview/callbacks.js');
            var expectedResponse = 
                [
                    {
                        to: 'sales@vinod-denim.com',
                        subject: 'Follow up on our order',
                        date: '$date',
                        msgtext: 'Follow up on our order'
                    }
                ]

            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
