import { handleActions } from 'redux-actions';

import setAllAssetIds from './reducers/set-all-asset-ids';
import setFetchStatus from '../misc/reducers/set-project-level-fetch-status';
import setFilteredAssetIds from './reducers/set-filtered-asset-ids';
import setCurrentPage from './reducers/set-current-page';
import setSelectedAssets from './reducers/set-selected-assets';
import toggleSelectAsset from './reducers/toggle-select-asset';

export default handleActions({
  PARTICIPANT_MEDIA: {
    SET_ALL_ASSET_IDS: setAllAssetIds,
    SET_CURRENT_PAGE: setCurrentPage,
    SET_FETCH_STATUS: setFetchStatus,
    SET_FILTERED_ASSET_IDS: setFilteredAssetIds,
    SET_SELECTED_ASSETS: setSelectedAssets,
    TOGGLE_SELECT_ASSET: toggleSelectAsset,
  },
}, {});
