import { bindable } from 'aurelia-framework';
import { InsightCommentModel } from 'researcher/models/insight-comment-model';
import { CurrentUser } from 'shared/current-user';

export class InsightBookmarkComment {
  static inject = [CurrentUser];

  constructor(currentUser) {
    this.currentUser = currentUser;
  }

  currentUser:CurrentUser;

  @bindable comment:InsightCommentModel;
}
