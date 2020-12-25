import sanitizeUserHtml from '../utility/security/sanitize-user-html';

export class SanitizeValueConverter {
  toView(value) {
    return sanitizeUserHtml(value);
  }
}
