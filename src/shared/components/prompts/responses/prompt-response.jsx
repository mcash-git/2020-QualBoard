import React from 'react';
import PropTypes from 'prop-types';
import { enums } from '2020-qb4';
import PromptResponseHeader from './prompt-response-header';
import PromptResponseCore from './prompt-response-core';
import PromptResponseButtons from './prompt-response-buttons';
import PromptResponseComment from './prompt-response-comment';
import PromptResponseCommentWrite from './prompt-response-comment-write';
import flattenResponsesRecursive from '../../../utility/task-responses/flatten-responses';

const PromptTypes = enums.promptTypes;

const PromptResponse = ({
  task,
  response,
  identityServerUri,
  currentUserTimeZone,
  currentProjectUser,
  viewMediaItem,
  tryAddResponseComment,
  setWriteResponseText,
  removeWriteResponse,
  submitWriteResponse,
  isEventOpen,
}) => {
  const currentUserIsModerator =
    currentProjectUser && currentProjectUser.role.value === 'Moderator';

  const renderedComments = response.responses.map((r) => {
    const renderedWriteResponses = flattenResponsesRecursive(r)
      .filter((rr) => rr.writeResponse)
      .map((rr) => (
        <PromptResponseCommentWrite
          key={`write-for-${rr.id}`}
          identityServerUri={identityServerUri}
          response={rr.writeResponse}
          setWriteResponseText={(text) => setWriteResponseText({
            parentResponseId: rr.id,
            taskId: task.id,
            text,
          })}
          removeWriteResponse={() => removeWriteResponse({
            parentResponseId: rr.id,
            taskId: task.id,
          })}
          submitWriteResponse={() => submitWriteResponse(rr.writeResponse)}
        />
      ));
    return (
      <div className="top-level-comment-wrapper" key={r.id}>
        <PromptResponseComment
          response={r}
          identityServerUri={identityServerUri}
          currentUserTimeZone={currentUserTimeZone}
          currentProjectUser={currentProjectUser}
          tryAddResponseComment={tryAddResponseComment}
          removeWriteResponse={removeWriteResponse}
          submitWriteResponse={submitWriteResponse}
          isEventOpen={isEventOpen}
        />
        {renderedWriteResponses}
      </div>
    );
  });

  const renderedWriteResponse = (response.writeResponse) ? (
    <PromptResponseCommentWrite
      response={response.writeResponse}
      identityServerUri={identityServerUri}
      setWriteResponseText={(text) => setWriteResponseText({
        parentResponseId: response.id,
        taskId: task.id,
        text,
      })}
      removeWriteResponse={() => removeWriteResponse({
        parentResponseId: response.id,
        taskId: task.id,
      })}
      submitWriteResponse={() => submitWriteResponse(response.writeResponse)}
    />
  ) : null;

  const renderedButtons = (shouldRenderButtons(task, currentProjectUser)) ? (
    <PromptResponseButtons
      currentUserIsModerator={currentUserIsModerator}
      isEventOpen={isEventOpen}
      replyClickHandler={() => tryAddResponseComment(response.id)}
    />
  ) : null;

  return (
    <React.Fragment>
      <PromptResponseHeader
        response={response}
        identityServerUri={identityServerUri}
        currentUserTimeZone={currentUserTimeZone}
      />
      <PromptResponseCore
        task={task}
        response={response}
        identityServerUri={identityServerUri}
        currentUserTimeZone={currentUserTimeZone}
        viewMediaItem={viewMediaItem}
      />
      {renderedButtons}
      <div className="prompt-comments">
        {renderedComments}
        {renderedWriteResponse}
      </div>
    </React.Fragment>
  );
};

PromptResponse.propTypes = {
  task: PropTypes.object.isRequired,
  response: PropTypes.object.isRequired,
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

PromptResponse.defaultProps = {
  currentProjectUser: null,
};

// when the task is not a Notice type, render the buttons for super-users
// (no project-user associated with this project) and moderators only
function shouldRenderButtons(task, currentProjectUser) {
  return PromptTypes[task.type] !== PromptTypes.notice &&
    (!currentProjectUser || currentProjectUser.role.value === 'Moderator');
}

export default PromptResponse;
