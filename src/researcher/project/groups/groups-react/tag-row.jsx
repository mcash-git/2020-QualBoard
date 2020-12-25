import React from 'react';
import Drop from 'tether-drop';
import PropTypes from 'prop-types';
import IconButton from 'shared/components/buttons/icon-button';
import Badge from 'shared/components/badges/badge';
import { colorBox } from 'researcher/project/groups/color-picker/color-picker';

export default class TagRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tag: props.tag,
      dropInstance: null,
      selectedCircle: null,
    };

    // this.prepDrop = this.prepDrop.bind(this);
    // this.handleColorSelected = this.handleColorSelected.bind(this);
    // this.saveTagColor = this.saveTagColor.bind(this);
  }

  componentDidMount() {
    // this.prepDrop();
  }

  prepDrop() {
    const drop = new Drop({
      target: this.refs.dropTarget, // eslint-disable-line
      content: colorBox(this.state.tag),
      position: 'bottom center',
      classes: 'drop-theme-filters',
    });

    drop.on('open', () => {
      const dropCircles = drop.content.querySelectorAll('.circle');
      const apply = drop.content.querySelector('#apply');

      if (this.state.selectedCircle) {
        this.state.selectedCircle.dataset.selected = 0;
        this.setState({ selectedCircle: null });
      }

      apply.onclick = this.saveTagColor;

      dropCircles.forEach(c => {
        if (this.state.tag.color && c.id.toLowerCase() === this.state.tag.color.toLowerCase()) {
          this.setState({ selectedCircle: c });
        }
        c.onclick = this.handleColorSelected;
      });
    });

    this.setState({ dropInstance: drop });
  }

  openDrop(e) {
    e.stopPropagation();
    this.state.dropInstance.open();
  }

  handleColorSelected(event) {
    const element = event.target;
    const color = element.id;
    const { tag } = this.state;

    if (this.state.tag.color) {
      this.state.selectedCircle.dataset.selected = 0;
    }

    element.dataset.selected = 1;
    tag.color = color;
    this.setState({ selectedCircle: element });
    this.setState({ tag });
  }

  saveTagColor() {
    if (this.state.selectedCircle) {
      this.props.updateTag(this.state.tag);
    }
    this.state.dropInstance.close();
  }

  deleteTag = (e) => {
    e.stopPropagation();
    this.props.delete(e);
  }

  render() {
    const { tag } = this.props;
    const tagStyle = {
      backgroundColor: tag.color ? tag.color : '',
    };

    const toolTipText = (tag.name.length > 50) ? tag.name : null;

    return (
      <div>
        <div className="tag-wrapper">
          <i className="icon-label icon" />
          <div className="tag" style={tagStyle} />
        </div>
        <div className="tag-title" data-toggle="tooltip" title={toolTipText}>
          {tag.name}
        </div>
        <div className="tag-actions">
          {/* <span ref="dropTarget" onClick={(e) => {
            this.openDrop(e);
          }}>
            <i className="icon-ion-android-color-palette"></i>
          </span> */}
          <IconButton btnClass="edit-btn" action={this.props.toggleEditState} icon="icon-mode_edit edit-pad" />
          <IconButton btnClass="delete-btn" action={this.deleteTag} icon="icon-delete" />
        </div>
        <div className="right-actions">
          <Badge badgeClass="number-bubble" number={tag.participants.length} />
          <div className="arrow">
            <i className="icon-ion-chevron-right arrow" />
          </div>
        </div>
      </div>
    );
  }
}

TagRow.propTypes = {
  tag: PropTypes.object.isRequired, // eslint-disable-line
  updateTag: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  toggleEditState: PropTypes.func.isRequired,
};
