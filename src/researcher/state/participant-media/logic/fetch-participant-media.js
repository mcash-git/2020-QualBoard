import { createLogic } from 'redux-logic';
import { enums } from '2020-qb4';
import participantMediaAppliedFiltersSelector from 'researcher/state/participant-media-applied-filters/selectors/participant-media-applied-filters-selector';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import { actions } from '../../all-actions';

const RuleOperators = enums.ruleOperators;

export default createLogic({
  type: `${actions.participantMedia.fetch}`,
  latest: true,
  async process({ api, getState, action }, dispatch, done) {
    const { projectId } = action.payload;
    const state = getState();
    const {
      createdAfter,
      createdBefore,
      assetTypes,
      taskIds,
      tagsRule,
      usersRule,
      page,
      pageSize,
    } = participantMediaAppliedFiltersSelector(state);

    const appliedFilters = {
      createdAfter,
      createdBefore,
      assetTypes,
      taskIds,
      projectUserLogicRules: [
        createGroupTagLogicRule(tagsRule),
        createUsersLogicRule(usersRule),
      ].filter((r) => r), // remove null / undefined rules.
      page,
      pageSize,
      projectId,
    };

    dispatch(actions.participantMedia.setFetchStatus({
      projectId,
      fetchStatus: fetchStatuses.pending,
    }));
    try {
      const [
        currentPage,
        assetIds,
      ] = await Promise.all([
        api.query.projects.getFilteredParticipantMedia(appliedFilters),
        api.query.projects.getFilteredParticipantMedia(appliedFilters, true),
      ]);

      dispatch(actions.participantMedia.setCurrentPage({ projectId, currentPage }));

      dispatch(actions.participantMedia.setFilteredAssetIds({ projectId, assetIds }));
      dispatch(actions.participantMedia.setFetchStatus({
        projectId,
        fetchStatus: fetchStatuses.success,
      }));
    } catch (error) {
      console.error('There was an error fetching the filtered participant media.', {
        error,
        state,
      });

      dispatch(actions.participantMedia.setFetchStatus({
        projectId,
        fetchStatus: fetchStatuses.failure,
      }));
    }
    done();
  },
});

function createGroupTagLogicRule(tagsRule) {
  if (!tagsRule || !tagsRule.tags || tagsRule.tags.length === 0) {
    return null;
  }

  return {
    memberName: 'GroupTags',
    operator: (tagsRule.operator || RuleOperators.containsAny).int,
    targetValue: tagsRule.tags.map((t) => t.id).join(','),
  };
}

const userOperatorMap = new Map([
  [RuleOperators.containsAny.int, {
    parentRuleOperator: RuleOperators.or,
    childRuleOperator: RuleOperators.equal,
  }],
  [RuleOperators.containsNone.int, {
    parentRuleOperator: RuleOperators.and,
    childRuleOperator: RuleOperators.notEqual,
  }],
]);

const userId = 'UserId';

function createUsersLogicRule(usersRule) {
  if (!usersRule || !usersRule.users || usersRule.users.length === 0) {
    return null;
  }

  const operators = userOperatorMap.get((usersRule.operator || RuleOperators.containsAny).int);

  return {
    memberName: userId,
    operator: operators.parentRuleOperator.int,
    rules: usersRule.users.map((u) => ({
      memberName: userId,
      operator: operators.childRuleOperator.int,
      targetValue: u.userId,
    })),
  };
}
