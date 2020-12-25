import iziToast from 'vendor/izi-toast/src/js/iziToast';
import 'vendor/izi-toast/src/css/iziToast.min.css';
import sanitizeUserHtml from './utility/security/sanitize-user-html';

export const growlProvider = {
  default: (title, message, opts) => doGrowl(title, message, opts, 'default'),
  error: (title, message, opts) => doGrowl(title, message, opts, 'error'),
  info: (title, message, opts) => doGrowl(title, message, opts, 'info'),
  warning: (title, message, opts) => doGrowl(title, message, opts, 'warning'),
  success: (title, message, opts) => doGrowl(title, message, opts, 'success'),
  removeValidationGrowls: () => {
    const growls = document.querySelector('.validation-error');
    if (growls) {
      growlProvider.close(growls);
    }
  },
  destroyAll: () => iziToast.destroy(),
  close: (toast) => {
    iziToast.hide({
      transitionOut: 'fadeOutUp',
    }, toast);
  },
};

const settings = {
  blue: {
    position: 'topRight',
    color: 'blue',
    icon: 'icon-info',
  },
  info: {
    position: 'topRight',
    color: 'blue',
    icon: 'icon-info',
  },
  success: {
    position: 'topRight',
    color: 'green',
    icon: 'ico-check',
  },
  warning: {
    position: 'topRight',
    color: 'yellow',
    icon: 'ico-warning',
  },
  error: {
    position: 'topRight',
    color: 'red',
    icon: 'ico-error',
  },
};

function doGrowl(title, message, opts, type) {
  const fn = iziToast[type];
  fn.bind(iziToast)({
    title: sanitizeUserHtml(title),
    message: sanitizeUserHtml(message),
    ...settings[type],
    ...opts,
  });
}
