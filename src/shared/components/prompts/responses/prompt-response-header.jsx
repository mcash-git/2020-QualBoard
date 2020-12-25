import React from 'react';
import PropTypes from 'prop-types';
import { formatMoment } from 'shared/value-converters/format-moment';
import Avatar from '../../avatar/avatar';

const PromptResponseHeader = ({ response, identityServerUri, currentUserTimeZone }) => {
  const respondedOn = formatMoment(response.respondedOn, currentUserTimeZone, 'M/D/YYYY h:mm A');

  return (
    <div className="prompt-response-header">
      <div className="prompt-response-header-label">
        <Avatar
          identityServerUri={identityServerUri}
          userId={response.userId}
          size={26}
        />
        <div className="label-container">
          <div className="label-display-name">
            {response.user.displayName}
          </div>
          <div className="label-response-date">
            {respondedOn}
          </div>
        </div>
      </div>
    </div>
  );
};

PromptResponseHeader.propTypes = {
  response: PropTypes.object.isRequired,
  identityServerUri: PropTypes.string.isRequired,
  currentUserTimeZone: PropTypes.string.isRequired,
};

export default PromptResponseHeader;
