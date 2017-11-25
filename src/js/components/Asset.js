import React from 'react';
import PropTypes from 'prop-types';

const Asset = ({
  asset
}) => {
  return (
    <div style={{}}>
      {asset.name}
    </div>
  );
};

Asset.propTypes = {
  asset: PropTypes.object.isRequired
};

export default Asset;
