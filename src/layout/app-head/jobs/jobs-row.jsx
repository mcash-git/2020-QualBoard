import React from 'react';
import PropTypes from 'prop-types';
import InfiniteProgressBar from 'shared/components/progress/infinite-progress-bar';
import { enums } from '2020-qb4';
import { JobModel } from 'shared/models/job-model';

const UserJobStatuses = enums.userJobStatuses;

export default class JobsRow extends React.Component {
  static propTypes = {
    job: PropTypes.instanceOf(JobModel).isRequired,
    downloadJob: PropTypes.func.isRequired,
  };
  
  renderIsRunning = () => (
    <div className="job-running-line">
      <div className="job-title">{this.props.job.fileName || this.props.job.title}</div>
      <div className="job-progress">
        <InfiniteProgressBar
          width="69px"
          height="3px"
          lineColor=""
          fillColor=""
        />
      </div>
      {/* <div className="cancel">
        <i className="icon-cancel icon"></i>
      </div> */}
    </div>
  );

  renderError = () => (
    <div className="job-error">
      <div className="job-title">{this.props.job.fileName || this.props.job.title}</div>
      <div className="error">
        <i className="icon-error icon" />
      </div>
    </div>
  );

  renderSuccess = () => (
    <div className="job-success">
      <div className="job-title">{this.props.job.fileName || this.props.job.title}</div>
      <div className="success">
        <i className="icon-check_circle icon" />
      </div>
    </div>
  );
  
  renderDownload = () => (
    <button
      className="job-download"
      onClick={() => { this.props.downloadJob(this.props.job); }}
    >
      <div className="job-title">{this.props.job.fileName || this.props.job.title}</div>
      <div className="download">
        <i className="icon-Download icon" />
      </div>
    </button>
  );

  render() {
    const status = UserJobStatuses[this.props.job.status.int];
    if (status === UserJobStatuses.queued || status === UserJobStatuses.inProgress) {
      return this.renderIsRunning();
    }

    if (status === UserJobStatuses.complete) {
      if (this.props.job.downloadLink) {
        return this.renderDownload();
      }
      return this.renderSuccess();
    }

    if (status === UserJobStatuses.failed) {
      return this.renderError();
    }
  }
}
