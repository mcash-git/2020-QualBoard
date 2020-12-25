import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { actions } from 'researcher/state/all-actions';
import { OidcWrapper } from 'shared/auth/oidc-wrapper';
import jobsSelector from 'researcher/state/jobs/selectors/jobs-selector';
import classNames from 'classnames';
import JobsRow from './jobs-row';

const spinnerBadgeTimeoutMs = 5000;

const mapStateToProps = (state) => ({
  jobs: jobsSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  setJobs: (jobs) => dispatch(actions.jobs.set(jobs)),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class JobsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverOpen: false,
    };

    this.api = props.aureliaDependencies.api;
  }

  async componentWillMount() {
    const jobsPagination = await this.api.query.jobs.getJobs();
    this.setReduxState(jobsPagination.items);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.jobs ||
      this.state.isNewJobAdded ||
      nextProps.jobs.today
        .every((nextJob) => this.props.jobs.today.some((thisJob) => nextJob.id === thisJob.id))) {
      return;
    }
    setTimeout(() => {
      this.setState({
        isNewJobAdded: false,
      });
    }, spinnerBadgeTimeoutMs);
    this.setState({
      isNewJobAdded: true,
    });
  }

  setReduxState(jobs) {
    this.props.setJobs(jobs);
  }

  toggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  };

  downloadJob = (job) => {
    if (/\.pdf$/i.test(job.fileName)) {
      this.downloadPdfJob(job);
    } else {
      this.downloadOtherJob(job);
    }
  };

  downloadPdfJob = async (pdfJob) => {
    const windowRef = window.open();
    windowRef.location.href = await this.api.query.jobs.getJobTempUrl(pdfJob.downloadLink);
  };

  downloadOtherJob = async (job) => {
    location.href = await this.api.query.jobs.getJobTempUrl(job.downloadLink);
  };

  displayPopperBody = () => {
    if (!this.props.jobs ||
      (this.props.jobs.today.length === 0 &&
      this.props.jobs.yesterday.length === 0 &&
      this.props.jobs.week.length === 0 &&
      this.props.jobs.older.length === 0)
    ) {
      return this.noJobs();
    }

    return this.hasJobs();
  };

  noJobs = () => (
    <div className="no-jobs">
      No recent downloads
    </div>
  );

  hasJobs = () => (
    <div className="has-jobs">
      { this.props.jobs.today.length > 0 &&
        <div>
          <div className="header">TODAY</div>
          {this.repeatJobs(this.props.jobs.today)}
        </div>
      }

      { this.props.jobs.yesterday.length > 0 &&
        <div>
          <div className="header">YESTERDAY</div>
          {this.repeatJobs(this.props.jobs.yesterday)}
        </div>
      }

      { this.props.jobs.week.length > 0 &&
        <div>
          <div className="header">THIS WEEK</div>
          {this.repeatJobs(this.props.jobs.week)}
        </div>
      }

      { this.props.jobs.older.length > 0 &&
        <div>
          <div className="header">OLDER</div>
          {this.repeatJobs(this.props.jobs.older)}
        </div>
      }
    </div>
  );


  repeatJobs = (jobs) =>
    jobs.map((job) => (
      <JobsRow
        key={`jobs-row-${job.id}`}
        job={job}
        downloadJob={this.downloadJob}
      />
    ));

  render() {
    const badgeClasses = classNames({
      badge: true,
      hidden: !this.state.isNewJobAdded,
    });
    const spinnerActivate = classNames({
      'badge-spinner': true,
      animation: this.state.isNewJobAdded,
    });
    return (
      <div className="jobs">
        <button className="nav-link" id="down-pop" onClick={this.toggle}>
          <i className="icon-Download icon" />
          <div className={badgeClasses}>
            <div className={spinnerActivate} />
          </div>
          <div className="downloads-text">DOWNLOADS</div>
        </button>
        <Popover className="popper" placement="bottom" isOpen={this.state.popoverOpen} target="down-pop" toggle={this.toggle}>
          <PopoverHeader className="popper-header">
            <div className="title">DOWNLOADS</div>
          </PopoverHeader>
          <PopoverBody className="popper-body">
            {this.displayPopperBody()}
          </PopoverBody>
        </Popover>
      </div>
    );
  }
}

JobsContainer.propTypes = {
  jobs: PropTypes.shape({
    today: PropTypes.array,
    yesterday: PropTypes.array,
    week: PropTypes.array,
    older: PropTypes.array,
  }),
  setJobs: PropTypes.func,
  aureliaDependencies: PropTypes.shape({
    api: PropTypes.object,
    oidcWrapper: PropTypes.instanceOf(OidcWrapper),
  }).isRequired,
};

JobsContainer.defaultProps = {
  jobs: {
    today: [],
    yesterday: [],
    week: [],
    older: [],
  },
  setJobs: () => {},
};
