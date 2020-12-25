import React from 'react';
import PropTypes from 'prop-types';
import { VideoInsightBag } from 'researcher/models/video-insight-bag';
import { VideoPlayer } from 'shared/components/video-player';

export class VideoInsightClipPlayer extends React.Component {
  static propTypes = {
    insight: PropTypes.instanceOf(VideoInsightBag).isRequired,
    mediaApiBaseUrl: PropTypes.string.isRequired,
  };
  
  componentDidMount() {
    this.videoPlayer.videojsAnnotationsPlugin.selectAnnotation(this.props.insight);
  }
  
  toggleLoopInsight(insight) {
    this.videoPlayer.videojsAnnotationsPlugin.toggleLoopAnnotation(insight);
  }
  
  editInsight(insight) {
    this.videoPlayer.videojsAnnotationsPlugin.editAnnotation(insight);
  }
  
  finishEditingInsight(insight) {
    this.videoPlayer.videojsAnnotationsPlugin.finishEditingAnnotation(insight);
  }
  
  togglePlay() {
    this.videoPlayer.togglePlay();
  }
  
  receiveUpdatedInsight(newInsight, oldInsight) {
    if (oldInsight.isEditing) {
      this.videoPlayer.videojsAnnotationsPlugin.finishEditingAnnotation(oldInsight);
    }
    this.videoPlayer.videojsAnnotationsPlugin.removeAnnotation(oldInsight);
    this.videoPlayer.videojsAnnotationsPlugin.addAnnotation(newInsight, oldInsight.isEditing);
    this.videoPlayer.videojsAnnotationsPlugin.selectAnnotation(newInsight);
  }
  
  render() {
    const { insight, mediaApiBaseUrl } = this.props;
    const insights = [insight];
  
    return (
      <VideoPlayer
        ref={(component) => { this.videoPlayer = component; }}
        assetId={insight.assetId}
        mediaApiBaseUrl={mediaApiBaseUrl}
        thumbnailTime={insight.start}
        isAnnotationsEnabled
        insights={insights}
      />
    );
  }
}
