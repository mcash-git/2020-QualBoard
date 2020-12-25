import { customElement, bindable, observable } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { growlProvider } from 'shared/growl-provider';
import { Api } from 'api/api';
import { IdentityClient } from '2020-identity';

@customElement('project-user-card-participant')
export class ProjectUserCardParticipant {
  static inject = [Element, DialogService, Api, IdentityClient];

  constructor(element, modalService, api, identityClient) {
    this.element = element;
    this.modalService = modalService;
    this.api = api;
    this.identityClient = identityClient;
  }

  @bindable user;
  @observable isShowingTags;
  isParticipant = true;

  activate(model) {
    this.user = model.user;
  }

  isShowingTagsChanged() {
    this.element.dispatchEvent(new CustomEvent('group-tags-visibility-change', {
      bubbles: true,
    }));
  }

  toggleGroupTags() {
    this.isShowingTags = !this.isShowingTags;
  }

  showGroupTags() {
    this.isShowingTags = true;
  }

  async hideGroupTags() {
    if (this.hasUnsavedChanges) {
      this.modalService.open({
        viewModel: 'shared/components/confirmation-modal',
        model: {
          title: 'Unsaved Changes',
          text: 'You have some unsaved changes to the participant\'s group tags.  Are you sure you want to discard your changes?',
        },
      }).whenClosed(result => {
        if (result.wasCancelled) {
          return;
        }

        this.user.editGroupTags = this.user.groupTags.concat();
        this.hasUnsavedChanges = false;
      });
    }

    this.isShowingTags = false;
  }

  tagsChanged() {
    // compare groupTags to editGroupTags for the same set of tags
    this.hasUnsavedChanges = this.user.editGroupTags
      .some(t => this.user.groupTags.indexOf(t) === -1) ||
      this.user.groupTags
        .some(t => this.user.editGroupTags.indexOf(t) === -1);
  }

  async saveGroupTags() {
    this.isSaving = true;
    // if there are any new group tags:
    const appliedNewTags = this.user.editGroupTags.filter(t => !t.id);

    if (appliedNewTags.length > 0) {
      // they must be saved first

      await this.api.command.groupTags
        .batchCreate({
          projectId: this.user.projectId,
          newTags: appliedNewTags,
        });

      if (appliedNewTags.some(t => !t.id)) {
        this.isSaving = false;
        growlProvider.warning('Error Saving', 'There was an error saving one or more tags.  Please try again.  If the problem persists, contact support.');
        return;
      }
    }

    try {
      await this.identityClient.setTagsForUser({
        projectId: this.user.projectId,
        userId: this.user.userId || this.user.id,
        groupTagIds: this.user.editGroupTags.map(t => t.id),
      });
      this.user.groupTags = this.user.editGroupTags.concat();
      this.hasUnsavedChanges = false;
      this.hideGroupTags();
    } catch (e) {
      console.error('Encountered an error saving the user\'s tags:', e);
      growlProvider.warning('Error', 'There was an error saving the user\'s tags.  Please try again.  If the problem persists, contact support.');
    }
    this.isSaving = false;
  }
}

// TODO:  while saving, disable button-presses and the tag-input itself.
