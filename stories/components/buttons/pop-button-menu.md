Pop Button Menu
=======

``` javascript
import PopButtonMenu from 'shared/components/buttons/pop-button-menu'
```

Usage:
```html
    <PopButtonMenu
      containerClass="some-button-container-class"
      btnId="my-btn-id-for-html-label-relationships"
    >
      <IconButton
        action={item1Clicked}
        icon="icon-schedule"
        appendText="Item 1"
      />
      <IconButton
        action={item2Clicked}
        icon="icon-download"
        appendText="Item 2"
      />
      <span>here is a non-button item</span>
    </PopButtonMenu>
```
You can contain anything you want as the result of clicking the button, but here I am demonstrating the use of IconButtons and a span of text.
