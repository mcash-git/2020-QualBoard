import React from 'react';
import PropTypes from 'prop-types';

export const DefaultContent = ({ iconClass, message }) => (
  <div className="default-content">
    <div>
      <i className={`${iconClass} default-content-icon`} />
    </div>
    <div className="default-content-text">
      {message}
    </div>
  </div>
);

DefaultContent.propTypes = {
  iconClass: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
