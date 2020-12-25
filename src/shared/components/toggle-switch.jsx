import React from 'react';
import PropTypes from 'prop-types';
import 'modules/toggle-switch.scss';

class ToggleSwitch extends React.Component {
  static propTypes = {
    changeHandler: PropTypes.func,
    isChecked: PropTypes.bool,
    isIndeterminate: PropTypes.bool,
    isDisabled: PropTypes.bool,
    checkboxId: PropTypes.string,
  };

  static defaultProps = {
    isChecked: false,
    checkboxId: undefined,
    isDisabled: undefined,
    isIndeterminate: undefined,
    changeHandler: undefined,
  };

  componentDidMount() {
    this.el.indeterminate = this.props.isIndeterminate;
  }

  componentDidUpdate({ isIndeterminate: wasIndeterminate}) {
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
      checkboxId
    } = this.props;

    return (
      <div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={isChecked && !isIndeterminate}
            onChange={(changeHandler) ?
              (changeEvent) => { changeHandler(changeEvent.target.checked); } :
              undefined}
            id={checkboxId}
            disabled={isDisabled}
            ref={(el) => { this.el = el; }}
           />
          <span className="new-slider round"></span>
        </label>
      </div>
    );
  }
}

export default ToggleSwitch;
