var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Overview', function() {
    describe('Unification', function() {
        it('should generate the message record through unification', function(done) {
			var response = require('../../samples/overview/unification.js');
            var expectedResponse = 
                [
                    {
                        to: 'sales@vinod-denim.com',
                        subject: 'Follow up on our order',
                        msgtext: 'Please send us an update on shipping status'
                    }
                ]

            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
