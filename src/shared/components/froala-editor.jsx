import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import FroalaEditor from 'react-froala-wysiwyg';
import { froalaDefaultConfig } from './froala/froala-default-config';

class Froala extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    onChange: PropTypes.func,
    config: PropTypes.object,
    shouldAutoFocus: PropTypes.bool,
  };

  static defaultProps = {
    text: '',
    onChange: null,
    config: {},
    shouldAutoFocus: false,
  };

  constructor(props) {
    super(props);

    const { config } = props;

    this.state = {
      config: {
        ...froalaDefaultConfig,
        ...config,
      },
    };
  }

  componentDidMount() {
    if (this.props.shouldAutoFocus) {
      this.froalaEditorComponent.$editor.focus(); // eslint-disable-line
    }
  }

  componentWillReceiveProps(nextProps) {
    const { config } = nextProps;

    if (config !== this.props.config) {
      this.setState({
        config: {
          ...froalaDefaultConfig,
          ...config,
        },
      });
    }
  }

  render() {
    return (
      <FroalaEditor
        tag="textarea"
        model={this.props.text}
        config={this.state.config}
        onModelChange={this.props.onChange}
        ref={(component) => { this.froalaEditorComponent = component; }}
      />
    );
  }
}

export default Froala;
