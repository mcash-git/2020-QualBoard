import { bindable, bindingMode } from 'aurelia-framework';
import { DateTimeService } from 'shared/components/date-time-service';

/* eslint-disable */
import moment from 'moment';
import 'moment-timezone';
/* eslint-enable */

export class Schedule {
  static inject = [DateTimeService];
  constructor(dateTimeService) {
    this.dateTimeService = dateTimeService;
  }

  @bindable({ defaultBindingMode: bindingMode.oneWay }) schedule;

  activate(model) {
    this.schedule = model.schedule;
  }

  scheduleChanged(newValue) {
    this.timeZoneFriendly =
      this.dateTimeService.getFriendlyFromIana(newValue.timeZone) || newValue.timeZone;
    this.open = this.dateTimeService.fromUtc(newValue.open, newValue.timeZone);
    this.close = this.dateTimeService.fromUtc(newValue.close, newValue.timeZone);
  }
}
