var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Builtins', function() {
    describe('$call', function() {
        it('should bind variables returned by', function(done) {
			var response = require('../../samples/builtins/call.js');
            var expectedResponse = 
            {
                'response': {
                    'date': [
                        '$date'
                    ],
                    'tomorrow': [
                        '$tomorrow'
                    ],
                    'addFive': [
                        '$addFive'
                    ],
                    'setTimestamp': [
                        {
                            'to': 'sales@vinod-denim.com',
                            'subject': 'test subject',
                            'msgtext': 'test message',
                            'timestamp': '$timestamp'
                        }
                    ],
                    'dateParts': [
                        {
                            'date': '$dpDate',
                            'm': '$m',
                            'd': '$d',
                            'y': '$y'
                        }
                    ]
                },
                'message': {
                    'to': 'sales@vinod-denim.com',
                    'subject': 'test subject',
                    'msgtext': 'test message',
                    'timestamp': '$msgTimestamp'
                }
            };

            expect(response).to.have.pattern(expectedResponse);
            done();
           

        });
    });
});
