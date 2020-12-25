Spinners
=======

Rolling Spinner:

``` javascript
import RollingSpinner from 'shared/components/spinners/rolling-spinner'
```

Usage:
```html
  <RollingSpinner
      size="70px"
      color="#00ff00"
      speed="0.8s"
      margin="10px"
      display="inline-block"
    />
```
Leaving color blank uses the applications default coloring for the bar (accent-1). Otherwise if you wish to specify a color you will need to pass colors in the format of hex like so "#4A90E2" or friendly strings like 'red'.

Speed like color can also be left blank to achieve the default speed of `0.8s`. However you may override this by passing another value in the animation valid speed format example: `0.5s`.
