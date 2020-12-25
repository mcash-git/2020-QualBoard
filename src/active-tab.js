// Set up window.isActiveTab for cpu-intensive items that should only be done
// when the tab is active.  Taken and modified from:
// https://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active/1060034#1060034

/* eslint-disable */
(function () {
  let hidden = 'hidden';
  window.tabActivatedTasks = [];
  window.tabDeactivatedTasks = [];

  // Standards:
  if (hidden in document) {
    document.addEventListener('visibilitychange', onchange);
  } else if ((hidden = 'mozHidden') in document) {
    document.addEventListener('mozvisibilitychange', onchange);
  } else if ((hidden = 'webkitHidden') in document) {
    document.addEventListener('webkitvisibilitychange', onchange);
  } else if ((hidden = 'msHidden') in document) {
    document.addEventListener('msvisibilitychange', onchange);
    // IE 9 and lower:
  } else if ('onfocusin' in document) {
    document.onfocusin = document.onfocusout = onchange;
    // All others:
  } else {
    window.onpageshow = window.onpagehide
      = window.onfocus = window.onblur = onchange;
  }

  function onchange(evt) {
    const evtMap = {
      focus: true, focusin: true, pageshow: true, blur: false, focusout: false, pagehide: false,
    };

    evt = evt || window.event;
    if (evt.type in evtMap) {
      window.isActiveTab = evtMap[evt.type];
    } else {
      window.isActiveTab = !this[hidden];
    }
    const tasks = window.isActiveTab ?
      window.tabActivatedTasks :
      window.tabDeactivatedTasks;

    const pruneIndeces = [];
    for (let i = 0; i < tasks.length; i++) {
      const fn = tasks[i];
      if (typeof fn === 'function') {
        fn();
      } else {
        pruneIndeces.push(i);
      }
    }

    // work backward removing any obsolete deleted functions
    let pruneIndex = pruneIndeces.pop();
    while (pruneIndex !== undefined) {
      tasks.splice(pruneIndex, 1);
      pruneIndex = pruneIndeces.pop();
    }
  }

  // set the initial state (but only if browser supports the Page Visibility API)
  if (document[hidden] !== undefined) {
    onchange({ type: document[hidden] ? 'blur' : 'focus' });
  }
}());
