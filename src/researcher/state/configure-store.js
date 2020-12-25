import { applyMiddleware, createStore, compose } from 'redux';
import { createLogicMiddleware } from 'redux-logic';
import persistState from 'redux-sessionstorage';
import rootReducer from './root-reducer';
import allLogic from './all-logic';

export default function configureStore({ api, annotationsClient }) {
  const logicMiddleware = createLogicMiddleware(allLogic, { api, annotationsClient });

  const createStoreWithLogicMiddleware =
    (rr, preloadedState) => createStore(rr, preloadedState, applyMiddleware(logicMiddleware));

  const createPersistentStore = compose(persistState(['participantMediaAppliedFilters']))(createStoreWithLogicMiddleware);

  return createPersistentStore(rootReducer);
}
