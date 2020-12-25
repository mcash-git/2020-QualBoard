import { computedFrom } from 'aurelia-framework';
import { compareBySortOrder } from 'shared/utility/compare-by-sort-order';

export class ParticipantMultipleAnswer {
  activate(model) {
    this.task = model.task;
    this.taskResponse = this.task.taskResponse;

    this.availableOptions = this.task.options.sort(compareBySortOrder);
  }

  @computedFrom('task.maximumOptionsLimit', 'task.minimumOptionsRequired')
  get instructions() {
    const max = this.task.maximumOptionsLimit;

    // always have a minimum
    const min = this.task.minimumOptionsRequired || 1;

    // TODO:  This language will need to be changed and sound better
    if (!max) { // only minimum:
      return `Select at least ${min || 1} option${min === 1 ? '' : 's'}:`;
    } else if (min === max) { // minimum and maximum are the same
      return `Select ${min} options:`;
    }

    // Otherwise, minimum and maximum are different.
    return `Select ${min} to ${max} options:`;
  }

  handleChange() {
    if (
      this.taskResponse.responseOptions.length >=
      (this.task.maximumOptionsLimit || this.task.options.length)
    ) {
      this.availableOptions.forEach(option => {
        option.disabled = !(this.taskResponse.responseOptions.find(o => o === option.optionId));
      });
    } else {
      this.availableOptions.forEach(option => {
        option.disabled = false;
      });
    }

    // TODO:  Find a better way.  This is the only way that seems to work
    // with @computedFrom...
    this.taskResponse.responseOptions = [...this.taskResponse.responseOptions];
  }

  // C# serializes Dictionary<TKey, TVal> as {"key1":value1,"key2":value2} - this
  // turns it into a usable array
  processOptions(optionDictionary) {
    return Object.keys(optionDictionary).map(item => {
      optionDictionary[item].disabled = false;
      return optionDictionary[item];
    }).sort(compareBySortOrder);
  }
}
