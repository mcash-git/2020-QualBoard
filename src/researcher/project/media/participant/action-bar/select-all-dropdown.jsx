import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export class SelectAllDropdown extends React.Component {
  static propTypes = {
    appliedFilterCount: PropTypes.number.isRequired,
    numSelected: PropTypes.number.isRequired,
    numVisible: PropTypes.number.isRequired,
    numFiltered: PropTypes.number.isRequired,
    numAll: PropTypes.number.isRequired,
    selectVisible: PropTypes.func.isRequired,
    selectFiltered: PropTypes.func.isRequired,
    selectAll: PropTypes.func.isRequired,
    deselectAll: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  toggleOpen = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    const isDeselectDisabled = this.props.numSelected === 0;
    const isSelectFilteredDisabled =
      (this.props.appliedFilterCount === 0 || this.props.numFiltered === 0);
    const isSelectVisibleDisabled = this.props.numVisible === 0;
    const isSelectAllDisabled = this.props.numAll === 0;
    const numFilteredDisplay = (this.props.appliedFilterCount === 0) ?
      '-' :
      this.props.numFiltered;

    return (
      <Dropdown
        isOpen={this.state.isOpen}
        toggle={this.toggleOpen}
        className="select-all-dropdown"
      >
        <DropdownToggle
          className="select-all-dropdown-toggle"
          color="transparent"
          caret
        >
          <span className="badge selected">{this.props.numSelected}</span>
          <span className="dropdown-button-text">Select</span>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            className="dropdown-title"
            header
          >
            You have
            <span className="num-selected">{this.props.numSelected}</span>
            media items selected
          </DropdownItem>
          <DropdownItem
            onClick={this.props.selectVisible}
            disabled={isSelectVisibleDisabled}
          >
            Select All Visible
            <span className="select-count">{this.props.numVisible}</span>
          </DropdownItem>
          <DropdownItem
            onClick={this.props.selectFiltered}
            disabled={isSelectFilteredDisabled}
          >
            Select Filtered
            <span className="select-count">{numFilteredDisplay}</span>
          </DropdownItem>
          <DropdownItem
            onClick={this.props.selectAll}
            disabled={isSelectAllDisabled}
          >
            Select All Project Media
            <span className="select-count">{this.props.numAll}</span>
          </DropdownItem>
          <DropdownItem
            disabled={isDeselectDisabled}
            onClick={this.props.deselectAll}
          >
            Deselect All
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default SelectAllDropdown;
