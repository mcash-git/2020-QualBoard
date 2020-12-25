import { Annotation } from '2020-annotations';
import { actions } from 'researcher/state/all-actions';

const normalizeAnnotationId = (id) => (id.startsWith('urn:uuid:') ? id : `urn:uuid:${id}`);

export async function getConfiguredResearcherSseClient(eventClient, store) {
  eventClient.addEventListener('Annotation', msg => {
    store.dispatch(actions.annotations.receive({
      annotation: Annotation.parse({
        ...msg,
        id: normalizeAnnotationId(msg.id),
      }),
    }));
  });

  eventClient.addEventListener('AnnotationDeleted', ({ id, targetResourceIri }) => {
    store.dispatch(actions.annotations.remove({
      id: normalizeAnnotationId(id),
      targetResourceIri,
    }));
  });

  eventClient.addEventListener('ProjectGroupTagAdded', ({
    groupTagId,
    id,
    name,
    color,
  }) => {
    store.dispatch(actions.groupTags.add({
      projectId: id,
      tag: {
        id: groupTagId,
        name,
        color,
        projectId: id,
      },
    }));
  });

  eventClient.addEventListener('ProjectGroupTagsAdded', ({
    id,
    groupTags,
  }) => {
    store.dispatch(actions.groupTags.addMultiple({
      projectId: id,
      tags: groupTags.map(t => ({
        id: t.groupTagId,
        name: t.name,
        color: t.color,
        projectId: id,
      })),
    }));
  });

  eventClient.addEventListener('ProjectGroupTagChanged', ({
    groupTagId,
    id,
    name,
    color,
  }) => {
    store.dispatch(actions.groupTags.update({
      projectId: id,
      tag: {
        id: groupTagId,
        projectId: id,
        name,
        color,
      },
    }));
  });

  eventClient.addEventListener('ProjectGroupTagDeleted', ({ id, groupTagId }) => {
    const payload = { projectId: id, id: groupTagId };
    store.dispatch(actions.projectUsers.groupTags.removeFromAll(payload));
    store.dispatch(actions.groupTags.remove(payload));
  });

  eventClient.addEventListener('UserProjectCreated', (user) => {
    const { projectId } = user;
    store.dispatch(actions.projectUsers.add({ projectId, user }));
  });

  eventClient.addEventListener('UserProjectUpdated', (user) => {
    const { projectId } = user;
    store.dispatch(actions.projectUsers.update({ projectId, userUpdate: user }));
  });

  eventClient.addEventListener('UserProfileUpdated', (userProfile) => {
    const { projectId } = userProfile;
    store.dispatch(actions.projectUsers.update({ projectId, userUpdate: userProfile }));
  });

  eventClient.addEventListener('UserProjectDisplayNameChanged', ({
    userId,
    projectId,
    displayName,
  }) => {
    store.dispatch(actions.projectUsers.update({
      projectId,
      userUpdate: {
        userId,
        displayName,
      },
    }));
  });

  eventClient.addEventListener('UserProjectRoleChanged', ({
    userId,
    projectId,
    role,
  }) => {
    store.dispatch(actions.projectUsers.update({
      projectId,
      userUpdate: {
        userId,
        role,
      },
    }));
  });

  eventClient.addEventListener('UserProjectActivated', ({ userId, projectId }) => {
    store.dispatch(actions.projectUsers.update({
      projectId,
      userUpdate: {
        userId,
        projectId,
        isActive: true,
      },
    }));
  });

  eventClient.addEventListener('UserProjectDeactivated', ({ userId, projectId }) => {
    store.dispatch(actions.projectUsers.update({
      projectId,
      userUpdate: {
        userId,
        projectId,
        isActive: false,
      },
    }));
  });

  eventClient.addEventListener('UserProjectDeleted', ({ userId, projectId }) => {
    store.dispatch(actions.projectUsers.remove({
      projectId,
      userId,
    }));
  });

  eventClient.addEventListener('UserProjectGroupTagRemoved', ({ groupTagId, userId, projectId }) => {
    store.dispatch(actions.projectUsers.groupTags.remove({
      tagId: groupTagId,
      userId,
      projectId,
    }));
  });

  eventClient.addEventListener('UserProjectGroupTagAdded', ({ groupTagId, userId, projectId }) => {
    store.dispatch(actions.projectUsers.groupTags.add({
      tagId: groupTagId,
      userId,
      projectId,
    }));
  });

  eventClient.addEventListener('UserProjectGroupTagsAdded', ({ groupTags, userId, projectId }) => {
    store.dispatch(actions.projectUsers.groupTags.addMultiple({
      tagIds: groupTags,
      userId,
      projectId,
    }));
  });

  eventClient.addEventListener('UserProjectGroupTagsReplaced', ({
    userId,
    groupTags,
    projectId,
  }) => {
    store.dispatch(actions.projectUsers.groupTags.replace({
      userId,
      projectId,
      tagIds: groupTags,
    }));
  });

  eventClient.addEventListener('UserJobCreated', job => {
    store.dispatch(actions.jobs.add({ job }));
  });

  eventClient.addEventListener('UserJobUpdated', jobUpdate => {
    store.dispatch(actions.jobs.update({ jobUpdate }));
  });

  eventClient.addEventListener('UserJobCompleted', job => {
    store.dispatch(actions.jobs.update({ jobUpdate: job }));
  });

  eventClient.addEventListener('NotificationCreated', msg => {
    document.dispatchEvent(new CustomEvent('new-notification', { bubbles: false, detail: msg }));
  });

  eventClient.addEventListener('ReportGenerated', msg => {
    document.dispatchEvent(new CustomEvent('report-generated', { detail: msg }));
  });

  eventClient.addEventListener('TaskResponseCreated', responseDto => {
    const response = transformTaskResponseDto(responseDto);
    store.dispatch(actions.activityTasksResponses.addTaskResponse({
      taskId: response.taskPromptId,
      response,
    }));
  });

  eventClient.onerror = e => console.error('event source error', e);

  return eventClient;
}

function transformTaskResponseDto(dtoResponse) {
  return {
    ...dtoResponse,
    taskPromptId: dtoResponse.id,
    taskId: dtoResponse.id,
    id: dtoResponse.taskResponseId,
    taskResponseId: undefined,
    responseTimeStamp: dtoResponse.timestamp,
  };
}
