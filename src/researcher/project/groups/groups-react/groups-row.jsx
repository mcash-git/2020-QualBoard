/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import TagRow from './tag-row.jsx';
import TagRowEdit from './tag-row-edit.jsx';

export default class GroupsRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
    };

    this.dialogService = props.aureliaDependencies.dialogService;
    this.delete = this.delete.bind(this);
    this.toggleEditState = this.toggleEditState.bind(this);
  }

  delete() {
    let deleteText = `Are you sure you want to delete "${this.props.tag.name}" group? `;
    if (this.props.tag.participants && this.props.tag.participants.length > 0) {
      deleteText += `This tag has been applied to ${this.props.tag.participants.length} participant(s).`;
    }
    this.dialogService.open({
      viewModel: 'shared/components/confirmation-modal',
      model: {
        text: deleteText,
        title: 'Delete Confirmation',
        confirmButtonClass: 'btn-danger',
        confirmButtonText: 'Delete',
        cancelButtonClass: 'btn-outline-secondary',
      },
    }).whenClosed(result => {
      if (result.wasCancelled) {
        return;
      }
      this.props.deleteTag(this.props.tag);
    });
  }

  toggleEditState() {
    this.setState({ isEditing: !this.state.isEditing });
  }

  render() {
    if (!this.props.tag) {
      return ({});
    }

    if (this.state.isEditing && this.props.isActive) {
      return (
        <div
          className={this.props.isActive ? 'group-row group-row-active' : 'group-row'}
          onClick={this.props.setActive}
          role="button"
        >
          <TagRowEdit
            tags={this.props.tags}
            tag={this.props.tag}
            delete={this.delete}
            toggleEditState={this.toggleEditState}
            updateTag={this.props.updateTag}
          />
        </div>
      );
    }
    this.state.isEditing = false; // need better way to do this but will work for now
    return (
      <div
        className={this.props.isActive ? 'group-row group-row-active' : 'group-row'}
        onClick={this.props.setActive}
        role="button"
      >
        <TagRow
          tag={this.props.tag}
          delete={this.delete}
          toggleEditState={this.toggleEditState}
          updateTag={this.props.updateTag}
        />
      </div>
    );
  }
}

GroupsRow.propTypes = {
  aureliaDependencies: PropTypes.shape({
    dialogService: PropTypes.object,
  }).isRequired,
  tag: PropTypes.object.isRequired, // eslint-disable-line
  tags: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line
  deleteTag: PropTypes.func.isRequired,
  updateTag: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired,
};
