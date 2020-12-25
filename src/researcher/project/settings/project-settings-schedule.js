import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { Validator } from '2020-aurelia';
import { enums } from '2020-qb4';
import { DateTimeService } from 'shared/components/date-time-service';
import { DateTimePickerModel } from 'shared/models/date-time-picker-model';
import { Api } from 'api/api';
import { DomainState } from 'shared/app-state/domain-state';
import { growlProvider } from 'shared/growl-provider';
import getDurationInDays from 'shared/utility/get-duration-in-days';
import { rules as validationRules } from './project-settings-schedule-validation';

const RepeatUnits = enums.repeatUnits;

export class ProjectSettingsSchedule {
  static inject = [Api, DateTimeService, DomainState];

  constructor(api, dateTimeService, domainState) {
    this.api = api;
    this.dateTimeService = dateTimeService;
    this.domainState = domainState;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) project;

  activate(model) {
    this.project = model.project;
  }

  projectChanged() {
    this._setUpValidation();
    this._activateSchedule(this.project);
    this._setEdit();
  }

  editClick() {
    this.project.editing = 'schedule';
  }

  saveClick() {
    this._save();
  }

  cancelClick() {
    growlProvider.removeValidationGrowls();
    this._setEdit();
    this.project.editing = undefined;
  }

  // "private" methods

  _setEdit() {
    this.edit = JSON.parse(JSON.stringify(this.project));
    this.edit.timeZone = this.project.timeZone;
    this._activateSchedule(this.edit);
    this.validator.clear();
  }

  _setUpValidation() {
    const validator = new Validator(this);
    validationRules.forEach(rule => validator.registerRule(rule));
    this.validator = validator;
  }

  _save() {
    growlProvider.removeValidationGrowls();
    if (!this._validate()) {
      return;
    }
    this.api.command.projects.setSchedule(this.edit).then(result => {
      if (result.error) {
        growlProvider.error('Error', 'There was an error saving your changes');
        return;
      }

      this.project.open = this.edit.open;
      this.project.close = this.edit.close;
      this.project.open.dateTime = this.project.open.dateTimeText;
      this.project.close.dateTime = this.project.close.dateTimeText;
      this.project.timeZone = this.edit.timeZone;

      this.project.editing = undefined;
    });
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

  _activateSchedule(schedule) {
    const tz = schedule.timeZone;

    if (schedule.timeZone && typeof (schedule.timeZone) === 'string') {
      schedule.timeZone = this.dateTimeService.getTimeZoneFromIana(schedule.timeZone);
    }

    let openTimeText;
    if (schedule.openTime) {
      openTimeText = this.dateTimeService.fromUtc(schedule.openTime, tz);
    } else if (schedule.open) {
      openTimeText = schedule.open.openTimeText; //eslint-disable-line
    }

    schedule.open = new DateTimePickerModel({
      dateTimeText: openTimeText,
      defaultTime: '8:00 AM',
      datePlaceholderText: 'Open Date',
      timePlaceholderText: 'Open Time',
    });

    let closeTimeText;
    if (schedule.closeTime) {
      closeTimeText = this.dateTimeService.fromUtc(schedule.closeTime, tz);
    } else if (schedule.close) {
      closeTimeText = schedule.close.closeTimeText; //eslint-disable-line
    }

    schedule.close = new DateTimePickerModel({
      dateTimeText: closeTimeText,
      defaultTime: '11:55 PM',
      datePlaceholderText: 'Close Date',
      timePlaceholderText: 'Close Time',
    });

    const self = this;

    Object.defineProperty(schedule, 'openTime', {
      get: () => {
        if (!schedule.timeZone) {
          return null;
        }
        return self.dateTimeService.toUtc(schedule.open.dateTimeText, schedule.timeZone.utc[0]);
      },
    });

    Object.defineProperty(schedule, 'closeTime', {
      get: () => {
        if (!schedule.timeZone) {
          return null;
        }
        return self.dateTimeService.toUtc(schedule.close.dateTimeText, schedule.timeZone.utc[0]);
      },
    });
  }

  @computedFrom(
    'project.editing',
    'project.open.dateTimeText',
    'project.close.dateTimeText',
    'project.timeZone',
    'edit.open.dateTimeText',
    'edit.close.dateTimeText',
    'edit.timeZone',
  )
  get numDaysText() {
    const proj = this.isEditing ? this.edit : this.project;

    if (!proj.open || !proj.close || !proj.timeZone) {
      return '(n/a)';
    }

    const durationInDays = getDurationInDays(proj, RepeatUnits.none);
    return `${durationInDays} Day${durationInDays === 1 ? '' : 's'}`;
  }

  @computedFrom('project.editing')
  get isEditing() {
    return this.project.editing === 'schedule';
  }
}
