// import moment from 'moment';
/**
 * Description - adjust minimumYield for the following conditions
 * increase for consecutive of the same type
 * multiply by ratio of order types
 * number of hours since last trade
 * dont let go too low, minimum trade size
 */
export const targetYield = (minimumYield, type, tradeHistory) => {
  let targetYield;
  // consecutive helps handle increasing yield for really good or bad run
  const consecutiveYield = lastConsecutiveRateChange(tradeHistory, type);
  const averageYield = typeConsecutiveAverageRateChange(tradeHistory, type);
  targetYield = Math.max(averageYield, consecutiveYield/2, minimumYield);
  targetYield = parseFloat(targetYield.toFixed(2));
  return targetYield;
};
/**
 * Description - gets rate change of recent consecutive trades of type
 */
export const lastConsecutiveRateChange = (tradeHistory, type) => {
  let rateChange = 0;
  let rates = [];
  let consecutive = true;
  tradeHistory.forEach(trade => {
    // add the next one even if just switched other direction for delta
    if (consecutive) rates.push(trade.rate);
    // switch consecutive to false so after this one it won't push rate
    if (trade.type !== type) consecutive = false;
  });
  if (rates.length > 0) {
    const rateDelta = Math.abs(rates[0] - rates[rates.length-1]);
    rateChange = rateDelta/rates[rates.length-1];
  }
  return rateChange * 100;
};
/**
 * Description - gets average consecutive rate change
 * if type is buys: buys/sells and if sells: sells/buys
 */
export const typeConsecutiveAverageRateChange = (tradeHistory, type) => {
  let consecutiveRuns = [];
  let consecutiveRates = [];
  tradeHistory.forEach((trade) => {
    let reset = false;
    // always add to the consecutive, if switched directions, it gives baseline rate
    consecutiveRates.push(trade.rate);
    if (trade.type !== type) {
      reset = true;
    }
    if (reset) {
      consecutiveRuns.push(consecutiveRates);
      consecutiveRates = [];
    }
  });
  consecutiveRuns = consecutiveRuns.filter(array => array.length > 0);
  let average = 0;
  if (consecutiveRuns.length > 0) {
    const consecutiveChanges = consecutiveRuns.map(rates => {
      let rateChange = 0;
      if (rates.length > 0) {
        const rateDelta = Math.abs(rates[0] - rates[rates.length-1]);
        rateChange = rateDelta/rates[rates.length-1];
      }
      return rateChange;
    });
    average = consecutiveChanges.reduce((p,c) => p + c, 0) / consecutiveChanges.length;
  }
  return average * 100;
};

export const typeFilter = (orders, type) => orders.filter(o => o.type === type);
export const typeReject = (orders, type) => orders.filter(o => o.type !== type);
