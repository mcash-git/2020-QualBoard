import { DialogController } from 'aurelia-dialog';
import { Validator } from '2020-aurelia';
import { growlProvider } from 'shared/growl-provider';
// import { ModalController } from 'shared/modal/modal-controller';
import { Api } from 'api/api';
import { DateTimePickerModel } from 'shared/models/date-time-picker-model';
import { DateTimeService } from 'shared/components/date-time-service';
import { rules as validationRules } from './create-project-modal-validation';

export class CreateProject {
  static inject = [
    DialogController,
    Api,
    DateTimeService,
  ];

  constructor(modalController, api, dateTimeService) {
    this.modalController = modalController;
    this.api = api;
    this.dateTimeService = dateTimeService;
  }

  activate(model) {
    const self = this;
    this.createCommand = {
      accountId: model.accountId,
      timeZone: null,
      open: new DateTimePickerModel({
        defaultTime: '08:00:00',
        datePlaceholderText: 'Project Open Date',
        timePlaceholderText: 'Project Open Time',
      }),
      close: new DateTimePickerModel({
        defaultTime: '23:55:00',
        datePlaceholderText: 'Project Close Date',
        timePlaceholderText: 'Project Close Time',
      }),
      get openTime() {
        // TODO: Refactor this for use everywhere else
        if (!this.timeZone) {
          return null;
        }
        // Create a moment in the selected time zone, then convert to UTC before
        // sending it to the server:
        // return moment.tz(this.open.dateTimeText,
        //   this.timeZone.utc[0]).tz('etc/utc').format();
        return self.dateTimeService.toUtc(this.open.dateTimeText, this.timeZone);
      },
      get closeTime() {
        if (!this.timeZone) {
          return null;
        }
        // return moment.tz(this.close.dateTimeText,
        //     this.timeZone.utc[0]).tz('etc/utc').format();
        // YOU ARE HERE -- TEST
        return self.dateTimeService.toUtc(this.close.dateTimeText, this.timeZone);
      },
    };

    this.model = model;
    this.accountId = model.accountId;
    this._setUpValidation();
  }

  save() {
    growlProvider.removeValidationGrowls();
    if (!this._validate()) {
      return;
    }
    this.api.command.projects.create(this.createCommand).then(result => {
      if (result.error) {
        // TODO: notify user of error.
        return;
      }

      this.modalController.ok(result);
      this.model.handleProjectAdded(result.id);
    });
  }

  cancelButtonClick() {
    growlProvider.removeValidationGrowls();
    this.modalController.cancel();
  }

  // "private" methods:
  _setUpValidation() {
    const validator = new Validator(this);
    validationRules.forEach(rule => validator.registerRule(rule));
    this.validator = validator;
  }

  _validate() {
    const validationResult = this.validator.validate();

    if (validationResult.isValid) {
      return true;
    }

    const errors = [...validationResult.errors];

    growlProvider.error('Unable to Save', errors.join('<br />'), { class: 'validation-error' });

    return false;
  }
}
