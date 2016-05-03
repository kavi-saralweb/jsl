var chai = require('chai');
var chaiJSL = require('chai-jsonlogic');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Overview', function() {
    describe('Builtins', function() {
        it('should generate the message record using JSL builtins', function(done) {
            var response = require('../../samples/overview/builtins.js');
             var expectedResponse = 
                [
                    {
                        'to': 'sales@vinod-denim.com',
                        'subject': 'Follow up on our order',
                        'msgtext': 'Follow up on our order'
                    }
                ]
            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
