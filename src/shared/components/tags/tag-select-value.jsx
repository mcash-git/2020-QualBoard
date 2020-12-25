import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '../buttons/icon-button';

const TagSelectValue = ({
  disabled,
  id: elId,
  onRemove,
  // onClick,
  value,
}) => {
  const { name, color } = value;
  const removeButton = (disabled) ?
    null :
    (
      <IconButton
        action={() => { onRemove(value); }}
        icon="icon-close"
        btnClass="group-tag-remove-button"
      />
    );
  return (
    <div className="group-tag" id={elId}>
      <div className="group-tag-color">
        <i
          style={{ color }}
          className="icon-label"
        />
      </div>
      <div className="group-tag-name">
        {name}
      </div>
      {removeButton}
    </div>
  );
};

TagSelectValue.propTypes = {
  disabled: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  // onClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  value: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
};

export default TagSelectValue;
