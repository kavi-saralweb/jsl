var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Overview', function() {
    describe('Introduction', function() {
        it('should generate the "hello world" message record', function(done) {
            var response = require('../../samples/overview/introduction.js');
            var expectedResponse = 
                    [{
                        to: 'world',
                        subject: 'hello',
                        msgtext: 'hello world'
                    }]
            expect(response).to.have.pattern(expectedResponse);
            console.log(done);
            done();
        });
    });
});
