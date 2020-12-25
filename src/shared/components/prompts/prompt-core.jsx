import React from 'react';
import PropTypes from 'prop-types';
import { enums } from '2020-qb4';
import PromptMatrix from './prompt-matrix';
import PromptMCMA from './prompt-mcma';

const PromptTypes = enums.promptTypes;

const PromptCore = ({ task }) => {
  const type = PromptTypes[task.type];
  switch (type) {
    case PromptTypes.text:
    case PromptTypes.notice:
      return null;
    case PromptTypes.multipleChoice:
    case PromptTypes.multipleAnswer:
      return <PromptMCMA task={task} />
    case PromptTypes.matrixMultipleChoice:
    case PromptTypes.matrixMultipleAnswer:
      return <PromptMatrix task={task} />;
    default:
      return null;
  }
};

PromptCore.propTypes = {
  task: PropTypes.object.isRequired,
};

export default PromptCore;
