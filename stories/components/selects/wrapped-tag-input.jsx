import React from 'react';
import PropTypes from 'prop-types';
import TagInput from 'shared/components/tags/tag-input';

class WrappedTagInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appliedTags: [...props.appliedTags],
    };
  }

  componentWillReceiveProps({ appliedTags }) {
    if (appliedTags !== this.state.appliedTags) {
      this.mapPropsToState({ appliedTags });
    }
  }

  mapPropsToState({ appliedTags }) {
    this.setState({ appliedTags });
  }

  setTags = (tags) => {
    this.setState({
      appliedTags: tags,
    });
  };

  render() {
    const {
      projectId,
      canAddTags,
      canModify,
      availableTags,
    } = this.props;
    const { appliedTags } = this.state;
    return (
      <TagInput
        projectId={projectId}
        canAddTags={canAddTags}
        canModify={canModify}
        availableTags={availableTags}
        appliedTags={appliedTags}
        setTags={this.setTags}
      />
    );
  }
}

export default WrappedTagInput;
