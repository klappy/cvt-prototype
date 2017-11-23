import * as helpers from './helpers/index';
/**
 * @description - Create a Pair object
 * @param {String} currencyCode - The code of the currency in the pair
 * @param {String} assetCode - The code of the asset in the pair
 */
export const newPair = (currencyCode, assetCode, constantValueTarget, spreadPercent) => {
  let pair = {};
  pair.currency = {
    code: currencyCode,
    balance: {},
    usd: undefined
  };
  pair.asset = {
    code: assetCode,
    balance: {},
    value: undefined
  };
  pair.config = {
    constantValueTarget,
    spreadPercent,
    feePercent: 0.25,
  };
  pair.ticker = {};
  pair.orders = {
    pending: {
      buy: {},
      sell: {}
    },
    open: [],
    history: []
  };
  pair.actions = {
    run: () => {
      this.balances.update()
      .then(this.ticker.update)
      .then(this.orders.updateHistory)
      .then(this.orders.updateOpen)
      .then(this.orders.validateOpen)
      .then(this.orders.cancelOpen)
      .then(this.orders.updatePending)
      .then(this.orders.placePending);
    },
    balances: {
      update: () => {
        return new Promise(resolve => {
          helpers.getBalances([pair.asset.code, pair.currency.code])
          .then(balances => {
            pair.currency.balance = balances[pair.currency.code];
            pair.asset.balance = balances[pair.asset.code];
            resolve();
          });
        });
      }
    },
    ticker: {
      update: () => {
        return new Promise(resolve => {
          helpers.getTicker(pair.asset.code, pair.currency.code)
          .then(ticker => {
            pair.ticker = ticker;
            resolve();
          });
        });
      }
    },
    orders: {
      updatePending: () => {
        return new Promise(resolve => {
          const {constantValueTarget, spreadPercent} = pair.config;
          const {balance} = pair.asset.balance;
          const percent = spreadPercent / 2;
          const buy = helpers.getBuyOrder(constantValueTarget, balance, percent);
          const sell = helpers.getSellOrder(constantValueTarget, balance, percent);
          pair.orders.pending = {buy, sell};
          resolve();
        });
      },
      placePending: () => {
        return new Promise(resolve => {
          const {buy, sell} = pair.orders.pending;
          helpers.placeOrders([buy, sell])
          .then(() => {
            pair.actions.orders.updateOpen()
            .then(resolve);
          });
        });
      },
      updateOpen: () => {
        return new Promise(resolve => {
          helpers.openOrders(pair.asset.code, pair.currency.code)
          .then(openOrders => {
            pair.orders.open = openOrders;
            resolve();
          });
        });
      },
      validateOpen: () => {
        // call function to validate the orders that are openOrders
        // cancel the orders that are not valid
        return new Promise(resolve => {
          const valid = helpers.validateOpenOrders(pair.orders.pending, pair.orders.open);
          if (valid) {
            resolve();
          } else {
            pair.actions.orders.cancelOpen()
            .then(() => {
              pair.actions.orders.placePending()
              .then(resolve);
            });
          }
        });
      },
      cancelOpen: () => {
        return new Promise(resolve => {
          helpers.cancelOrders(pair.orders.open)
          .then(() => {
            pair.actions.orders.updateOpen()
            .then(resolve);
          });
        });
      },
      updateHistory: () => {
        return new Promise(resolve => {
          helpers.history(pair.asset.code, pair.currency.code)
          .then(history => {
            pair.orders.history = history;
            resolve();
          });
        });
      }
    }
  };
  return pair;
};
