import React from 'react';
import PropTypes from 'prop-types';
import { enums } from '2020-qb4';
import 'modules/prompts/_prompt-icon.scss';

const PromptTypes = enums.promptTypes;

const PromptIcon = ({ type, size }) => {
  const iconClass = (PromptTypes[type] || {}).newIcon;

  const iconStyle = {
    fontSize: size,
  };

  return (
    <div className="prompt-icon-wrapper" style={iconStyle}>
      <i className={`icon ${iconClass}`} />
    </div>);
};

PromptIcon.propTypes = {
  type: PropTypes.number.isRequired,
  size: PropTypes.string,
};

PromptIcon.defaultProps = {
  size: '30px',
};

export default PromptIcon;
