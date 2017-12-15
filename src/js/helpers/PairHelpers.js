import * as OrderHelpers from './OrderHelpers';

export const getPair = (assetCode, currencyCode) => {
  return currencyCode + '_' + assetCode;
};

export const getTargetBuyOrder = (assetCode, currencyCode, balance, ticker, tradeHistory, settings) => {
  const type = 'buy';
  const assetBalance = balance.available + balance.onOrders;
  const targetYield = OrderHelpers.targetYield(settings.spread, type, tradeHistory);
  const rate = getTargetBuyRate(settings.target, assetBalance, targetYield);
  const amount = getTargetBuyAmount(settings.target, assetBalance, targetYield);
  const order = getOrder(type, assetCode, currencyCode, rate, amount, targetYield);
  return order;
};

export const getTargetSellOrder = (assetCode, currencyCode, balance, ticker, tradeHistory, settings) => {
  const type = 'sell';
  const assetBalance = balance.available + balance.onOrders;
  const targetYield = OrderHelpers.targetYield(settings.spread, type, tradeHistory);
  const rate = getTargetSellRate(settings.target, assetBalance, targetYield);
  const amount = getTargetSellAmount(settings.target, assetBalance, targetYield);
  const order = getOrder(type, assetCode, currencyCode, rate, amount, targetYield);
  return order;
};

export const getUrgentOrder = (assetCode, currencyCode, balance, ticker, tradeHistory, settings) => {
  const urgentBuyOrder = getUrgentBuyOrder(assetCode, currencyCode, balance, ticker, settings);
  const urgentSellOrder = getUrgentSellOrder(assetCode, currencyCode, balance, ticker, settings);
  const targetBuyOrder = getTargetBuyOrder(assetCode, currencyCode, balance, ticker, tradeHistory, settings);
  const targetSellOrder = getTargetSellOrder(assetCode, currencyCode, balance, ticker, tradeHistory, settings);
  const targetDelta = Math.abs(balance.btcValue - settings.target);
  const holdAmount = targetDelta/ticker.last;
  var highestOrder = [urgentBuyOrder, urgentSellOrder].reduce(function(a, b) {
    return a.btcValue > b.btcValue ? a : b;
  });
  let order = getOrder('hold', assetCode, currencyCode, ticker.last, holdAmount);
  if (highestOrder.btcValue > 0.0001) order = highestOrder;
  const denominator = [targetBuyOrder, targetSellOrder].filter(_order => {
    return _order.type === highestOrder.type;
  })[0].btcValue;
  const percentToTrade = targetDelta/denominator;
  order.percentToTrade = percentToTrade;
  [targetBuyOrder, targetSellOrder].forEach(_order => {
    if (_order.type === highestOrder.type) order.targetYield = _order.targetYield;
  });
  return order;
};

export const getUrgentBuyOrder = (assetCode, currencyCode, balance, ticker, settings) => {
  const rate = ticker.lowestAsk;
  let amount = getUrgentOrderAmount(settings.target, balance.btcValue, rate);
  amount = (amount < 0) ? Math.abs(amount) : 0;
  const order = getOrder('buy', assetCode, currencyCode, rate, amount);
  return order;
};

export const getUrgentSellOrder = (assetCode, currencyCode, balance, ticker, settings) => {
  const rate = ticker.highestBid;
  let amount = getUrgentOrderAmount(settings.target, balance.btcValue, rate);
  amount = (amount > 0) ? amount : 0;
  const order = getOrder('sell', assetCode, currencyCode, rate, amount);
  return order;
};

export const getOrder = (type, assetCode, currencyCode, rate, amount, targetYield) => {
  const btcValue = amount * rate;
  return {
    currencyPair: getPair(assetCode, currencyCode),
    rate,
    amount,
    btcValue,
    targetYield,
    type
  };
};

export const getTargetBuyRate = (targetValue, assetBalance, targetYield) => {
  const targetRate = getTargetRate(targetValue, assetBalance);
  const targetBuyRate = targetRate - (targetRate * targetYield/100);
  return targetBuyRate;
};

export const getTargetSellRate = (targetValue, assetBalance, targetYield) => {
  const targetRate = getTargetRate(targetValue, assetBalance);
  const targetSellRate = targetRate + (targetRate * targetYield/100);
  return targetSellRate;
};

export const getTargetRate = (targetValue, assetBalance) => {
  return targetValue/assetBalance;
};

export const getTargetBuyAmount = (targetValue, assetBalance, targetYield) => {
  const btcAmount = targetValue * targetYield/100 + 0.000001;
  const rate = getTargetBuyRate(targetValue, assetBalance, targetYield);
  const amount = btcAmount / rate;
  return amount;
};

export const getTargetSellAmount = (targetValue, assetBalance, targetYield) => {
  const btcAmount = targetValue * targetYield/100 + 0.000001;
  const rate = getTargetSellRate(targetValue, assetBalance, targetYield);
  const amount = btcAmount / rate;
  return amount;
};

export const getUrgentOrderAmount = (targetValue, assetValue, rate) => {
  const btcAmount = assetValue - targetValue;
  const amount = btcAmount / rate;
  return amount;
};
