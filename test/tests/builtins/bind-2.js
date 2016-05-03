var chai = require('chai');
var chaiJSL = require('chai-jsl');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Builtins', function() {
    describe('bind', function() {
        it('should bind variables based on containment rule', function(done) {
            var response = require('../../samples/builtins/bind-2.js');
            var expectedResponse = [
                [
                    1,
                    2,
                    {
                        'p': 1,
                        'q': 2
                    }
                ],
                [
                    4,
                    5,
                    [
                        'arrays',
                        'also',
                        'work'
                    ]
                ],
                [
                    'list',
                    'of',
                    'objects'
                ],
                [
                    'values',
                    'by',
                    'position'
                ]
            ];

            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});

