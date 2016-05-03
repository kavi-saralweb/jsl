var auth = require('./auth-module.js');
var chai = require('chai');
var chaiJSL = require('chai-jsonlogic');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Simple auth test', function() { 
    describe('Using pattern method', function() { 
        it('should successfully login', function(done) { 

            var response = auth.login({
                username : 'mohan', 
                password : 'xyzw'
            });

            var expectedResponse = { 
                status: '$s', 
                logged_in: true 
            };
            expect(response).to.have.pattern(expectedResponse);
            done();
        }); 
    });
});
