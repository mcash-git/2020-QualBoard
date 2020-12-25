import 'modules/prompts/_prompt.scss';
import React from 'react';
import PropTypes from 'prop-types';
import MediaItems from 'shared/components/media/media-items';
import PromptCore from './prompt-core';
import PromptHeader from './prompt-header';
import PromptResponse from './responses/prompt-response';
import PromptIcon from './prompt-icon';

const Prompt = ({
  task,
  responses,
  viewMediaItem,
  identityServerUri,
  currentUserTimeZone,
  currentProjectUser,
  tryAddResponseComment,
  setWriteResponseText,
  removeWriteResponse,
  submitWriteResponse,
  isEventOpen,
}) => {
  const renderedMediaItems = (task.media && task.media.length > 0) ? (
    <MediaItems
      mediaItems={task.media}
      viewMediaItem={(mediaItem, mediaItems) => viewMediaItem(mediaItem, mediaItems, false)}
    />
  ) : null;

  const renderedResponses = responses.map((r) => (
    <PromptResponse
      key={r.id}
      task={task}
      response={r}
      identityServerUri={identityServerUri}
      currentUserTimeZone={currentUserTimeZone}
      currentProjectUser={currentProjectUser}
      // TODO: When supporting insights, change the third argument to "true" here:
      viewMediaItem={(mediaItem, mediaItems) => viewMediaItem(mediaItem, mediaItems, false)}
      tryAddResponseComment={tryAddResponseComment}
      setWriteResponseText={setWriteResponseText}
      removeWriteResponse={removeWriteResponse}
      submitWriteResponse={submitWriteResponse}
      isEventOpen={isEventOpen}
    />
  ));

  return (
    <div className="prompt">
      <PromptIcon type={task.type} />
      <PromptHeader
        title={task.title}
        text={task.text}
        mediaRequired={task.mediaRequired}
        responseTextRequired={task.responseTextRequired}
        hasLogic={task.hasLogic}
      />
      {renderedMediaItems}
      <PromptCore task={task} />
      {renderedResponses}
    </div>
  );
};

Prompt.propTypes = {
  task: PropTypes.object.isRequired,
  responses: PropTypes.array,
  identityServerUri: PropTypes.string.isRequired,
  currentUserTimeZone: PropTypes.string.isRequired,
  currentProjectUser: PropTypes.object,
  viewMediaItem: PropTypes.func.isRequired,
  tryAddResponseComment: PropTypes.func.isRequired,
  setWriteResponseText: PropTypes.func.isRequired,
  removeWriteResponse: PropTypes.func.isRequired,
  submitWriteResponse: PropTypes.func.isRequired,
  isEventOpen: PropTypes.bool.isRequired,
};

Prompt.defaultProps = {
  responses: [],
  currentProjectUser: null,
};

export default Prompt;
