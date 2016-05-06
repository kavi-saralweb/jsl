var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Overview', function() {
    describe('Query', function() {
        it('should generate a list of matching bidders', function(done) {
            var response = require('../../samples/overview/transform.js');
            var expectedResponse = [
                'pradeep',
                'naveen'
            ]

            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
