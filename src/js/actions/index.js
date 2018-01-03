import * as types from '../constants/ActionTypes';
import * as ExchangeHelpers from '../helpers/ExchangeHelpers';

export const updateAll = () => {
  return ((dispatch) => {
    dispatch(updateBalancesAndTickers());
    dispatch(updateOrdersAndTrades());
  });
};

export const updateBalancesAndTickers = () => {
  return ((dispatch) => {
    dispatch(updateTickers());
    dispatch(updateBalances());
  });
};

export const updateOrdersAndTrades = () => {
  return ((dispatch) => {
    dispatch(updateTradeHistories());
    dispatch(updateOpenOrders());
  });
};

export const updateAssetSettings = (assetCode, target, minimumYield) => (
  { type: types.UPDATE_ASSET_SETTINGS, assetCode, target, minimumYield }
);

export const updateAuthentication = (key, secret) => (
  { type: types.UPDATE_AUTHENTICATION, key, secret }
);

export const updateApplicationSettings = (minimumYield) => (
  { type: types.UPDATE_APPLICATION_SETTINGS, minimumYield }
);

export const updateBalances = () => {
  return ((dispatch, getState) => {
    const state = getState();
    const {tickers} = state;
    ExchangeHelpers.getCompleteBalances(state.authentication)
    .then(balances => {
      const usdtBtcTicker = tickers['USDT_BTC'];
      if (usdtBtcTicker) {
        let _balances = {};
        Object.keys(balances).forEach(assetCode => {
          let balance = balances[assetCode];
          if (assetCode === 'USDT') {
            balance.btcValue = (balance.available + balance.onOrders) / usdtBtcTicker.last;
            balance.usdtValue = (balance.available + balance.onOrders);
          } else {
            balance.usdtValue = (balance.btcValue * usdtBtcTicker.last);
          }
          _balances[assetCode] = balance;
        });
      }
      dispatch({ type: types.UPDATE_BALANCES, balances });
    });
  });
};

export const updateTradeHistories = () => {
  return ((dispatch, getState) => {
    const state = getState();
    ExchangeHelpers.getTradeHistories(state.authentication)
    .then(tradeHistories => {
      dispatch({ type: types.UPDATE_TRADE_HISTORIES, tradeHistories });
    });
  });
};

export const updateOpenOrders = () => {
  return ((dispatch, getState) => {
    const state = getState();
    ExchangeHelpers.getOpenOrders(state.authentication)
    .then(openOrders => {
      dispatch({ type: types.UPDATE_OPEN_ORDERS, openOrders });
    });
  });
};

export const updateTickers = () => {
  return ((dispatch, getState) => {
    const state = getState();
    ExchangeHelpers.getTicker(state.authentication)
    .then(_tickers => {
      let tickers = {};
      Object.keys(_tickers).forEach(pairCode => {
        const _ticker = _tickers[pairCode];
        let ticker = {};
        Object.keys(_ticker).forEach(key => {
          ticker[key] = (_ticker[key]) ? parseFloat(_ticker[key]) : undefined;
        });
        tickers[pairCode] = ticker;
      });
      dispatch({ type: types.UPDATE_TICKERS, tickers });
    });
  });
};

export const placeOrder = (order, update=true) => {
  return ((dispatch, getState) => {
    const state = getState();
    ExchangeHelpers.placeOrder(state.authentication, order)
    .then(() => {
      if (update) {
        dispatch(updateBalances());
        dispatch(updateOpenOrders());
      }
    });
  });
};

export const placeOrders = (orders) => {
  return ((dispatch) => {
    orders.forEach(order => {
      dispatch(placeOrder(order, false));
    });
  });
};

export const cancelOrder = (order, update=true) => {
  return ((dispatch, getState) => {
    const state = getState();
    ExchangeHelpers.cancelOrder(state.authentication, order.orderNumber)
    .then(() => {
      if (update) {
        dispatch(updateOpenOrders());
      }
    });
  });
};

export const cancelPairOrders = (pairCode) => {
  return ((dispatch, getState) => {
    const state = getState();
    const {openOrders} = state;
    openOrders[pairCode].forEach(order => {
      dispatch(cancelOrder(order, false));
    });
  });
};

export const replacePairOrders = (pairCode, orders) => {
  return ((dispatch) => {
    dispatch(cancelPairOrders(pairCode));
    dispatch(placeOrders(orders));
    dispatch(updateOpenOrders());
    dispatch(updateBalances());
  });
};

export const addMessage = (message) => ({ type: types.ADD_MESSAGE, message });
export const removeMessage = (index) => ({ type: types.REMOVE_MESSAGE, index });
export const clearMessages = () => ({ type: types.CLEAR_MESSAGES });
