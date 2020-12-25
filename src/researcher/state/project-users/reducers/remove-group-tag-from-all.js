import remove from 'shared/utility/arrays/remove';

export default (state, action) => {
  const { projectId, tagId } = action.payload;

  const stateForProject = state[projectId];

  if (!stateForProject) {
    return state;
  }

  return {
    ...state,
    [projectId]: {
      ...stateForProject,
      users: stateForProject.users.map(pu => {
        const index = pu.groupTags.indexOf(tagId);
        if (index === -1) {
          return pu;
        }
        return {
          ...pu,
          groupTags: remove(pu.groupTags, index),
        };
      }),
    },
  };
};
