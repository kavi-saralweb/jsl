var chai = require('chai');
var chaiJSL = require('chai-jsonlogic');
var expect = chai.expect;
chai.use(chaiJSL);

describe('Builtins', function() {
    describe('$each', function() {
        it('should bind variables on first successful attempt', function(done) {
			var response = require('../../samples/builtins/each.js');
            var expectedResponse = 
                {
                    'AoA': [
                        [
                            {
                                'AoA': [
                                    [
                                        1
                                    ],
                                    [
                                        2
                                    ],
                                    [
                                        3
                                    ],
                                    [
                                        4
                                    ]
                                ]
                            }
                        ]
                    ],
                    'AoO': [
                        [
                            {
                                'AoO': [
                                    {
                                        'a': 1
                                    },
                                    {
                                        'b': 2
                                    },
                                    {
                                        'c': 3
                                    },
                                    {
                                        'd': 4
                                    }
                                ]
                            }
                        ]
                    ],
                    'OoA': [
                        [
                            {
                                'OoA': {
                                    'a': [
                                        1
                                    ],
                                    'b': [
                                        2
                                    ],
                                    'c': [
                                        3
                                    ],
                                    'd': [
                                        4
                                    ]
                                }
                            }
                        ]
                    ],
                    'OoO': [
                        [
                            {
                                'OoO': {
                                    'a': {
                                        'a': 1
                                    },
                                    'b': {
                                        'b': 2
                                    },
                                    'c': {
                                        'c': 3
                                    },
                                    'd': {
                                        'd': 4
                                    }
                                }
                            }
                        ]
                    ],
                    'OoO_deep': [
                        [
                            {
                                'OoO_deep': {
                                    'a': {
                                        'b': {
                                            'c': {
                                                'd': 1
                                            },
                                            'e': {
                                                'f': 2
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    ],
                    'OoO_deep_fail': []
                }; 
            expect(response).to.have.pattern(expectedResponse);
            done();
        });
    });
});
