import { computedFrom } from 'aurelia-framework';

export class ParticipantMultipleAnswer {
  activate({ task, response }) {
    this.task = task;
    this.response = response;
  
    this.max = this.task.maxResponseOptions || null;
    this.min = this.task.minResponseOptions || 1;
  }

  handleChange(option) {
    option.isSelected = this.response.responseOptions.indexOf(option) !== -1;
  }
  
  @computedFrom('task.maxResponseOptions', 'task.minResponseOptions')
  get instructions() {
    if (!this.max) {
      return `Select at least ${this.min || 1} option${this.min === 1 ? '' : 's'}:`;
    } else if (this.min === this.max) {
      return `Select ${this.min} options:`;
    }
    
    // Otherwise, this.minimum and this.maximum are different.
    return `Select ${this.min} to ${this.max} options:`;
  }
  
  @computedFrom('task.maxResponseOptions', 'response.responseOptions.length')
  get canSelectMore() {
    return this.max === null || this.response.responseOptions.length < this.max;
  }
}
