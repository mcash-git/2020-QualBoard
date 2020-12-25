import React from 'react';
import PropTypes from 'prop-types';
import SidebarTask from './sidebar-task';


const ActivityTasksSidebar = ({ tasks, selectTask, selectedTask }) => {
  return (
    <div className="activity-tasks-sidebar">
      {tasks
        .map((t) => (
          <SidebarTask
            key={t.id}
            task={t}
            selectTask={selectTask}
            isSelected={selectedTask === t}
          />
        ))}
    </div>
  );
};

export default ActivityTasksSidebar;
