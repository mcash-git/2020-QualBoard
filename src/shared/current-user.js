import { DateTimeService } from 'shared/components/date-time-service';
import { computedFrom } from 'aurelia-framework';

export class CurrentUser {
  constructor({
    profile = {},
  } = {}) {
    const {
      email,
      email_verified: emailVerified,
      family_name: familyName,
      given_name: givenName,
      preferred_username: preferredUsername,
      sub: userId,
      global_access: globalAccessScope,
      qualboard4_access: qb4AccessScope,
      zoneinfo: timeZone,
    } = profile;
    this.email = email;
    this.emailVerified = emailVerified;
    this.firstName = givenName;
    this.lastName = familyName;
    this.preferredUsername = preferredUsername;
    this.userId = userId;
    this.globalAccessScope = globalAccessScope;
    this.timeZone = timeZone || getDefaultTimeZone();
    if (globalAccessScope === 'developer') {
      this.isSuperUser = true;
      this.isDeveloper = true;
    } else if (globalAccessScope === 'super_admin'
      || qb4AccessScope === 'admin') {
      this.isSuperUser = true;
      this.isDeveloper = false;
    } else {
      this.isSuperUser = false;
      this.isDeveloper = false;
    }
  }

  @computedFrom('firstName', 'lastName', 'email')
  get privateDisplayName() {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }

    return `${this.email}`;
  }
}

function getDefaultTimeZone() {
  return new DateTimeService().getBrowserTimeZone();
}
