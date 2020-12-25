import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import Froala from 'shared/components/froala-editor';
import scrollIntoView from 'shared/utility/scroll-into-view';
import Avatar from 'shared/components/avatar/avatar';
import LoaderImg from 'shared/components/loader-img';

class PromptResponseCommentWrite extends React.Component {
  static propTypes = {
    identityServerUri: PropTypes.string.isRequired,
    response: PropTypes.object.isRequired,
    setWriteResponseText: PropTypes.func.isRequired,
    removeWriteResponse: PropTypes.func.isRequired,
    submitWriteResponse: PropTypes.func.isRequired,
  };

  componentDidMount() {
    scrollIntoView(this.element, 200);
  }

  render() {
    const {
      response,
      removeWriteResponse,
      submitWriteResponse,
      identityServerUri,
      setWriteResponseText,
    } = this.props;
    const classes = classNames({
      'response-comment': true,
      followup: response.isProbe,
    });

    const btnClasses = classNames({
      btn: true,
      'btn-primary': true,
      working: response.status === fetchStatuses.pending,
    });

    const areButtonsDisabled = response.status === fetchStatuses.pending;

    const renderedButtons = (
      <div className="reply-buttons">
        <button
          type="button"
          className="btn btn-secondary-outline"
          onClick={removeWriteResponse}
          disabled={areButtonsDisabled}
        >
          Cancel
        </button>
        <button
          type="button"
          className={btnClasses}
          disabled={areButtonsDisabled}
          onClick={submitWriteResponse}
        >
          <span className="btn-text">Submit</span>
          <LoaderImg className="btn-loader" />
        </button>
        <div className="clear" />
      </div>
    );

    return (
      <div
        className={classes}
        ref={(el) => { this.element = el; }}
      >
        <div className="avatar-wrapper">
          <Avatar
            identityServerUri={identityServerUri}
            userId={response.userId}
            size={26}
          />
        </div>
        <div className="response-comment-content">
          <div className="response-comment-reply-to">
            <span className="reply-to">Reply to:</span>
            <Avatar
              identityServerUri={identityServerUri}
              userId={response.parentUserId}
              size={22}
            />
            <span>
              {response.parentUser.displayName}
            </span>
            <i className="icon-ion-reply icon" />
          </div>
          <div className="response-comment-body">
            <Froala
              text={response.text}
              onChange={setWriteResponseText}
              shouldAutoFocus
            />
          </div>
          {renderedButtons}
        </div>
      </div>
    );
  }
}

export default PromptResponseCommentWrite;
