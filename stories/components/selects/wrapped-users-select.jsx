import React from 'react';
import PropTypes from 'prop-types';
import UsersSelect from 'researcher/components/users/users-select';

class WrappedUsersSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUsers: [...props.selectedUsers],
    };
  }

  componentWillReceiveProps({ selectedUsers }) {
    if (selectedUsers !== this.state.selectedUsers) {
      this.mapPropsToState({ selectedUsers });
    }
  }

  mapPropsToState({ selectedUsers }) {
    this.setState({ selectedUsers });
  }

  setUsers = (users) => {
    this.setState({
      selectedUsers: users,
    });
  };

  render() {
    const {
      projectId,
      canModify,
      availableUsers,
      identityServerUri,
    } = this.props;
    const { selectedUsers } = this.state;
    return (
      <UsersSelect
        projectId={projectId}
        canModify={canModify}
        availableUsers={availableUsers}
        selectedUsers={selectedUsers}
        setUsers={this.setUsers}
        identityServerUri="https://alpha.2020identity.com"
      />
    );
  }
}

export default WrappedUsersSelect;
