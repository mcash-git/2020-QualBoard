import { TaskQueue, BindingEngine, bindable, bindingMode } from 'aurelia-framework';
import { Validator, ValidationRule } from '2020-aurelia';
import moment from 'moment';
import * as validate from 'validator';
import { ParticipantFiltersModel } from './participant-filters-model';

// we will have events from the project user logic rules component that we
// can use to fire off the filters-updated event.
const ignoreFilterProperties = ['projectUserLogicRules', 'taskLogicRules', 'page'];

export class ParticipantFilters {
  static inject = [Element, BindingEngine, TaskQueue];

  constructor(element, bindingEngine, taskQueue) {
    this.element = element;
    this.bindingEngine = bindingEngine;
    this.taskQueue = taskQueue;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) filterModel;
  @bindable availableGroupTags;
  @bindable participants;
  @bindable individualActivities;
  
  // for caching filters on a given page.  This is just the base of the key.
  @bindable clientStorageKeyBase;

  // always set in constructor
  assetTypes;
  observeSubscriptions = [];
  
  bind() {
    this.projectId = this.filterModel.projectId;

    this._setUpValidation();
    this._beginObservingFilterModel();
  }

  detached() {
    this._clearObserveSubscriptions();
  }

  filterModelChanged(newValue) {
    if (!newValue) {
      return;
    }

    this._clearObserveSubscriptions();
    this._beginObservingFilterModel();
  }

  clear() {
    this.filterModel = new ParticipantFiltersModel({
      projectId: this.projectId,
    });
    this.signalUpdatedFilters();
  }

  signalUpdatedFilters() {
    if (!this._validate()) {
      return;
    }
    this.taskQueue.queueTask(() => {
      this.element.dispatchEvent(new CustomEvent('filters-updated', {
        bubbles: true,
      }));
    });
  }

  _validate() {
    const result = this.validator.validate();

    return result.isValid;
  }

  _beginObservingFilterModel() {
    Object.keys(this.filterModel).forEach(prop => {
      if (ignoreFilterProperties.indexOf(prop) !== -1) {
        return;
      }

      this.observeSubscriptions.push(Array.isArray(this.filterModel[prop]) ?
        this.bindingEngine
          .collectionObserver(this.filterModel[prop])
          .subscribe(() => this.signalUpdatedFilters()) :
        this.bindingEngine
          .propertyObserver(this.filterModel, prop)
          .subscribe(() => this.signalUpdatedFilters()));
    });
  }

  _clearObserveSubscriptions() {
    this.observeSubscriptions.forEach(s => {
      s.dispose();
    });
    this.observeSubscriptions = [];
  }

  _setUpValidation() {
    const valueFormat = 'YYYY-MM-DD';

    const validator = new Validator(this);
    validator.registerRule(new ValidationRule({
      property: 'filterModel.createdAfter',
      validate: value => moment(value, valueFormat).isValid(),
      message: 'Please specify a valid date.',
      runIf: value => value,
    }));
    validator.registerRule(new ValidationRule({
      property: 'filterModel.createdBefore',
      validate: value => moment(value, valueFormat).isValid(),
      runIf: value => value,
      message: 'Please specify a valid date.',
    }));
    validator.registerRule(new ValidationRule({
      property: 'filterModel.createdBefore',
      validate: (value, model) => validate
        .isAfter(value, model.filterModel.createdAfter) ||
      !validate.isBefore(value, model.filterModel.createdAfter),
      runIf: (value, model) => value && model.filterModel.createdAfter &&
        moment(model.filterModel.createdAfter, valueFormat).isValid(),
      message: 'Please specify a valid date range ("uploaded before" must come after "uploaded after".)',
    }));
    this.validator = validator;
  }
}
