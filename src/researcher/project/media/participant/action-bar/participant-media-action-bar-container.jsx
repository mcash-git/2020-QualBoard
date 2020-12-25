import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DialogService } from 'aurelia-dialog';
import { MediaClient } from '2020-media';
import { ViewState } from 'shared/app-state/view-state';
import { actions } from 'researcher/state/all-actions';
import participantMediaSelectedAssetsSelector from 'researcher/state/participant-media/selectors/participant-media-selected-assets-selector';
import participantMediaCurrentPageSelector from 'researcher/state/participant-media/selectors/participant-media-current-page-selector';
import participantMediaAllAssetIdsSelector from 'researcher/state/participant-media/selectors/participant-media-all-asset-ids-selector';
import participantMediaFilteredAssetIdsSelector from 'researcher/state/participant-media/selectors/participant-media-filtered-asset-ids-selector';
import participantMediaAppliedFilterCountSelector from 'researcher/state/participant-media-applied-filters/selectors/participant-media-applied-filters-count-selector';
import ParticipantMediaActionBar from './participant-media-action-bar';
import { growlProvider } from '../../../../../shared/growl-provider';

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.Component {
  static propTypes = {
    projectName: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    selectPage: PropTypes.func.isRequired,
    setSelectedAssets: PropTypes.func.isRequired,
    fetchAllAssetIds: PropTypes.func.isRequired,
    selectedAssets: PropTypes.arrayOf(PropTypes.string),
    growlProvider: PropTypes.object.isRequired,
    dialogService: PropTypes.instanceOf(DialogService).isRequired,
    mediaClient: PropTypes.instanceOf(MediaClient).isRequired,
    viewState: PropTypes.instanceOf(ViewState).isRequired,
    currentPage: PropTypes.object,
    appliedFilterCount: PropTypes.number.isRequired,
    filteredAssetIds: PropTypes.arrayOf(PropTypes.string),
    allAssetIds: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    currentPage: null,
    selectedAssets: [],
    filteredAssetIds: [],
    allAssetIds: [],
  };

  constructor(props) {
    super(props);

    const {
      dialogService,
      growlProvider,
      mediaClient,
      viewState,
    } = props;

    this.dialogService = dialogService;
    this.growlProvider = growlProvider;
    this.mediaClient = mediaClient;
    this.viewState = viewState;
    this.state = {
      isSidebarOpen: viewState.childStateStack.current.sidebarOpen,
    };
  }

  componentWillMount() {
    this.props.fetchAllAssetIds({ projectId: this.props.projectId });
  }

  exportAssets() {
    if (this.props.selectedAssets.length === 0) {
      return;
    }

    this.dialogService.open({
      viewModel: 'shared/media/text-prompt-modal',
      model: {
        title: 'Export Media',
        body: 'Name Your Export',
        placeholderText: 'File Name',
        defaultValue: `${this.props.projectName} - QualBoard Media`,
      },
    }).whenClosed(async modalResult => {
      if (modalResult.wasCancelled) {
        return;
      }

      const success = await this.mediaClient.exportAssets({
        assetIds: this.props.selectedAssets,
        fileName: modalResult.output,
      });

      if (success) {
        this.growlProvider.success('Export Started', 'When your export is finished, it will be available in the downloads icon of the title bar.');
      } else {
        this.growlProvider.error('Error', 'There was an error processing your export request; please try again.  If the problem persists, contact support.');
      }
    });
  }

  deleteAssets() {
    const { selectedAssets, currentPage } = this.props;
    if (selectedAssets.length === 0) {
      return;
    }

    const notVisibleCount =
      selectedAssets.filter((id) => currentPage.items.every((asset) => asset.id !== id)).length;

    this.dialogService.open({
      viewModel: 'shared/components/confirmation-modal',
      model: {
        text: `Are you sure you want to delete these ${this.props.selectedAssets.length} files${notVisibleCount > 0 ? ` (including ${notVisibleCount} not currently visible)` : ''} from the system?`,
        title: 'Delete Confirmation',
        confirmButtonClass: 'btn-danger',
        confirmButtonText: 'Delete',
        cancelButtonClass: 'btn-outline-secondary',
      },
    }).whenClosed(async result => {
      if (result.wasCancelled) {
        return;
      }

      const success = await this.mediaClient.deleteAssets(this.props.selectedAssets);
      if (!success) {
        this.growlProvider.warning('Error', 'There was an error deleting your media. Please try again; if the problem persists, contact support.');
        return;
      }

      setTimeout(() => {
        this.props.selectPage({
          projectId: this.props.projectId,
          page: this.props.currentPage.currentPage,
        });
        this.props.setSelectedAssets({ projectId: this.props.projectId, selectedAssets: [] });
      }, 150);
    });
  }

  toggleSidebar() {
    const childState = this.viewState.childStateStack.current;
    childState.sidebarOpen = !childState.sidebarOpen;
    this.setState({
      isSidebarOpen: childState.sidebarOpen,
    });
  }

  render() {
    return (
      <ParticipantMediaActionBar
        selectedAssets={this.props.selectedAssets}
        appliedFilterCount={this.props.appliedFilterCount}
        exportAssets={() => this.exportAssets()}
        toggleSidebar={() => this.toggleSidebar()}
        deleteAssets={() => this.deleteAssets()}
        isSidebarOpen={this.state.isSidebarOpen}
        currentPage={this.props.currentPage}
        filteredAssetIds={this.props.filteredAssetIds}
        allAssetIds={this.props.allAssetIds}
        setSelectedAssets={({ selectedAssets }) => this.props.setSelectedAssets({
          projectId: this.props.projectId,
          selectedAssets,
        })}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    projectName: state.project.privateName,
    projectId: state.project.id,
    selectedAssets: participantMediaSelectedAssetsSelector(state),
    currentPage: participantMediaCurrentPageSelector(state),
    appliedFilterCount: participantMediaAppliedFilterCountSelector(state),
    allAssetIds: participantMediaAllAssetIdsSelector(state),
    filteredAssetIds: participantMediaFilteredAssetIdsSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectPage:
      ({ projectId, page }) => dispatch(actions.participantMediaAppliedFilters.setPage({
        projectId,
        page,
      })),
    setSelectedAssets:
      ({ projectId, selectedAssets }) => dispatch(actions.participantMedia.setSelectedAssets({
        projectId,
        selectedAssets,
      })),
    fetchAllAssetIds: ({ projectId }) =>
      dispatch(actions.participantMedia.fetchAllAssetIds({ projectId })),
  };
}
