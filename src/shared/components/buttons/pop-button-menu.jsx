import React from 'react';
import PropTypes from 'prop-types';
import { Popover, PopoverBody } from 'reactstrap';
import IconButton from './icon-button';

class PopButtonMenu extends React.Component {
  static propTypes = {
    btnId: PropTypes.string,
    containerClass: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
  };

  static defaultProps = {
    btnId: null,
    containerClass: null,
  };

  constructor(props) {
    super(props);

    this.state = { isPopoverOpen: false };
  }

  togglePopover() {
    this.setState({
      isPopoverOpen: !this.state.isPopoverOpen,
    });
  }

  render() {
    return (
      <div className={this.props.containerClass}>
        <IconButton
          btnClass="circle-button"
          btnId={this.props.btnId}
          icon="icon-ion-more"
          action={() => this.togglePopover()}
        />
        <Popover
          className="clip-popover"
          placement="top"
          isOpen={this.state.isPopoverOpen}
          target={this.props.btnId}
          toggle={() => this.togglePopover()}
        >
          <PopoverBody>
            {this.props.children}
          </PopoverBody>
        </Popover>
      </div>
    );
  }
}

export default PopButtonMenu;
