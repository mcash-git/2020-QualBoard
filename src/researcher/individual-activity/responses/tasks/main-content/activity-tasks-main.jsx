import React from 'react';
import PropTypes from 'prop-types';
import Prompt from 'shared/components/prompts/prompt';
import { DefaultContent } from 'shared/components/default-content';

const ActivityTasksMain = ({
  selectedTask,
  responses,
  identityServerUri,
  currentUserTimeZone,
  currentProjectUser,
  viewMediaItem,
  tryAddResponse,
  removeWriteResponse,
  setWriteResponseText,
  submitWriteResponse,
  isActivityOpen,
}) => ((selectedTask) ? (
  <div className="activity-tasks-main-content">
    <div className="prompt-wrapper">
      <Prompt
        task={selectedTask}
        responses={responses}
        viewMediaItem={viewMediaItem}
        identityServerUri={identityServerUri}
        currentUserTimeZone={currentUserTimeZone}
        currentProjectUser={currentProjectUser}
        tryAddResponseComment={(parentResponseId) =>
          tryAddResponse({ parentResponseId, taskId: selectedTask.id })}
        setWriteResponseText={setWriteResponseText}
        removeWriteResponse={removeWriteResponse}
        submitWriteResponse={submitWriteResponse}
        isEventOpen={isActivityOpen}
      />
    </div>
  </div>
) : (
  <DefaultContent
    iconClass="icon-noun_356772"
    message="Select a task to view responses"
  />
));

ActivityTasksMain.propTypes = {
  selectedTask: PropTypes.object,
  responses: PropTypes.array,
  identityServerUri: PropTypes.string.isRequired,
  currentUserTimeZone: PropTypes.string.isRequired,
  currentProjectUser: PropTypes.object,
  viewMediaItem: PropTypes.func.isRequired,
  tryAddResponse: PropTypes.func.isRequired,
  setWriteResponseText: PropTypes.func.isRequired,
  removeWriteResponse: PropTypes.func.isRequired,
  submitWriteResponse: PropTypes.func.isRequired,
  isActivityOpen: PropTypes.bool.isRequired,
};

ActivityTasksMain.defaultProps = {
  selectedTask: null,
  responses: [],
  currentProjectUser: null,
};

export default ActivityTasksMain;
