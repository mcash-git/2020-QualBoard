import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'shared/components/buttons/icon-button';
import Badge from 'shared/components/badges/badge';
import SelectAllDropdown from './select-all-dropdown';

const ParticipantMediaActionBar = ({
  toggleSidebar,
  selectedAssets,
  exportAssets,
  deleteAssets,
  isSidebarOpen,
  appliedFilterCount,
  currentPage,
  filteredAssetIds,
  allAssetIds,
  setSelectedAssets,
}) => {
  const actionsAreDisabled = !selectedAssets || selectedAssets.length === 0;
  const toggleClass = `filter-toggle-icon ${(isSidebarOpen ? 'icon-arrow_forward' : 'icon-filter_list')}`;
  const badge = (appliedFilterCount > 0 && !isSidebarOpen) ?
    <Badge number={appliedFilterCount} /> :
    null;
  const numVisible = (currentPage && currentPage.items && currentPage.items.length) || 0;

  return (
    <div className="media-action-bar-content">
      <div className="action-bar-container">
        <div className="action-bar-section">
          <SelectAllDropdown
            numSelected={selectedAssets.length}
            numVisible={numVisible}
            numFiltered={filteredAssetIds.length}
            numAll={allAssetIds.length}
            selectVisible={() => { selectVisible(setSelectedAssets, currentPage); }}
            selectFiltered={() => { setSelectedAssets({ selectedAssets: filteredAssetIds }); }}
            selectAll={() => { setSelectedAssets({ selectedAssets: allAssetIds }); }}
            deselectAll={() => { setSelectedAssets({ selectedAssets: [] }); }}
            appliedFilterCount={appliedFilterCount}
          />
        </div>
      </div>
      <div className="action-bar-container action-bar-right">
        <div className="media-action">
          <button
            className="btn btn-primary"
            disabled={actionsAreDisabled}
            onClick={exportAssets}
          >
            Download
          </button>
        </div>
        <div className="media-action">
          <IconButton
            icon="icon-delete"
            disabled={actionsAreDisabled}
            action={deleteAssets}
          />
        </div>
        <div className="media-action">
          <IconButton
            btnClass="toggle-filters-button"
            icon={toggleClass}
            action={toggleSidebar}
          />
          {badge}
        </div>
      </div>
    </div>
  );
};

ParticipantMediaActionBar.propTypes = {
  selectedAssets: PropTypes.arrayOf(PropTypes.string),
  exportAssets: PropTypes.func.isRequired,
  deleteAssets: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  setSelectedAssets: PropTypes.func.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  appliedFilterCount: PropTypes.number.isRequired,
  currentPage: PropTypes.object,
  filteredAssetIds: PropTypes.arrayOf(PropTypes.string),
  allAssetIds: PropTypes.arrayOf(PropTypes.string),
};

ParticipantMediaActionBar.defaultProps = {
  currentPage: null,
  selectedAssets: [],
  filteredAssetIds: [],
  allAssetIds: [],
};

export default ParticipantMediaActionBar;

function selectVisible(setSelectedAssets, currentPage) {
  setSelectedAssets({ selectedAssets: currentPage.items.map((a) => a.id) });
}
