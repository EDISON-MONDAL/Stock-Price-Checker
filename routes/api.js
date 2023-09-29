'use strict';

const axios = require('axios');

const mongoose = require("mongoose");
const { Schema } = mongoose;

// mongoose schema
const StockSchema = new Schema({
  symbol: { type: String, required: true },
  likes: { type: [String], default: [] },
});
const StockModel = mongoose.model("Stock", StockSchema);


async function createStock(stock, like, ip) {
  const stockSymbol = stock.toUpperCase()

  let ip2save = []
  if(like == 'true'){
    ip2save = [ip]
  } 

  const newStock = new StockModel({
    symbol: stockSymbol,
    likes: ip2save,
  });
  const savedNew = await newStock.save();
  return savedNew;
}


async function findStock(stock) {
  const stockSymbol = stock.toUpperCase()

  return await StockModel.findOne({ symbol: stockSymbol }).exec();
}

async function saveStock(stock, like, ip) {
  const stockSymbol = stock.toUpperCase()

  let saved = {};
  const foundStock = await findStock(stockSymbol);

  
  if (!foundStock) {
    const createNew = await createStock(stockSymbol, like, ip);
    saved = createNew;
    return saved;
  } else {
    if (like === 'true' && !foundStock.likes.includes(ip)) {
      foundStock.likes.push(ip);
    }
    saved = await foundStock.save();
    return saved;
  }
}


async function getStock(stock) {  
  const stockSymbol = stock.toUpperCase()

  const response = await axios.get(
    `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stockSymbol}/quote`
  );

  const { symbol, latestPrice } = response.data;
  return { symbol, latestPrice };  
}



module.exports = function (app) {
    
  app.route("/api/stock-prices").get(async function (req, res) {
    const { stock, like } = req.query;
    
    // when comparing two stocks
    if (Array.isArray(stock)) {

      const { symbol, latestPrice } = await getStock( stock[0] ); // get data from API key
      const { symbol: symbol2, latestPrice: latestPrice2 } = await getStock( stock[1] ); // get data from API key

      const firstStock = await saveStock(stock[0], like, req.ip);
      const secondStock = await saveStock(stock[1], like, req.ip);

      let stockData = [];

      if (!symbol) {
        stockData.push({
          rel_likes: firstStock.likes.length - secondStock.likes.length,
        });
      } else {
        stockData.push({
          stock: symbol,
          price: latestPrice,
          rel_likes: firstStock.likes.length - secondStock.likes.length,
        });
      }

      if (!symbol2) {
        stockData.push({
          rel_likes: secondStock.likes.length - firstStock.likes.length,
        });
      } else {
        stockData.push({
          stock: symbol2,
          price: latestPrice2,
          rel_likes: secondStock.likes.length - firstStock.likes.length,
        });
      }

      res.json({
        stockData,
      });
      return;
    }
    // when comparing two stocks


    // when working with only one stock
    const { symbol, latestPrice } = await getStock(stock); // get data from API key
    let hasLike = 0
    if(like == 'true'){
      hasLike = 1
    } 

    if (!symbol) {
      res.json({ stockData: { likes: hasLike } });
      return;
    }

    const singleStockData = await saveStock(symbol, like, req.ip);

    res.json({
      stockData: {
        stock: symbol,
        price: latestPrice,
        likes: singleStockData.likes.length,
      },
    });
    // when working with only one stock

  });
  
};