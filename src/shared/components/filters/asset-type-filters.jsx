import React from 'react';
import PropTypes from 'prop-types';
import CollapsibleSection from 'shared/components/collapsible-section/collapsible-section';
import Checkbox from '../checkbox';

const AssetTypeFilters = ({
  selectedAssetTypes,
  availableAssetTypes,
  toggleSelectAssetType,
  isExpanded,
  toggleExpand,
}) => {
  const badgeCount = selectedAssetTypes.length;

  return (
    <CollapsibleSection
      isRequired={false}
      isOpen={isExpanded}
      badgeCount={badgeCount}
      title="Media Types"
      toggleOpen={toggleExpand}
    >
      <div className="form-inline-custom">
        {availableAssetTypes.map((type) => (
          <Checkbox
            key={`asset-type-${type.int}-checkbox`}
            changeHandler={() => toggleSelectAssetType(type.int)}
            isChecked={selectedAssetTypes.indexOf(type.int) !== -1}
            labelText={type.friendly}
          />
        ))}
      </div>
    </CollapsibleSection>
  );
};

AssetTypeFilters.propTypes = {
  selectedAssetTypes: PropTypes.arrayOf(PropTypes.number).isRequired,
  availableAssetTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleSelectAssetType: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool,
  toggleExpand: PropTypes.func.isRequired,
};

AssetTypeFilters.defaultProps = {
  isExpanded: false,
};

export default AssetTypeFilters;
