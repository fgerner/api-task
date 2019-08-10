var supertest = require('supertest'),
  api = supertest('http://preview.airwallex.com:30001');

describe('bank', function () {
  it('should return a 200 response', function (done) {
    api.post('/bank')
      .set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      })
      .send({
        'payment_method': 'SWIFT',
        "bank_country_code": "US",
        "account_name": "John Smith",
        "account_number": "123",
        "swift_code": "ICBCUSBJ",
        "aba": "11122233A"
      })
      .expect(200, done)
  })
  it('should return a 400 response', function (done) {
    api.post('/bank')
      .set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      })
      .send({
        'payment_method': 'SWIFT',
        "bank_country_code": "US",
        "account_number": "123",
        "swift_code": "ICBCUSBJ",
        "aba": "11122233A"
      })
      .expect(400, done)
  })

})