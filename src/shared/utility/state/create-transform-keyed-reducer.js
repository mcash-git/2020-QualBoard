const createTransformKeyedReducer = (key, transform, cancelIfUndefined = true) =>
  (state, action) => {
    const keyValue = action.payload[key];
    const existingState = state[keyValue];

    if (!existingState && cancelIfUndefined) {
      return state;
    }

    return {
      ...state,
      [keyValue]: transform(action.payload, existingState),
    };
  };

export default createTransformKeyedReducer;
