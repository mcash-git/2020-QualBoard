import React from 'react';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import 'modules/_avatars.scss';

export default class Avatar extends React.Component {
  constructor(props) {
    super(props);

    // for right now you have to send over AppConfig as a Dep
    this.avatarUrlBase = props.identityServerUri;
    if (!this.avatarUrlBase.endsWith('/')) {
      this.avatarUrlBase += '/';
    }
  }

  componentDidMount() {
    document.addEventListener('avatar-changed', event => {
      if (this.caresAboutUpatedEvent(event)) {
        this.avatarUrl = this.cacheBustUrl();
      }
    });
  }

  cacheBustUrl = () => `${this.avatarUrl()}&cacheBust=${new Date().getTime()}`;

  caresAboutUpatedEvent = (event) => {
    if (this.props.email &&
      event.email &&
      event.email.toLowerCase() === this.props.email.toLowerCase()) {
      return true;
    }

    if (this.props.userId &&
      event.userId &&
      event.userId.toLowerCase() === this.props.userId.toLowerCase()) {
      return true;
    }

    return false;
  }

  avatarQuery = () => {
    let query = '?';
    if ((!this.props.width || !this.props.height) && this.props.size) {
      query += `s=${this.props.size}`;
    } else if (this.props.width && this.props.height) {
      query += `h=${this.props.height}&w=${this.props.width}`;
    }
    return query;
  }

  avatarUrl = () => (
    this.props.userId ?
      `${this.avatarUrlBase}avatar/user/${this.props.userId}${this.avatarQuery()}` :
      `${this.avatarUrlBase}avatar/${hash((this.props.email || '').trim().toLowerCase())}${this.avatarQuery()}`);


  render() {
    return (
      <div className="avatar">
        <img src={this.avatarUrl()} alt="" />
      </div>
    );
  }
}

Avatar.propTypes = {
  identityServerUri: PropTypes.string.isRequired,
  userId: PropTypes.string,
  email: PropTypes.string,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};

Avatar.defaultProps = {
  userId: null,
  email: null,
  size: null,
  width: null,
  height: null,
};
