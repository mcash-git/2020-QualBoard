import uuid from 'node-uuid';

export function createGuid() {
  return uuid.v4();
}
