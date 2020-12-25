Icon Button
=======

``` javascript
import IconButton from 'shared/components/buttons/icon-button'
```

Usage:
```html
  <IconButton
    action={this.fireAction}
    btnClass="override-class"
    icon="icon-schedule"
    prependText=""
    appendText=""
  />
```
You can override the buttons class by specifying a class otherwise it uses the default. The action property is what event you would like to fire when the button is clicked. Prepend & Append Text allow you to place text in front of or behind the icon but still inside the clickable button.