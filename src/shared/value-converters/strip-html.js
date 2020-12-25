import sanitizeHtml from 'sanitize-html';

export class StripHtmlValueConverter {
  toView(value) {
    return sanitizeHtml(value, {
      allowedTags: [],
    });
  }
}
