Checkbox
=======

``` javascript
import Checkbox from 'shared/components/checkbox'
```

Usage:
```html
  <Checkbox
    changeHandler={(isChecked) => { handleChange(itemA, isChecked); }}
    isChecked={isASelected}
    checkboxId="checkbox-a"
    labelText="Option A"
  />
  <Checkbox
    changeHandler={(isChecked) => { handleChange(itemB, isChecked); }}
    isChecked={isBSelected}
    checkboxId="checkbox-b"
    labelText="Option B"
  />
```
changeHandler should be a function with one parameter, which is a boolean that indicates whether the checkbox is checked AFTER the change has taken place.
