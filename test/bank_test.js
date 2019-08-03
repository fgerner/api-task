var supertest = require('supertest'),
  expect = require('chai').expect,
api = supertest(`http://preview.airwallex.com:30001`);
// api = supertest(`http://${NODE_ENV}.airwallex.com:30001`);

describe('bank endpoint,', function () {
  it('should return a success message', function (done) {
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
      .expect(200)
      .expect({
        "success": "Bank details saved"
      }, done)
  })
  it('should be able to use LOCAL payment method', function (done) {
    api.post('/bank')
      .set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      })
      .send({
        'payment_method': 'LOCAL',
        "bank_country_code": "US",
        "account_name": "John Smith",
        "account_number": "123",
        "aba": "11122233A"
      })
      .expect(200)
      .expect({
        "success": "Bank details saved"
      }, done)
  })

  describe('status code', function () {
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
          "account_name": "John Smith",
          // "account_number": "123",
          "swift_code": "ICBCUSBJ",
          "aba": "11122233A"
        })
        .expect(400, done)
    })
  })
  describe('error message', function () {
    it('account number is missing', function (done) {
      api.post('/bank')
        .set({
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json'
        })
        .send({
          'payment_method': 'SWIFT',
          "bank_country_code": "US",
          "account_name": "John Smith",
          // "account_number": "123",
          "swift_code": "ICBCUSBJ",
          "aba": "11122233A"
        })
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.error.text).to.contain("account_number' is required");
          done();
        })
    })
    it('aba code is missing for bank country US', function (done) {
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
        })
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.error.text).to.contain("aba_code is required");
          done();
        })
    })
    it('bsb code is missing for bank country AU', function (done) {
      api.post('/bank')
        .set({
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json'
        })
        .send({
          'payment_method': 'SWIFT',
          "bank_country_code": "AU",
          "account_name": "John Smith",
          "account_number": "1234567",
          "swift_code": "ICBCAUUSBJ"
        })
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.error.text).to.contain("'bsb' is required when bank country code is 'AU'");
          done();
        })
    })
    it('country code is missing', function (done) {
      api.post('/bank')
        .set({
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json'
        })
        .send({
          'payment_method': 'SWIFT',
          "account_name": "John Smith",
          "account_number": "123",
          "swift_code": "ICBCUSBJ",
        })
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.error.text).to.contain("'bank_country_code' is required, and should be one of 'US', 'AU', or 'CN'");
          done();
        })
    })
    it('account name is missing', function (done) {
      api.post('/bank')
        .set({
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json'
        })
        .send({
          'payment_method': 'SWIFT',
          "bank_country_code": "US",
          // "account_name": "John Smith",
          "account_number": "123",
          "swift_code": "ICBCUSBJ",
          "aba": "11122233A"
        })
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.error.text).to.contain("account_name' is required");
          done();
        })
    })
    describe('account number length', function () {
      it('account number too long US', function (done) {
        api.post('/bank')
          .set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
          })
          .send({
            'payment_method': 'SWIFT',
            "bank_country_code": "US",
            "account_name": "John Smith",
            "account_number": "123456789012345678",
            "swift_code": "ICBCUSBJ",
            "aba": "11122233A"
          })
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.error.text).to.contain("Length of account_number should be between 1 and 17 when bank_country_code is \'US\'");
            done();
          })
      })
      it('account number too short for AU', function (done) {
        api.post('/bank')
          .set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
          })
          .send({
            'payment_method': 'SWIFT',
            "bank_country_code": "AU",
            "account_name": "John Smith",
            "account_number": "12345",
            "swift_code": "ICBCAUBJ",
            "aba": "11122233A",
            "bsb": "123456"
          })
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.error.text).to.contain("Length of account_number should be between 6 and 9 when bank_country_code is \'AU\'");
            done();
          })
      })
      it('account number too long for AU', function (done) {
        api.post('/bank')
          .set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
          })
          .send({
            'payment_method': 'SWIFT',
            "bank_country_code": "AU",
            "account_name": "John Smith",
            "account_number": "1234567890",
            "swift_code": "ICBCAUBJ",
            "aba": "11122233A",
            "bsb": "123456"
          })
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.error.text).to.contain("Length of account_number should be between 6 and 9 when bank_country_code is \'AU\'");
            done();
          })
      })
    })
    describe('SWIFT code', function () {
      it('SWIFT code is missing', function (done) {
        api.post('/bank')
          .set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
          })
          .send({
            'payment_method': 'SWIFT',
            "bank_country_code": "US",
            "account_name": "John Smith",
            "account_number": "12345678901234567",
            "aba": "11122233A"
          })
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.error.text)
              .to.contain("swift_code' is required when payment method is 'SWIFT'");
            done();
          })
      })
      it('SWIFT code is incorrect', function (done) {
        api.post('/bank')
          .set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
          })
          .send({
            'payment_method': 'SWIFT',
            "bank_country_code": "US",
            "account_name": "John Smith",
            "account_number": "12345678901234567",
            "swift_code": "ICBCAUBJ",
            "aba": "11122233A"
          })
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.error.text)
              .to.contain("The swift code is not valid for the given bank country code: US");
            done();
          })
      })
      it('SWIFT code is too long', function (done) {
        api.post('/bank')
          .set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
          })
          .send({
            'payment_method': 'SWIFT',
            "bank_country_code": "US",
            "account_name": "John Smith",
            "account_number": "12345678901234567",
            "swift_code": "ICBCUSBJXXXX",
            "aba": "11122233A"
          })
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.error.text).to.contain("Length of 'swift_code' should be either 8 or 11");
            done();
          })
      })
      it('SWIFT code is too short', function (done) {
        api.post('/bank')
          .set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
          })
          .send({
            'payment_method': 'SWIFT',
            "bank_country_code": "US",
            "account_name": "John Smith",
            "account_number": "12345678901234567",
            "swift_code": "ICBCUSB",
            "aba": "11122233A"
          })
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.error.text).to.contain("Length of 'swift_code' should be either 8 or 11");
            done();
          })
      })

    })
  })
})