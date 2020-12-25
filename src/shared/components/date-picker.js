import { TaskQueue, observable, bindable, bindingMode } from 'aurelia-framework';
import moment from 'moment';
import 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const valueFormat = 'YYYY-MM-DD';
const displayFormat = 'MM/DD/YYYY';

export class DatePicker {
  static inject = [TaskQueue];

  constructor(taskQueue) {
    this.taskQueue = taskQueue;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) date;
  @bindable placeholder;
  @bindable validator;
  @bindable validationProperty;

  @observable dateText;

  bind() {
    const momDate = moment(this.date, valueFormat);

    this._ignoreChangesTemporarily();

    this.dateText = momDate.isValid() ? momDate.format(displayFormat) : null;
  }

  attached() {
    if (!this.inputElement) {
      return;
    }

    this.updateFlatpickr();
  }

  keyup(event) {
    if (event.keyCode === 9) {
      this.inputElement._flatpickr.close();
    }

    return true;
  }

  inputValueChanged() {
    if (this._shouldIgnoreChanges) {
      return;
    }

    const isDate = moment(this.inputElement.value).isValid();
    if (isDate) {
      this.inputElement._flatpickr.setDate(this.inputElement.value, true);
    } else {
      this.inputElement._flatpickr.clear(true);
    }
  }

  dateChanged() {
    if (!this.inputElement || this._shouldIgnoreChanges) {
      return;
    }

    this.updateFlatpickr();
  }

  dateTextChanged(newValue) {
    if (this._shouldIgnoreChanges) {
      return;
    }

    const momDate = moment(newValue, displayFormat);
    this.date = momDate.isValid() ? momDate.format(valueFormat) : null;
  }

  updateFlatpickr() {
    if (this.inputElement._flatpickr) {
      this.inputElement._flatpickr.destroy();
      const momDate = moment(this.date, valueFormat);
      this.inputElement.value = momDate.isValid() ?
        momDate.format(displayFormat) :
        '';
    }

    this.inputElement.flatpickr({
      allowInput: true,
      onChange: (date, dateText) => {
        const momDate = moment(dateText, displayFormat);
        this._ignoreChangesTemporarily();
        this.date = momDate.isValid() ? momDate.format(valueFormat) : null;
      },
      dateFormat: 'n/j/Y',
    });
  }

  _ignoreChangesTemporarily() {
    this._shouldIgnoreChanges = true;
    this.taskQueue.queueTask(() => { this._shouldIgnoreChanges = false; });
  }
}
