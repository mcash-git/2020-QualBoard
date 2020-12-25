import React from 'react';
import PropTypes from 'prop-types';
import TagSelectValue from './tag-select-value';

class TagSelectOption extends React.Component {
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
      option: tag,
    } = this.props;

    return (
      <button
        className={`${className} group-tag-option`}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        title={tag.name}
        disabled={isDisabled}
      >
        <TagSelectValue
          disabled
          id={`tag-select-option-tag ${tag.id}${tag.name}`}
          onRemove={() => {}}
          value={tag}
        />
      </button>
    );
  }
}

export default TagSelectOption;
