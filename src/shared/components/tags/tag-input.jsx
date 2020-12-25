import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import TagSelectValue from './tag-select-value';
import TagSelectOption from './tag-select-option';

class TagInput extends React.Component {
  static propTypes = {
    availableTags: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      color: PropTypes.string,
    })).isRequired,
    appliedTags: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      color: PropTypes.string,
    })).isRequired,
    canAddTags: PropTypes.bool,
    canModify: PropTypes.bool.isRequired,
    setTags: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    canAddTags: false,
  };

  isTagUnique({ option, options }) {
    const lower = option.name.toLowerCase();
    return options.every((o) => o.name.toLowerCase() !== lower);
  }

  render() {
    const selectProps = {
      multi: true,
      options: this.props.availableTags,
      value: this.props.appliedTags,
      labelKey: 'name',
      valueKey: 'id',
      valueComponent: TagSelectValue,
      optionComponent: TagSelectOption,
      onChange: this.props.setTags,
      disabled: !this.props.canModify,
      newOptionCreator: ({ label: name }) => ({
        name,
        id: null,
        color: null,
        projectId: this.props.projectId,
      }),
      isOptionUnique: ({ option, options }) => this.isTagUnique({ option, options }),
      promptTextCreator: (label) => `Add new tag "${label}"`,
    };

    return (this.props.canAddTags) ? (
      <Select.Creatable
        {...selectProps}
      />
    ) : (
      <Select
        {...selectProps}
      />
    );
  }
}

export default TagInput;
