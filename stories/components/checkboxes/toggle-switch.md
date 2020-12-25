Toggle Switch
=======

``` javascript
import ToggleSwitch from 'shared/components/toggle-switch';
```

Usage:
```html
  <ToggleSwitch
    changeHandler={(isChecked) => { handleChange(itemA, isChecked); }}
    isChecked={isASelected}
    checkboxId="checkbox-a"
  />
  <ToggleSwitch
    changeHandler={(isChecked) => { handleChange(itemB, isChecked); }}
    isChecked={isBSelected}
    checkboxId="checkbox-b"
  />
```
changeHandler should be a function with one parameter, which is a boolean that indicates whether the checkbox is checked AFTER the change has taken place.
