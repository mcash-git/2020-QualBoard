import React from 'react';
import PropTypes from 'prop-types';
import { AssetTypes } from '2020-media';
// import 'modules/_media-grid.scss';

const MediaItem = ({ mediaItem, clickAction }) => {
  const type = AssetTypes[mediaItem.type].value;
  const hasThumb = type === 'Video' || type === 'Image';

  const thumb = (hasThumb) ?
    <img alt="" className="media-thumbnail" src={`${mediaItem.thumbnailUrl}?h=63`} /> :
    <i className="icon-insert_drive_file" />;

  const overlayIcon = (hasThumb) ?
    'icon-zoom_in' :
    'icon-download';

  return (
    <button
      className="media-item-wrapper"
      onClick={() => clickAction(mediaItem)}
    >
      <div className="overlay">
        <i className={overlayIcon} />
      </div>
      <div className="media-thumbnail-container">
        {thumb}
      </div>
    </button>
  );
};

MediaItem.propTypes = {
  mediaItem: PropTypes.object.isRequired,
  clickAction: PropTypes.func.isRequired,
};

export default MediaItem;
