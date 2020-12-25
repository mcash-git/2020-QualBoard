import React from 'react';
import PropTypes from 'prop-types';

export const VideoInsightBookmarkBase = ({
  creatorDisplayName,
  createdOn,
  toggleLoopInsight,
  loopButtonIcon,
  start,
  end,
  body,
  buttons,
}) => (
  <div className="insight-card card">
    <div className="card-head">
      <div className="circle-border-icon">
        <i className="icon-lightbulb_outline" />
      </div>
      <span className="creator-name">{creatorDisplayName}</span>
      <span className="created-date">{createdOn}</span>
      <span className="clear" />
    </div>
    <div className="card-body">
      <div className="video-play-control">
        <button
          className="btn btn-sm btn-secondary video-insight-play-button"
          onClick={toggleLoopInsight}
        >
          <span>
            <i className={loopButtonIcon} />
            &nbsp;
            Start: {start}
          </span>
          <span>
            End: {end}
          </span>
        </button>
      </div>
      <div className="insight-comment-head">
        <div className="creator-name">{creatorDisplayName}</div>
        <div className="created-date">{createdOn}</div>
        <div className="clear" />
      </div>
      <div className="text-body">
        {body}
      </div>
      <div className="card-buttons">
        {buttons}
      </div>
    </div>
  </div>
);

VideoInsightBookmarkBase.propTypes = {
  creatorDisplayName: PropTypes.string.isRequired,
  createdOn: PropTypes.string.isRequired,
  toggleLoopInsight: PropTypes.func.isRequired,
  loopButtonIcon: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.node).isRequired,
};
