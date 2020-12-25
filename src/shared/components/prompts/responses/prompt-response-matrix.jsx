import React from 'react';
import PropTypes from 'prop-types';
import PromptMatrix from '../prompt-matrix';

const PromptResponseMatrix = ({ task, response }) =>
  <PromptMatrix task={task} matrixResponses={response.matrixResponses} />;

PromptResponseMatrix.propTypes = {
  task: PropTypes.object.isRequired,
  response: PropTypes.object.isRequired,
};

export default PromptResponseMatrix;
