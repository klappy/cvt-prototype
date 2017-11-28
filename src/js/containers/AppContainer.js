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
    console.log(this.props.balances, this.props.ticker, this.props.portfolio)

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
            title="Constant Value Target Trading Strategy"
            iconElementRight={refreshButton}
            iconElementLeft={authenticationButton}
          />
          <PortfolioContainer authentication={this.props.authentication} portfolio={this.props.portfolio} />
          <ReactInterval timeout={10000} enabled={true} callback={() => { this.updateReducers() }} />
        </div>
      </MuiThemeProvider>
    );
  }
}

AppContainer.propTypes = {
  authentication: PropTypes.object.isRequired,
  balances: PropTypes.object.isRequired,
  portfolio: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  authentication: state.authentication,
  balances: state.balances,
  portfolio: state.portfolio,
  ticker: state.ticker
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
