import getDefaultFilters from './get-default-filters';

export default {
  ADD_ASSET_TYPE: undefined,
  ADD_TASK_IDS: undefined,
  FETCH_INDIVIDUAL_ACTIVITIES: undefined,
  REMOVE_ASSET_TYPE: undefined,
  REMOVE_TASK_IDS: undefined,
  SET_ALL_FILTERS: undefined,
  SET_ASSET_TYPES: undefined,
  SET_AVAILABLE_INDIVIDUAL_ACTIVITIES: undefined,
  SET_CREATED_AFTER: undefined,
  SET_CREATED_BEFORE: undefined,
  SET_DEFAULT: ({ projectId, page, pageSize }) =>
    ({ filters: getDefaultFilters({ projectId, page, pageSize }), projectId }),
  SET_EXPANDED: undefined,
  SET_FETCH_STATUS: undefined,
  SET_TAGS_RULE_TAGS: undefined,
  SET_TAGS_RULE_OPERATOR: undefined,
  SET_PAGE: undefined,
  SET_PAGE_SIZE: undefined,
  SET_PROJECT_USER_LOGIC_RULES: undefined,
  SET_TASK_IDS: undefined,
  SET_USERS_RULE_USERS: undefined,
  SET_USERS_RULE_OPERATOR: undefined,
  TOGGLE_ASSET_TYPE: undefined,
  TOGGLE_EXPAND: undefined,
  TOGGLE_TASK_ID: undefined,
};
