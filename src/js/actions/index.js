import * as types from '../constants/ActionTypes';
import * as ExchangeHelpers from '../helpers/ExchangeHelpers';
import * as PairHelpers from '../helpers/PairHelpers';

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

export const updateAssetSettings = (assetCode, target, spread) => (
  { type: types.UPDATE_ASSET_SETTINGS, assetCode, target, spread }
);

export const updateAuthentication = (key, secret) => (
  { type: types.UPDATE_AUTHENTICATION, key, secret }
);

export const updateBalances = () => {
  return ((dispatch, getState) => {
    const state = getState();
    ExchangeHelpers.getCompleteBalances(state.authentication)
    .then(balances => {
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
    const currencyCode = 'BTC';
    const assetCodes = Object.keys(state.balances)
      .filter(pairCode => (pairCode !== 'BTC'));
    const pairCodes = assetCodes
      .map(assetCode => PairHelpers.getPair(assetCode, currencyCode));
    ExchangeHelpers.getTicker(state.authentication, pairCodes)
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

export const placeOrder = (order) => {
  return ((dispatch, getState) => {
    const state = getState();
    ExchangeHelpers.placeOrder(state.authentication, order)
    .then(response => {
      const message = {
        primaryText: 'Order Placed',
        secondaryText: JSON.stringify(response)
      };
      dispatch(addMessage(message));
      dispatch(updateBalances());
      dispatch(updateOpenOrders());
    })
    .catch(error => {
      const message = {
        primaryText: 'Order Placed',
        secondaryText: JSON.stringify(error)
      };
      dispatch(addMessage(message));
    });
  });
};

export const cancelOrder = (order) => {
  return ((dispatch, getState) => {
    const state = getState();
    ExchangeHelpers.cancelOrder(state.authentication, order.orderNumber)
    .then(() => {
      const message = {
        primaryText: order.currencyPair + ' Order Canceled',
        secondaryText: 'Order Number: ' + order.orderNumber
      };
      dispatch(addMessage(message));
      dispatch(updateOpenOrders());
    })
    .catch(error => {
      const message = {
        primaryText: 'Order Placed',
        secondaryText: JSON.stringify(error)
      };
      dispatch(addMessage(message));
    });
  });
};

export const addMessage = (message) => ({ type: types.ADD_MESSAGE, message });
export const removeMessage = (index) => ({ type: types.REMOVE_MESSAGE, index });
export const clearMessages = () => ({ type: types.CLEAR_MESSAGES });
