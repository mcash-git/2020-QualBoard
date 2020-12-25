import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MediaClient } from '2020-media';
import { DialogService } from 'aurelia-dialog';
import participantMediaCurrentPageSelector from 'researcher/state/participant-media/selectors/participant-media-current-page-selector';
import participantMediaFetchStatusSelector from 'researcher/state/participant-media/selectors/participant-media-fetch-status-selector';
import projectUsersFetchStatusSelector from 'researcher/state/project-users/selectors/project-users-fetch-status-selector';
import participantMediaAppliedFiltersSelector from 'researcher/state/participant-media-applied-filters/selectors/participant-media-applied-filters-selector';
import participantMediaAllAssetIdsSelector from 'researcher/state/participant-media/selectors/participant-media-all-asset-ids-selector';
import participantMediaSelectedAssetsSelector from 'researcher/state/participant-media/selectors/participant-media-selected-assets-selector';
import currentUserSelector from 'shared/state/current-user/selectors/current-user-selector';
import { actions } from 'researcher/state/all-actions';
import { combineFetchStatuses, fetchStatuses } from 'shared/enums/fetch-statuses';
import InfiniteProgressBar from 'shared/components/progress/infinite-progress-bar';
import { ViewState } from 'shared/app-state/view-state';
import { ParticipantMedia } from './participant-media';

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    currentPage: PropTypes.object,
    appliedFilters: PropTypes.object,
    fetchStatus: PropTypes.string.isRequired,
    currentUserTimeZone: PropTypes.string.isRequired,
    fetchParticipantMedia: PropTypes.func.isRequired,
    toggleSelectAsset: PropTypes.func.isRequired,
    setSelectedAssets: PropTypes.func.isRequired,
    setDefaultFilters: PropTypes.func.isRequired,
    selectPage: PropTypes.func.isRequired,
    selectedAssets: PropTypes.arrayOf(PropTypes.string),
    mediaClient: PropTypes.instanceOf(MediaClient).isRequired,
    viewState: PropTypes.instanceOf(ViewState).isRequired,
    dialogService: PropTypes.instanceOf(DialogService).isRequired,
    allAssetIds: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    currentPage: null,
    appliedFilters: null,
    selectedAssets: [],
    allAssetIds: [],
  };

  constructor(props) {
    super(props);

    this.setInitialState(props);

    const {
      mediaClient,
      viewState,
      dialogService,
    } = props;

    this.mediaClient = mediaClient;
    this.dialogService = dialogService;
    this.viewState = viewState;
    this.childViewState = viewState.childStateStack.current;
  }

  componentWillMount() {
    const { projectId } = this.props;

    this.childViewState.actionBarModel.viewModel = 'researcher/project/media/participant/action-bar/participant-media-action-bar-wrapper';
    this.childViewState.sidebarViewModel = 'researcher/project/media/participant/sidebar/participant-media-sidebar-wrapper';

    if (!this.props.appliedFilters) {
      this.props.setDefaultFilters({ projectId });
    } else {
      // ^ this setting of filters dispatches a fetch
      this.props.fetchParticipantMedia({ projectId });
    }

    this.props.setSelectedAssets({ projectId, selectedAssets: [] });
  }

  setInitialState() {
    this.state = {
      fetchStatus: fetchStatuses.pending,
      pageNumber: 1,
      selectPage: (page) => this.props.selectPage({ projectId: this.props.projectId, page }),
      viewAsset: (asset) => this.viewAsset(asset),
      exportAssets: (assets) => this.exportAssets(assets),
      downloadAsset: (asset) => this.downloadAsset(asset),
      deleteAsset: (asset) => this.deleteAsset(asset),
    };
  }

  viewAsset(asset) {
    this.viewState.openModal('shared/media/asset-modal', { asset, canEdit: false });
  }

  downloadAsset(asset) {
    this.mediaClient.downloadAsset(asset.id);
  }

  deleteAsset(asset) {
    this.dialogService.open({
      viewModel: 'shared/components/confirmation-modal',
      model: {
        text: 'Are you sure you want to delete this media from the system?',
        title: 'Delete Confirmation',
        confirmButtonClass: 'btn-danger',
        confirmButtonText: 'Delete',
        cancelButtonClass: 'btn-outline-secondary',
      },
    }).whenClosed(result => {
      if (result.wasCancelled) {
        return;
      }

      this.mediaClient.deleteAsset(asset.id);

      setTimeout(() => {
        this.props.selectPage({
          projectId: this.props.projectId,
          page: this.props.currentPage.currentPage,
        });
      }, 150);
    });
  }

  render() {
    // This is done because hiding the current page's media items while showing the
    // infinite progress bar each time you paginate or change filters did not feel right.
    // So we show the items if we have them, but also show the progress bar when we are loading.
    const children = [];
    if (this.props.fetchStatus === fetchStatuses.pending) {
      children.push(<InfiniteProgressBar key="infinite-progress-bar" width="100%" height="5px" />);
    }

    if (this.props.fetchStatus === fetchStatuses.failure) {
      return 'FAILURE';
    }

    if (this.props.currentPage) {
      const participantMedia = (
        <ParticipantMedia
          key="participant-media"
          currentPage={this.props.currentPage}
          selectedAssets={this.props.selectedAssets}
          selectPage={this.state.selectPage}
          toggleSelectAsset={this.props.toggleSelectAsset}
          viewAsset={this.state.viewAsset}
          downloadAsset={this.state.downloadAsset}
          exportAssets={this.state.exportAssets}
          deleteAsset={this.state.deleteAsset}
          currentUserTimeZone={this.props.currentUserTimeZone}
          projectHasMedia={this.props.allAssetIds.length > 0}
        />
      );
      children.push(participantMedia);
    }

    return <div>{children}</div>;
  }
}

function mapStateToProps(state) {
  return {
    currentUserTimeZone: currentUserSelector(state).timeZone,
    currentPage: participantMediaCurrentPageSelector(state),
    fetchStatus: combineFetchStatuses([
      participantMediaFetchStatusSelector(state),
      projectUsersFetchStatusSelector(state),
    ]),
    appliedFilters: participantMediaAppliedFiltersSelector(state),
    selectedAssets: participantMediaSelectedAssetsSelector(state),
    allAssetIds: participantMediaAllAssetIdsSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchParticipantMedia:
      ({ projectId }) => dispatch(actions.participantMedia.fetch({ projectId })),
    setDefaultFilters:
      ({ projectId }) => dispatch(actions.participantMediaAppliedFilters.setDefault({ projectId })),
    selectPage:
      ({ projectId, page }) => dispatch(actions.participantMediaAppliedFilters.setPage({
        projectId,
        page,
      })),
    toggleSelectAsset:
      ({ assetId }) => dispatch(actions.participantMedia.toggleSelectAsset({ assetId })),
    setSelectedAssets:
      ({ projectId, selectedAssets }) => dispatch(actions.participantMedia.setSelectedAssets({
        projectId,
        selectedAssets,
      })),
  };
}
