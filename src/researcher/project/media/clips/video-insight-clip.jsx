import Checkbox from 'shared/components/checkbox';
import React from 'react';
import PropTypes from 'prop-types';
import { formatMoment } from 'shared/value-converters/format-moment';
import { formatSeconds } from 'shared/value-converters/format-seconds';
import { VideoInsightBag } from 'researcher/models/video-insight-bag';
import PopButtonMenu from 'shared/components/buttons/pop-button-menu';
import { fetchStatuses } from 'shared/enums/fetch-statuses';

class VideoInsightClip extends React.Component {
  static propTypes = {
    insight: PropTypes.instanceOf(VideoInsightBag).isRequired,
    selectedInsights: PropTypes.arrayOf(PropTypes.instanceOf(VideoInsightBag)).isRequired,
    currentUserTimeZone: PropTypes.string.isRequired,
    mediaApiBaseUrl: PropTypes.string.isRequired,
    toggleSelectInsight: PropTypes.func.isRequired,
    viewClip: PropTypes.func.isRequired,
    exportInsight: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      status: fetchStatuses.pending,
    };
  }

  renderThumbnail() {
    const {
      insight,
      mediaApiBaseUrl,
    } = this.props;

    const startMs = Math.floor(insight.start * 1000);

    const thumbnailUrl =
      `${mediaApiBaseUrl}/video/${insight.assetId}/thumb?thumbnailTime=${startMs}`;

    const mediaThumb = (
      <img
        alt=""
        className="thumb"
        src={thumbnailUrl}
        onError={() => {
          this.setState({
            status: fetchStatuses.failure,
          });
        }}
        onLoad={() => {
          this.setState({
            status: fetchStatuses.success,
          });
        }}
      />
    );

    switch (this.state.status) {
      case fetchStatuses.pending:
        return (
          <React.Fragment>
            {mediaThumb}
            <img
              alt=""
              src="/images/media-loader.svg"
              className="img-thumb-loader"
            />
          </React.Fragment>
        );
      case fetchStatuses.success:
        return (
          <React.Fragment>
            {mediaThumb}
          </React.Fragment>
        );
      default:
        return <i className="icon-ion-alert-circled" />;
    }
  }

  render() {
    const {
      insight,
      selectedInsights,
      toggleSelectInsight,
      currentUserTimeZone,
      viewClip,
      exportInsight,
    } = this.props;


    const createdOn = formatMoment(insight.createdOn, currentUserTimeZone, 'M/D/YYYY');
    const createdBy = insight.readModel.projectUser.displayName;
    const duration = formatSeconds(insight.end - insight.start);
    const checkboxChangeHandler = () => {
      toggleSelectInsight(insight);
    };

    const buttonId = `clip-popper-button-${insight.readModel.id.replace('urn:uuid:', '')}`;

    let buttonsContent;

    if (selectedInsights.length === 0) {
      buttonsContent = (
        <PopButtonMenu
          btnId={buttonId}
          containerClass="buttons"
        >
          <button
            className="drop-link"
            onClick={() => exportInsight(insight)}
          >
            <i className="dropdown-item-icon icon-get_app" />
            Download
          </button>
          <button
            className="drop-link"
            onClick={() => {
              alert('todo: delete');
            }}
          >
            <i className="dropdown-item-icon icon-delete" />
            Delete
          </button>
        </PopButtonMenu>
      );
    }

    const isSelected = selectedInsights.indexOf(insight) !== -1;

    let clipClass = 'video-insight-clip';

    if (isSelected) {
      clipClass = `${clipClass} is-selected`;
    }

    return (
      <div className="video-insight-clip-wrapper">
        <div
          role="button"
          tabIndex="0"
          className={clipClass}
          onClick={(event) =>
            handleClick(event, insight, selectedInsights, toggleSelectInsight, viewClip)}
          onKeyDown={(event) =>
            handleKeyDown(event, insight, selectedInsights, toggleSelectInsight, viewClip)}
        >
          <div className="thumb-container">
            <div className="checker">
              <Checkbox
                isChecked={isSelected}
                changeHandler={checkboxChangeHandler}
                checkboxId={`toggle-select-${insight.readModel.id}`}
              />
            </div>
            {this.renderThumbnail()}
          </div>
          <div className="details">
            <div className="details-left">
              <div className="file-name">{insight.readModel.fileName}</div>
              <div className="created-on">{createdOn}</div>
              <div className="created-by">{createdBy}</div>
            </div>
            <div className="details-right">
              <div className="clip-duration">
                <i className="icon-ion-android-film" />
                <span>{duration}</span>
              </div>
              {buttonsContent}
            </div>
            <div className="clear" />
          </div>
        </div>
      </div>
    );
  }
}

function isCheckboxClick(event) {
  return (event && event.target && event.target.closest('.custom-control'));
}

function isCircleButtonClick(event) {
  return (event && event.target && event.target.closest('.circle-button'));
}

function handleClick(event, insight, selectedInsights, toggleSelectInsight, viewClip) {
  if (isCheckboxClick(event) || isCircleButtonClick(event)) {
    return;
  }

  if (selectedInsights.length > 0) {
    toggleSelectInsight(insight);
    return;
  }

  viewClip(insight);
}

function handleKeyDown(event, insight, selectedInsights, toggleSelectInsight, viewClip) {
  if (event.keyCode === 32 || event.keyCode === 13) {
    handleClick(null, insight, selectedInsights, toggleSelectInsight, viewClip);
  }
}

export default VideoInsightClip;
