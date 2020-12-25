import React from 'react';
import PropTypes from 'prop-types';
import { VideoInsightBag } from 'researcher/models/video-insight-bag';
import { VideoInsightBookmark } from 'researcher/components/insights/video-insight-bookmark';
import { VideoInsightClipPlayer } from './video-insight-clip-player';

const onContextMenu = (event) => {
  event.stopPropagation();
  event.preventDefault();
  return false;
};

export class VideoInsightClipModalContent extends React.Component {
  static propTypes = {
    insight: PropTypes.instanceOf(VideoInsightBag).isRequired,
    mediaApiBaseUrl: PropTypes.string.isRequired,
    currentUserTimeZone: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    saveInsight: PropTypes.func.isRequired,
    removeInsight: PropTypes.func.isRequired,
  };
  
  componentWillMount() {
    this.mapPropsToState(this.props);
  }
  
  componentDidMount() {
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    window.document.addEventListener('keydown', this.boundHandleKeyDown);
  }
  
  componentWillReceiveProps(newProps) {
    if (newProps.insight !== this.state.insight) {
      this.replacePlayerInsight(newProps.insight, this.state.insight);
      this.mapPropsToState(newProps);
    }
  }
  
  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.boundHandleKeyDown);
  }
  
  mapPropsToState(props) {
    const { insight } = props;
    this.setState({
      insight,
    });
  }
  
  handleKeyDown(e) {
    if (e.target.matches('input,textarea,select') || e.keyCode !== 32) {
      return true;
    }
    
    this.togglePlay();
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  
  togglePlay() {
    this.videoInsightClipPlayer.togglePlay();
  }
  
  replacePlayerInsight(newInsight, oldInsight) {
    this.videoInsightClipPlayer.receiveUpdatedInsight(newInsight, oldInsight);
  }
  
  render() {
    const {
      closeModal,
      mediaApiBaseUrl,
      currentUserTimeZone,
      confirm,
      saveInsight,
      removeInsight,
    } = this.props;
    
    const toggleLoopInsight = () => {
      this.state.insight.isLooping = !this.state.insight.isLooping;
      this.mapPropsToState({ insight: this.state.insight });
      this.videoInsightClipPlayer.toggleLoopInsight(this.state.insight);
    };
    
    const edit = () => {
      this.state.insight.writeModel = this.state.insight.readModel.toWriteModel();
      this.state.insight.isEditing = true;
      this.mapPropsToState({
        insight: this.state.insight,
      });
      this.videoInsightClipPlayer.editInsight(this.state.insight);
    };
    
    const cancelEditing = () => {
      this.state.insight.isEditing = false;
      this.state.insight.isLooping = false;
      this.mapPropsToState({
        insight: this.state.insight,
      });
      this.videoInsightClipPlayer.finishEditingInsight(this.state.insight);
    };
    
    const { fileName } = this.state.insight.readModel;
    
    const confirmDelete = async () => {
      const shouldDelete = await confirm({
        text: 'Are you sure you want to delete this annotation/clip from the system?',
        title: 'Delete Confirmation',
        confirmButtonClass: 'btn-danger',
        confirmButtonText: 'Delete',
        cancelButtonClass: 'btn-outline-secondary',
      });
      
      if (shouldDelete) {
        await removeInsight(this.state.insight);
        closeModal();
      }
    };
    
    const confirmSaveAndClose = async () => {
      const shouldSaveAndClose = await confirm({
        title: 'Would you like to save?',
        text: 'You have some unsaved changes to the insight bookmark you are editing.',
        confirmButtonText: 'Save Bookmark',
        confirmButtonClass: 'btn-warning',
        cancelButtonText: 'Cancel',
        cancelButtonClass: 'btn-outline-secondary',
        titleIconClass: 'icon-warning warn',
        titleClass: 'warn',
        textClass: 'warn',
      });
      
      if (shouldSaveAndClose) {
        await saveInsight(this.state.insight);
        closeModal();
      }
    };
    
    const tryCloseModal = async () => {
      if (this.state.insight.isEditing) {
        confirmSaveAndClose();
      } else {
        closeModal();
      }
    };
    
    const save = () => saveInsight(this.state.insight);
  
    return (
      <div className="custom-modal clip-modal fs">
        <div className="media-modal-content-wrapper">
          <div
            className="media-item-modal-content"
            onContextMenu={onContextMenu}
          >
            <button
              className="modal-close"
              onClick={tryCloseModal}
            >
              <i className="icon-close" />
            </button>
            <VideoInsightClipPlayer
              ref={(component) => { this.videoInsightClipPlayer = component; }}
              insight={this.state.insight}
              mediaApiBaseUrl={mediaApiBaseUrl}
            />
          </div>
          <div className="media-insights-panel active">
            <div className="media-insights-panel-header">
              <h6 className="media-insights-panel-title">
                <i className="icon-ion-android-film" />
                Clip
              </h6>
              <div className="clear" />
            </div>
            <div className="insight-bookmarks">
              <VideoInsightBookmark
                insight={this.state.insight}
                currentUserTimeZone={currentUserTimeZone}
                toggleLoopInsight={toggleLoopInsight}
                save={save}
                remove={confirmDelete}
                edit={edit}
                cancelEditing={cancelEditing}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
