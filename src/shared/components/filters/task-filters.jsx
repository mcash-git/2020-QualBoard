import React from 'react';
import PropTypes from 'prop-types';
import CheckboxTree from 'shared/components/checkbox-tree/checkbox-tree';
import CollapsibleSection from '../collapsible-section/collapsible-section';

const TaskFilters = ({
  selectedTasks,
  individualActivities,
  addTaskIds,
  removeTaskIds,
  isExpanded,
  toggleExpand,
}) => (
  <CollapsibleSection
    isRequired={false}
    isOpen={isExpanded}
    badgeCount={selectedTasks.length}
    title="Individual Activities / Tasks"
    toggleOpen={toggleExpand}
  >
    <div className="checkbox-trees">
      {individualActivities.map((ia) => (
        <CheckboxTree
          key={`ia-checkbox-tree${ia.id}`}
          text={ia.privateName}
          childNodes={ia.tasks.map((t) => ({
            text: t.title,
            value: t.id,
          }))}
          selectedValues={selectedTasks}
          addValues={addTaskIds}
          removeValues={removeTaskIds}
        />
      ))}
    </div>
  </CollapsibleSection>
);

TaskFilters.propTypes = {
  selectedTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  individualActivities: PropTypes.array.isRequired,
  addTaskIds: PropTypes.func.isRequired,
  removeTaskIds: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool,
  toggleExpand: PropTypes.func.isRequired,
};

TaskFilters.defaultProps = {
  isExpanded: false,
};

export default TaskFilters;
