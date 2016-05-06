var JSL = require('lib-jsl');

var offers = [
[{
    type : 'offer',
    offerer : 'sandeep',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 18,
    qty : 100
}],
[{
    type : 'offer',
    offerer : 'ruchir',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 20,
    qty : 100
}],
[{
    type : 'offer',
    offerer : 'prachi',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 16,
    qty : 100
}],
[{
    type : 'offer',
    offerer : 'avantika',
    bidder : '$bidder',
    symbol : 'ABC',
    price : null,
    qty : 200
}]

]


var bids = [
[{
    type : 'bid',
    offerer : '$offerer',
    bidder : 'kavi',
    symbol : 'ABC',
    price : 20,
    qty : 100
}],
[{
    type : 'bid',
    offerer : '$offerer',
    bidder : 'pradeep',
    symbol : 'ABC',
    price : 21,
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
    price : 26,
    qty : 100
}],
[{
    type : 'bid',
    offerer : '$offerer',
    bidder : 'prashant',
    symbol : 'ABC',
    price : 25,
    qty : 200
}],
[{
    type : 'bid',
    offerer : '$offerer',
    bidder : 'shipu',
    symbol : 'ABC',
    price : null,
    qty : 200
}]


]

var rules = [

    [
        { match : {offerer : '$offerer', bidder : '$bidder', symbol : '$symbol', price : '$price', qty : '$qty'}},
        { $query : [ [{ accumulateBestMatches : '$x'}], null, '$y'] },
        { type : 'bid', bidder : '$bidder', symbol : '$symbol', qty : '$qty'},
        { $call : [ 'getBestMatch', '$bidder', ['$offerer', '$bidPrice', '$price'] ] }
    ],
    [
        { accumulateBestMatches : '$x'},
        { type : 'bid', bidder : '$bidder', symbol : '$symbol', price : '$bidPrice', qty : '$qty'},
        { type : 'offer', offerer : '$offerer', symbol : '$symbol', price : '$offerPrice', qty : '$qty'},
        { $call : [ 'accumulateMatch', '$bidder', '$bidPrice', '$offerer', '$offerPrice' ] }
    ]


]

var bestOffers = {};
var offersConsumed = {};
var callbacks = {
    accumulateMatch : function(bidder, bidPrice, offerer, offerPrice) {
        if (!offersConsumed[offerer]) {
            if (bestOffers[bidder] == null) {
                if (offerPrice != null && bidPrice != null && bidPrice - offerPrice > 0) { 
                    bestOffers[bidder] = [offerer, bidPrice, offerPrice];
                    offersConsumed[offerer] = true;
                }
                else if (offerPrice == null && bidPrice != null) {
                    bestOffers[bidder] = [offerer, bidPrice, bidPrice]
                    offersConsumed[offerer] = true;
                }
                else if (offerPrice != null && bidPrice == null) {
                    bestOffers[bidder] = [offerer, offerPrice, offerPrice]
                    offersConsumed[offerer] = true;
                }
            }
            else {
                var spread = bestOffers[bidder][1] - bestOffers[bidder][2];
                if (offerPrice != null && bidPrice != null && bidPrice - offerPrice > spread) { 
                    offersConsumed[bestOffers[bidder][0]] = false;
                    bestOffers[bidder] = [offerer, bidPrice, offerPrice];
                    offersConsumed[offerer] = true;
                }
                else if (offerPrice != null && bidPrice == null && offerPrice < bestOffers[bidder][2]) {
                    bestOffers[bidder] = [offerer, offerPrice, offerPrice]
                }
            }
        }
        return true; // accumulation always succeeds
    },

    //{ $call : [ 'getBestMatch', '$bidder', ['$offerer', '$price'] ] }
    getBestMatch : function(bidder) {
        var result = null;
        if (bestOffers[bidder] != null) {
            result = bestOffers[bidder]
        }
        return result;
    }
}

var jsl = new JSL({
    rules: rules.concat(bids, offers),
    query: [{match: '$match'}],
    callbacks : callbacks,
    transform: '$match'
});

var response = jsl.run();
console.log(bestOffers);

console.log('matches: ', response);

module.exports = response;
