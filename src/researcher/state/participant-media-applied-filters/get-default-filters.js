export default ({ projectId, page, pageSize }) => ({
  page: page || 1,
  pageSize: pageSize || 24,
  projectId,
  assetTypes: [],
  taskIds: [],
  projectUserLogicRules: [],
  createdAfter: null,
  createdBefore: null,
  tagsRule: null,
  usersRule: null,
});
