import React from 'react';
import PropTypes from 'prop-types';
import Pair from './Pair';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow
} from 'material-ui/Table';

const Pairs = ({
  portfolio
}) => {
  const pairs = [];
  Object.keys(portfolio).forEach((pairCode, index) => {
    const pair = portfolio[pairCode];
    pairs.push(
      <Pair key={index} pair={pair} />
    );
  });

  return (
    <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Asset</TableHeaderColumn>
            <TableHeaderColumn>Balance</TableHeaderColumn>
            <TableHeaderColumn>24hr Change</TableHeaderColumn>
            <TableHeaderColumn>BTC Value</TableHeaderColumn>
            <TableHeaderColumn>Buy/Sell/Hold</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} showRowHover={true}>
          {pairs}
        </TableBody>
      </Table>
  );
};

Pairs.propTypes = {
  portfolio: PropTypes.object.isRequired
};

export default Pairs;
