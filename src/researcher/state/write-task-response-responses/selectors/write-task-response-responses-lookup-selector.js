import { createSelector } from 'reselect';
import writeTaskResponseResponsesSelector from './write-task-response-responses-selector';

const writeTaskResponseResponsesLookupSelector = createSelector(
  writeTaskResponseResponsesSelector,
  (responses = []) => new Map(responses.map((r) => [r.parentResponseId, r])),
);

export default writeTaskResponseResponsesLookupSelector;
