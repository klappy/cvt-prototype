
export const getPair = (assetCode, currencyCode) => {
  return currencyCode + '_' + assetCode;
};

export const getTargetBuyOrder = (assetCode, currencyCode, balance, ticker, settings) => {
  const assetBalance = balance.available + balance.onOrders;
  const rate = getTargetBuyRate(settings.target, assetBalance, settings.spread);
  const amount = getTargetBuyAmount(settings.target, assetBalance, settings.spread);
  const order = getOrder('buy', assetCode, currencyCode, rate, amount);
  return order;
};

export const getTargetSellOrder = (assetCode, currencyCode, balance, ticker, settings) => {
  const assetBalance = balance.available + balance.onOrders;
  const rate = getTargetSellRate(settings.target, assetBalance, settings.spread);
  const amount = getTargetSellAmount(settings.target, assetBalance, settings.spread);
  const order = getOrder('sell', assetCode, currencyCode, rate, amount);
  return order;
};

export const getUrgentOrder = (assetCode, currencyCode, balance, ticker, settings) => {
  const urgentBuyOrder = getUrgentBuyOrder(assetCode, currencyCode, balance, ticker, settings);
  const urgentSellOrder = getUrgentSellOrder(assetCode, currencyCode, balance, ticker, settings);
  let order = getOrder('hold', assetCode, currencyCode, ticker.last, 0);
  if (urgentBuyOrder.btcValue > 0.0001) order = urgentBuyOrder;
  if (urgentSellOrder.btcValue > 0.0001) order = urgentSellOrder;
  return order;
};

export const getUrgentBuyOrder = (assetCode, currencyCode, balance, ticker, settings) => {
  const rate = ticker.lowestAsk;
  let amount = getCurrentOrderAmount(settings.target, balance.btcValue, rate);
  amount = (amount < 0) ? Math.abs(amount) : 0;
  const order = getOrder('buy', assetCode, currencyCode, rate, amount);
  return order;
};

export const getUrgentSellOrder = (assetCode, currencyCode, balance, ticker, settings) => {
  const rate = ticker.highestBid;
  let amount = getCurrentOrderAmount(settings.target, balance.btcValue, rate);
  amount = (amount > 0) ? amount : 0;
  const order = getOrder('sell', assetCode, currencyCode, rate, amount);
  return order;
};

export const getOrder = (type, assetCode, currencyCode, rate, amount) => {
  const btcValue = amount * rate;
  return {
    currencyPair: getPair(assetCode, currencyCode),
    rate,
    amount,
    btcValue,
    type
  };
};

export const getTargetBuyRate = (targetValue, assetBalance, spread) => {
  const targetRate = getTargetRate(targetValue, assetBalance);
  const targetBuyRate = targetRate - (targetRate * spread/100/2);
  return targetBuyRate;
};

export const getTargetSellRate = (targetValue, assetBalance, spread) => {
  const targetRate = getTargetRate(targetValue, assetBalance);
  const targetSellRate = targetRate + (targetRate * spread/100/2);
  return targetSellRate;
};

export const getTargetRate = (targetValue, assetBalance) => {
  return targetValue/assetBalance;
};

export const getTargetBuyAmount = (targetValue, assetBalance, spread) => {
  const btcAmount = targetValue * spread/100/2 + 0.000001;
  const rate = getTargetBuyRate(targetValue, assetBalance, spread);
  const amount = btcAmount / rate;
  return amount;
};

export const getTargetSellAmount = (targetValue, assetBalance, spread) => {
  const btcAmount = targetValue * spread/100/2 + 0.000001;
  const rate = getTargetSellRate(targetValue, assetBalance, spread);
  const amount = btcAmount / rate;
  return amount;
};

export const getCurrentOrderAmount = (targetValue, assetValue, rate) => {
  const btcAmount = assetValue - targetValue;
  const amount = btcAmount / rate;
  return amount;
};
