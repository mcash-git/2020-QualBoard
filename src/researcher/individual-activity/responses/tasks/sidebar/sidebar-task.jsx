import React from 'react';
import PropTypes from 'prop-types';
import { enums } from '2020-qb4';

const PromptTypes = enums.promptTypes;

const SidebarTask = ({ task, isSelected, selectTask }) => {
  const className = `sidebar-task${isSelected ? ' is-selected' : ''}`;
  const { newIcon: icon } = PromptTypes[task.type];
  return (
    <button
      className={className}
      onClick={() => { selectTask(task); }}
    >
      <i className={`${icon} sidebar-task-icon`} />
      <span className="sidebar-task-title">
        {task.title}
      </span>
    </button>
  );
};

export default SidebarTask;
