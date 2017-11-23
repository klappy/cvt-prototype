// import cvt from '../src/cvt/ticker.js';
import * as cvt from '../cvt/index';

const asset = 'XMR';
const currency = 'BTC';


describe('getNextBuy', () => {
 it('should return boolean', () => {
   const nextBuy = nextBuy
   expect(buySignal).toEqual(expected);
 });
});

describe('getBuyPrice', () => {
  it('should return a number', () => {
    const targetValue = 10;
    const assetBalance = 5;
    const percent = 0.01;
    const buyPrice = cvt.getBuyPrice(targetValue, assetBalance, percent);
    const expected = 1.98;
    expect(buyPrice).toEqual(expected);
  });
});

describe('getSellPrice', () => {
  it('should return a number', () => {
    const targetValue = 10;
    const assetBalance = 5;
    const percent = 0.01;
    const sellPrice = cvt.getSellPrice(targetValue, assetBalance, percent);
    const expected = 2.02;
    expect(sellPrice).toEqual(expected);
  });
});

describe('getTargetPrice', () => {
  it('should return a number', () => {
    const targetValue = 10;
    const assetBalance = 5;
    const targetPrice = cvt.getTargetPrice(targetValue, assetBalance);
    const expected = 2;
    expect(targetPrice).toEqual(expected);
  });
});

describe('getTicker', () => {
  it('should return object with expected keys', (done) => {
    cvt.getTicker(asset, currency)
    .then(ticker => {
      const expected = ['last', 'ask', 'bid', 'high', 'low', 'volume', 'timestamp'];
      expect(Object.keys(ticker)).toEqual(expected);
      done();
    });
  });
});

describe('getBalance', () => {
  it('should return object with expected keys', (done) => {
    cvt.getBalance(asset)
    .then(balance => {
      const expected = ['balance', 'available', 'pending'];
      expect(Object.keys(balance)).toEqual(expected);
      done();
    });
  });
});

describe('getAssetValues', () => {
  it('should return object with expected keys', (done) => {
    cvt.getAssetValues(asset, currency)
    .then(ticker => {
      const expected = ['last', 'ask', 'bid', 'high', 'low'];
      expect(Object.keys(ticker)).toEqual(expected);
      done();
    });
  });
});
