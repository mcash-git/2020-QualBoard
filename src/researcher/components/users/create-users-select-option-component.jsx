import React from 'react';
import PropTypes from 'prop-types';

const createUsersSelectOptionComponent = (ValueComponent) => {
  class UsersSelectOption extends React.Component {
    static propTypes = {
      className: PropTypes.string.isRequired,
      isDisabled: PropTypes.bool,
      isFocused: PropTypes.bool,
      onFocus: PropTypes.func.isRequired,
      onSelect: PropTypes.func.isRequired,
      option: PropTypes.object.isRequired, // eslint-disable-line
    };

    static defaultProps = {
      isDisabled: false,
      isFocused: false,
    };

    handleMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.props.onSelect(this.props.option, event);
    };

    handleMouseEnter = (event) => {
      this.props.onFocus(this.props.option, event);
    };

    handleMouseMove = (event) => {
      if (this.props.isFocused) {
        return;
      }
      this.props.onFocus(this.props.option, event);
    };

    render() {
      const {
        className,
        isDisabled,
        option: user,
      } = this.props;

      return (
        <button
          className={`${className} users-select-option`}
          onMouseDown={this.handleMouseDown}
          onMouseEnter={this.handleMouseEnter}
          onMouseMove={this.handleMouseMove}
          title={user.displayName}
          disabled={isDisabled}
        >
          <ValueComponent
            disabled
            id={`tag-select-option-tag ${user.id}`}
            onRemove={() => {}}
            value={user}
          />
        </button>
      );
    }
  }
  return UsersSelectOption;
};

export default createUsersSelectOptionComponent;
