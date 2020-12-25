import React from 'react';
import PropTypes from 'prop-types';
import Flatpickr from 'react-flatpickr';
import moment from 'moment-timezone';

const flatpickrOptions = {
  wrap: true,
  allowInput: true,
  dateFormat: 'n/j/Y',
};

const DatePicker = ({
  value,
  onChange,
  timeZone,
  placeholder,
}) => {
  const handleFlatpickrChange = (dateArr) => {
    const mom = moment.tz(dateArr[0], timeZone);
    const dateStr = (dateArr.length === 0 || !mom.isValid()) ?
      null :
      mom.format();

    onChange(dateStr);
  };

  const mom = moment.tz(value, timeZone);

  const flatpickrValue = (mom.isValid()) ?
    mom.toDate() :
    null;

  return (
    <Flatpickr
      className="form-group input-button-group input-group date date-picker"
      onChange={handleFlatpickrChange}
      options={flatpickrOptions}
      value={flatpickrValue}
    >
      <input
        className="form-control"
        data-input
        placeholder={placeholder}
      />
      <button className="input-group-addon" type="toggle" data-toggle>
        <i className="icon-ion-calendar" />
      </button>
      <button className="input-group-addon" type="clear" data-clear>
        <i className="icon-close" />
      </button>
    </Flatpickr>
  );
};

DatePicker.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  timeZone: PropTypes.string.isRequired,
};

DatePicker.defaultProps = {
  value: null,
  placeholder: null,
};

export default DatePicker;
