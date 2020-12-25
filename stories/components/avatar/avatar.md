Avatar
=======

``` javascript
import Avatar from 'shared/components/avatar/avatar'
```

Default:
```html
  <Avatar
    identityServerUri="https://alpha.2020identity.com/"
    size="100"
  />
```

Size:
```html
  <Avatar
    identityServerUri="https://alpha.2020identity.com/"
    userId="{this.props.userId}"
    size="100"
  />
```

Width - Height:
```html
  <Avatar
    identityServerUri="https://alpha.2020identity.com/"
    userId="{this.props.userId}"
    width="100"
    heigth="100"
  />
```

If the user doesn't have an avatar a default image is sent in the specified size or width/height.
