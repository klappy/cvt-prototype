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
  const consecutiveYield = lastConsecutiveRateChange(tradeHistory, type);
  const averageYield = typeConsecutiveAverageRateChange(tradeHistory, type);
  if (consecutiveYield === 0) { // if this is the first trade in theis direction
    targetYield = averageYield/2;
  } else if (averageYield > consecutiveYield) {
    targetYield = averageYield - (consecutiveYield/2);
  } else { // consecutive is greatest, use that in case of flash crash or sky rocket
    targetYield = consecutiveYield/2;
  }
  targetYield = parseFloat(targetYield.toFixed(2));
  targetYield = Math.max(targetYield, minimumYield);
// console.log(consecutiveBtc, consecutiveYield, averageBtcValue, averageYield, targetYield)
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
    if (trade.type !== type) {
      consecutive = false;
    } else {
      if (consecutive) rates.push(trade.rate);
    }
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
    let push = false;
    if (trade.type === type) {
      consecutiveRates.push(trade.rate);
    } else {
      push = true;
    }
    if (push) {
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
