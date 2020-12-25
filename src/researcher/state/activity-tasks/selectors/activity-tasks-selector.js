import { createSelector } from 'reselect';
import createMapMediaItem from 'shared/utility/media/create-map-media-item';

const activityTasksSelector = createSelector(
  (state) => state.appConfig,
  (state) => state.individualActivity && state.individualActivity.id,
  (state) => state.activityTasks,
  (appConfig, iaId, allActivityTasks) => {
    const mapMediaItem = createMapMediaItem(appConfig);
    const activityTasksState = allActivityTasks[iaId];
    return activityTasksState &&
      activityTasksState.tasks &&
      activityTasksState.tasks.map((t) => ({
        ...t,
        media: t.media.map(mapMediaItem),
      }));
  },
);

export default activityTasksSelector;
