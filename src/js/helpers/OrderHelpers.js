// import moment from 'moment';
/**
 * Description - adjust spread for the following conditions
 * increase for consecutive of the same type
 * multiply by ratio of order types
 * number of hours since last trade
 * dont let go too low, minimum trade size
 */
export const targetYield = (spread, type, tradeHistory) => {
  const consecutive = lastConsecutive(tradeHistory, type);
  const average = typeConsecutiveAverage(tradeHistory, type);
  let targetYield = spread/2 + (average - consecutive);
  targetYield = parseFloat(targetYield.toFixed(2));
  targetYield = Math.max(targetYield, 2);
  return targetYield;
};
 /**
  * Description - gets number of recent consecutive trades of type
  */
export const lastConsecutive = (tradeHistory, type) => {
  let count = 0;
  let consecutive = true;
  tradeHistory.forEach(trade => {
    if (consecutive && trade.type === type) {
      count ++;
    }
    if (trade.type === type) {
      consecutive = true;
    } else {
      consecutive = false;
    }
  });
  return count;
};
/**
 * Description - gets average consecutive
 * if type is buys: buys/sells and if sells: sells/buys
 */
export const typeConsecutiveAverage = (tradeHistory, type) => {
  let consecutiveRuns = [];
  let consecutiveRun = 0;
  tradeHistory.forEach((trade, index) => {
    let push = false;
    if (trade.type === type) {
      consecutiveRun ++;
    } else {
      push = true;
    }
    if (index === tradeHistory.length-1) push = true;
    if (push) consecutiveRuns.push(consecutiveRun);
  });
  consecutiveRuns = consecutiveRuns.filter(int => int > 0);
  const average = consecutiveRuns.reduce((p,c) => p + c, 0) / consecutiveRuns.length;
  return average;
};

export const typeFilter = (orders, type) => orders.filter(o => o.type === type);
export const typeReject = (orders, type) => orders.filter(o => o.type !== type);
