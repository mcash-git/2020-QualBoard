import React from 'react';
import PropTypes from 'prop-types';
import { VideoInsightBag } from 'researcher/models/video-insight-bag';
import { VideoInsightBookmarkRead } from './video-insight-bookmark/video-insight-bookmark-read';
import { VideoInsightBookmarkWrite } from './video-insight-bookmark/video-insight-bookmark-write';

export const VideoInsightBookmark = ({
  insight,
  edit,
  cancelEditing,
  save,
  remove,
  toggleLoopInsight,
  currentUserTimeZone,
}) => {
  const content = (insight.isEditing) ? (
    <VideoInsightBookmarkWrite
      writeModel={insight.writeModel}
      isLooping={insight.isLooping}
      currentUserTimeZone={currentUserTimeZone}
      toggleLoopInsight={toggleLoopInsight}
      cancelEditing={cancelEditing}
      save={save}
    />
  ) : (
    <VideoInsightBookmarkRead
      readModel={insight.readModel}
      isLooping={insight.isLooping}
      currentUserTimeZone={currentUserTimeZone}
      toggleLoopInsight={toggleLoopInsight}
      remove={remove}
      edit={edit}
    />
  );
  
  return (
    <div className="insight-bookmark">
      {content}
    </div>
  );
};

VideoInsightBookmark.propTypes = {
  insight: PropTypes.instanceOf(VideoInsightBag).isRequired,
  currentUserTimeZone: PropTypes.string.isRequired,
  toggleLoopInsight: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  cancelEditing: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};
