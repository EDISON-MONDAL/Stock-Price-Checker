const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  // Define variables to store stock symbols for testing
  let stockSymbol1 = 'AAPL';
  let stockSymbol2 = 'GOOG';

  // Define variables to store IP addresses for liking tests
  let ip1 = '127.0.0.1';
  let ip2 = '192.168.0.1';

  test('Viewing one stock: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: stockSymbol1 })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        assert.equal(res.body.stockData.stock, stockSymbol1);
        done();
      });
  });
  /*
  test('Viewing one stock and liking it: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: stockSymbol1, like: true, ip: ip1 })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        assert.equal(res.body.stockData.stock, stockSymbol1);
        assert.equal(res.body.stockData.likes, 1); // Check if the like is counted
        done();
      });
  });

  test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: stockSymbol1, like: true, ip: ip1 })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        assert.equal(res.body.stockData.stock, stockSymbol1);
        assert.equal(res.body.stockData.likes, 1); // Check that likes are not double-counted
        done();
      });
  });

  test('Viewing two stocks: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: [stockSymbol1, stockSymbol2] })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.lengthOf(res.body, 2); // Check if two stock data objects are returned
        assert.property(res.body[0], 'stockData');
        assert.property(res.body[1], 'stockData');
        done();
      });
  });

  test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: [stockSymbol1, stockSymbol2], like: [true, true], ip: [ip1, ip2] })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.lengthOf(res.body, 2); // Check if two stock data objects are returned
        assert.property(res.body[0], 'stockData');
        assert.property(res.body[1], 'stockData');
        assert.isNumber(res.body[0].stockData.rel_likes); // Check for rel_likes property
        assert.isNumber(res.body[1].stockData.rel_likes); // Check for rel_likes property
        done();
      });
  });
  */
});
