import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'shared/components/avatar/avatar';
import IconButton from 'shared/components/buttons/icon-button';

// I could think of no better way to inject the identityServerUri into the component,
// without attaching it to each user object in the collection.
const createUsersSelectValueComponent = (identityServerUri) => {
  const UsersSelectValue = ({
    disabled,
    id: elId,
    onRemove,
    value: user,
  }) => {
    const { displayName, userId } = user;
    const removeButton = (disabled) ?
      null :
      (
        <IconButton
          action={() => { onRemove(user); }}
          icon="icon-close"
          btnClass="users-select-remove-button"
        />
      );
    return (
      <div className="users-select-user" id={elId}>
        <div className="users-select-avatar">
          <Avatar identityServerUri={identityServerUri} userId={userId} size="18" />
        </div>
        <div className="users-select-display-name">
          {displayName}
        </div>
        {removeButton}
      </div>
    );
  };

  UsersSelectValue.propTypes = {
    disabled: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    // onClick: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    value: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      color: PropTypes.string,
    }).isRequired,
  };

  return UsersSelectValue;
};

export default createUsersSelectValueComponent;
