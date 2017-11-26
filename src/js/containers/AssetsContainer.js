import React from 'react';
import Assets from '../components/Assets';
import * as ExchangeHelpers from '../helpers/ExchangeHelpers';
import * as PairHelpers from '../helpers/PairHelpers';

class AssetsContainer extends React.Component {
  state = {
    assets: [
    ]
  };

  componentDidMount() {
  }

  populateAssets() {
    const currency = 'BTC';
    ExchangeHelpers.getBalances()
    .then( balances => {
      const assetNames = Object.keys(balances);
      const pairs = assetNames.map(name => PairHelpers.getPair(name, currency));
      ExchangeHelpers.getTicker(pairs)
      .then( ticker => {
        const assets = Object.keys(balances).map((name) => {
          const pair = PairHelpers.getPair(name, currency);
          const balance = balances[name];
          const value = (ticker[pair]) ? ticker[pair].last * balance : balance;
          return {
            name,
            balance,
            value
          };
        });
        this.setState(
          {assets}
        );
      });
    });
  }

  render() {
    return (
      <div>
        <p>Assets</p>
        <Assets assets={this.state.assets} />
      </div>
    );
  }
}

export default AssetsContainer;
