var chai = require('chai');
var chaiJSL = require('chai-jsonlogic');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Builtins', function() {
    describe('$query', function() {
        it('should get rows from the database based on query', function(done) {
            var response = require('../../samples/builtins/query.js');
            var expectedResponse = 
                [
                    [
                        {
                            'a': 1,
                            'b': 2
                        },
                        {
                            'a': 3,
                            'b': 4
                        },
                        {
                            'a': 5,
                            'b': 6
                        },
                        {
                            'a': 7,
                            'b': 8
                        },
                        {
                            'a': 9,
                            'b': 10
                        }
                    ]
                ]


            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
