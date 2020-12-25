export class CheckboxTreeModel {
  constructor({
    children = null,
    value = null,
    text = null,
    isExpanded = false,
  } = {}) {
    if (!children && !value) {
      throw new
      Error('CheckboxTreeModel must have either children or value set.');
    }
    this.children = children;
    this.value = value;
    this.text = text;
    this.isExpanded = isExpanded;
  }

  get isParent() {
    return !!this.children;
  }

  // TODO:  We could improve this performance by building the leaf node
  // collection in the initialization and keeping it - but we lose the ability
  // to have a dynamic checkbox tree.  We may want to have two options.
  get leafValues() {
    if (!this.isParent) {
      return [this.value];
    }

    return this.children.reduce(recur, []);
  }
}

function recur(accumulator, node) {
  if (node.isParent) {
    return accumulator.concat(node.children.reduce(recur, accumulator));
  }
  accumulator.push(node.value);
  return accumulator;
}
