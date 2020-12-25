import { computedFrom } from 'aurelia-framework';

const nouns = {
  2: 'Day',
  3: 'Week',
  4: 'Month',
};

const iconMap = {
  0: 'icon-check_circle',
  1: 'icon-ion-close',
  2: 'icon-Activity',
  3: 'icon-Activity',
  4: 'icon-Activity',
};

export class RepetitionModel {
  constructor({
    id = null,
    intervalIndex = 1,
    repetitionIndex = 1,
    status = 0,
    repeatUnit = 0,
  } = {}) {
    this.id = id;
    this.intervalIndex = intervalIndex;
    this.repetitionIndex = repetitionIndex;
    this.status = status;
    this.repeatUnit = repeatUnit;
  }

  @computedFrom('intervalIndex', 'index', 'repeatUnit')
  get text() {
    const intervalText = this.repeatUnit < 2 ?
      '' :
      `${nouns[this.repeatUnit]} ${this.intervalIndex} - `;
    return `${intervalText}Entry ${this.repetitionIndex}`;
  }

  @computedFrom('status')
  get icon() {
    return iconMap[this.status];
  }
}
