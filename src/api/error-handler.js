import { growlProvider } from '../shared/growl-provider';

export class ErrorHandler {
  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }

  handleError(e) {
    // response error from api
    if (e.response) {
      this.apiError(e);
    }
  }

  apiError(e) {
    let custom = {};
    if (window.OLARK_OPERATOR) {
      custom = {
        buttons: [
          ['<button>Support</button>', (instance, toast) => {
            instance.hide({
              transitionOut: 'fadeOutUp',
            }, toast, 'close', 'btn1');
            /* eslint-disable */
            olark('api.box.expand');
            olark('api.chat.sendNotificationToOperator', {
              body: `Api Error -> Status: ${e.response.status}. Error: ${e.response.statusText}. Url: ${e.response.url}>`,
            });
            /* eslint-enable */
          }],
          ['<button>Dismiss</button>', (instance, toast) => {
            instance.hide({
              transitionOut: 'fadeOutUp',
            }, toast, 'close', 'btn2');
          }],
        ],
      };
    } else {
      custom = {
        buttons: [
          ['<button>Dismiss</button>', (instance, toast) => {
            instance.hide({
              transitionOut: 'fadeOutUp',
            }, toast, 'close', 'btn2');
          }],
        ],
      };
    }

    growlProvider.error('Error', 'We are sorry something with the API went wrong.', custom);
  }
}
