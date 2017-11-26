// import cvt from '../src/cvt/ticker.js';
import plnx from 'plnx';
import fs from 'fs-extra';

const auth = fs.readJSONSync('auth.json');

const asset = 'XMR';
const pair = 'BTC_' + asset;

describe('ticker', () => {
  it('should return object with expected keys', function (done) {
    plnx.returnTicker(auth).then(result => {
      console.log(result[pair]);
      const expected = ['id', 'last', 'lowestAsk', 'highestBid', 'percentChange', 'baseVolume', 'quoteVolume', 'isFrozen', 'high24hr', 'low24hr'];
      expect(Object.keys(result[pair])).toEqual(expected);
      done();
    });
  });
});

describe('balances', () => {
  it('should return object with expected keys', function (done) {
    plnx.returnBalances(auth).then(result => {
      const balance = result[asset];
      console.log(balance);
      expect(parseInt(balance)).toBeGreaterThanOrEqual(0);
      done();
    });
  });
});
