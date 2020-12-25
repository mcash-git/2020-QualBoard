import React from 'react';
import PropTypes from 'prop-types';
import { AssetTypes } from '2020-media';
import PopButtonMenu from 'shared/components/buttons/pop-button-menu';
import { formatSeconds } from 'shared/value-converters/format-seconds';
import Checkbox from 'shared/components/checkbox';
import bytesToHuman from 'shared/utility/bytes-to-human';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import LoaderImg from '../../../../shared/components/loader-img';

class Asset extends React.Component {
  static propTypes = {
    asset: PropTypes.object.isRequired,
    selectedAssets: PropTypes.arrayOf(PropTypes.string).isRequired,
    toggleSelectAsset: PropTypes.func.isRequired,
    viewAsset: PropTypes.func.isRequired,
    deleteAsset: PropTypes.func.isRequired,
    downloadAsset: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      status: fetchStatuses.pending,
    };
  }

  renderThumbnail() {
    if (!assetHasThumbnail(this.props.asset)) {
      return <i className="icon-insert_drive_file" />;
    }

    const mediaThumb = (
      <img
        alt=""
        className="thumb"
        src={`${this.props.asset.thumbnailUrl}?h=110`}
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
            <LoaderImg className="img-thumb-loader" />
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
      asset,
      selectedAssets,
      toggleSelectAsset,
      viewAsset,
      downloadAsset,
      deleteAsset,
    } = this.props;

    const duration = asset.durationMs && formatSeconds(asset.durationMs / 1000);

    // NOTE - the thumbnail
    const buttonId = `asset-popper-button-${asset.id}`;

    let buttonsContent;

    if (selectedAssets.length === 0) {
      buttonsContent = (
        <PopButtonMenu
          btnId={buttonId}
          containerClass="buttons"
        >
          <button
            className="drop-link"
            onClick={() => downloadAsset(asset)}
          >
            <i className="dropdown-item-icon icon-get_app" />
            Download
          </button>
          <button
            className="drop-link"
            onClick={() => deleteAsset(asset)}
          >
            <i className="dropdown-item-icon icon-delete" />
            Delete
          </button>
        </PopButtonMenu>
      );
    }

    const isSelected = selectedAssets.indexOf(asset.id) !== -1;

    let assetClass = 'asset';

    if (isSelected) {
      assetClass = `${assetClass} is-selected`;
    }

    return (
      <div className="asset-wrapper">
        <div
          role="button"
          tabIndex="0"
          className={assetClass}
          onClick={(event) =>
            handleClick(event, asset, selectedAssets, toggleSelectAsset, viewAsset, downloadAsset)}
          onKeyDown={(event) => handleKeyDown(
            event,
            asset,
            selectedAssets,
            toggleSelectAsset,
            viewAsset,
            downloadAsset,
          )}
        >
          <div className="thumb-container">
            <div className="checker">
              <Checkbox
                isChecked={isSelected}
                changeHandler={() => toggleSelectAsset({ assetId: asset.id })}
                checkboxId={`toggle-select-${asset.id}`}
              />
            </div>
            {this.renderThumbnail()}
          </div>
          <div className="details">
            <div className="details-left">
              <div className="file-name">{asset.name || asset.fileName}</div>
              <div className="created-on">{asset.createdOn}</div>
              <div className="file-size">{bytesToHuman(asset.fileSize)}</div>
              <div className="created-by">{asset.createdBy}</div>
            </div>
            <div className="details-right">
              <div className="video-duration">
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

function handleClick(event, asset, selectedAssets, toggleSelectAsset, viewAsset, downloadAsset) {
  if (isCheckboxClick(event) || isCircleButtonClick(event)) {
    return;
  }

  if (selectedAssets.length > 0) {
    toggleSelectAsset({ assetId: asset.id });
    return;
  }

  const type = AssetTypes[asset.type].value;

  if (type === 'Image' || type === 'Video') {
    viewAsset(asset);
  } else {
    downloadAsset(asset);
  }
}

function handleKeyDown(event, asset, selectedAssets, toggleSelectAsset, viewAsset, downloadAsset) {
  if (event.keyCode === 32 || event.keyCode === 13) {
    handleClick(null, asset, selectedAssets, toggleSelectAsset, viewAsset, downloadAsset);
  }
}

function assetHasThumbnail(asset) {
  const type = AssetTypes[asset.type].value;
  return type === 'Image' || type === 'Video';
}

export default Asset;
