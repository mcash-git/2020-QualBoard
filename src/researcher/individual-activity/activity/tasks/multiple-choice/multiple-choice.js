import { compareBySortOrder } from 'shared/utility/compare-by-sort-order';

export class ParticipantMultipleChoice {
  activate(model) {
    this.task = model.task;

    // TODO:  Switch over to the new way of handling task responses.
    this.taskResponse = this.task.taskResponse;
    // this.taskResponse = model.taskResponse;

    this.availableOptions = this.task.options.sort(compareBySortOrder);
  }

  handleChange(option) {
    this.taskResponse.responseOptions = [option.optionId];
  }
}
