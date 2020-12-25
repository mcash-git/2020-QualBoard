import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfiniteProgressBar from 'shared/components/progress/infinite-progress-bar';
import { MediaClient } from '2020-media';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import { actions } from 'researcher/state/all-actions';
import activityTasksSelector from 'researcher/state/activity-tasks/selectors/activity-tasks-selector';
import activityTasksFetchStatusSelector from 'researcher/state/activity-tasks/selectors/activity-tasks-fetch-status-selector';
import currentUserSelector from 'shared/state/current-user/selectors/current-user-selector';
import activityTasksSelectedTaskSelector from 'researcher/state/activity-tasks/selectors/activity-tasks-selected-task-selector';
import activityTasksResponsesSelector from 'researcher/state/activity-tasks-responses/selectors/activity-tasks-responses-selector';
import activityTasksResponsesFetchStatusSelector from 'researcher/state/activity-tasks-responses/selectors/activity-tasks-responses-fetch-status-selector';
import currentProjectUserSelector from 'researcher/state/project-users/selectors/current-project-user-selector';
import isActivityOpenSelector from 'researcher/state/individual-activity/selectors/is-activity-open-selector';
import ActivityTasks from './activity-tasks';

@connect(mapStateToProps, mapDispatchToProps)
class ActivityTasksContainer extends React.Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    iaId: PropTypes.string.isRequired,
    fetchStatus: PropTypes.string.isRequired,
    fetchTasks: PropTypes.func.isRequired,
    tasks: PropTypes.array,
    responses: PropTypes.array,
    identityServerUri: PropTypes.string.isRequired,
    currentUserTimeZone: PropTypes.string.isRequired,
    selectedTask: PropTypes.object,
    selectTask: PropTypes.func.isRequired,
    currentProjectUser: PropTypes.object,
    viewState: PropTypes.object.isRequired,
    tryAddResponse: PropTypes.func.isRequired,
    removeWriteResponse: PropTypes.func.isRequired,
    setWriteResponseText: PropTypes.func.isRequired,
    submitWriteResponse: PropTypes.func.isRequired,
    isActivityOpen: PropTypes.bool.isRequired,
    mediaClient: PropTypes.instanceOf(MediaClient).isRequired,
  };

  static defaultProps = {
    tasks: [],
    selectedTask: null,
    responses: [],
    currentProjectUser: null,
  };

  constructor(props) {
    super(props);

    const {
      projectId,
      iaId,
      viewState,
      mediaClient,
    } = props;

    this.projectId = projectId;
    this.iaId = iaId;
    this.viewState = viewState;
    this.mediaClient = mediaClient;

    this.setInitialState();
  }

  componentWillMount() {
    this.props.fetchTasks({ projectId: this.projectId, iaId: this.iaId });
    this.userCanAddInsights = this.props.currentProjectUser &&
      this.props.currentProjectUser.role.value === 'Moderator';
  }

  setInitialState() {
    this.state = {
      fetchStatus: fetchStatuses.pending,
    };
  }

  viewMediaItem = (mediaItem, mediaItems, canAddInsights) => {
    if (mediaItem.viewable) {
      this.viewState.openModal('shared/media/media-item-modal', {
        mediaItems,
        index: mediaItems.indexOf(mediaItem),
        canEdit: false,
        canAddInsights: this.userCanAddInsights && canAddInsights,
        projectId: this.projectId,
      });
    } else {
      this.mediaClient.downloadAsset(mediaItem.assetId);
    }
  };

  scrollIntoView = (el) => {
    this.viewState.scrollIntoView(el, 100);
  };

  renderLoading = () => <InfiniteProgressBar width="100%" height="5px" />;

  renderFailure = () => 'FAILURE';

  renderTasks() {
    const {
      projectId,
      iaId,
    } = this.props;

    return (
      <ActivityTasks
        tasks={this.props.tasks}
        responses={this.props.responses}
        identityServerUri={this.props.identityServerUri}
        currentUserTimeZone={this.props.currentUserTimeZone}
        selectTask={(task) => { this.props.selectTask({ projectId, iaId, task }); }}
        selectedTask={this.props.selectedTask}
        currentProjectUser={this.props.currentProjectUser}
        viewMediaItem={this.viewMediaItem}
        tryAddResponse={this.props.tryAddResponse}
        removeWriteResponse={this.props.removeWriteResponse}
        setWriteResponseText={this.props.setWriteResponseText}
        submitWriteResponse={this.props.submitWriteResponse}
        isActivityOpen={this.props.isActivityOpen}
      />
    );
  }

  render() {
    switch (this.props.fetchStatus) {
      case fetchStatuses.pending:
        return this.renderLoading();
      case fetchStatuses.success:
        return this.renderTasks();
      case fetchStatuses.failure:
        return this.renderFailure();
      default:
        throw new Error(`Unrecognized retrieve status: ${this.props.fetchStatus}`);
    }
  }
}

function mapStateToProps(state) {
  return {
    fetchStatus: activityTasksFetchStatusSelector(state),
    tasks: activityTasksSelector(state),
    identityServerUri: state.appConfig.identity.identityServerUri,
    currentUserTimeZone: currentUserSelector(state).timeZone,
    selectedTask: activityTasksSelectedTaskSelector(state),
    responses: activityTasksResponsesSelector(state),
    responsesFetchStatus: activityTasksResponsesFetchStatusSelector(state),
    currentProjectUser: currentProjectUserSelector(state),
    isActivityOpen: isActivityOpenSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTasks: ({ projectId, iaId }) =>
      dispatch(actions.activityTasks.fetchTasks({ projectId, iaId })),
    selectTask: ({ projectId, iaId, task }) =>
      dispatch(actions.activityTasks.selectTask({ projectId, iaId, taskId: task.id })),
    tryAddResponse: ({ taskId, parentResponseId }) =>
      dispatch(actions.writeTaskResponseResponses.tryAddResponse({ taskId, parentResponseId })),
    setWriteResponseText: ({ taskId, parentResponseId, text }) =>
      dispatch(actions.writeTaskResponseResponses.setResponseText({
        taskId,
        parentResponseId,
        text,
      })),
    removeWriteResponse: ({ taskId, parentResponseId }) =>
      dispatch(actions.writeTaskResponseResponses.removeResponse({
        taskId,
        parentResponseId,
      })),
    submitWriteResponse: (writeResponse) =>
      dispatch(actions.writeTaskResponseResponses.submitResponse({
        taskId: writeResponse.taskPromptId,
        response: writeResponse,
      })),
  };
}

export default ActivityTasksContainer;
