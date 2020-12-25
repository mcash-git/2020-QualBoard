import { Api } from 'api/api';
import { CurrentUserRole } from 'shared/current-user-role';

export class IndividualActivitySettings {
  static inject = [Api, CurrentUserRole];

  constructor(api, userRole) {
    this.api = api;
    this.isModerator = userRole.isModerator();
  }

  async activate(params) {
    const [ia, moderators] = await Promise.all([
      this.api.query.individualActivities
        .get(params.projectId, params.iaId),
      this.api.query.projectUsers.getModerators(params.projectId),
    ]);

    this.moderators = moderators;
    this.ia = ia;
  }
}
