import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'shared/components/buttons/icon-button';
import UploadDateFilters from './upload-date-filters';
import AssetTypeFilters from './asset-type-filters';
import TaskFilters from './task-filters';
import TagFilters from './group-tag/tag-filters';
import UserFilters from './user-filters';

const ParticipantFilters = ({
  clearFilters,
  filters,
  currentUserTimeZone,
  setCreatedAfter,
  setTags,
  setUsers,
  setCreatedBefore,
  allAssetTypes,
  availableTags,
  participants,
  toggleSelectAssetType,
  individualActivities,
  addTaskIds,
  removeTaskIds,
  toggleExpandDates,
  toggleExpandAssetTypes,
  toggleExpandTasks,
  toggleExpandTags,
  toggleExpandUsers,
  setTagsRuleOperator,
  setUsersRuleOperator,
  tagsRuleOperators,
  usersRuleOperators,
  identityServerUri,
}) => {
  const {
    dates: datesExpanded,
    assetTypes: assetTypesExpanded,
    tasks: tasksExpanded,
    tags: tagsExpanded,
    users: usersExpanded,
  } = (filters.expandedState || {});
  const { projectId } = filters;

  return (
    <div className="flex-column sidebar-content">
      <section className="sidebar-header">
        <div className="sidebar-header-right">
          <h5 className="title">Select Filters</h5>
          <IconButton
            btnClass="btn btn-xs btn-link btn-default"
            action={clearFilters}
            icon="icon-clear_all"
            appendText="clear filters"
          />
        </div>
      </section>
      <div className="outer-content">
        <div className="inner-content-div hide-scroll">
          <div className="filter-accordion">
            <UploadDateFilters
              startDate={filters.createdAfter}
              endDate={filters.createdBefore}
              timeZone={currentUserTimeZone}
              setStartDate={setCreatedAfter}
              setEndDate={setCreatedBefore}
              toggleExpand={() => { toggleExpandDates({ projectId }); }}
              isExpanded={datesExpanded}
            />
            <AssetTypeFilters
              selectedAssetTypes={filters.assetTypes}
              availableAssetTypes={allAssetTypes}
              toggleSelectAssetType={toggleSelectAssetType}
              toggleExpand={() => { toggleExpandAssetTypes({ projectId }); }}
              isExpanded={assetTypesExpanded}
            />
            <TaskFilters
              selectedTasks={filters.taskIds}
              individualActivities={individualActivities}
              addTaskIds={addTaskIds}
              removeTaskIds={removeTaskIds}
              toggleExpand={() => { toggleExpandTasks({ projectId }); }}
              isExpanded={tasksExpanded}
            />
            <TagFilters
              availableTags={availableTags}
              rule={filters.tagsRule}
              isExpanded={tagsExpanded}
              toggleExpand={() => { toggleExpandTags({ projectId }); }}
              projectId={projectId}
              setTags={setTags}
              setRuleOperator={setTagsRuleOperator}
              ruleOperators={tagsRuleOperators}
            />
            <UserFilters
              availableUsers={participants}
              rule={filters.usersRule}
              isExpanded={usersExpanded}
              toggleExpand={() => { toggleExpandUsers({ projectId }); }}
              projectId={projectId}
              setUsers={setUsers}
              setRuleOperator={setUsersRuleOperator}
              ruleOperators={usersRuleOperators}
              identityServerUri={identityServerUri}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ParticipantFilters.propTypes = {
  identityServerUri: PropTypes.string.isRequired,
  clearFilters: PropTypes.func.isRequired,
  setCreatedAfter: PropTypes.func.isRequired,
  setCreatedBefore: PropTypes.func.isRequired,
  toggleSelectAssetType: PropTypes.func.isRequired,
  currentUserTimeZone: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  individualActivities: PropTypes.array.isRequired,
  allAssetTypes: PropTypes.array.isRequired,
  availableTags: PropTypes.array.isRequired,
  addTaskIds: PropTypes.func.isRequired,
  removeTaskIds: PropTypes.func.isRequired,
  toggleExpandDates: PropTypes.func.isRequired,
  toggleExpandAssetTypes: PropTypes.func.isRequired,
  toggleExpandTasks: PropTypes.func.isRequired,
  toggleExpandTags: PropTypes.func.isRequired,
  toggleExpandUsers: PropTypes.func.isRequired,
  setTagsRuleOperator: PropTypes.func.isRequired,
  setUsersRuleOperator: PropTypes.func.isRequired,
  setTags: PropTypes.func.isRequired,
  setUsers: PropTypes.func.isRequired,
  tagsRuleOperators: PropTypes.array.isRequired,
  usersRuleOperators: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
};

export default ParticipantFilters;
