import React from 'react';
import PropTypes from 'prop-types';
import { PaginationPageModel } from 'shared/models/pagination-page-model';
import { Pagination } from 'shared/components/pagination/pagination';
import { DefaultContent } from 'shared/components/default-content';
import Asset from './asset';

export const ParticipantMedia = ({
  currentPage,
  selectedAssets,
  toggleSelectAsset,
  selectPage,
  viewAsset,
  downloadAsset,
  deleteAsset,
  projectHasMedia,
}) => ((currentPage.items.length > 0) ?
  renderMedia({
    currentPage,
    selectedAssets,
    toggleSelectAsset,
    selectPage,
    viewAsset,
    downloadAsset,
    deleteAsset,
  }) :
  renderNoMedia(projectHasMedia));

ParticipantMedia.propTypes = {
  currentPage: PropTypes.instanceOf(PaginationPageModel).isRequired,
  selectedAssets: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectPage: PropTypes.func.isRequired,
  toggleSelectAsset: PropTypes.func.isRequired,
  viewAsset: PropTypes.func.isRequired,
  deleteAsset: PropTypes.func.isRequired,
  downloadAsset: PropTypes.func.isRequired,
  projectHasMedia: PropTypes.bool.isRequired,
};

function renderNoMedia(projectHasMedia) {
  const message = (projectHasMedia) ?
    'No results' :
    'No participant media';

  return <DefaultContent iconClass="icon-media" message={message} />;
}
/* eslint-disable react/prop-types */
function renderMedia({
  currentPage,
  selectedAssets,
  toggleSelectAsset,
  selectPage,
  viewAsset,
  downloadAsset,
  deleteAsset,
}) {
  /* eslint-enable */
  const containerClasses =
    `${selectedAssets.length === 0 ? '' : 'is-selecting '}assets`;

  const pagination = (currentPage.totalPages < 2) ?
    null : (
      <Pagination
        currentPage={currentPage}
        selectPage={selectPage}
      />
    );

  return (
    <section>
      <section className="tt_qb_content-padding">
        <div className={containerClasses}> {
          currentPage.items.map((asset) => (
            <Asset
              key={`asset-${asset.id}`}
              asset={asset}
              selectedAssets={selectedAssets}
              toggleSelectAsset={toggleSelectAsset}
              selectPage={selectPage}
              viewAsset={viewAsset}
              downloadAsset={downloadAsset}
              deleteAsset={deleteAsset}
            />
          ))}
        </div>
      </section>
      {pagination}
    </section>
  );
}
