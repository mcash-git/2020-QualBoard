export const fetchStatuses = {
  pending: 'PENDING',
  success: 'SUCCESS',
  failure: 'FAILURE',
};

export function combineFetchStatuses(statuses) {
  const counts = statuses.reduce((accu, status) => {
    accu[status]++;
    return accu;
  }, {
    [fetchStatuses.pending]: 0,
    [fetchStatuses.success]: 0,
    [fetchStatuses.failure]: 0,
  });

  if (counts[fetchStatuses.failure] > 0) {
    return fetchStatuses.failure;
  }
  if (counts[fetchStatuses.pending] > 0) {
    return fetchStatuses.pending;
  }
  return fetchStatuses.success;
}
