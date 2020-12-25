import 'modules/_media-items.scss';
import React from 'react';
import PropTypes from 'prop-types';
import MediaItem from './media-item';

class MediaItems extends React.Component {
  static propTypes = {
    mediaItems: PropTypes.array.isRequired,
    viewMediaItem: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
    };
  }

  toggleExpanded = () => {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  };

  renderExpandToggler() {
    const togglerContent = (this.state.isExpanded) ? (
      <React.Fragment>
        <i className="icon-noun-circle-up" />
        <div className="more-text">
          view less
        </div>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <i className="icon-ion-more" />
        <div className="more-text">
          and {this.props.mediaItems.length - 4} more
        </div>
      </React.Fragment>
    );

    return (
      <button className="media-item-wrapper media-items-expander" onClick={this.toggleExpanded}>
        <div className="expander-content">
          {togglerContent}
        </div>
      </button>
    );
  }

  viewMediaItem = (mediaItem) => {
    this.props.viewMediaItem(mediaItem, this.props.mediaItems);
  };

  render() {
    let renderedMediaItems;
    let renderedToggler = null;
    if (this.props.mediaItems.length > 4) {
      renderedToggler = this.renderExpandToggler();
      renderedMediaItems = (this.state.isExpanded) ?
        this.props.mediaItems.map(curryMapMediaItemToComponent(this.viewMediaItem)) :
        this.props.mediaItems
          .slice(0, 4)
          .map(curryMapMediaItemToComponent(this.viewMediaItem));
    } else {
      renderedMediaItems =
        this.props.mediaItems.map(curryMapMediaItemToComponent(this.viewMediaItem));
    }

    return (
      <div className="media-items-wrapper">
        {renderedMediaItems}
        {renderedToggler}
        <div className="clear" />
      </div>
    );
  }
}

function curryMapMediaItemToComponent(viewMediaItem) {
  return (mediaItem) => (
    <MediaItem
      key={mediaItem.assetId}
      mediaItem={mediaItem}
      clickAction={() => { viewMediaItem(mediaItem); }}
    />
  );
}

export default MediaItems;
