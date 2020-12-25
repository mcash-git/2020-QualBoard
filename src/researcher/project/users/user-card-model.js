import { computedFrom } from 'aurelia-framework';
import moment from 'moment';

const roleToViewModel = {
  0: 'moderator',
  // 1: 'analyst',
  1: 'moderator',
  2: 'client',
  3: 'participant',
};

const viewModelBase = 'project-user-card-';

export class UserCardModel {
  constructor({
    completionPercentage = null,
    creatingUser = null,
    displayName = null,
    email = null,
    firstName = null,
    groupTags = [],
    id = null,
    userId = null,
    isActive = true,
    lastLogin = null,
    lastName = null,
    lastPost = null,
    past24HourResponseCount = null,
    probes = [],
    projectId = null,
    role = 3,
    totalCompletedRepetitionCount = null,
    totalMinimumRequiredRepetitionCount = null,
    unansweredProbeCount = null,
    totalFollowupCount = null,
    availableGroupTags = null,
  } = {}) {
    this.completionPercentage = completionPercentage;
    this.creatingUser = creatingUser;
    this.displayName = displayName;
    this.email = email;
    this.firstName = firstName;
    this.groupTagIds = groupTags;
    this.availableGroupTags = availableGroupTags;
    if (availableGroupTags && groupTags !== null) {
      this.groupTags = groupTags.map(tagId => availableGroupTags
        .find(t => t.id === tagId));
      this.editGroupTags = this.groupTags.concat();
    }
    this.id = id;
    this.userId = userId;
    this.isActive = isActive;
    this.lastLogin = lastLogin;
    this.lastName = lastName;
    this.lastPost = lastPost;
    this.past24HourResponseCount = past24HourResponseCount;
    this.probes = probes;
    this.projectId = projectId;
    this.userId = userId;
    this.role = role;
    this.totalCompletedRepetitionCount = totalCompletedRepetitionCount;
    this.totalMinimumRequiredRepetitionCount =
      totalMinimumRequiredRepetitionCount;
    this.unansweredProbeCount = unansweredProbeCount;
    this.totalFollowupCount = totalFollowupCount;

    this.viewModel = `${viewModelBase}${roleToViewModel[role]}`;
    
    this._setUpEngagementClassUpdates();
  }
  
  _setUpEngagementClassUpdates() {
    this.lastPostMoment = moment(this.lastPost);
    this.lastLoginMoment = moment(this.lastLogin);
    
    this._setEngagementClass();
  }
  
  _setEngagementClass() {
    if (!this.lastLoginMoment.isValid()) {
      this.engagementClass = 'never-signed-in';
      return;
    }
    
    if (!this.lastPostMoment.isValid()) {
      this.engagementClass = 'never-posted';
      return;
    }
    
    const now = moment();
    const hours = now.diff(this.lastPostMoment, 'hours');
    let timeoutUpdateMoment;
    
    if (hours < 24) {
      this.engagementClass = 'last-24';
      timeoutUpdateMoment = this.lastPostMoment.clone().add(24, 'h');
    } else if (hours < 48) {
      this.engagementClass = 'last-48';
      timeoutUpdateMoment = this.lastLoginMoment.clone().add(48, 'h');
    } else {
      this.engagementClass = 'not-last-48';
      // no need to update the class with a timeout
    }
    if (timeoutUpdateMoment) {
      const ms = timeoutUpdateMoment.diff(now);
      setTimeout(() => {
        if (!this) {
          // I'm not sure if this can happen, but just in case the reference to
          // this is destroyed at some point, we don't want an error.
          return;
        }
        this._setEngagementClass();
      }, ms);
    }
  }

  get lastLoginText() {
    if (!this.lastLogin) {
      return 'Never';
    }

    const mom = moment(this.lastLogin);
    if (!mom.isValid()) {
      return 'Never';
    }

    return mom.fromNow();
  }

  @computedFrom('isActive')
  get isDeactivated() {
    return !this.isActive;
  }
}
