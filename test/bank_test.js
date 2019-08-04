var supertest = require('supertest'),
  expect = require('chai').expect,
  api = supertest(`http://${process.env.NODE_ENV}.airwallex.com:30001`);

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
  describe('should return error message', function () {
    it('when account number is missing', function (done) {
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
    it('when aba code is missing for bank country code US', function (done) {
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
    it('when aba code is too long for bank country code US', function (done) {
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
          "aba": "11122233AX"
        })
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.error.text).to.contain("Length of 'aba' should be 9");
          done();
        })
    })
    it('when bsb code is missing for bank country code AU', function (done) {
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
    it('when country code is missing', function (done) {
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
    describe('when account name is', function () {
      it('missing', function (done) {
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
      it('too long', function (done) {
        api.post('/bank')
          .set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
          })
          .send({
            'payment_method': 'SWIFT',
            "bank_country_code": "US",
            "account_name": "John SmithS",
            "account_number": "123",
            "swift_code": "ICBCUSBJ",
            "aba": "11122233A"
          })
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.error.text).to.contain("Length of account_name should be between 2 and 10");
            done();
          })
      })
      it('too short', function (done) {
        api.post('/bank')
          .set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
          })
          .send({
            'payment_method': 'SWIFT',
            "bank_country_code": "US",
            "account_name": "J",
            "account_number": "123",
            "swift_code": "ICBCUSBJ",
            "aba": "11122233A"
          })
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.error.text).to.contain("Length of account_name should be between 2 and 10");
            done();
          })
      })
    })
    describe('when account number is too', function () {
      it('long for bank country code US', function (done) {
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
      it('short for bank country code AU', function (done) {
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
      it('long  for bank country code AU', function (done) {
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
      it('short for bank country code CN', function (done) {
        api.post('/bank')
          .set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
          })
          .send({
            'payment_method': 'SWIFT',
            "bank_country_code": "CN",
            "account_name": "John Smith",
            "account_number": "1234567",
            "swift_code": "ICBCCNBJ",
            "aba": "11122233A",
            "bsb": "123456"
          })
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.error.text).to.contain("Length of account_number should be between 8 and 20 when bank_country_code is \'CN\'");
            done();
          })
      })
      it('long  for bank country code CN', function (done) {
        api.post('/bank')
          .set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
          })
          .send({
            'payment_method': 'SWIFT',
            "bank_country_code": "CN",
            "account_name": "John Smith",
            "account_number": "123456789012345678901",
            "swift_code": "ICBCCNBJ",
            "aba": "11122233A",
            "bsb": "123456"
          })
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.error.text).to.contain("Length of account_number should be between 8 and 20 when bank_country_code is \'CN\'");
            done();
          })
      })
    })
    describe('for SWIFT code', function () {
      it('is missing', function (done) {
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
      it('is incorrect', function (done) {
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
      it('is too long', function (done) {
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
      it('is too short', function (done) {
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