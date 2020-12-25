export const regexFactory = {
  getTaskResponseInsightIriRegex: () => /qb:\/projects\/([^/]+)\/task-responses\/(.+)$/i,
  getVideoInsightIriRegex: () => /qb:\/projects\/([^/]+)\/video\/(.+)$/i,
  getProjectIdFromInsightIriRegex: () => /qb:\/projects\/([^/]+)/i,
};
