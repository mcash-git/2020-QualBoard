export class UserImportModel {
  constructor({
    email = null,
    firstName = null,
    lastName = null,
    displayName = null,
    role = null,
    groupTags = null,
    groupTagIds = null,
    projectId = null,
  }) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;

    this.userProject = {
      displayName,
      role,
      groupTags,
      projectId,
    };

    if (groupTags && !groupTagIds) {
      this.userProject.groupTags = groupTags.map(t => t.id);
    }
  }
}
