import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { Validator } from '2020-aurelia';
import { DateTimeService } from 'shared/components/date-time-service';
import { DateTimePickerModel } from 'shared/models/date-time-picker-model';
import { Api } from 'api/api';
import { DomainState } from 'shared/app-state/domain-state';
import { growlProvider } from 'shared/growl-provider';
import { enums } from '2020-qb4';
import moment from 'moment-timezone';
import getDurationInDays from 'shared/utility/get-duration-in-days';
import { isRepeatUnitRepeating } from 'shared/utility/is-repeat-unit-repeating';
import { rules as validationRules } from './individual-activity-settings-schedule-validation';

const RepeatUnits = enums.repeatUnits;

export class IndividualActivitySettingsSchedule {
  static inject = [
    Api,
    DateTimeService,
    DomainState,
  ];

  constructor(api, dateTimeService, domainState) {
    this.api = api;
    this.dateTimeService = dateTimeService;
    this.domainState = domainState;
    this.repeatUnits = RepeatUnits;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) ia;

  iaChanged(ia) {
    this._setUpValidation();
    this.ia.repeat = RepeatUnits[ia.repeatUnit || 0];
    this._activateSchedule(this.ia);
    this._setEdit();
  }

  activate(model) {
    this.ia = model.ia;
  }

  editClick() {
    this.ia.editing = 'schedule';
  }

  saveClick() {
    this._save();
  }

  cancelClick() {
    growlProvider.removeValidationGrowls();
    this._setEdit();
    this.ia.editing = undefined;
    setImmediate(() => {
      this.scheduleFormViewModel.reset();
    });
  }

  // "private" methods

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

    const errors = ['Please correct the following error(s):', ...validationResult.errors];
    growlProvider.error('Unable to Save', errors.join('<br />'), { class: 'validation-error' });

    return false;
  }

  _setEdit() {
    this.edit = JSON.parse(JSON.stringify(this.ia));
    this.edit.repeat = this.ia.repeat;
    this.edit.timeZone = this.ia.timeZone;
    this.edit.numberOfRepetitions = this.ia.numberOfRepetitions;
    this._activateSchedule(this.edit);
    this.validator.clear();
  }

  _savePreprocess() {
    const repeat = this.edit.repeat.value;
    this.edit.repeatUnit = RepeatUnits.findIndex(u => u.value === this.edit.repeat.value);

    switch (repeat) {
      case 'None':
        this.edit.repeatMinimum = null;
        this.edit.repeatMaximum = null;
        break;
      default:
        break;
    }
  }

  async _save() {
    growlProvider.removeValidationGrowls();
    if (!this._validate()) {
      return;
    }
    this._savePreprocess();
    const result = await this.api.command.individualActivities
      .setSchedule(this.edit);

    if (result.error) {
      growlProvider.error('Error', 'There was an error saving your changes.');
      return;
    }

    this._applySavedChanges();
    this.ia.editing = undefined;
  }

  _applySavedChanges() {
    this.ia.repeatMinimum = this.edit.repeatMinimum;
    this.ia.repeatMaximum = this.edit.repeatMaximum;
    this.ia.numberOfRepetitions = this.edit.numberOfRepetitions;
    this.ia.repeatUnit = this.edit.repeatUnit;
    this.ia.repeat = this.edit.repeat;
    this.ia.open = this.edit.open;
    this.ia.close = this.edit.close;
    this.ia.open.dateTime = this.edit.open.dateTimeText;
    this.ia.close.dateTime = this.computedCloseDate;
    this.ia.timeZone = this.edit.timeZone;
  }

  _activateSchedule(schedule) {
    const tz = schedule.timeZone;

    if (schedule.timeZone && typeof (schedule.timeZone) === 'string') {
      schedule.timeZone = this.dateTimeService.getTimeZoneFromIana(schedule.timeZone);
    }

    schedule.numberOfRepetitions = schedule.numberOfRepetitions ||
      Math.round(calculateRepetitions(schedule));

    let openDateTimeText;
    if (schedule.openTime) {
      openDateTimeText = this.dateTimeService.fromUtc(schedule.openTime, tz);
    } else if (schedule.open) {
      openDateTimeText = schedule.open.dateTimeText;
    }

    schedule.open = new DateTimePickerModel({
      dateTimeText: openDateTimeText,
      defaultTime: '8:00 AM',
      datePlaceholderText: 'Open Date',
      timePlaceholderText: 'Open Time',
    });

    let closeDateTimeText;
    if (this.computedCloseDate) {
      closeDateTimeText = this.computedCloseDate;
    } else if (schedule.closeTime) {
      closeDateTimeText = this.dateTimeService.fromUtc(schedule.closeTime, tz);
    } else if (schedule.close) {
      // after JSON stringify/parse, schedule.close.moment is a string - what we want.
      closeDateTimeText = schedule.close.dateTimeText || schedule.close.moment;
    }

    schedule.close = new DateTimePickerModel({
      dateTimeText: closeDateTimeText,
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
        return self.dateTimeService.toUtc(
          schedule.open.dateTimeText,
          schedule.timeZone.utc[0],
        );
      },
    });

    Object.defineProperty(schedule, 'closeTime', {
      get: () => {
        if (!schedule.timeZone) {
          return null;
          // if the repeat unit is daily/weekly/monthly we calc. the close date.
        } else if (self.edit && self.edit.repeatUnit > 1) {
          return self.computedCloseDate;
        }
        return self.dateTimeService.toUtc(
          schedule.close.dateTimeText,
          schedule.timeZone.utc[0],
        );
      },
    });
  }

  @computedFrom(
    'ia.editing',
    'ia.open.dateTimeText',
    'ia.close.dateTimeText',
    'ia.timeZone',
    'ia.repeat',
    'ia.numberOfRepetitions',
    'edit.open.dateTimeText',
    'edit.close.dateTimeText',
    'edit.timeZone',
    'edit.repeat',
    'edit.numberOfRepetitions',
  )
  get numDaysText() {
    const ia = this.isEditing ? this.edit : this.ia;

    if (!ia.open || !ia.close || !ia.timeZone) {
      return '(n/a)';
    }

    const durationInDays = getDurationInDays(ia, ia.repeat, ia.numberOfRepetitions);

    return `${durationInDays} Day${durationInDays === 1 ? '' : 's'}`;
  }

  @computedFrom('ia.repeat')
  get shouldShowRepetitions() {
    return isRepeatUnitRepeating(this.ia.repeat);
  }

  @computedFrom('ia.editing')
  get isEditing() {
    return this.ia.editing === 'schedule';
  }
}

// the .numberOfRepetitions property is not persisted on the server, so we have to calc.
// it when we load.
function calculateRepetitions(schedule) {
  const duration = moment.duration(moment(schedule.closeTime).diff(schedule.openTime));
  switch (schedule.repeatUnit) {
    case 0:
    case 1:
      return 1;
    case 2:
      return duration.asDays();
    case 3:
      return duration.asWeeks();
    case 4:
      return duration.asMonths();
    default:
      return null;
  }
}
