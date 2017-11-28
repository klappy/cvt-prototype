import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// components
import PortfolioContainer from './PortfolioContainer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import ReactInterval from 'react-interval';
import Authentication from '../components/Authentication';
// helpers
import * as ExchangeHelpers from '../helpers/ExchangeHelpers';
import * as PairHelpers from '../helpers/PairHelpers';
// actions
import * as Actions from '../actions';

class AppContainer extends React.Component {
  state = {
    portfolio: {}
  };

  componentDidMount() {
    this.populatePortfolio();
  }

  populatePortfolio() {
    const currencyCode = 'BTC';
    ExchangeHelpers.getBalances(this.props.authentication)
    .then( balances => {
      const assetCodes = Object.keys(balances);
      const pairCodes = assetCodes.map(assetCode => PairHelpers.getPair(assetCode, currencyCode));
      ExchangeHelpers.getTicker(this.props.authentication, pairCodes)
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
    const refreshButton = (
      <IconButton onClick={() => { this.populatePortfolio() }}>
        <NavigationRefresh />
      </IconButton>
    );

    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Constant Value Target Trading Strategy"
            iconElementRight={refreshButton}
          />
          <PortfolioContainer authentication={this.props.authentication} portfolio={this.state.portfolio} />
          <ReactInterval timeout={10000} enabled={true} callback={() => { this.populatePortfolio() }} />
          <Authentication actions={this.props.actions} authentication={this.props.authentication} />
        </div>
      </MuiThemeProvider>
    );
  }
}

AppContainer.propTypes = {
  authentication: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  authentication: state.authentication
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
