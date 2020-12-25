import React from 'react';
import PropTypes from 'prop-types';
import { VideoAssetInsightReadModel } from 'researcher/models/video-asset-insight-model';
import { formatMoment } from 'shared/value-converters/format-moment';
import { formatSeconds } from 'shared/value-converters/format-seconds';
import { VideoInsightBookmarkBase } from './video-insight-bookmark-base';

export const VideoInsightBookmarkRead = ({
  readModel,
  currentUserTimeZone,
  toggleLoopInsight,
  isLooping,
  edit,
  remove,
}) => {
  const creatorDisplayName = readModel.projectUser.displayName;
  const createdOn = formatMoment(readModel.createdOn, currentUserTimeZone);
  const loopButtonIcon = isLooping ? 'icon-pause' : 'icon-play_arrow';
  const start = formatSeconds(readModel.start);
  const end = formatSeconds(readModel.end);
  const commentText = readModel.comments[0].text;
  
  const body = <div className="annotation-body">{commentText}</div>;
  const buttons = [(
    <button
      key="edit-button"
      className="icon-button"
      onClick={edit}
    >
      <i className="icon-mode_edit" />
    </button>
  ), (
    <button
      key="remove-button"
      className="icon-button"
      onClick={remove}
    >
      <i className="icon-delete" />
    </button>
    )];
  
  return (
    <VideoInsightBookmarkBase
      creatorDisplayName={creatorDisplayName}
      createdOn={createdOn}
      toggleLoopInsight={toggleLoopInsight}
      loopButtonIcon={loopButtonIcon}
      start={start}
      end={end}
      body={body}
      buttons={buttons}
    />
  );
};

VideoInsightBookmarkRead.propTypes = {
  readModel: PropTypes.instanceOf(VideoAssetInsightReadModel).isRequired,
  currentUserTimeZone: PropTypes.string.isRequired,
  isLooping: PropTypes.bool.isRequired,
  toggleLoopInsight: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};
