import { DialogController } from 'aurelia-dialog';
import { Api } from 'api/api';
import { growlProvider } from 'shared/growl-provider';
import { DateTimePickerModel } from 'shared/models/date-time-picker-model';
import { DateTimeService } from 'shared/components/date-time-service';
import { enums } from '2020-qb4';
import { Validator } from '2020-aurelia';
import { rules as validationRules } from './create-individual-activity-modal-validation';

const RepeatUnits = enums.repeatUnits;

export class CreateIndividualActivityModal {
  static inject = [DialogController, Api, DateTimeService];

  constructor(modalController, api, dateTimeService) {
    this.modalController = modalController;
    this.api = api;
    this.dateTimeService = dateTimeService;
    this.repeatUnits = RepeatUnits;
  }

  activate(model) {
    const self = this;
    this.createCommand = {
      projectId: model.projectId,
      timeZone: model.projectTimeZone,
      open: new DateTimePickerModel({
        defaultTime: '08:00:00',
        datePlaceholderText: 'Open Date',
        timePlaceholderText: 'Open Time',
      }),
      close: new DateTimePickerModel({
        defaultTime: '23:55:00',
        datePlaceholderText: 'Close Date',
        timePlaceholderText: 'Close Time',
      }),
      get openDateTime() {
        return this.timeZone ?
          self.dateTimeService.toUtc(this.open.dateTimeText, this.timeZone) :
          null;
      },
      get closeDateTime() {
        return this.timeZone ?
          self.dateTimeService.toUtc(this.close.dateTimeText, this.timeZone) :
          null;
      },
    };

    this.projectId = model.projectId;
    this._setUpValidation();
  }

  async save() {
    growlProvider.removeValidationGrowls();
    if (!this._validate()) {
      return;
    }

    const result = await this.api.command.individualActivities.create({
      ...this.createCommand,
      repeatUnit: this.createCommand.repeatUnit.int,
    });

    if (result.error) {
      // TODO: notify user of error.
      return;
    }

    this.modalController.ok(result);
  }

  cancelButtonClick() {
    growlProvider.removeValidationGrowls();
    this.modalController.cancel();
  }

  // "private" methods
  _validate() {
    const validationResult = this.validator.validate();

    if (validationResult.isValid) {
      return true;
    }

    const errors = [...validationResult.errors];
    growlProvider.error('Unable to Save', errors.join('<br />'), { class: 'validation-error' });

    return false;
  }

  _setUpValidation() {
    const validator = new Validator(this);
    validationRules.forEach(rule => validator.registerRule(rule));
    this.validator = validator;
  }
}
