Users-Select
=======

UsersSelect:

``` javascript
import UsersSelect from 'researcher/components/users/users-select'
```

Usage:
```html
  <UsersSelect
    projectId={this.props.projectId}
    setUsers={this.props.setUsers}
    canModify={true}
    availableUsers={this.props.participants}
    selectedUsers={this.props.selectedUsers}
  />
```

## Props:
- `projectId: string` the project ID whose group tags are being manipulated
- `setUsers: (selectedUsers) => void`, handles the receiving of the entire array of selected users _after_ a change has been made.
- `canModify: boolean`, whether changes can be made to the selected users
- `availableUsers: [{ id: string, displayName: string }]`, array of all project users available from which to select.
- `selectedUsers: [{ id: string, displayName: string }]`, array of users selected.
