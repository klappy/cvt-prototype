import plnx from 'plnx';
import moment from 'moment';
// import * as PairHelpers from './PairHelpers';

export const urls = {
  public: 'https://cvt-proxy.herokuapp.com/https://poloniex.com/public',
  private: 'https://cvt-proxy.herokuapp.com/https://poloniex.com/tradingApi'
};

export const getBalances = (authentication) => {
  return new Promise( resolve => {
    let balances = {};
    let options = authentication;
    options.urls = urls;
    plnx.returnBalances(options)
    .then(_balances => {
      Object.keys(_balances).forEach(asset => {
        const balance = parseFloat(_balances[asset]);
        if (balance > 0) balances[asset] = balance;
      });
      resolve(balances);
    })
    .catch(error => {
      // console.warn(error);
    });
  });
};

export const getCompleteBalances = (authentication) => {
  return new Promise( resolve => {
    let balances = {};
    let options = authentication;
    options.urls = urls;
    plnx.returnCompleteBalances(options)
    .then(_balances => {
      Object.keys(_balances).forEach(assetCode => {
        balances[assetCode] = parseFloatObject(_balances[assetCode]);
      });
      resolve(balances);
    })
    .catch(error => {
      // console.warn(error);
    });
  });
};

export const getTradeHistories = (authentication) => {
  return new Promise( resolve => {
    let options = authentication;
    options.urls = urls;
    options.currencyPair = 'all';
    const startTimestamp = moment().subtract(1, 'months').unix();
    options.start = startTimestamp;
    plnx.returnTradeHistory(options)
    .then(_histories => {
      let histories = {};
      Object.keys(_histories).forEach(pairCode => {
        const _trades = _histories[pairCode];
        const trades = _trades.map(_trade => {
          let trade = {};
          Object.keys(_trade).forEach(key => {
            let floatKeys = ['rate', 'amount', 'total', 'fee'];
            const value = _trade[key];
            trade[key] = (floatKeys.includes(key)) ? parseFloat(value) : value;
          });
          return trade;
        });
        histories[pairCode] = trades;
        if (pairCode === 'USDT_BTC') {
          const _trades = trades.map(trade => invertTrade(trade));
          histories['BTC_USDT'] = _trades;
        }
      });
      resolve(histories);
    })
    .catch(error => {
      // console.warn(error);
    });
  });
};

export const getOpenOrders = (authentication) => {
  return new Promise( resolve => {
    let options = authentication;
    options.urls = urls;
    options.currencyPair = 'all';
    plnx.returnOpenOrders(options)
    .then(_openOrders => {
      let openOrders = {};
      Object.keys(_openOrders).forEach(pairCode => {
        const _orders = _openOrders[pairCode];
        const orders = _orders.map(_order => {
          let order = {};
          Object.keys(_order).forEach(key => {
            let floatKeys = ['rate', 'amount', 'total', 'fee'];
            const value = _order[key];
            order[key] = (floatKeys.includes(key)) ? parseFloat(value) : value;
          });
          return order;
        });
        openOrders[pairCode] = orders;
        if (pairCode === 'USDT_BTC') {
          openOrders['BTC_USDT'] = orders.map(order => invertOrder(order));
        }
      });
      resolve(openOrders);
    })
    .catch(error => {
      // console.warn(error);
    });
  });
};

export const getTicker = (authentication) => {
  return new Promise( resolve => {
    let tickers = {};
    let options = authentication;
    options.urls = urls;
    plnx.returnTicker(options)
    .then(_tickers => {
      Object.keys(_tickers).forEach(pairCode => {
        tickers[pairCode] = parseFloatObject(_tickers[pairCode]);
      });
      const usdtBtcTicker = _tickers['USDT_BTC'];
      const btcUsdtTicker = invertTicker(usdtBtcTicker);
      tickers['BTC_USDT'] = btcUsdtTicker;
      resolve(tickers);
    })
    .catch(error => {
      // console.warn(error);
    });
  });
};

export const parseFloatObject = (object) => {
  let _object = {};
  Object.keys(object).forEach(key => {
    _object[key] = parseFloat(object[key]);
  });
  return _object;
};

export const invertTicker = (ticker) => {
  const {last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume} = ticker;
  const _ticker = {
    last: 1/last,
    lowestAsk: 1/lowestAsk,
    highestBid: 1/highestBid,
    percentChange: -percentChange,
    baseVolume,
    quoteVolume
  };
  return _ticker;
};

export const invertTrade = trade => {
  let _trade = JSON.parse(JSON.stringify(trade));
  _trade.type = trade.type === 'sell' ? 'buy' : 'sell';
  _trade.rate = 1/trade.rate;
  _trade.amount = trade.total;
  _trade.total = trade.amount;
  return _trade;
};

export const invertOrder = order => {
  let _order = JSON.parse(JSON.stringify(order));
  if (order.currencyPair) {
    const pairCodeArray = order.currencyPair.split('_');
    _order.currencyPair = `${pairCodeArray[1]}_${pairCodeArray[0]}`;
  }
  _order.type = (order.type === 'sell') ? 'buy' : 'sell';
  _order.rate = 1/order.rate;
  _order.total = order.amount;
  _order.amount = order.total;
  return _order;
};

export const placeOrder = (authentication, order) => {
  return new Promise( (resolve, reject) => {
    if (order.currencyPair === 'BTC_USDT') {
      order = invertOrder(order);
    }
    let options = authentication;
    options.urls = urls;
    if (order.type === 'buy') {
      placeBuyOrder(authentication, order)
      .then(response => {
        resolve(response);
      });
    } else if (order.type === 'sell') {
      placeSellOrder(authentication, order)
      .then(response => {
        resolve(response);
      });
    } else {
      reject('No trade type in order. ' + JSON.stringify(order));
    }
  });
};

export const placeBuyOrder = (authentication, order) => {
  return new Promise( resolve => {
    let options = authentication;
    options.urls = urls;
    options.currencyPair = order.currencyPair;
    options.rate = order.rate;
    options.amount = order.amount;
    plnx.buy(options)
    .then(response => {
      resolve(response);
    })
    .catch(error => {
      // console.warn(error);
    });
  });
};

export const placeSellOrder = (authentication, order) => {
  return new Promise( resolve => {
    let options = authentication;
    options.urls = urls;
    options.currencyPair = order.currencyPair;
    options.rate = order.rate;
    options.amount = order.amount;
    plnx.sell(options)
    .then(response => {
      resolve(response);
    })
    .catch(error => {
      // console.warn(error);
    });
  });
};

export const cancelOrder = (authentication, orderNumber) => {
  return new Promise( resolve => {
    let options = authentication;
    options.urls = urls;
    options.orderNumber = orderNumber;
    plnx.cancelOrder(options)
    .then(response => {
      resolve(response);
    })
    .catch(error => {
      // console.warn(error);
    });
  });
};
