import { handleActions } from 'redux-actions';

import addAssetType from './reducers/add-asset-type';
import addTaskIds from './reducers/add-task-ids';
import removeAssetType from './reducers/remove-asset-type';
import removeTaskIds from './reducers/remove-task-ids';
import setAllFilters from './reducers/set-all-filters';
import setAssetTypes from './reducers/set-asset-types';
import setAvailableIndividualActivities from './reducers/set-available-individual-activities';
import setCreatedAfter from './reducers/set-created-after';
import setCreatedBefore from './reducers/set-created-before';
import setPage from './reducers/set-page';
import setExpanded from './reducers/set-expanded';
import setPageSize from './reducers/set-page-size';
import setProjectUserLogicRules from './reducers/set-project-user-logic-rules';
import setTaskIds from './reducers/set-task-ids';
import setTagsRuleTags from './reducers/set-tags-rule-tags';
import setTagsRuleOperator from './reducers/set-tags-rule-operator';
import setUsersRuleUsers from './reducers/set-users-rule-users';
import setUsersRuleOperator from './reducers/set-users-rule-operator';
import setFetchStatus from '../misc/reducers/set-project-level-fetch-status';

export default handleActions({
  PARTICIPANT_MEDIA_APPLIED_FILTERS: {
    ADD_TASK_IDS: addTaskIds,
    ADD_ASSET_TYPE: addAssetType,
    REMOVE_ASSET_TYPE: removeAssetType,
    REMOVE_TASK_IDS: removeTaskIds,
    SET_ALL_FILTERS: setAllFilters,
    SET_ASSET_TYPES: setAssetTypes,
    SET_AVAILABLE_INDIVIDUAL_ACTIVITIES: setAvailableIndividualActivities,
    SET_CREATED_AFTER: setCreatedAfter,
    SET_CREATED_BEFORE: setCreatedBefore,
    SET_DEFAULT: setAllFilters,
    SET_EXPANDED: setExpanded,
    SET_FETCH_STATUS: setFetchStatus,
    SET_TAGS_RULE_TAGS: setTagsRuleTags,
    SET_TAGS_RULE_OPERATOR: setTagsRuleOperator,
    SET_PAGE: setPage,
    SET_PAGE_SIZE: setPageSize,
    SET_PROJECT_USER_LOGIC_RULES: setProjectUserLogicRules,
    SET_TASK_IDS: setTaskIds,
    SET_USERS_RULE_USERS: setUsersRuleUsers,
    SET_USERS_RULE_OPERATOR: setUsersRuleOperator,
  },
}, {});
