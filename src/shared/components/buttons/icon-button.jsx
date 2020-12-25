import React from 'react';
import PropTypes from 'prop-types';

const IconButton = ({
  action,
  btnClass,
  btnId,
  icon,
  prependText,
  appendText,
  disabled,
}) => (
  <button
    onClick={action}
    className={`icon-btn ${btnClass}`}
    id={btnId}
    disabled={disabled}
  >
    {prependText}
    <i className={icon} />
    {appendText}
  </button>);

IconButton.propTypes = {
  action: PropTypes.func.isRequired,
  btnClass: PropTypes.string,
  icon: PropTypes.string.isRequired,
  prependText: PropTypes.string,
  appendText: PropTypes.string,
  btnId: PropTypes.string,
  disabled: PropTypes.bool,
};

IconButton.defaultProps = {
  btnClass: '',
  prependText: '',
  appendText: '',
  btnId: null,
  disabled: false,
};

export default IconButton;
