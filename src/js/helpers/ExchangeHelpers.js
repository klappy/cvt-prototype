import plnx from 'plnx';
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
      Object.keys(_balances).forEach(asset => {
        const balance = _balances[asset];
        balances[asset] = {
          available: parseFloat(balance.available),
          onOrders: parseFloat(balance.onOrders),
          btcValue: parseFloat(balance.btcValue)
        };
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
      });
      resolve(openOrders);
    })
    .catch(error => {
      // console.warn(error);
    });
  });
};

export const getTicker = (authentication, pairs = []) => {
  return new Promise( resolve => {
    let ticker = {};
    let options = authentication;
    options.urls = urls;
    plnx.returnTicker(options)
    .then(_ticker => {
      if (pairs.length === 0) {
        resolve(_ticker);
      } else {
        pairs.forEach(pair => {
          ticker[pair] = _ticker[pair];
        });
        resolve(ticker);
      }
    })
    .catch(error => {
      // console.warn(error);
    });
  });
};

export const placeOrder = (authentication, order) => {
  return new Promise( (resolve, reject) => {
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
