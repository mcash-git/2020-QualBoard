import React from 'react';
import PropTypes from 'prop-types';
import { VideoAssetInsightWriteModel } from 'researcher/models/video-asset-insight-model';
import { formatMoment } from 'shared/value-converters/format-moment';
import { formatSeconds } from 'shared/value-converters/format-seconds';
import { VideoInsightBookmarkBase } from './video-insight-bookmark-base';

export class VideoInsightBookmarkWrite extends React.Component {
  static propTypes = {
    writeModel: PropTypes.instanceOf(VideoAssetInsightWriteModel).isRequired,
    currentUserTimeZone: PropTypes.string.isRequired,
    isLooping: PropTypes.bool.isRequired,
    toggleLoopInsight: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    cancelEditing: PropTypes.func.isRequired,
  };
  
  componentWillMount() {
    this.mapPropsToState(this.props);
  }
  
  componentWillReceiveProps(newProps) {
    if (newProps.writeModel !== this.state.writeModel) {
      this.mapPropsToState(newProps);
    }
  }
  
  mapPropsToState(props) {
    const { writeModel } = props;
    this.setState({
      writeModel,
    });
  }
  
  handleCommentChange(event) {
    const { value } = event.target;
    
    this.state.writeModel.comments[0].text = value;
    
    this.setState({
      writeModel: this.state.writeModel,
    });
  }
  
  render() {
    const {
      currentUserTimeZone,
      toggleLoopInsight,
      isLooping,
      save,
      cancelEditing,
    } = this.props;
    
    const creatorDisplayName = this.state.writeModel.projectUser.displayName;
    const createdOn = formatMoment(this.state.writeModel.createdOn, currentUserTimeZone);
    const loopButtonIcon = isLooping ? 'icon-pause' : 'icon-play_arrow';
    const start = formatSeconds(this.state.writeModel.start);
    const end = formatSeconds(this.state.writeModel.end);
    const commentText = this.state.writeModel.comments[0].text;
  
    const body = (
      <textarea
        className="form-control"
        value={commentText}
        onChange={(event) => { this.handleCommentChange(event); }}
      />
    );
    
    const buttons = [(
      <button
        key="cancel-button"
        className="btn btn-xs btn-outline-secondary"
        onClick={cancelEditing}
      >
        Cancel
      </button>
    ), (
      <button
        key="save-button"
        className="btn btn-xs btn-secondary"
        onClick={save}
      >
        Save
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
  }
}
