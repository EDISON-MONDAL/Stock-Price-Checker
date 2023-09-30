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
      .timeout(6000)
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
  
  test('Viewing one stock and liking it: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: stockSymbol1, like: true, ip: ip1 })
      .timeout(6000)
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
      .timeout(6000)
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
      .timeout(6000)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.lengthOf(res.body.stockData, 2); // Check if two stock data objects are returned

        assert.property(res.body.stockData[0], 'stock');
        assert.property(res.body.stockData[0], 'price');
        assert.property(res.body.stockData[0], 'rel_likes');
        assert.property(res.body.stockData[1], 'stock');
        assert.property(res.body.stockData[1], 'price');
        assert.property(res.body.stockData[1], 'rel_likes');
        
        assert.equal(res.body.stockData[0].stock, stockSymbol1);
        assert.equal(res.body.stockData[1].stock, stockSymbol2);
        done();
      });
  });
  
  test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: [stockSymbol1, stockSymbol2], like: true, ip: ip1 })
      .timeout(6000)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.lengthOf(res.body.stockData, 2); // Check if two stock data objects are returned
        
        assert.property(res.body.stockData[0], 'stock');
        assert.property(res.body.stockData[0], 'price');
        assert.property(res.body.stockData[0], 'rel_likes');
        assert.property(res.body.stockData[1], 'stock');
        assert.property(res.body.stockData[1], 'price');
        assert.property(res.body.stockData[1], 'rel_likes');
        
        assert.equal(res.body.stockData[0].stock, stockSymbol1);
        assert.equal(res.body.stockData[0].rel_likes, -1);
        assert.equal(res.body.stockData[1].stock, stockSymbol2);
        assert.equal(res.body.stockData[1].rel_likes, 1);

        done();
      });
  });
  
});
