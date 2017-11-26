import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Pairs from '../components/Pairs';
// helpers
import * as ExchangeHelpers from '../helpers/ExchangeHelpers';
import * as PairHelpers from '../helpers/PairHelpers';

class PortfolioContainer extends React.Component {
  state = {
    portfolio: {}
  };

  componentDidMount() {
    this.populatePairs();
  }

  populatePairs() {
    const currencyCode = 'BTC';
    ExchangeHelpers.getBalances()
    .then( balances => {
      const assetCodes = Object.keys(balances);
      const pairCodes = assetCodes.map(assetCode => PairHelpers.getPair(assetCode, currencyCode));
      ExchangeHelpers.getTicker(pairCodes)
      .then( tickers => {
        const portfolio = {};
        let currencyBalance;
        Object.keys(balances).forEach((assetCode) => {
          const balance = balances[assetCode];
          const pairCode = PairHelpers.getPair(assetCode, currencyCode);
          const ticker = tickers[pairCode] ? tickers[pairCode] : {};
          let value;
          if (assetCode === currencyCode) {
            currencyBalance = balance;
            value = balance;
          } else {
            value = tickers[pairCode].last * balance;
            value = value.toFixed(8);
          }
          const currency = {
            code: currencyCode,
            currencyBalance
          };
          const asset = {
            code: assetCode,
            balance,
            value
          };
          let config = {
            constantValueTarget: 0.01,
            spreadPercent: 1,
            feePercent: 0.25
          };
          switch (assetCode) {
            case 'ETH': {
              config.constantValueTarget = 0.015;
              break;
            }
            case 'XRP': {
              config.constantValueTarget = 0.005;
              break;
            }
            default: {
              config.constantValueTarget = 0.01;
            }
          }
          portfolio[pairCode] = {
            currency,
            asset,
            config,
            ticker,
            orders: {}
          };
        });
        this.setState(
          { portfolio }
        );
      });
    });
  }

  render() {
    const _this = this;
    return (
      <Card>
        <CardHeader
          title='Portfolio'
          subtitle='Portfolio'
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={false}>
          <Pairs portfolio={this.state.portfolio} />
        </CardText>
        <CardActions>
          <RaisedButton fullWidth={true} label='Reload' onClick={()=>{_this.populatePairs()}} />
        </CardActions>
      </Card>
    );
  }
}

export default PortfolioContainer;
