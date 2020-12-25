import { bindable, bindingMode } from 'aurelia-framework';
import { CurrentUser } from 'shared/current-user';
import { DateTimeService } from './date-time-service';

export class TimeZonePicker {
  static inject = [DateTimeService, CurrentUser];

  constructor(dateTimeService, user) {
    this.timezones = dateTimeService.timeZones;
    this.user = user;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) selectedTimeZone;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) validator;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) validationProperty;

  bind() {
    if (!this.selectedTimeZone && this.user.timeZone) {
      this.selectedTimeZone = this.timezones
        .find(tz => tz.utc && tz.utc
          .find(text => text.toLowerCase() ===
            this.user.timeZone.toLowerCase()));
    } else if (this.selectedTimeZone && this.selectedTimeZone.text) {
      this.selectedTimeZone = this.timezones
        .find(tz => tz.text === this.selectedTimeZone.text);
    } else if (this.selectedTimeZone) {
      const selectedLower = this.selectedTimeZone.toLowerCase();
      this.selectedTimeZone = this.timezones
        .find(tz => tz.utc && tz.utc
          .find(text => text.toLowerCase() === selectedLower));
    }
  }
}
