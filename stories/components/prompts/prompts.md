Prompts
=======

A complete prompt is constructed using several react components. The `PromptIcon` provides the type icon found in the top left of every prompt type. The `PromptHeader` provides the title and question content that is found in every prompt type. The `MediaItems` provides the media and finally the `PromptCore` provides additional pieces like matrix grids, mcma, etc. A prompt looks like so if we were to look inside of it:

```html
<Prompt>
  <PromptIcon />
  <PromptHeader/>
  <MediaItems />
  <PromptCore />
</Prompt>
```  

To use a complete prompt you simply provide it with a task object like so:
``` javascript
import Prompt from 'shared/components/prompts/prompt';
```

Usage:
```html
  <Prompt
    task={taskObject}
  />
```

---------------------------

## Anatomy of a Prompt

### Prompt Icon
```javascript
import PromptIcon from 'shared/components/prompts/prompt-icon';
```

Usage:
```html
<PromptIcon
  type=""
/>
```

`type` should be an int that references the enumerable type.

### Prompt Header
``` javascript
import PromptHeader from 'shared/components/prompts/prompt-header';
```

Usage:
```html
<PromptHeader
  title=""
  body=""
  mediaRequired=""
  responseTextRequired=""
  hasLogic=""
/>
```

The `mediaRequired`, `responseTextRequired`, and `hasLogic` options are not required. They display the icon in the top right rather the respective is required by the participant. Mostly for entry building.

### Prompt Core
```javascript
import PromptCore from 'shared/components/prompt-core';
```

Usage:
```html
<PromptCore task={task} />
```
