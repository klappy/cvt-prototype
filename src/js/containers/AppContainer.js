import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import ReactInterval from 'react-interval';
import Authentication from '../components/Authentication';
import Currency from '../components/Currency';
// actions
import * as Actions from '../actions';

class AppContainer extends React.Component {

  componentDidMount() {
    this.updateReducers();
  }

  updateReducers() {
    this.props.actions.updateBalancesAndTicker();
  }

  render() {
    const refreshButton = (
      <IconButton onClick={() => { this.updateReducers() }}>
        <NavigationRefresh />
      </IconButton>
    );

    const authenticationButton = (
      <Authentication actions={this.props.actions} authentication={this.props.authentication} />
    );

    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Constant Value Target Trading"
            iconElementRight={refreshButton}
            iconElementLeft={authenticationButton}
          />
          <Currency
            currencyCode="BTC"
            actions={this.props.actions}
            authentication={this.props.authentication}
            assetSettings={this.props.assetSettings}
            balances={this.props.balances}
            tickers={this.props.tickers}
          />
          <ReactInterval timeout={10000} enabled={true} callback={() => { this.updateReducers() }} />
        </div>
      </MuiThemeProvider>
    );
  }
}

AppContainer.propTypes = {
  assetSettings: PropTypes.object.isRequired,
  authentication: PropTypes.object.isRequired,
  balances: PropTypes.object.isRequired,
  tickers: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  assetSettings: state.assetSettings,
  authentication: state.authentication,
  balances: state.balances,
  tickers: state.tickers
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
