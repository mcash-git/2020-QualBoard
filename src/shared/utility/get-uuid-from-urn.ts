export function getUuidFromUrn(urn:string) : string {
  const matches = /urn:uuid:(.+)$/.exec(urn);
  return matches === null ? null : matches[1];
}
