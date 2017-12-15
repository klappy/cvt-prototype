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
  const ratio = typeRatio(tradeHistory, type);
  let targetYield = spread/2 * ratio + consecutive;
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
    } else {
      consecutive = false;
    }
  });
  return count;
};
/**
 * Description - gets ratio of history types
 * if type is buys: buys/sells and if sells: sells/buys
 */
export const typeRatio = (tradeHistory, type) => {
  const tradesOfType = typeFilter(tradeHistory, type);
  const tradesOfOtherType = typeReject(tradeHistory, type);
  const ratio = (tradesOfOtherType.length !== 0) ? tradesOfType.length/tradesOfOtherType.length : 1;
  return ratio;
};

export const typeFilter = (orders, type) => orders.filter(o => o.type === type);
export const typeReject = (orders, type) => orders.filter(o => o.type !== type);
