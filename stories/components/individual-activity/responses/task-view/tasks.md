Task
=======

### Task Header
``` javascript
import TaskHeader from 'shared/components/task/task-header';
```

Usage:
```html
  <TaskHeader
    title=""
    body=""
    type=""
  />
```

Type is the type of task you referencing (prompt type). It changes the icon on the left to match the task type. So `type = 0` would give you the text icon.


### Complete Task
``` javascript
import Task from 'shared/components/task/task';
```

Usage:
```html
  <Task
    task={taskObject}
  />
```
