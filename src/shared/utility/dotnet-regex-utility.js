export function escapeRegexString(s) {
  return s.replace(/[.$^{[(|)\]}*+?|\\]/g, '\\$&');
}

export function unescapeRegexString(s) {
  return s.replace(/\\[.$^{[(|)\]}*+?|\\]/g, unescapeRegexMatch);
}

function unescapeRegexMatch(match) {
  return match.substring(1);
}
