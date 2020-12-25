import animate from 'amator';
import scrollParent from 'scrollparent';

// TODO:  I think this can be modified with relative ease to scroll multiple
// nested scrolling elements simultaneously.
export function scrollIntoView(el, duration = 500) {
  if (!el) { throw new Error('Element is required in scrollIntoView'); }

  const scrollingParent = scrollParent(el);
  if (!scrollingParent) {
    throw new Error('Element is not attached to the DOM in scrollIntoView');
  }

  const parentTop = scrollingParent.getBoundingClientRect().top;
  const elTop = el.getBoundingClientRect().top;
  const alreadyScrolledTo = scrollingParent.scrollTop;

  return animate(scrollingParent, {
    scrollTop: alreadyScrolledTo + (elTop - parentTop),
  }, { duration });
}

export default scrollIntoView;
