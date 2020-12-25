export class CssHelper {
  addClass(elem, className) {
    if (!this.hasClass(elem, className)) {
      elem.className += ` ${className}`;
    }
  }

  hasClass(elem, className) {
    return new RegExp(` ${className} `).test(` ${elem.className} `);
  }

  removeClass(elem, className) {
    let newClass = ` ${elem.className.replace(/[\t\r\n]/g, ' ')} `;
    if (this.hasClass(elem, className)) {
      while (newClass.indexOf(` ${className} `) >= 0) {
        newClass = newClass.replace(` ${className} `, ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
      elem.className += ` ${className}`;
    }
  }

  selectSiblings(elem) {
    const siblings = [];
    let sibling = elem.parentNode.firstChild;
    for (; sibling; sibling = sibling.nextSibling) {
      if (sibling.nodeType === 1 && sibling !== elem) {
        siblings.push(sibling);
      }
    }
    return siblings;
  }

  toggle(elem, className) {
    if (this.hasClass(className)) {
      this.removeClass(elem, className);
    } else {
      this.addClass(elem, className);
    }
  }
}
