import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import createUsersSelectValueComponent from './create-users-select-value-component';
import createUsersSelectOptionComponent from './create-users-select-option-component';

const userShape = {
  userId: PropTypes.string,
  displayName: PropTypes.string,
};

class UsersSelect extends React.Component {
  static propTypes = {
    availableUsers: PropTypes.arrayOf(PropTypes.shape(userShape)).isRequired,
    selectedUsers: PropTypes.arrayOf(PropTypes.shape(userShape)).isRequired,
    canModify: PropTypes.bool.isRequired,
    setUsers: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired,
    identityServerUri: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.valueComponent = createUsersSelectValueComponent(props.identityServerUri);
    this.optionComponent = createUsersSelectOptionComponent(this.valueComponent);
  }

  render() {
    const selectProps = {
      multi: true,
      options: this.props.availableUsers,
      value: this.props.selectedUsers,
      labelKey: 'displayName',
      valueKey: 'userId',
      valueComponent: this.valueComponent,
      optionComponent: this.optionComponent,
      onChange: this.props.setUsers,
      disabled: !this.props.canModify,
    };

    return (
      <Select {...selectProps} />
    );
  }
}

export default UsersSelect;
