// import moment from 'moment';
/**
 * Description - adjust spread for the following conditions
 * increase for consecutive of the same type
 * multiply by ratio of order types
 * number of hours since last trade
 * dont let go too low, minimum trade size
 */
export const targetYield = (spread, type, tradeHistory, assetTargetBtcValue) => {
  let targetYield;
  const consecutiveBtc = lastConsecutiveBtc(tradeHistory, type);
  const consecutiveYield = consecutiveBtc/assetTargetBtcValue*100;
  const averageBtcValue = typeConsecutiveAverageBtc(tradeHistory, type);
  const averageYield = averageBtcValue/assetTargetBtcValue*100;
  if (consecutiveYield === 0) { // if this is the first trade in theis direction
    targetYield = averageYield/2;
  } else if (averageYield > consecutiveYield) {
    targetYield = averageYield - (consecutiveYield/2);
  } else { // consecutive is greatest, use that in case of flash crash or sky rocket
    targetYield = consecutiveYield/2;
  }
  targetYield = parseFloat(targetYield.toFixed(2));
  targetYield = Math.max(targetYield, spread/2);
// console.log(consecutiveBtc, consecutiveYield, averageBtcValue, averageYield, targetYield)
  return targetYield;
};
 /**
  * Description - gets number of recent consecutive trades of type
  */
export const lastConsecutiveBtc = (tradeHistory, type) => {
  let btc = 0;
  let consecutive = true;
  tradeHistory.forEach(trade => {
    if (trade.type !== type) {
      consecutive = false;
    } else {
      if (consecutive) btc = btc + trade.total;
    }
  });
  return btc;
};
/**
 * Description - gets average consecutive btcValue
 * if type is buys: buys/sells and if sells: sells/buys
 */
export const typeConsecutiveAverageBtc = (tradeHistory, type) => {
  let consecutiveRuns = [];
  let consecutiveBTC = 0;
  tradeHistory.forEach((trade) => {
    let push = false;
    if (trade.type === type) {
      consecutiveBTC = consecutiveBTC + trade.total;
    } else {
      push = true;
    }
    // if (index === tradeHistory.length-1) push = true; // don't include this in case first trade was buy-in
    if (push) {
      consecutiveRuns.push(consecutiveBTC);
      consecutiveBTC = 0;
    }
  });
  consecutiveRuns = consecutiveRuns.filter(int => int > 0);
  let average = 0;
  if (consecutiveRuns.length > 0) {
    average = consecutiveRuns.reduce((p,c) => p + c, 0) / consecutiveRuns.length;
  }
  return average;
};

export const typeFilter = (orders, type) => orders.filter(o => o.type === type);
export const typeReject = (orders, type) => orders.filter(o => o.type !== type);
