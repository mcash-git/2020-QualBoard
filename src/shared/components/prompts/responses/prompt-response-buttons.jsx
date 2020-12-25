import React from 'react';
import PropTypes from 'prop-types';

const PromptResponseButtons = ({ currentUserIsModerator, replyClickHandler, isEventOpen }) => {
  const renderedFollowupButton =
    renderFollowUpButton(replyClickHandler, currentUserIsModerator, isEventOpen);

  // TODO:  Supporting insights
  const renderedInsightButton = null;
  // const renderedInsightButton = renderInsightButton(currentUserIsModerator, isEventOpen);

  return (
    <div className="response-buttons">
      <div className="primary">
        {renderedFollowupButton}
      </div>
      <div className="secondary">
        {renderedInsightButton}
      </div>
    </div>
  );
};

PromptResponseButtons.propTypes = {
  currentUserIsModerator: PropTypes.bool.isRequired,
  isEventOpen: PropTypes.bool.isRequired,
  replyClickHandler: PropTypes.func.isRequired,
};

function renderFollowUpButton(handler, currentUserIsModerator, isEventOpen) {
  const button = (
    <button
      onClick={handler}
      className="btn response-button"
      disabled={!isEventOpen || !currentUserIsModerator}
    >
      <i className="icon-ion-reply" />
      <span>Follow Up</span>
    </button>
  );

  let title = null;

  if (!isEventOpen) {
    title = 'The event is closed.';
  } else if (!currentUserIsModerator) {
    title = 'Psst, hey super user!  You are not a moderator on this project!';
  }

  return (title === null) ?
    button :
    <span title={title}>{button}</span>;
}

function renderInsightButton(currentUserIsModerator, isEventOpen) {
  const button = (
    <button className="btn response-button" disabled={!isEventOpen || !currentUserIsModerator}>
      <i className="icon-lightbulb_outline" />
      <span>Add Insight</span>
    </button>
  );

  let title = null;

  if (!isEventOpen) {
    title = 'The event is closed.';
  } else if (!currentUserIsModerator) {
    title = 'Psst, hey super user!  You are not a moderator on this project!';
  }

  return (title === null) ?
    button :
    <span title={title}>{button}</span>;
}

export default PromptResponseButtons;
