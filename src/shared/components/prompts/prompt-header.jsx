import React from 'react';
import PropTypes from 'prop-types';
import 'modules/prompts/_prompt-header.scss';
import sanitizeUserHtml from '../../utility/security/sanitize-user-html';

const PromptHeader = ({
  title,
  text,
  mediaRequired,
  responseTextRequired,
  hasLogic,
}) => {
  const responseIcon = responseTextRequired ? <i className="icon-ion-ios-chatboxes" /> : null;
  const mediaIcon = mediaRequired ? <i className="icon-photo" /> : null;
  const logicIcon = hasLogic ? <i className="icon-call_split" /> : null;

  return (
    <div className="prompt-header">
      <div className="title">{title}</div>
      <div className="icon-container">
        {responseIcon}
        {mediaIcon}
        {logicIcon}
      </div>
      <div className="title-body" dangerouslySetInnerHTML={{ __html: sanitizeUserHtml(text) }} />
    </div>
  );
};

PromptHeader.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  mediaRequired: PropTypes.bool,
  responseTextRequired: PropTypes.bool,
  hasLogic: PropTypes.bool,
};

PromptHeader.defaultProps = {
  text: '',
  mediaRequired: false,
  responseTextRequired: false,
  hasLogic: false,
};

export default PromptHeader;
