import React from 'react';
import PropTypes from 'prop-types';
import CollapsibleSection from 'shared/components/collapsible-section/collapsible-section';
import DatePicker from 'shared/components/date-picker/date-picker';

const UploadDateFilters = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  timeZone,
  isExpanded,
  toggleExpand,
}) => {
  let badgeCount = 0;
  if (startDate) {
    badgeCount++;
  }
  if (endDate) {
    badgeCount++;
  }

  return (
    <CollapsibleSection
      isRequired={false}
      isOpen={isExpanded}
      badgeCount={badgeCount}
      title="Date Uploaded"
      toggleOpen={toggleExpand}
    >
      <div className="form-inline-custom">
        <span className="label">
          Filter by date uploaded:
        </span>
        <DatePicker
          value={startDate}
          timeZone={timeZone}
          onChange={setStartDate}
          placeholder="After..."
        />
        <span className="label">
          and:
        </span>
        <DatePicker
          value={endDate}
          timeZone={timeZone}
          onChange={setEndDate}
          placeholder="Before..."
        />
      </div>
    </CollapsibleSection>
  );
};

UploadDateFilters.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  setStartDate: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired,
  timeZone: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool,
  toggleExpand: PropTypes.func.isRequired,
};

UploadDateFilters.defaultProps = {
  startDate: null,
  endDate: null,
  isExpanded: false,
};

export default UploadDateFilters;
