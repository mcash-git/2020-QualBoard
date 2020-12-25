import React from 'react';
import PropTypes from 'prop-types';
import 'modules/_spinners.scss';

const RollingSpinner = ({
  color,
  display,
  margin,
  size,
  speed,
}) => {
  const spinnerStyle = {
    animation: `rotate ${speed || '0.8s'} infinite linear`,
    borderTopColor: color,
    borderLeftColor: color,
    borderBottomColor: color,
    borderRightColor: 'transparent',
    display,
    height: size,
    margin,
    width: size,
  };

  return (
    <div className="rolling-spinner" style={spinnerStyle} />
  );
};

RollingSpinner.propTypes = {
  size: PropTypes.string.isRequired,
  color: PropTypes.string,
  speed: PropTypes.string,
  display: PropTypes.string,
  margin: PropTypes.string,
};

RollingSpinner.defaultProps = {
  color: '#4A90E2',
  speed: '0.8s',
  display: '',
  margin: '',
};

export default RollingSpinner;
