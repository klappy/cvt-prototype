import React from 'react';
import PropTypes from 'prop-types';

const Asset = ({
  asset
}) => {
  return (
    <div style={{}}>
      name: {asset.name}, balance: {asset.balance}, value: {asset.value}
    </div>
  );
};

Asset.propTypes = {
  asset: PropTypes.object.isRequired
};

export default Asset;
