import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import UsersSelect from 'researcher/components/users/users-select';
import CollapsibleSection from '../collapsible-section/collapsible-section';

const UserFilters = ({
  availableUsers,
  ruleOperators,
  rule,
  isExpanded,
  toggleExpand,
  projectId,
  setUsers,
  setRuleOperator,
  identityServerUri,
}) => {
  const selectProps = {
    options: ruleOperators,
    value: (rule && rule.operator) || ruleOperators[0],
    labelKey: 'friendly',
    onChange: setRuleOperator,
    clearable: false,
    className: 'tag-rule-operator',
  };

  const users = (rule && rule.users) || [];

  return (
    <CollapsibleSection
      isOpen={isExpanded}
      badgeCount={users.length}
      title="Users"
      toggleOpen={toggleExpand}
    >
      <div className="form-inline-custom">
        <div>
          <Select {...selectProps} />
          <div className="tag-rule-label">
            of the following users:
          </div>
        </div>
        <UsersSelect
          availableUsers={availableUsers}
          selectedUsers={users}
          canModify
          setUsers={setUsers}
          projectId={projectId}
          identityServerUri={identityServerUri}
        />
      </div>
    </CollapsibleSection>
  );
};

UserFilters.propTypes = {
  identityServerUri: PropTypes.string.isRequired,
  availableUsers: PropTypes.array.isRequired,
  ruleOperators: PropTypes.array.isRequired,
  rule: PropTypes.object,
  isExpanded: PropTypes.bool,
  toggleExpand: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  setUsers: PropTypes.func.isRequired,
  setRuleOperator: PropTypes.func.isRequired,
};

UserFilters.defaultProps = {
  rule: {},
  isExpanded: false,
};

export default UserFilters;
