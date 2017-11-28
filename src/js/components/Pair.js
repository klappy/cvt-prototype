import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
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
  if (targetDelta >= targetSellDelta && Math.abs(targetDelta) >= 0.0001) signal = '-';
  if (targetDelta <= targetBuyDelta && Math.abs(targetDelta) >= 0.0001) signal = '+';

  const primary = signal === '-';
  const secondary = signal === '+';
  let button = <RaisedButton
    fullWidth={true}
    primary={primary}
    secondary={secondary}
    label={ signal + Math.abs(targetDelta).toFixed(5)}
  />;
  if (pair.asset.code === 'BTC') button = '';

  const percentToTrade = Math.abs(targetDelta)/0.0001*100;

  return (
    <TableRow {...otherProps}>
      {otherProps.children[0] /* checkbox passed down from Table-Body*/}
      <TableRowColumn>{pair.asset.code}</TableRowColumn>
      <TableRowColumn>{parseFloat(pair.asset.value).toFixed(5)}</TableRowColumn>
      <TableRowColumn>
        {button}
        <LinearProgress mode="determinate" value={percentToTrade} />
      </TableRowColumn>
    </TableRow>
  );
};

Pair.propTypes = {
  pair: PropTypes.object.isRequired
};

export default Pair;
