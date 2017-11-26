import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import {
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const Pair = ({
  pair,
  ...otherProps
}) => {
  const percentChange = pair.ticker.percentChange ? (100 * parseFloat(pair.ticker.percentChange)).toFixed(2) + '%' : '';
  let signal = '';
  let targetDelta = pair.asset.value - pair.config.constantValueTarget;
  let targetBuyDelta = -pair.config.spreadPercent/2/100 * pair.asset.value;
  let targetSellDelta = pair.config.spreadPercent/2/100 * pair.asset.value;
  if (targetDelta > targetSellDelta && Math.abs(targetDelta) > 0.0001) signal = '-';
  if (targetDelta < targetBuyDelta && Math.abs(targetDelta) > 0.0001) signal = '+';

  const primary = signal === '-';
  const secondary = signal === '+';
  let button = <RaisedButton
    fullWidth={true}
    primary={primary}
    secondary={secondary}
    label={ signal + Math.abs(targetDelta).toFixed(5)}
  />;
  if (pair.asset.code === 'BTC') button = '';

  return (
    <TableRow {...otherProps} displayRowCheckBox={false}>
      {otherProps.children[0] /* checkbox passed down from Table-Body*/}
      <TableRowColumn>{pair.asset.code}</TableRowColumn>
      <TableRowColumn>{pair.asset.balance}</TableRowColumn>
      <TableRowColumn>{percentChange}</TableRowColumn>
      <TableRowColumn>{pair.asset.value}</TableRowColumn>
      <TableRowColumn>
        {button}
      </TableRowColumn>
    </TableRow>
  );
};

Pair.propTypes = {
  pair: PropTypes.object.isRequired
};

export default Pair;
