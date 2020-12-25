import React from 'react';
import PropTypes from 'prop-types';
import ActivityTasksSidebar from './sidebar/activity-tasks-sidebar';
import ActivityTasksMain from './main-content/activity-tasks-main';

class ActivityTasks extends React.Component {
  static propTypes = {
    tasks: PropTypes.array.isRequired,
    identityServerUri: PropTypes.string.isRequired,
    currentUserTimeZone: PropTypes.string.isRequired,
    responses: PropTypes.array,
    selectedTask: PropTypes.object,
    selectTask: PropTypes.func.isRequired,
    currentProjectUser: PropTypes.object,
    viewMediaItem: PropTypes.func.isRequired,
    tryAddResponse: PropTypes.func.isRequired,
    removeWriteResponse: PropTypes.func.isRequired,
    setWriteResponseText: PropTypes.func.isRequired,
    submitWriteResponse: PropTypes.func.isRequired,
    isActivityOpen: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    selectedTask: null,
    responses: [],
    currentProjectUser: null,
  };

  render() {
    return (
      <div className="activity-tasks">
        <ActivityTasksSidebar
          tasks={this.props.tasks}
          selectedTask={this.props.selectedTask}
          selectTask={this.props.selectTask}
        />
        <ActivityTasksMain
          selectedTask={this.props.selectedTask}
          responses={this.props.responses}
          identityServerUri={this.props.identityServerUri}
          currentUserTimeZone={this.props.currentUserTimeZone}
          currentProjectUser={this.props.currentProjectUser}
          viewMediaItem={this.props.viewMediaItem}
          tryAddResponse={this.props.tryAddResponse}
          removeWriteResponse={this.props.removeWriteResponse}
          setWriteResponseText={this.props.setWriteResponseText}
          submitWriteResponse={this.props.submitWriteResponse}
          isActivityOpen={this.props.isActivityOpen}
        />
      </div>
    );
  }
}

export default ActivityTasks;
