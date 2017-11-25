import React from 'react';
import Assets from '../components/Assets';
import * as ExchangeHelpers from '../helpers/ExchangeHelpers';

class AssetsContainer extends React.Component {
  state = {
    assets: [
    ]
  };

  componentDidMount() {
    this.populateAssets();
  }

  populateAssets() {
    const _assets = [
      "BTC",
      "ETH",
      "XMR",
      "LTC",
      "XRP"
    ];
    const balances = ExchangeHelpers.getBalances(_assets);
    const assets = Object.keys(balances).map((name) => {
      return {
        name
      };
    });
    this.setState(
      {assets}
    );
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
