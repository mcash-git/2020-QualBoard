Tag-Input
=======

TagInput:

``` javascript
import TagInput from 'shared/components/tags/tag-input'
```

Usage:
```html
  <TagInput
    projectId={this.props.projectId}
    setTags={this.props.setUserTags}
    canAddTags={true}
    canModify={true}
    availableTags={this.props.availableGroupTags}
    appliedTags={this.props.userTags}
  />
```

## Props:
- `projectId: string` the project ID whose group tags are being manipulated
- `setTags: (selectedTags) => void`, handles the receiving of the entire array of selected tags _after_ a change has been made.
- `canAddTags: boolean`, whether new tags can be created with this control
- `canModify: boolean`, whether changes can be made to the selected tags
- `availableTags: [{ name: string, id: string, color: string, projectId: string }]`, array of all group tags available from which to select.
- `appliedTags: [{ name: string, id: string, color: string, projectId: string }]`, array of group tags selected.
