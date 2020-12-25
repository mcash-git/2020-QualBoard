import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { AppConfig } from 'app-config';
import { EventAggregator } from 'aurelia-event-aggregator';
import { CurrentUser } from 'shared/current-user';
import hash from 'object-hash';
import { AvatarChangedEvent } from 'shared/events/avatar-changed-event';

export class Avatar {
  static inject = [AppConfig, CurrentUser, EventAggregator];
  constructor(appConfig, user, ea) {
    this.avatarUrlBase = appConfig.identity.identityServerUri;
    if (!this.avatarUrlBase.endsWith('/')) {
      this.avatarUrlBase += '/';
    }
    this.user = user;

    this.ea = ea;
  }

  @bindable({ defaultBindingMode: bindingMode.oneWay }) userId;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) email;

  // NOTE:  Use size OR the other two.  If all are defined, or if only width is
  // defined, but height isn't (or vise versa) size will be used.
  @bindable({ defaultBindingMode: bindingMode.oneWay }) size;

  @bindable({ defaultBindingMode: bindingMode.oneWay }) width;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) height;

  bind() {
    this.subscribe();
  }

  unbind() {
    this.unsubscribe();
  }

  subscribe() {
    this.avatarChangedSub = this.ea.subscribe(AvatarChangedEvent, event => {
      if (this._caresAboutUpdatedEvent(event)) {
        this.imgElement.src = `${this.url}&cacheBust=${new Date().getTime()}`;
      }
    });
  }

  unsubscribe() {
    this.avatarChangedSub.dispose();
  }

  @computedFrom(
    'userId',
    'size',
    'width',
    'height',
  )
  // TODO:  Rename to 'src'
  get url() {
    let query = '?';
    if ((!this.width || !this.height) && this.size) {
      query += `s=${this.size}`;
    } else if (this.width && this.height) {
      query += `h=${this.height}&w=${this.width}`;
    }

    return this.userId ?
      `${this.avatarUrlBase}avatar/user/${this.userId}${query}` :
      `${this.avatarUrlBase}avatar/${hash((this.email || '').trim().toLowerCase())
      }${query}`;
  }

  _caresAboutUpdatedEvent(event) {
    if (this.email &&
      event.email &&
      event.email.toLowerCase() === this.email.toLowerCase()) {
      return true;
    }

    if (this.userId &&
      event.userId &&
      event.userId.toLowerCase() === this.userId.toLowerCase()) {
      return true;
    }

    return false;
  }
}
