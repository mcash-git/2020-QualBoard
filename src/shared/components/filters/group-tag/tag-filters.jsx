import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import CollapsibleSection from '../../collapsible-section/collapsible-section';
import TagInput from '../../tags/tag-input';

const TagFilters = ({
  availableTags,
  ruleOperators,
  rule,
  isExpanded,
  toggleExpand,
  projectId,
  setTags,
  setRuleOperator,
}) => {
  const selectProps = {
    options: ruleOperators,
    value: (rule && rule.operator) || ruleOperators[0],
    labelKey: 'friendly',
    onChange: setRuleOperator,
    clearable: false,
    className: 'tag-rule-operator',
  };

  const tags = (rule && rule.tags) || [];

  return (
    <CollapsibleSection
      isOpen={isExpanded}
      badgeCount={tags.length}
      title="Groups"
      toggleOpen={toggleExpand}
    >
      <div className="form-inline-custom">
        <div>
          <div className="tag-rule-label">
            Users belonging to
          </div>
          <Select {...selectProps} />
          <div className="tag-rule-label">
            of the following groups:
          </div>
        </div>
        <TagInput
          availableTags={availableTags}
          appliedTags={tags}
          canModify
          setTags={setTags}
          projectId={projectId}
        />
      </div>
    </CollapsibleSection>
  );
};

TagFilters.propTypes = {
  availableTags: PropTypes.array.isRequired,
  ruleOperators: PropTypes.array.isRequired,
  rule: PropTypes.object,
  isExpanded: PropTypes.bool,
  toggleExpand: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  setTags: PropTypes.func.isRequired,
  setRuleOperator: PropTypes.func.isRequired,
};

TagFilters.defaultProps = {
  rule: {},
  isExpanded: false,
};

export default TagFilters;
