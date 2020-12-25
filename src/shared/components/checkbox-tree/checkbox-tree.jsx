import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../checkbox';
import IconButton from '../buttons/icon-button';

const statuses = {
  unchecked: 0,
  checked: 1,
  indeterminate: 2,
};

class CheckboxTree extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    value: PropTypes.any,
    childNodes: PropTypes.arrayOf(PropTypes.object),
    isExpanded: PropTypes.bool,
    selectedValues: PropTypes.array.isRequired,
    addValues: PropTypes.func.isRequired,
    removeValues: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isExpanded: undefined,
    childNodes: null,
    value: null,
  };

  constructor(props) {
    super(props);

    const { isExpanded } = props;

    this.state = {
      isExpanded,
    };
  }

  componentWillReceiveProps(newProps) {
    const { isExpanded } = newProps;
    if (isExpanded === undefined) {
      return;
    }

    if (isExpanded !== this.state.isExpanded) {
      this.setState({
        isExpanded,
      });
    }
  }

  getStatus() {
    return getStatus(this.props, this.props.selectedValues);
  }

  toggleExpanded() {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  }

  handleChange(isChecked) {
    const values = getAllChildValues(this.props);

    if (isChecked) {
      this.props.addValues(values);
    } else {
      this.props.removeValues(values);
    }
  }

  renderParent() {
    const expanderIcon = (this.state.isExpanded) ? 'icon-ion-minus' : 'icon-ion-plus';
    const expander = (this.props.childNodes.length > 0) ? (
      <IconButton
        btnClass="checkbox-tree-expander"
        action={() => { this.toggleExpanded(); }}
        icon={expanderIcon}
      />
    ) : null;
    const status = this.getStatus();

    const childrenClass =
      `${expander && this.state.isExpanded ? '' : 'hidden '}checkbox-tree-children`;

    return (
      <div className="checkbox-tree">
        {expander}
        <Checkbox
          isChecked={status === statuses.checked}
          isDisabled={this.props.childNodes.length === 0}
          isIndeterminate={status === statuses.indeterminate}
          labelText={this.props.text}
          changeHandler={(isChecked) => { this.handleChange(isChecked); }}
        />
        <ul className={childrenClass}>
          {this.props.childNodes.map((n, i) => (
            <li
              key={i.toString()}
              className="checkbox-tree-child"
            >
              <CheckboxTree
                {...n}
                addValues={this.props.addValues}
                removeValues={this.props.removeValues}
                selectedValues={this.props.selectedValues}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  renderLeaf() {
    const status = this.getStatus();
    return (
      <div className="checkbox-tree">
        <Checkbox
          isChecked={status === statuses.checked}
          labelText={this.props.text}
          changeHandler={(isChecked) => { this.handleChange(isChecked); }}
        />
      </div>
    );
  }

  render() {
    return (this.props.childNodes) ?
      this.renderParent() :
      this.renderLeaf();
  }
}

function getStatusForParent(node, selectedValues) {
  if (node.childNodes.length === 0) {
    return statuses.unchecked;
  }

  const childStatuses = node.childNodes.map((n) => getStatus(n, selectedValues));

  if (childStatuses.every((s) => s === statuses.checked)) {
    return statuses.checked;
  }

  return (childStatuses.every((s) => s === statuses.unchecked)) ?
    statuses.unchecked :
    statuses.indeterminate;
}

function getStatusForLeaf(node, selectedValues) {
  return (selectedValues.some((v) => node.value === v)) ?
    statuses.checked :
    statuses.unchecked;
}

function getStatus(node, selectedValues) {
  return (node.childNodes) ?
    getStatusForParent(node, selectedValues) :
    getStatusForLeaf(node, selectedValues);
}

function getAllChildValues(node) {
  return (node.childNodes) ?
    node.childNodes.reduce((values, childNode) => values.concat(getAllChildValues(childNode)), []) :
    [node.value];
}

export default CheckboxTree;
