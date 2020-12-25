import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { enums } from '2020-qb4';
import MediaItems from '../../media/media-items';
import PromptResponseMcma from './prompt-response-mcma';
import PromptResponseMatrix from './prompt-response-matrix';
import sanitizeUserHtml from '../../../utility/security/sanitize-user-html';

const PromptTypes = enums.promptTypes;

const PromptResponseCore = ({ task, response, viewMediaItem }) => {
  const type = PromptTypes[task.type];

  if (type === PromptTypes.notice) {
    return null;
  }

  const renderedMediaItems = (response.media && response.media.length > 0) ? (
    <MediaItems
      mediaItems={response.media}
      viewMediaItem={viewMediaItem}
    />
  ) : null;

  const renderedText = (response.text) ?
    <div className="prompt-response-text" dangerouslySetInnerHTML={{ __html: sanitizeUserHtml(response.text) }} /> :
    null;

  const classes = classNames('prompt-response-content', {
    'user-is-responding': response.writeResponse,
  });

  return (
    <div className={classes}>
      {renderContent(type, task, response, renderedText, renderedMediaItems)}
    </div>
  );
};

PromptResponseCore.propTypes = {
  task: PropTypes.object.isRequired,
  response: PropTypes.object.isRequired,
  viewMediaItem: PropTypes.func.isRequired,
};

export default PromptResponseCore;

function getResponseCore(type, task, response) {
  switch (type) {
    case PromptTypes.text:
    case PromptTypes.notice:
      return null;
    case PromptTypes.multipleChoice:
    case PromptTypes.multipleAnswer:
      return (
        <PromptResponseMcma
          task={task}
          response={response}
        />
      );
    case PromptTypes.matrixMultipleChoice:
    case PromptTypes.matrixMultipleAnswer:
      return (
        <PromptResponseMatrix
          task={task}
          response={response}
        />
      );
    default:
      return null;
  }
}

function renderContent(type, task, response, renderedText, renderedMediaItems) {
  return (type === PromptTypes.media) ? (
    <React.Fragment>
      {renderedMediaItems}
      {renderedText}
    </React.Fragment>
  ) : (
    <React.Fragment>
      {getResponseCore(type, task, response)}
      {renderedText}
      {renderedMediaItems}
    </React.Fragment>
  );
}
