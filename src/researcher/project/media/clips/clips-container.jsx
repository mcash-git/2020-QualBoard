import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import projectSelector from 'researcher/state/project/selectors/project-selector';
import { Api } from 'api/api';
import { ViewState } from 'shared/app-state/view-state';
import { MediaClient, VideoClipModel } from '2020-media';
import { DialogService } from 'aurelia-dialog';
import InfiniteProgressBar from 'shared/components/progress/infinite-progress-bar';
import { combineFetchStatuses, fetchStatuses } from 'shared/enums/fetch-statuses';
import { VideoInsightBag } from 'researcher/models/video-insight-bag';
import { CurrentUser } from 'shared/current-user';
import { PaginationPageModel } from 'shared/models/pagination-page-model';
import videoInsightsSelector from 'researcher/state/annotations/selectors/video-insights-selector';
import currentUserSelector from 'shared/state/current-user/selectors/current-user-selector';
import annotationsFetchStatusSelector from 'researcher/state/annotations/selectors/annotations-fetch-status-selector';
import projectUsersFetchStatusSelector from 'researcher/state/project-users/selectors/project-users-fetch-status-selector';
import { actions } from 'researcher/state/all-actions';
import { Clips } from './clips';

@connect(mapStateToProps, mapDispatchToProps)
export class ClipsContainer extends React.Component {
  static propTypes = {
    insights: PropTypes.arrayOf(PropTypes.instanceOf(VideoInsightBag)),
    currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    api: PropTypes.instanceOf(Api).isRequired,
    mediaClient: PropTypes.instanceOf(MediaClient).isRequired,
    viewState: PropTypes.instanceOf(ViewState).isRequired,
    growlProvider: PropTypes.object.isRequired,
    dialogService: PropTypes.instanceOf(DialogService).isRequired,
    fetchStatus: PropTypes.string.isRequired,
    fetchAnnotations: PropTypes.func.isRequired,
  };

  static defaultProps = {
    insights: [],
  };

  constructor(props) {
    super(props);

    const {
      projectId,
      api,
      mediaClient,
      viewState,
      growlProvider,
      dialogService,
    } = props;

    this.projectId = projectId;
    this.api = api;
    this.mediaClient = mediaClient;
    this.viewState = viewState;
    this.growlProvider = growlProvider;
    this.dialogService = dialogService;

    this.setInitialState();
  }

  async componentWillMount() {
    this.initializeActionBar();
    this.mapPropsToState(this.props);

    this.props.fetchAnnotations({ projectId: this.props.projectId });
  }

  componentWillReceiveProps(newProps) {
    this.mapPropsToState(newProps);
  }

  onSelectAllChecked({ target }) {
    this.setState({
      selectedInsights: (target.checked) ? this.state.currentPage.items.concat() : [],
    });
  }

  onSelectAllLabelClick() {
    if (this.state.currentPage.items.length === 0) {
      return;
    }

    const selectAll = !this.state.selectAll;

    this.setState({
      selectAll,
    });
    this.onSelectAllChecked({ target: { checked: selectAll } });
  }

  mapPropsToState({ insights }) {
    if (insights !== this.state.insights) {
      const pagination = PaginationPageModel.buildPagination(insights, 24);
      this.setState({
        pagination,
        insights,
        currentPage: pagination[this.state.pageNumber - 1],
      });
    }
  }

  selectPage(pageNumber) {
    if (pageNumber > this.state.pagination.length || pageNumber < 1) {
      console.error('Unable to select page - outside range of available pages.');
      return;
    }

    this.setState({
      pageNumber,
      currentPage: this.state.pagination[pageNumber - 1],
    });
  }

  toggleSelectInsight(insight) {
    const selectedInsights = this.state.selectedInsights.concat();
    const index = selectedInsights.indexOf(insight);
    if (index === -1) {
      selectedInsights.push(insight);
    } else {
      selectedInsights.splice(index, 1);
    }
    this.setState({
      selectedInsights,
    });
  }

  viewClip(insight) {
    this.viewState.openModal('researcher/project/media/clips/video-insight-clip-modal', {
      insight,
    });
  }

  async exportInsights(insights) {
    if (!insights || insights.length === 0) {
      return;
    }

    this.dialogService.open({
      viewModel: 'shared/media/text-prompt-modal',
      model: {
        title: 'Export Media',
        body: 'Name Your Export',
        placeholderText: 'File Name',
        defaultValue: `${this.props.project.privateName} - QualBoard Clips`,
      },
    }).whenClosed(async modalResult => {
      if (modalResult.wasCancelled) {
        return;
      }

      const videoClipModelDtos = insights.map(insight => new VideoClipModel({
        assetId: insight.assetId,
        startMs: Math.floor(insight.start * 1000),
        durationMs: Math.floor((insight.end - insight.start) * 1000),
      }).toDto());

      const success = await this.mediaClient.exportClips({
        clips: videoClipModelDtos,
        fileName: modalResult.output,
      });

      if (success) {
        this.growlProvider.success('Export Started', 'When your export is finished, it will be ' +
          'available in the downloads icon of the title bar.');
      } else {
        this.growlProvider.error('Error', 'There was an error processing your export request; please try' +
          'again.  If the problem persists, contact support.');
      }
    });
  }

  initializeActionBar() {
    const { actionBarModel } = this.viewState.childStateStack.current;
    actionBarModel.currentRoute =
      actionBarModel.router.navigation.find(r => /clips/i.test(r.title));
    actionBarModel.module = this;
    actionBarModel.viewModel = 'researcher/project/media/clips/clips-action-bar';
    this.viewState.childStateStack.current.sidebarOpen = false;
  }

  setInitialState() {
    this.state = {
      fetchStatus: fetchStatuses.pending,
      selectedInsights: [],
      pageNumber: 1,
      selectPage: this.selectPage.bind(this),
      toggleSelectInsight: this.toggleSelectInsight.bind(this),
      viewClip: this.viewClip.bind(this),
      exportInsights: this.exportInsights.bind(this),
      exportInsight: async (insight) => { this.exportInsights([insight]); },
    };
  }

  renderLoading = () => <InfiniteProgressBar width="100%" height="5px" />;

  renderFailure = () => 'FAILURE';

  renderClips() {
    return (
      <Clips
        currentPage={this.state.currentPage}
        selectedInsights={this.state.selectedInsights}
        currentUserTimeZone={this.props.currentUser.timeZone}
        selectPage={this.state.selectPage}
        toggleSelectInsight={this.state.toggleSelectInsight}
        mediaApiBaseUrl={this.mediaClient.config.baseUrl}
        viewClip={this.state.viewClip}
        exportInsight={this.state.exportInsight}
      />
    );
  }

  render() {
    switch (this.props.fetchStatus) {
      case fetchStatuses.pending:
        return this.renderLoading();
      case fetchStatuses.success:
        return this.renderClips();
      case fetchStatuses.failure:
        return this.renderFailure();
      default:
        throw new Error(`Unrecognized retrieve status: ${this.props.fetchStatus}`);
    }
  }
}

function mapStateToProps(state) {
  return {
    insights: videoInsightsSelector(state) || [],
    currentUser: currentUserSelector(state),
    project: projectSelector(state),
    fetchStatus: combineFetchStatuses([
      annotationsFetchStatusSelector(state),
      projectUsersFetchStatusSelector(state),
    ]),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAnnotations: ({ projectId }) => dispatch(actions.annotations.fetch({ projectId })),
  };
}
