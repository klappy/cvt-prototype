
export const getPair = (asset, currency) => {
  return currency + '_' + asset;
};

export const getBuyPrice = (targetValue, assetBalance, percent) => {
  const targetPrice = getTargetPrice(targetValue, assetBalance);
  const targetBuyPrice = targetPrice - (targetPrice * percent);
  return targetBuyPrice;
};

export const getSellPrice = (targetValue, assetBalance, percent) => {
  const targetPrice = getTargetPrice(targetValue, assetBalance);
  const targetSellPrice = targetPrice + (targetPrice * percent);
  return targetSellPrice;
};

export const getTargetPrice = (targetValue, assetBalance) => {
  return targetValue/assetBalance;
};
