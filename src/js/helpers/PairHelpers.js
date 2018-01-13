import * as OrderHelpers from './OrderHelpers';

export const getPair = (assetCode, currencyCode) => {
  return currencyCode + '_' + assetCode;
};

export const getTargetBuyOrder = (assetCode, currencyCode, balance, ticker, tradeHistory, target, minimumYield) => {
  const type = 'buy';
  const assetBalance = balance.available + balance.onOrders;
  const targetYield = OrderHelpers.targetYield(minimumYield, type, tradeHistory);
  const rate = getTargetBuyRate(target, assetBalance, targetYield);
  const amount = getTargetBuyAmount(target, assetBalance, targetYield);
  const order = getOrder(type, assetCode, currencyCode, rate, amount, targetYield);
  return order;
};

export const getTargetSellOrder = (assetCode, currencyCode, balance, ticker, tradeHistory, target, minimumYield) => {
  const type = 'sell';
  const assetBalance = balance.available + balance.onOrders;
  const targetYield = OrderHelpers.targetYield(minimumYield, type, tradeHistory);
  const rate = getTargetSellRate(target, assetBalance, targetYield);
  const amount = getTargetSellAmount(target, assetBalance, targetYield);
  const order = getOrder(type, assetCode, currencyCode, rate, amount, targetYield);
  return order;
};

export const getUrgentOrder = (assetCode, currencyCode, balance, ticker, tradeHistory, target, minimumYield) => {
  const urgentBuyOrder = getUrgentBuyOrder(assetCode, currencyCode, balance, ticker, target, minimumYield);
  const urgentSellOrder = getUrgentSellOrder(assetCode, currencyCode, balance, ticker, target, minimumYield);
  const targetBuyOrder = getTargetBuyOrder(assetCode, currencyCode, balance, ticker, tradeHistory, target, minimumYield);
  const targetSellOrder = getTargetSellOrder(assetCode, currencyCode, balance, ticker, tradeHistory, target, minimumYield);
  const targetDelta = Math.abs(balance.btcValue - target);
  const holdAmount = targetDelta/ticker.last;
  var highestOrder = [urgentBuyOrder, urgentSellOrder].reduce(function(a, b) {
    return a.btcValue > b.btcValue ? a : b;
  });
  let order = getOrder('hold', assetCode, currencyCode, ticker.last, holdAmount);
  if (highestOrder.btcValue > 0.0001 && highestOrder.targetYield >= minimumYield) order = highestOrder;
  const denominator = [targetBuyOrder, targetSellOrder].filter(_order => {
    return _order.type === highestOrder.type;
  })[0].btcValue;
  const percentToTrade = denominator ? targetDelta/denominator : 0;
  order.percentToTrade = percentToTrade;
  [targetBuyOrder, targetSellOrder].forEach(_order => {
    if (_order.type === highestOrder.type) order.targetYield = _order.targetYield;
  });
  return order;
};

export const getUrgentBuyOrder = (assetCode, currencyCode, balance, ticker, target) => {
  const rate = ticker.lowestAsk;
  let amount = getUrgentOrderAmount(target, balance.btcValue, rate);
  amount = (amount < 0) ? Math.abs(amount) : 0;
  const currentYield = amount*rate/target*100;
  const order = getOrder('buy', assetCode, currencyCode, rate, amount, currentYield);
  return order;
};

export const getUrgentSellOrder = (assetCode, currencyCode, balance, ticker, target) => {
  const rate = ticker.highestBid;
  let amount = getUrgentOrderAmount(target, balance.btcValue, rate);
  amount = (amount > 0) ? amount : 0;
  const currentYield = amount*rate/target*100;
  const order = getOrder('sell', assetCode, currencyCode, rate, amount, currentYield);
  return order;
};

export const getOrder = (type, assetCode, currencyCode, rate, amount, targetYield) => {
  const btcValue = amount * rate;
  return {
    currencyPair: getPair(assetCode, currencyCode),
    rate,
    amount,
    btcValue,
    total: btcValue,
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
  const minimumBtcAmount = 0.00010001;
  const btcAmount = Math.max(minimumBtcAmount, targetValue * targetYield/100);
  const rate = getTargetBuyRate(targetValue, assetBalance, targetYield);
  const amount = btcAmount / rate;
  return amount;
};

export const getTargetSellAmount = (targetValue, assetBalance, targetYield) => {
  const minimumBtcAmount = 0.00010001;
  const btcAmount = Math.max(minimumBtcAmount, targetValue * targetYield/100);
  const rate = getTargetSellRate(targetValue, assetBalance, targetYield);
  const amount = btcAmount / rate;
  return amount;
};

export const getUrgentOrderAmount = (targetValue, assetValue, rate) => {
  const btcAmount = assetValue - targetValue;
  const amount = btcAmount / rate;
  return amount;
};
