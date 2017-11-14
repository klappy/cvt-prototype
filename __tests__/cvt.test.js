// import cvt from '../src/cvt/ticker.js';
import * as cvt from '../cvt/index';


const asset = 'XMR';
const currency = 'BTC';

describe('getTicker', () => {
  it('should return object with expected keys', function (done) {
    cvt.getTicker(asset, currency)
    .then(ticker => {
      console.log(ticker);
      const expected = ['last', 'ask', 'bid', 'high', 'low', 'volume', 'timestamp'];
      expect(Object.keys(ticker)).toEqual(expected);
      done();
    });
  });
});

describe('getBalance', () => {
  it('should return object with expected keys', function (done) {
    cvt.getBalance(asset)
    .then(balance => {
      console.log(balance);
      const expected = ['balance', 'available', 'pending'];
      expect(Object.keys(balance)).toEqual(expected);
      done();
    });
  });
});

describe('getAssetValues', () => {
  it('should return object with expected keys', function (done) {
    cvt.getAssetValues(asset, currency)
    .then(ticker => {
      console.log(ticker);
      const expected = ['last', 'ask', 'bid', 'high', 'low'];
      expect(Object.keys(ticker)).toEqual(expected);
      done();
    });
  });
});
