import plnx from 'plnx';
// import * as PairHelpers from './PairHelpers';

export const getBalances = (authentication) => {
  return new Promise( resolve => {
    let balances = {};
    let options = authentication;
    options.urls = {
      public: 'https://cors-anywhere.herokuapp.com/https://poloniex.com/public',
      private: 'https://cors-anywhere.herokuapp.com/https://poloniex.com/tradingApi'
    };
    plnx.returnBalances(options)
    .then(_balances => {
      Object.keys(_balances).forEach(asset => {
        const balance = parseFloat(_balances[asset]);
        if (balance > 0) balances[asset] = balance;
      });
      resolve(balances);
    })
    .catch(error => {
      console.warn(error);
    });
  });
};

export const getCompleteBalances = (authentication) => {
  return new Promise( resolve => {
    let balances = {};
    let options = authentication;
    options.urls = {
      public: 'https://cors-anywhere.herokuapp.com/https://poloniex.com/public',
      private: 'https://cors-anywhere.herokuapp.com/https://poloniex.com/tradingApi'
    };
    plnx.returnCompleteBalances(options)
    .then(_balances => {
      Object.keys(_balances).forEach(asset => {
        const balance = _balances[asset];
        if (balance.btcValue > parseFloat(0)) {
          balances[asset] = {
            available: parseFloat(balance.available),
            onOrders: parseFloat(balance.onOrders),
            btcValue: parseFloat(balance.btcValue)
          };
        }
      });
      resolve(balances);
    })
    .catch(error => {
      console.warn(error);
    });
  });
};

export const getTicker = (authentication, pairs = []) => {
  return new Promise( resolve => {
    let ticker = {};
    let options = authentication;
    options.urls = {
      public: 'https://cors-anywhere.herokuapp.com/https://poloniex.com/public',
      private: 'https://cors-anywhere.herokuapp.com/https://poloniex.com/tradingApi'
    };
    plnx.returnTicker(options)
    .then(_ticker => {
      pairs.forEach(pair => {
        ticker[pair] = _ticker[pair];
      });
      resolve(ticker);
    })
    .catch(error => {
      console.warn(error);
    });
  });
};
