var JSL = require('lib-jsl');

var offers = [
[{
    type : 'offer',
    offerer : 'sandeep',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 20,
    qty : 100
}],
 [{
    type : 'offer',
    offerer : 'shekhar',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 25,
    qty : 100
}],
[{
    type : 'offer',
    offerer : 'ruchir',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 20,
    qty : 200
}],
[{
    type : 'offer',
    offerer : 'prachi',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 25,
    qty : 200
}]
]


var bids = [
[{
    type : 'bid',
    offerer : '$offerer',
    bidder : 'kavi',
    symbol : 'ABC',
    price : 10,
    qty : 100
}],
[{
    type : 'bid',
    offerer : '$offerer',
    bidder : 'pradeep',
    symbol : 'ABC',
    price : 20,
    qty : 100
}],
[{
    type : 'bid',
    offerer : '$offerer',
    bidder : 'taran',
    symbol : 'ABC',
    price : 20,
    qty : 200
}],
[{
    type : 'bid',
    offerer : '$offerer',
    bidder : 'naveen',
    symbol : 'ABC',
    price : 20,
    qty : 100
}],
[{
    type : 'bid',
    offerer : '$offerer',
    bidder : 'prashant',
    symbol : 'ABC',
    price : 25,
    qty : 200
}]

]

var rules = [
    [   //head
        { match : {offerer : '$offerer', bidder : '$bidder', symbol : '$symbol', price : '$price', qty : '$qty'}},
        //body
        { type: 'bid', bidder : '$bidder', symbol : '$symbol', price : '$price', qty : '$qty'},
        { type : 'offer', offerer : '$offerer', symbol : '$symbol', price : '$price', qty : '$qty'},
    ]
];

var jsl = new JSL({
    rules: rules.concat(bids, offers),
    query: [{match: '$match'}],
    transform: '$match'
});

var response = jsl.run();
console.log('contracts: ', response);

module.exports = response;
