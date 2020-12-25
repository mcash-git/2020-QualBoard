import React from 'react';
import PropTypes from 'prop-types';
import { enums } from '2020-qb4';
import Radio from 'shared/components/radio';
import Checkbox from 'shared/components/checkbox';

const PromptTypes = enums.promptTypes;

const PromptMatrix = ({
  task,
  selectItem,
  matrixResponses = [],
}) => {
  const renderRows = createRenderRows(PromptTypes[task.type]);

  const tableHeadColumns = task.matrixColumns.map((c) => (
    <th>{c.text}</th>
  ));

  const selectionLookup = matrixResponses.reduce((lookup, resp) => ({
    ...lookup,
    [resp.rowId]: {
      ...lookup[resp.rowId],
      [resp.columnId]: true,
    },
  }), {});

  return (
    <div className="table-wrapper matrix-wrapper">
      <table className="table table-striped table-bordered grid-table">
        <thead>
          <tr>
            <th />
            {tableHeadColumns}
          </tr>
        </thead>
        <tbody>
          {renderRows(task, selectItem, selectionLookup)}
        </tbody>
      </table>
    </div>
  );
};

PromptMatrix.propTypes = {
  task: PropTypes.object.isRequired,
  matrixResponses: PropTypes.array,
  selectItem: PropTypes.func,
};

PromptMatrix.defaultProps = {
  matrixResponses: [],
  selectItem: null,
};

function createRenderRows(type) {
  const renderInput = (type === PromptTypes.matrixMultipleChoice) ?
    renderRadio :
    renderCheckbox;

  return (task, selectItem, selectionLookup) =>
    task.matrixRows.map((r) => (
      <tr>
        <td className="row-hidden">
          <div className="row-value">{r.text}</div>
        </td>
        {task.matrixColumns.map((c) => (
          <td>
            {renderInput(r.rowId, c.columnId, selectItem, selectionLookup)}
          </td>
          ))}
      </tr>
    ));
}

function itemIsSelected(rowId, colId, selections) {
  return selections[rowId] && selections[rowId][colId];
}

function renderRadio(rowId, colId, selectItem, selectionLookup) {
  return (
    <Radio
      key={`${rowId}${colId}`}
      isChecked={itemIsSelected(rowId, colId, selectionLookup)}
    />
  );
}

function renderCheckbox(rowId, colId, selectItem, selectionLookup) {
  return (
    <Checkbox
      key={`${rowId}${colId}`}
      isChecked={itemIsSelected(rowId, colId, selectionLookup)}
    />
  );
}

export default PromptMatrix;
