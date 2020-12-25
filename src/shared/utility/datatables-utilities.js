import sanitizeUserHtml from './security/sanitize-user-html';

export const renderSafe = (render, sanitizeOptions) =>
  (data, type, row, meta) =>
    sanitizeUserHtml(render(data, type, row, meta), sanitizeOptions);
