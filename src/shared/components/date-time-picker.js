import { bindable } from 'aurelia-framework';
import { DateTimePickerModel } from 'shared/models/date-time-picker-model';
import moment from 'moment';
import 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export class DateTimePicker {
  static inject = [Element];
  
  constructor(element) {
    this.element = element;
  }
  
  static cssClass = 'tt_qb_date-time-picker';
  
  @bindable model;
  @bindable validator;
  @bindable dateProperty;
  @bindable timeProperty;
  // TODO:  Find a better solution...
  @bindable validateOn;

  activate(model) {
    this.model = model || new DateTimePickerModel();

    if (this.dateElement &&
      this.timeElement &&
      this.dateElement._flatpickr &&
      this.timeElement._flatpickr) {
      this.attached();
    }
  }

  attached() {
    this.element.classList.add(DateTimePicker.cssClass);
    this.updateControls();
    // this is here because of timing
  }
  
  unbind() {
    if (this.dateFlatpickr) {
      this.dateFlatpickr.destroy();
    }
    if (this.timeFlatpickr) {
      this.timeFlatpickr.destroy();
    }
  }

  dateKeyup(event) {
    if (event.keyCode === 9) {
      this.dateElement._flatpickr.close();
    }

    return true;
  }

  dateChanged(newValue, oldValue) {
    if (newValue === oldValue) {
      return;
    }
    const isDate = moment(this.dateElement.value).isValid();
    if (isDate) {
      this.dateElement._flatpickr.setDate(this.dateElement.value, true);
    } else {
      this.dateElement._flatpickr.clear(true);
    }
  }

  timeKeyup() {
    if (event.keyCode === 9) {
      this.timeElement._flatpickr.close();
    }

    return true;
  }

  timeChanged(newValue, oldValue) {
    if (newValue === oldValue) {
      return;
    }
    const moments = [
      moment(this.timeElement.value, 'h:mm a'),
      moment(this.timeElement.value, 'h:mm'),
      moment(this.timeElement.value, 'h a'),
      moment(this.timeElement.value, 'ha'),
      moment(this.timeElement.value, 'h'),
    ];

    const validTimes = moments.filter(m => m.isValid());

    if (validTimes.length === 0) {
      this.timeElement._flatpickr.clear(true);
    } else {
      this.timeElement._flatpickr.setDate(validTimes[0].toString(), true);
    }

    this._isTimeUpdated = false;
    this.validator.validate(this.timeProperty);
  }

  updateDateFlatpickr() {
    if (this.dateElement._flatpickr) {
      this.dateElement._flatpickr.destroy();
      this.dateElement.value = this.model.date;
    }
    this.dateFlatpickr = this.dateElement.flatpickr({
      allowInput: true,
      onChange: (date, dateText) => {
        this.model.date = dateText;
      },
      onClose: () => {
        this.validator.validate(this.dateProperty);
      },
      dateFormat: 'n/j/Y',
    });
  }

  updateTimeFlatpickr() {
    if (this.timeElement._flatpickr) {
      this.timeElement._flatpickr.destroy();
      this.timeElement.value = this.model.time;
    }
    this.timeFlatpickr = this.timeElement.flatpickr({
      allowInput: true,
      enableTime: true,
      noCalendar: true,
      onChange: (date, dateText) => {
        this.model.time = dateText;
      },
      onClose: () => {
        this.validator.validate(this.timeProperty);
      },
      dateFormat: 'h:i K',
    });
  }

  updateControls() {
    if (!this.dateElement || !this.timeElement) {
      return;
    }
    this.updateDateFlatpickr();
    this.updateTimeFlatpickr();
  }
}
