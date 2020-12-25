import React from 'react';
import PropTypes from 'prop-types';
import { DialogService } from 'aurelia-dialog';
import { IdentityClient } from '2020-identity';
import { connect } from 'react-redux';
import { growlProvider } from 'shared/growl-provider';
import { groupTagService } from 'shared/services/group-tag-service';
import { actions } from 'researcher/state/all-actions';
import groupTagAssignmentsSelector from 'researcher/state/group-tags/selectors/group-tag-assignments-selector';
import groupTagsFetchStatusSelector from 'researcher/state/group-tags/selectors/group-tags-fetch-status-selector';
import projectUsersFetchStatusSelector from 'researcher/state/project-users/selectors/project-users-fetch-status-selector';
import isEqual from 'lodash.isequal';
import { Api } from 'api/api';
import { ChildViewState } from 'shared/app-state/child-view-state';
import { fetchStatuses, combineFetchStatuses } from 'shared/enums/fetch-statuses';
import InfiniteProgressBar from 'shared/components/progress/infinite-progress-bar';
import { GroupTagModel } from 'researcher/models/group-tag-model';
import { DefaultContent } from 'shared/components/default-content';
import GroupsHeader from './groups-header.jsx';
import GroupsRow from './groups-row.jsx';

@connect(mapStateToProps, mapDispatchToProps)
export default class GroupsContainer extends React.Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    aureliaDependencies: PropTypes.shape({
      api: PropTypes.instanceOf(Api),
      identityClient: PropTypes.instanceOf(IdentityClient),
      dialogService: PropTypes.instanceOf(DialogService),
      childViewState: PropTypes.instanceOf(ChildViewState),
    }).isRequired,
    tags: PropTypes.arrayOf(PropTypes.instanceOf(GroupTagModel)),
    setGroupTags: PropTypes.func.isRequired,
    fetchStatus: PropTypes.string.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tags: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTag: null,
    };

    this.projectId = props.projectId;
    this.api = props.aureliaDependencies.api;
    this.identityClient = props.aureliaDependencies.identityClient;
    this.childViewState = props.aureliaDependencies.childViewState;

    this.deleteTag = this.deleteTag.bind(this);
    this.updateTag = this.updateTag.bind(this);
    this.removeParticipantFromGroupTag = this.removeParticipantFromGroupTag.bind(this);
  }

  async componentWillMount() {
    this.props.fetch({ projectId: this.props.projectId });
    this.mapPropsToState(this.props);
    this.childViewState.actionBarModel.react = this;
  }

  componentWillReceiveProps({ tags }) {
    if (tags !== this.props.tags) {
      this.mapPropsToState({ tags });
    }
  }

  componentDidUpdate() {
    if (this.state.activeTag) {
      const tag = this.props.tags.find(t => t.id === this.state.activeTag.id);
      this.childViewState.sidebarModel.tag = tag;
    }
  }

  setReduxState(tags) {
    this.props.setGroupTags({ projectId: this.projectId, tags });
  }

  setActiveTagHandler(tag) {
    const model = { tag, react: this };
    this.childViewState.sidebarModel = model;
    this.childViewState.sidebarOpen = true;

    if (this.state.activeTag !== tag.id) {
      this.setState({ activeTag: tag });
    }
  }

  mapPropsToState({ tags }) {
    this.setState({
      tags: tags && tags.sort(compareTags),
    });
  }

  isActive(id) {
    if (this.state.activeTag) {
      return this.state.activeTag.id === id;
    }
    return false;
  }

  closeSidebar() {
    this.childViewState.sidebarOpen = false;
    this.setState({ activeTag: null });
  }

  createTagCmnd(tag) {
    return groupTagService.commandCreateTag(this.api, tag, this.projectId);
  }

  removeTagCmnd(tag) {
    return groupTagService.commandRemoveTag(this.api, tag);
  }

  updateTagCmnd(tag) {
    return groupTagService.commandUpdateTag(this.api, tag);
  }

  removeParticipantFromTagCmnd(tag, participant) {
    return groupTagService.commandRemoveParticipantFromTag(this.identityClient, tag, participant);
  }

  async addTag(tagName) {
    const tag = {
      name: tagName,
      projectId: this.projectId,
      color: null,
      tagLower: tagName.toLowerCase(),
      participants: [],
    };

    const oldState = this.props.tags;
    const success = await this.createTagCmnd(tag);
    if (!success) {
      return;
    }

    this.noSseCheck(oldState);
    growlProvider.success('Success', 'You added a new tag.');
  }

  async deleteTag(tag) {
    this.childViewState.sidebarOpen = false;

    const oldState = this.props.tags;
    const success = await this.removeTagCmnd(tag);
    if (!success) {
      return;
    }

    this.noSseCheck(oldState);
    growlProvider.success('Success', 'Group tag successfully removed.');
  }

  async updateTag(tag) {
    const { oldState } = this.props;
    const success = await this.updateTagCmnd(tag);
    if (!success) {
      return;
    }

    this.noSseCheck(oldState);
    growlProvider.success('Success', 'Group tag successfully updated.');
  }

  async removeParticipantFromGroupTag(tag, participant) {
    const oldState = this.props.tags;
    const success = await this.removeParticipantFromTagCmnd(tag, participant);
    if (!success) {
      return;
    }

    this.noSseCheck(oldState);
    growlProvider.success('Success', 'Participant was removed from the group.');
  }

  // basically we are just going to look at the old state and
  // compare it with the new state. if they are the same that means
  // something didn't change so we will refetch to be sure that we have
  // the latest changes.
  noSseCheck(oldState) {
    setTimeout(async () => {
      if (isEqual(oldState, this.props.tags)) {
        console.log('NO SSE! GETTING STATE MANUALLY'); // eslint-disable-line
        this.props.fetch({ projectId: this.props.projectId });
      }
    }, 2000);
  }

  repeatGroupRows(tags) {
    return tags.map((tag) => (
      <GroupsRow
        key={tag.id}
        tag={tag}
        tags={this.state.tags}
        deleteTag={this.deleteTag}
        updateTag={this.updateTag}
        aureliaDependencies={this.props.aureliaDependencies}
        isActive={this.isActive(tag.id)}
        setActive={() => this.setActiveTagHandler(tag)}
      />
    ));
  }

  render() {
    if (this.state.activeTag && !this.childViewState.sidebarOpen) {
      // NOTE: refactor - you should never set state in render()
      this.state.activeTag = null;
    }

    if (this.props.fetchStatus === fetchStatuses.pending) {
      return <InfiniteProgressBar width="100%" height="5px" />;
    }

    if (this.props.fetchStatus === fetchStatuses.failure) {
      return 'FAILURE';
    }

    if (this.state.tags && this.state.tags.length < 1) {
      return (
        <DefaultContent
          iconClass="icon-group-tags"
          message="This project has no group tags. You may create or import Group Tags above."
        />
      );
    }

    return (
      <div className="tt_qb_content-padding">
        <div className="groups-container">
          <div className="groups-list-wrapper">
            <GroupsHeader />
            {this.repeatGroupRows(this.state.tags)}
          </div>
        </div>
      </div>
    );
  }
}

function compareTags(a, b) {
  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1;
  }
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  }
  return 0;
}

function mapStateToProps(state) {
  return {
    fetchStatus: combineFetchStatuses([
      groupTagsFetchStatusSelector(state),
      projectUsersFetchStatusSelector(state),
    ]),
    tags: groupTagAssignmentsSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: ({ projectId }) => dispatch(actions.groupTags.fetch({ projectId })),
    setGroupTags: ({ projectId, tags }) => dispatch(actions.groupTags.set({ projectId, tags })),
  };
}
