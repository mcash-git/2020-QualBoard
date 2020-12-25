export function setProject(state, action) {
  return {
    ...state,
    project: action.payload.project,
  };
}
