import React from 'react';
import PropTypes from 'prop-types';
import { DefaultContent } from 'shared/components/default-content';
import { Pagination } from 'shared/components/pagination/pagination';
import { PaginationPageModel } from 'shared/models/pagination-page-model';
import { VideoInsightBag } from 'researcher/models/video-insight-bag';
import VideoInsightClip from './video-insight-clip';

// TODO: selected state, add class .is-selecting on .media-picker-thumb-container
const renderClips = ({
  currentPage,
  selectedInsights,
  currentUserTimeZone,
  selectPage,
  toggleSelectInsight,
  mediaApiBaseUrl,
  viewClip,
  exportInsight,
}) => {
  const containerClasses =
    `${selectedInsights.length === 0 ? '' : 'is-selecting '}video-insight-clips`;

  const pagination = (currentPage.totalPages === 1) ?
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
          currentPage.items.map((insight) => (
            <VideoInsightClip
              key={insight.readModel.id}
              insight={insight}
              selectedInsights={selectedInsights}
              currentUserTimeZone={currentUserTimeZone}
              mediaApiBaseUrl={mediaApiBaseUrl}
              toggleSelectInsight={toggleSelectInsight}
              selectPage={selectPage}
              viewClip={viewClip}
              exportInsight={exportInsight}
            />
        ))}
        </div>
      </section>
      {pagination}
    </section>
  );
};

const renderNoClips = () => (
  <DefaultContent
    iconClass="icon-ion-android-film"
    message="This project has no clips.  Create some insights on participant video submissions and return to view the clips."
  />
);

export const Clips = (props) => (
  (props.currentPage.totalItems === 0) ?
    renderNoClips() :
    renderClips(props));

Clips.propTypes = {
  currentPage: PropTypes.instanceOf(PaginationPageModel).isRequired,
  selectedInsights: PropTypes.arrayOf(PropTypes.instanceOf(VideoInsightBag)).isRequired,
  currentUserTimeZone: PropTypes.string.isRequired,
  selectPage: PropTypes.func.isRequired,
  toggleSelectInsight: PropTypes.func.isRequired,
  mediaApiBaseUrl: PropTypes.string.isRequired,
  viewClip: PropTypes.func.isRequired,
  exportInsight: PropTypes.func.isRequired,
};

renderClips.propTypes = Clips.propTypes;
