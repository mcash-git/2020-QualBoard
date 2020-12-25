import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'reactstrap';
import Badge from 'shared/components/badges/badge';

class CollapsibleSection extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    isRequired: PropTypes.bool,
    badgeCount: PropTypes.number,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    toggleOpen: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    isRequired: false,
    badgeCount: 0,
    toggleOpen: null,
  };

  constructor(props) {
    super(props);

    this.state = { isOpen: props.isOpen };
  }

  componentWillReceiveProps(nextProps) {
    const { isOpen } = nextProps;
    if (isOpen !== this.state.isOpen) {
      this.setState({
        isOpen,
      });
    }
  }

  toggleOpen() {
    const { toggleOpen } = this.props;
    if (toggleOpen && typeof toggleOpen === 'function') {
      toggleOpen();
    } else {
      this.setState({
        isOpen: !this.state.isOpen,
      });
    }
  }

  render() {
    const requiredIndicator = (this.props.isRequired) ?
      <span className="required-label">*</span> :
      null;

    const badge = (this.props.badgeCount > 0) ?
      <Badge number={this.props.badgeCount} badgeClass="filter" /> :
      null;

    const chevronClass = `icon-ion-chevron-${this.state.isOpen ? 'up' : 'down'} filter-section-toggle-icon`;

    return (
      <div className="card">
        <button
          className="card-header"
          onClick={() => this.toggleOpen()}
        >
          <h5 className="card-header-title">
            <span>
              {this.props.title}
              {requiredIndicator}
            </span>
            <span>
              {badge}
              <i className={chevronClass} />
            </span>
          </h5>
        </button>
        <Collapse isOpen={this.state.isOpen}>
          <div className="card-block">
            {this.props.children}
          </div>
        </Collapse>
      </div>
    );
  }
}

export default CollapsibleSection;
