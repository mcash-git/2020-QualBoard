Checkbox Tree
=======

```javascript
import CheckboxTree from 'shared/components/checkbox-tree/checkbox-tree';

const parent = {
  name: 'Dad',
  children: [{
    name: 'Child 1',
    value: 'A8S7DFH'
  }, {
    name: 'Child 2',
    value: 'F897NEA'
  }, {
    name: 'Child 3',
    value: 'NAV98OD'
  }],
};
```

Usage
```html
  <CheckboxTree
    text={parent.name}
    childNodes={parent.children}
    selectedValues={someArrayOfLeafValues}
    addValues={(leafValues) => addSelectedItems(leafValues)}
    removeValues={(leafValues) => removeSelectedItems(leafValues)}
  />
```

Checking/unchecking a leaf node wraps the value represented by the leaf node in an array and passes
it to the `addValues`/`removeValues` (respectively) function, which should add/remove the values
to/from the `selectedValues` collection via redux most likely.

Checking/unchecking any non-leaf node will pass an array containing the values represented by all
descendant leaf nodes to the `addValues`/`removeValues` (respectively) function, which should
add/remove the values to/from the `selectedValues` collection via redux most likely.
