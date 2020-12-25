/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import videojs from '2020-videojs-annotations';
import { VideoInsightBag } from 'researcher/models/video-insight-bag';

const defaultVideojsOptions = {
  controlBar: {
    volumePanel: {
      inline: false,
    },
  },
};

const getThumbnailUrl = (assetUrl, thumbTime) =>
  `${assetUrl}/thumb${(thumbTime !== null) ? `?thumbnailTime=${Math.floor(thumbTime * 1000)}` : ''}`;

export class VideoPlayer extends React.Component {
  static propTypes = {
    isAnnotationsEnabled: PropTypes.bool,
    shouldShowAnnotations: PropTypes.bool,
    insights: PropTypes.arrayOf(PropTypes.instanceOf(VideoInsightBag)),
    assetId: PropTypes.string.isRequired,
    mediaApiBaseUrl: PropTypes.string.isRequired,
    videojsOptions: PropTypes.object,
    thumbnailTime: PropTypes.number,
  };

  static defaultProps = {
    isAnnotationsEnabled: false,
    shouldShowAnnotations: true,
    insights: [],
    videojsOptions: {},
    thumbnailTime: null,
  };

  componentWillMount() {
    this.setState({
      videojsOptions: {
        ...defaultVideojsOptions,
        ...this.props.videojsOptions,
      },
    });
  }

  componentDidMount() {
    if (this.props.isAnnotationsEnabled) {
      this.state.videojsOptions.plugins = {
        annotationsPlugin: {
          annotations: this.props.insights,
          shown: this.props.shouldShowAnnotations,
        },
      };

      this.player = videojs(this.videoElement, this.state.videojsOptions);
      this.videojsAnnotationsPlugin = this.player.annotationsPlugin();
    } else {
      this.player = videojs(this.videoElement, this.state.videojsOptions);
    }
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  togglePlay() {
    if (this.player.paused()) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }

  render() {
    const { mediaApiBaseUrl, assetId, thumbnailTime } = this.props;
    const url = `${mediaApiBaseUrl}/video/${assetId}`;
    const thumbnailUrl = getThumbnailUrl(url, thumbnailTime);
    return (
      <div className="video-player">
        <video
          className="video-js vjs-default-skin"
          controls
          preload="auto"
          poster={thumbnailUrl}
          ref={(element) => { this.videoElement = element; }}
        >
          <source
            src={url}
            type="video/mp4"
          />
        </video>
      </div>
    );
  }
}
