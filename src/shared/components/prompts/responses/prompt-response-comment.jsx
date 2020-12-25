import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import sanitizeUserHtml from 'shared/utility/security/sanitize-user-html';
import Avatar from 'shared/components/avatar/avatar';
import { formatMoment } from 'shared/value-converters/format-moment';
import PromptResponseButtons from './prompt-response-buttons';

const PromptResponseComment = ({
  response,
  identityServerUri,
  currentUserTimeZone,
  currentProjectUser,
  tryAddResponseComment,
  isEventOpen,
}) => {
  const currentUserIsModerator =
    currentProjectUser && currentProjectUser.role.value === 'Moderator';

  const classes = classNames({
    'response-comment': true,
    followup: response.isProbe,
    'user-is-responding': response.writeResponse,
  });

  const respondedOn = formatMoment(response.respondedOn, currentUserTimeZone, 'M/D/YYYY h:mm A');

  const renderedButtons = (shouldRenderButtons(response, currentProjectUser)) ? (
    <PromptResponseButtons
      currentUserIsModerator={currentUserIsModerator}
      isEventOpen={isEventOpen}
      replyClickHandler={() => tryAddResponseComment(response.id)}
    />
  ) : null;

  const renderedChildResponses = response.responses && response.responses.map((r) => (
    <PromptResponseComment
      key={r.id}
      response={r}
      identityServerUri={identityServerUri}
      currentUserTimeZone={currentUserTimeZone}
      currentProjectUser={currentProjectUser}
      tryAddResponseComment={tryAddResponseComment}
      isEventOpen={isEventOpen}
    /> 
  ));

  return (
    <React.Fragment>
      <div className={classes}>
        <div className="avatar-wrapper">
          <Avatar
            identityServerUri={identityServerUri}
            userId={response.userId}
            size={26}
          />
        </div>
        <div className="response-comment-content">
          <div className="response-comment-header">
            <span className="label-display-name">
              {response.user.displayName}
            </span>
            <span className="label-response-date">
              {respondedOn}
            </span>
          </div>
          <div
            className="response-comment-body"
            dangerouslySetInnerHTML={{ __html: sanitizeUserHtml(response.text) }}
          />
          {renderedButtons}
        </div>
      </div>
      {renderedChildResponses}
    </React.Fragment>
  );
};

PromptResponseComment.propTypes = {
  response: PropTypes.object.isRequired,
  identityServerUri: PropTypes.string.isRequired,
  currentUserTimeZone: PropTypes.string.isRequired,
  tryAddResponseComment: PropTypes.func.isRequired,
  isEventOpen: PropTypes.bool.isRequired,
  currentProjectUser: PropTypes.object,
};

PromptResponseComment.defaultProps = {
  currentProjectUser: null,
};

// when the comment was written by a participant, render the buttons for super-users
// (no project-user associated with this project) and moderators only
function shouldRenderButtons(response, currentProjectUser) {
  return response.user.role.value === 'Participant' &&
    (!currentProjectUser || currentProjectUser.role.value === 'Moderator');
}

export default PromptResponseComment;
