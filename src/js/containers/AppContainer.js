import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// components
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import ReactInterval from 'react-interval';
import Authentication from '../components/Authentication';
import Currency from '../components/Currency';
import ApplicationSettings from '../components/ApplicationSettings';
// actions
import * as Actions from '../actions';

class AppContainer extends React.Component {

  updateOrdersAndTrades() {
    this.props.actions.updateOrdersAndTrades();
  }

  updateBalancesAndTickers() {
    this.props.actions.updateBalancesAndTickers();
  }

  render() {
    const authenticationButton = (
      <Authentication actions={this.props.actions} authentication={this.props.authentication} />
    );
    const applicationSettingsButton = (
      <ApplicationSettings actions={this.props.actions} applicationSettings={this.props.applicationSettings} />
    );

    let {balances, tickers} = this.props;

    let assetsOfCurrencies = {};
    Object.keys(tickers).forEach(pairCode => {
      const currencyCode = pairCode.split('_')[0];
      const assetCode = pairCode.split('_')[1];
      if (currencyCode === 'BTC' && balances[currencyCode]) {
        if (!assetsOfCurrencies[currencyCode]) assetsOfCurrencies[currencyCode] = [];
        if (balances[assetCode] && balances[assetCode].available > 0) assetsOfCurrencies[currencyCode].push(assetCode);
      }
    });

    let currencies = [];
    Object.keys(assetsOfCurrencies).forEach(currencyCode => {
      const assetCodes = assetsOfCurrencies[currencyCode];
      currencies.push(<Currency key={currencyCode}
        currencyCode={currencyCode}
        applicationSettings={this.props.applicationSettings}
        assetCodes={assetCodes}
        actions={this.props.actions}
        authentication={this.props.authentication}
        assetSettings={this.props.assetSettings}
        balances={this.props.balances}
        tickers={this.props.tickers}
        tradeHistories={this.props.tradeHistories}
        openOrders={this.props.openOrders}
      />);
    });

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div>
          <AppBar
            title="Proactive Response Trader"
            iconElementLeft={authenticationButton}
            iconElementRight={applicationSettingsButton}
          />
          {currencies}
          <ReactInterval timeout={5000} enabled={true} callback={() => { this.updateBalancesAndTickers() }} />
          <ReactInterval timeout={7000} enabled={true} callback={() => { this.updateOrdersAndTrades() }} />
        </div>
      </MuiThemeProvider>
    );
  }
}

AppContainer.propTypes = {
  assetSettings: PropTypes.object.isRequired,
  authentication: PropTypes.object.isRequired,
  balances: PropTypes.object.isRequired,
  applicationSettings: PropTypes.object.isRequired,
  tickers: PropTypes.object.isRequired,
  tradeHistories: PropTypes.object.isRequired,
  openOrders: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  assetSettings: state.assetSettings,
  authentication: state.authentication,
  balances: state.balances,
  applicationSettings: state.applicationSettings,
  tickers: state.tickers,
  tradeHistories: state.tradeHistories,
  openOrders: state.openOrders
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
