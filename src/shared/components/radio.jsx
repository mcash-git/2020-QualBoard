import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Radio extends React.Component {
  static propTypes = {
    changeHandler: PropTypes.func,
    isChecked: PropTypes.bool,
    isIndeterminate: PropTypes.bool,
    isDisabled: PropTypes.bool,
    radioId: PropTypes.string,
    labelText: PropTypes.string,
  };

  static defaultProps = {
    isChecked: false,
    radioId: undefined,
    labelText: undefined,
    isDisabled: undefined,
    isIndeterminate: undefined,
    changeHandler: undefined,
  };

  componentDidMount() {
    this.el.indeterminate = this.props.isIndeterminate;
  }

  componentDidUpdate({ isIndeterminate: wasIndeterminate }) {
    if (wasIndeterminate !== this.props.isIndeterminate) {
      this.el.indeterminate = this.props.isIndeterminate;
    }
  }

  render() {
    const {
      changeHandler,
      isChecked,
      isIndeterminate,
      isDisabled,
      radioId,
      labelText,
    } = this.props;

    const className = classNames({
      'custom-control-input': true,
      'read-only': !changeHandler,
    });

    const label = (labelText) ?
      <span className="custom-control-description"><span>{labelText}</span></span> :
      null;

    return (
      <label
        className="custom-control custom-radio"
        htmlFor={radioId}
      >
        <input
          className={className}
          type="radio"
          checked={isChecked && !isIndeterminate}
          onChange={(changeHandler) ?
            (changeEvent) => { changeHandler(changeEvent.target.selected); } :
            undefined}
          id={radioId}
          disabled={isDisabled}
          ref={(el) => { this.el = el; }}
        />
        <span className="custom-control-indicator" />
        {label}
      </label>
    );
  }
}

export default Radio;
