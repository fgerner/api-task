var {Given, When, Then} = require('cucumber');
var got = require('got');

let api = 'http://preview.airwallex.com:30001';

let header = {
  "Cache-Control":"no-cache",
  "Content-Type": "application/json"
};

let body = {
  "payment_method": "SWIFT",
  "bank_country_code": "US",
  "account_name": "John Smith",
  "account_number": "123",
  "swift_code": "ICBCUSBJ",
  "aba": "11122233A"
};

Given('service is active', function () {
  

});

When('user sends a valid POST request', function () {
  




});

Then('the user gets a {int} status response', function (int) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});