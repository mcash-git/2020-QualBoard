/* eslint-disable react/no-string-refs */
import React from 'react';
import PropTypes from 'prop-types';
import { GroupTagValidation } from 'researcher/project/groups/groups-validation';
import { growlProvider } from 'shared/growl-provider';
import Badge from 'shared/components/badges/badge';

export default class TagRowEdit extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
  }

  save(e) {
    if (!this.isTagValid(this.refs.name.value)) {
      return;
    }
    growlProvider.removeValidationGrowls();
    this.props.tag.name = this.refs.name.value;
    this.props.tag.tagLower = this.refs.name.value.toLowerCase();
    this.props.updateTag(this.props.tag);
    this.props.toggleEditState();
    e.preventDefault();
  }

  isTagValid(tagName) {
    if (this.refs.name.value === this.props.tag.name) {
      return true;
    }
    return GroupTagValidation.tagNameIsValid(tagName, this.props.tags);
  }

  render() {
    const { tag } = this.props;
    const tagStyle = {
      backgroundColor: tag.color || '#6D7273',
    };

    return (
      <form onSubmit={this.save}>
        <div className="tag-wrapper">
          <div className="tag" style={tagStyle}>
            <i className="icon-label icon" />
          </div>
        </div>
        <div className="tag-title-edit">
          <input
            className="input"
            type="text"
            defaultValue={tag.name}
            ref="name"
          />
        </div>
        <div className="tag-actions-edit">
          <button type="button" className="cancel-btn" onClick={this.props.toggleEditState}>
            CANCEL
          </button>
          <button type="submit" className="save-btn edit-pad" onClick={this.save}>
            SAVE
          </button>
        </div>
        <div className="right-actions">
          <Badge badgeClass="number-bubble" number={tag.participants.length} />
          <div className="arrow">
            <i className="icon-ion-chevron-right arrow" />
          </div>
        </div>
      </form>
    );
  }
}

TagRowEdit.propTypes = {
  tag: PropTypes.object.isRequired, // eslint-disable-line
  tags: PropTypes.array.isRequired, // eslint-disable-line
  updateTag: PropTypes.func.isRequired,
  toggleEditState: PropTypes.func.isRequired,
};
