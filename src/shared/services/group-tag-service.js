import { growlProvider } from 'shared/growl-provider';

export const groupTagService = {
  commandCreateTag: async (api, tag) => {
    try {
      const result = await api.command.groupTags.create(tag);
      return result;
    } catch (error) {
      growlProvider.error('Error', 'Unable to add group tag. Please try again');
      return false;
    }
  },
  commandRemoveTag: async (api, tag) => {
    try {
      const result = await api.command.groupTags.delete({
        id: tag.id,
        projectId: tag.projectId,
      });
      return result;
    } catch (error) {
      growlProvider.error('Error', 'Unable to remove group tag. Please try again.');
      return false;
    }
  },
  commandRemoveParticipantFromTag: async (api, tag, participant) => {
    try {
      await api.removeTagFromUsers({
        userIds: [participant.userId],
        groupTagId: tag.id,
        projectId: tag.projectId,
      });
      return true;
    } catch (error) {
      growlProvider.error('Error', 'There was an error removing the users from the group. Please try again.');
      return false;
    }
  },
  commandUpdateTag: async (api, tag) => {
    try {
      const result = await api.command.groupTags.update({
        name: tag.name,
        id: tag.id,
        projectId: tag.projectId,
        color: tag.color,
      });
      return result;
    } catch (error) {
      growlProvider.error('Error', 'There was an error updating your group. Please try again.');
      return false;
    }
  },
  queryTags: async (api, projectId) => {
    try {
      return api.query.groupTags.getGroupTags(projectId);
    } catch (error) {
      growlProvider.error('Error', 'There was an error fetching group tags. Please try again.');
      return false;
    }
  },
};
