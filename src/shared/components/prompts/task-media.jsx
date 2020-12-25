import React from 'react';
import PropTypes from 'prop-types';
import MediaItems from 'shared/components/media/media-items';

const TaskMedia = ({ mediaItems }) => <MediaItems mediaItems={mediaItems} />;

TaskMedia.propTypes = {
  mediaItems: PropTypes.array.isRequired,
};

export default TaskMedia;
