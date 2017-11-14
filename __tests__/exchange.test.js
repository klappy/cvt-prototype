// import cvt from '../src/cvt/ticker.js';
import Exchanges from 'crypto-exchange';
import fs from 'fs-extra';

const auth = fs.readJSONSync('auth.json');
const poloniex = new Exchanges.poloniex(auth);

const asset = 'XMR';
const pair = asset + '_BTC';

describe('ticker', () => {
  it('should return object with expected keys', function (done) {
    poloniex.ticker(pair).then(result => {
      console.log(result);
      const expected = ['last', 'ask', 'bid', 'high', 'low', 'volume', 'timestamp'];
      expect(Object.keys(result[pair])).toEqual(expected);
      done();
    });
  });
});

describe('balances', () => {
  it('should return object with expected keys', function (done) {
    poloniex.balances().then(result => {
      const balance = result[asset];
      console.log(balance);
      const expected = ['balance', 'available', 'pending'];
      expect(Object.keys(balance)).toEqual(expected);
      done();
    });
  });
});
