import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DialogService } from 'aurelia-dialog';
import { MediaClient, AssetTypes } from '2020-media';
import { ViewState } from 'shared/app-state/view-state';
import { actions } from 'researcher/state/all-actions';
import groupTagsSelector from 'researcher/state/group-tags/selectors/group-tags-selector';
import groupTagsFetchStatusSelector from 'researcher/state/group-tags/selectors/group-tags-fetch-status-selector';
import participantMediaSelectedAssetsSelector from 'researcher/state/participant-media/selectors/participant-media-selected-assets-selector';
import participantMediaAppliedFiltersSelector from 'researcher/state/participant-media-applied-filters/selectors/participant-media-applied-filters-selector';
import participantMediaAvailableFiltersFetchStatusSelector from 'researcher/state/participant-media-applied-filters/selectors/participant-media-available-filters-fetch-status-selector';
import participantMediaAvailableFiltersSelector from 'researcher/state/participant-media-applied-filters/selectors/participant-media-available-filters-selector';
import currentUserSelector from 'shared/state/current-user/selectors/current-user-selector';
import ParticipantFilters from 'shared/components/filters/participant-filters';
import { combineFetchStatuses, fetchStatuses } from 'shared/enums/fetch-statuses';
import InfiniteProgressBar from 'shared/components/progress/infinite-progress-bar';
import { enums } from '2020-qb4';
import participantsSelector from 'researcher/state/project-users/selectors/participants-selector';

const RuleOperators = enums.ruleOperators;

const tagsRuleOperators = [
  RuleOperators.containsAny,
  RuleOperators.containsAll,
  RuleOperators.containsNone,
];

const usersRuleOperators = [
  RuleOperators.containsAny,
  RuleOperators.containsNone,
];

@connect(mapStateToProps, mapDispatchToProps)
class ParticipantMediaSidebarContainer extends React.Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    dialogService: PropTypes.instanceOf(DialogService).isRequired,
    mediaClient: PropTypes.instanceOf(MediaClient).isRequired,
    identityServerUri: PropTypes.string.isRequired,
    viewState: PropTypes.instanceOf(ViewState).isRequired,
    appliedFilters: PropTypes.object,
    availableFilters: PropTypes.object,
    currentUserTimeZone: PropTypes.string.isRequired,
    clearFilters: PropTypes.func.isRequired,
    setCreatedAfter: PropTypes.func.isRequired,
    setCreatedBefore: PropTypes.func.isRequired,
    fetchIndividualActivities: PropTypes.func.isRequired,
    toggleExpand: PropTypes.func.isRequired,
    fetchStatus: PropTypes.string.isRequired,
    toggleSelectAssetType: PropTypes.func.isRequired,
    addTaskIds: PropTypes.func.isRequired,
    removeTaskIds: PropTypes.func.isRequired,
    availableTags: PropTypes.array,
    fetchGroupTags: PropTypes.func.isRequired,
    setTagsRuleOperator: PropTypes.func.isRequired,
    setTagsRuleTags: PropTypes.func.isRequired,
    setUsersRuleOperator: PropTypes.func.isRequired,
    setUsersRuleUsers: PropTypes.func.isRequired,
    participants: PropTypes.array,
  };

  static defaultProps = {
    appliedFilters: {},
    availableFilters: {},
    availableTags: null,
    participants: null,
  };

  constructor(props) {
    super(props);

    const {
      dialogService,
      mediaClient,
      viewState,
    } = props;

    this.dialogService = dialogService;
    this.mediaClient = mediaClient;
    this.viewState = viewState;
  }

  componentWillMount() {
    const { projectId } = this.props;
    this.props.fetchIndividualActivities({ projectId });
    if (!this.props.availableTags) {
      this.props.fetchGroupTags({ projectId });
    }
  }

  renderProgressBar = () => <InfiniteProgressBar height="5px" width="100%" />;

  renderFilters() {
    const { projectId, page, pageSize } = this.props.appliedFilters || {};
    const toggleExpand = (section) => this.props.toggleExpand({ projectId, section });
    return (
      <ParticipantFilters
        clearFilters={() => this.props.clearFilters({ projectId, page, pageSize })}
        filters={this.props.appliedFilters}
        currentUserTimeZone={this.props.currentUserTimeZone}
        setCreatedAfter={(createdAfter) => this.props.setCreatedAfter({ projectId, createdAfter })}
        setCreatedBefore={(createdBefore) =>
          this.props.setCreatedBefore({ projectId, createdBefore })}
        allAssetTypes={AssetTypes}
        availableTags={this.props.availableTags}
        individualActivities={this.props.availableFilters.individualActivities}
        toggleSelectAssetType={(assetType) =>
          this.props.toggleSelectAssetType({ projectId, assetType })}
        removeTaskIds={(taskIds) => this.props.removeTaskIds({ projectId, taskIds })}
        addTaskIds={(taskIds) => this.props.addTaskIds({ projectId, taskIds })}
        toggleExpandDates={() => { toggleExpand('dates'); }}
        toggleExpandAssetTypes={() => { toggleExpand('assetTypes'); }}
        toggleExpandTasks={() => { toggleExpand('tasks'); }}
        toggleExpandTags={() => { toggleExpand('tags'); }}
        toggleExpandUsers={() => { toggleExpand('users'); }}
        setTags={(tags) => { this.props.setTagsRuleTags({ tags, projectId }); }}
        setTagsRuleOperator={(operator) => {
          this.props.setTagsRuleOperator({ operator, projectId });
        }}
        setUsers={(users) => { this.props.setUsersRuleUsers({ users, projectId }); }}
        setUsersRuleOperator={(operator) => {
          this.props.setUsersRuleOperator({ operator, projectId });
        }}
        tagsRuleOperators={tagsRuleOperators}
        usersRuleOperators={usersRuleOperators}
        participants={this.props.participants}
        identityServerUri={this.props.identityServerUri}
      />
    );
  }

  render() {
    return (this.props.fetchStatus === fetchStatuses.success) ?
      this.renderFilters() :
      this.renderProgressBar();
  }
}

function mapStateToProps(state) {
  return {
    projectId: state.project.id,
    currentUserTimeZone: currentUserSelector(state).timeZone,
    selectedAssets: participantMediaSelectedAssetsSelector(state),
    appliedFilters: participantMediaAppliedFiltersSelector(state),
    fetchStatus: combineFetchStatuses([
      participantMediaAvailableFiltersFetchStatusSelector(state),
      groupTagsFetchStatusSelector(state),
    ]),
    availableFilters: participantMediaAvailableFiltersSelector(state),
    availableTags: groupTagsSelector(state),
    participants: participantsSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearFilters: ({ projectId, page, pageSize }) =>
      dispatch(actions.participantMediaAppliedFilters.setDefault({
        projectId,
        page,
        pageSize,
      })),
    setCreatedAfter: ({ projectId, createdAfter }) =>
      dispatch(actions.participantMediaAppliedFilters.setCreatedAfter({
        projectId,
        createdAfter,
      })),
    setCreatedBefore: ({ projectId, createdBefore }) =>
      dispatch(actions.participantMediaAppliedFilters.setCreatedBefore({
        projectId,
        createdBefore,
      })),
    toggleSelectAssetType: ({ projectId, assetType }) =>
      dispatch(actions.participantMediaAppliedFilters.toggleAssetType({ projectId, assetType })),
    addTaskIds: ({ projectId, taskIds }) =>
      dispatch(actions.participantMediaAppliedFilters.addTaskIds({ projectId, taskIds })),
    removeTaskIds: ({ projectId, taskIds }) =>
      dispatch(actions.participantMediaAppliedFilters.removeTaskIds({ projectId, taskIds })),
    fetchIndividualActivities: ({ projectId }) =>
      dispatch(actions.participantMediaAppliedFilters.fetchIndividualActivities({ projectId })),
    fetchGroupTags: ({ projectId }) => dispatch(actions.groupTags.fetch({ projectId })),
    toggleExpand: ({ projectId, section }) =>
      dispatch(actions.participantMediaAppliedFilters.toggleExpand({ projectId, section })),
    setTagsRuleTags: ({ projectId, tags }) =>
      dispatch(actions.participantMediaAppliedFilters.setTagsRuleTags({ projectId, tags })),
    setTagsRuleOperator: ({ projectId, operator }) =>
      dispatch(actions.participantMediaAppliedFilters.setTagsRuleOperator({ projectId, operator })),
    setUsersRuleUsers: ({ projectId, users }) =>
      dispatch(actions.participantMediaAppliedFilters.setUsersRuleUsers({ projectId, users })),
    setUsersRuleOperator: ({ projectId, operator }) =>
      dispatch(actions.participantMediaAppliedFilters.setUsersRuleOperator({
        projectId,
        operator,
      })),
  };
}

export default ParticipantMediaSidebarContainer;
