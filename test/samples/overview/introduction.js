var JSL = require('lib-jsl');

var offer = {
    offerer : 'sandeep',
    bidder : '$bidder',
    symbol : 'ABC',
    price : 10,
    qty : 100
} 

var bid = [{
    offerer : '$offerer',
    bidder : 'kavi',
    symbol : 'ABC',
    price : 10,
    qty : 100
}]

var jsl = new JSL({
    rules: [bid],
    query: [offer]
});

var response = jsl.run();
console.log('contract: ', response);

module.exports = response;
