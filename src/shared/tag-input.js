import {
  observable,
  customElement,
  bindingMode,
  bindable,
  computedFrom,
  TaskQueue,
} from 'aurelia-framework';
import throttle from 'lodash.throttle';
import Sifter from 'sifter';
import hoverIntent from 'hoverintent';
import Drop from 'tether-drop';

const staticStyle = {
  position: 'absolute',
  top: '-9999px',
  left: '-9999px',
  width: 'auto',
  padding: 0,
  whiteSpace: 'pre',
};

const keys = {
  backspace: 8,
  tab: 9,
  enter: 13,
  esc: 27,
  pageUp: 33,
  pageDown: 34,
  up: 38,
  down: 40,
  comma: 188,
};

@customElement('tag-input')
export class TagInput {
  static inject = [Element, TaskQueue];

  constructor(element, taskQueue) {
    this.element = element;
    this.taskQueue = taskQueue;
    this.displayItem = item => item;
    this.addNewTagText = obj => `Add new: [${obj.tagText.trim()}]`;
    this.selectedAutocompleteItemIndex = 0;
    this.removeTagHtml =
      '';
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) value = [];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) sourceItems = [];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) autocompleteSortField;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) autocompleteSortDirection;

  @bindable({ defaultBindingMode: bindingMode.oneWay }) disabled;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) mini;

  @bindable({ defaultBindingMode: bindingMode.oneTime }) autocompleteSearchFields = [];
  @bindable({ defaultBindingMode: bindingMode.oneTime }) displayProperty;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) removeTagHtml;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) shouldFocus;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) shouldAllowAdd;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) autocompleteMinChars = 1;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) addTagMinChars = 1;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) placeholderText = '';
  @bindable({ defaultBindingMode: bindingMode.oneTime }) tagViewModel = './default-tag-view-model';

  // function bindings:
  @bindable({ defaultBindingMode: bindingMode.oneTime }) addNewTagText;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) tryAddTag;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) tryRemoveTag;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) createTag;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) tagAdded;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) tagRemoved;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) changed;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) display;

  @observable textInput = '';
  searchResults = null;
  autocompleteSearchItems = [];

  attached() {
    this.documentMousedownDelegate = event => this.handleDocumentMousedown(event);
    this.windowResizeDelegate = throttle(this.handleResize.bind(this), 16);
    this.handleResize();

    document.addEventListener('mousedown', this.documentMousedownDelegate);
    window.addEventListener('resize', this.windowResizeDelegate);


    this.setUpInputWidthGrowth();

    this.setInputWidth();

    this.dropConfig = {
      target: this.wrapperElement,
      content: this.summaryElement,
      remove: false,
      openOn: null,
      position: 'bottom center',
      constrainToWindow: true,
      classes: 'drop-theme-filters',
    };

    this.drop = new Drop(this.dropConfig);
    hoverIntent(this.truncatedIndicatorElement, () => {
      this.drop.open();
    }, () => {
      this.drop.close();
    });
  }

  unbind() {
    window.removeEventListener('resize', this.windowResizeDelegate);
    document.removeEventListener('mousedown', this.documentMousedownDelegate);
    if (this.widthCalcElement) {
      this.widthCalcElement.remove();
    }
    this.drop.destroy();
  }

  sourceItemsChanged() {
    this.sifter = new Sifter(this.sourceItems);
  }

  displayPropertyChanged(newValue) {
    this.displayItem = !newValue ?
      item => item :
      item => {
        if (!item) {
          return '';
        }
        return item[newValue];
      };
  }

  displayChanged(newValue) {
    this.displayItem = !newValue ?
      item => item :
      item => newValue({ tagText: item });
  }

  textInputChanged(newValue) {
    if (
      newValue === null ||
      newValue === undefined ||
      newValue.trim().length < this.autocompleteMinChars
    ) {
      this.searchResults = null;
    } else if (!this.sourceItems || this.sourceItems.length === 0) {
      this.searchResults = [];
    } else {
      // sets this.searchResults
      this.searchForAutocomplete(newValue);
    }

    this.selectedAutocompleteItemIndex = this.shouldShowAddOption ? -1 : 0;
    this.setInputWidth();
  }

  addTagMinCharsChanged(newValue, oldValue) {
    if (newValue < 1) {
      this.addTagMinChars = oldValue;
    }
  }

  measureStringWidth(str) {
    if (!str) {
      return 0;
    }

    this.widthCalcElement.innerText = str;
    return this.widthCalcElement.offsetWidth;
    // TODO:  Debug why sometimes this width is off by a bit.
  }

  setUpInputWidthGrowth() {
    this.widthCalcElement = document.createElement('div');
    const styleObj = Object.assign(
      {},
      this.widthCalcElement.style,
      this.textInputElement.style,
      staticStyle,
    );

    Object.keys(styleObj).forEach(key => {
      if (isNaN(key)) { // eslint-disable-line
        this.widthCalcElement.style[key] = styleObj[key];
      }
    });

    document.body.appendChild(this.widthCalcElement);
  }

  searchForAutocomplete(search) {
    let fields = this.autocompleteSearchFields;

    if (!this.autocompleteSearchFields ||
      this.autocompleteSearchFields.length === 0) {
      this.sifter = new Sifter(this.sourceItems.map(item => ({ value: item })));
      fields = ['value'];
    }

    const result = this.sifter.search(search, { fields });
    this.searchResults = result.items.map(r => this.sourceItems[r.id])
      .filter(item => this.value.indexOf(item) === -1);
  }

  selectItem(item) {
    this.value.push(item);

    if (this.textInput === '') {
      this.textInputChanged(this.textInput, this.textInput);
    } else {
      this.textInput = '';
    }
    this.selectedAutocompleteItemIndex = -1;
    this.textInputElement.focus();

    this.handleResize();
    if (this.changed && typeof this.changed === 'function') {
      this.changed();
    }
  }

  async addNewTag() {
    // TODO:  NEXT - complex object allowed duplicates...
    if (!this.shouldAllowAdd) {
      return;
    }

    if (!this.shouldShowAddOption) {
      return;
    }

    // TODO: consider binding a tagMode somehow to differentiate between using
    // tag objects and strings...

    const tagText = this.textInput.trim();

    // TODO: test this with both sync and async functions.
    const should = this.tryAddTag &&
      typeof this.tryAddTag === 'function' ?
      (await this.tryAddTagFunction({ tagText })) :
      true;

    if (!should) {
      return;
    }

    const tag = await this._createTagWrapper(tagText);

    this.sourceItems.push(tag);
    this.selectItem(tag);

    if (this.tagAdded && typeof this.tagAdded === 'function') {
      this.tagAdded({ tag });
    }
  }
  handleRemoveTag(event) {
    this.removeTag(this.value.indexOf(event.detail.item));
  }

  async removeTag(index) {
    if (!await this.verifyCanRemoveTag(index)) {
      return;
    }
    const removed = this.value.splice(index, 1);
    this.textInputElement.focus();
    this.textInputChanged(this.textInput, this.textInput);

    if (this.tagRemoved &&
      typeof this.tagRemoved === 'function') {
      this.tagRemoved({ tag: removed });
    }

    this.handleResize();
    if (this.changed && typeof this.changed === 'function') {
      this.changed();
    }
  }

  async verifyCanRemoveTag(index) {
    if (this.disabled) {
      return false;
    }

    // if we have a try function bound from a parent view-model, call it.
    if (this.tryRemoveTag && typeof this.tryRemoveTag === 'function') {
      return this.tryRemoveTag({ tag: this.value[index] });
    }

    return true;
  }

  setInputWidth() {
    const width = this.measureStringWidth(this.textInput) + 2;

    this.textInputElement.style.width = `${width}px`;
  }

  handleWrapperClick(event) {
    if (event.target !== this.wrapperElement &&
      event.target !== this.placeholderTextElement &&
      event.target !== this.tagsDisplayElement) {
      return;
    }

    this.textInputElement.focus();
    this.textInputChanged(this.textInput, this.textInput);
  }

  eatCommandKeys(event) {
    if (event.keyCode === keys.esc || event.keyCode === keys.enter) {
      event.stopPropagation();
      event.preventDefault();
      return false;
    }
    return true;
  }

  handleResize() {
    setTimeout(() => {
      const el = this.tagsDisplayElement;
      this.isTruncated =
        el.scrollWidth > el.clientWidth || el.scrollHeight > (el.clientHeight * 2);
    }, 0);
  }

  handleKeyup(event) {
    const key = event.keyCode;
    switch (key) {
      case keys.backspace:
        if (this.textInput === '' && this.value.length > 0) {
          this.removeTag(this.value.length - 1);
          return false;
        }
        return true;
      case keys.up:
        if (this.searchResults === null) {
          this.textInputChanged(this.textInput, this.textInput);
        } else {
          this.selectedAutocompleteItemIndex =
            Math.max(this.selectedAutocompleteItemIndex - 1, -1);

          const selectedItemElement =
            this.autocompleteSearchItems[this.selectedAutocompleteItemIndex];

          const liRect = selectedItemElement.getBoundingClientRect();
          const ulRect = this.searchResultsElement.getBoundingClientRect();

          if (liRect.bottom > ulRect.bottom) {
            selectedItemElement.scrollIntoView();
          } else if (liRect.top < ulRect.top) {
            this.searchResultsElement.scrollTop -=
              ulRect.top - liRect.top;
          }
        }
        return false;
      case keys.down:
        if (this.searchResults === null) {
          this.textInputChanged(this.textInput, this.textInput);
        } else {
          this.selectedAutocompleteItemIndex =
            Math.min(
              this.selectedAutocompleteItemIndex + 1,
              this.searchResults.length - 1,
            );

          const selectedItemElement =
            this.autocompleteSearchItems[this.selectedAutocompleteItemIndex];

          const liRect = selectedItemElement.getBoundingClientRect();
          const ulRect = this.searchResultsElement.getBoundingClientRect();

          if (liRect.top < ulRect.top) {
            selectedItemElement.scrollIntoView();
          } else if (liRect.bottom > ulRect.bottom) {
            this.searchResultsElement.scrollTop +=
              liRect.bottom - ulRect.bottom;
          }
        }
        return false;
      case keys.pageUp:
        if (this.searchResults === null) {
          this.textInputChanged(this.textInput, this.textInput);
        } else {
          this.selectedAutocompleteItemIndex =
            Math.max(this.selectedAutocompleteItemIndex - 10, -1);

          const selectedItemElement =
            this.autocompleteSearchItems[this.selectedAutocompleteItemIndex];

          const liRect = selectedItemElement.getBoundingClientRect();
          const ulRect = this.searchResultsElement.getBoundingClientRect();

          if (liRect.bottom > ulRect.bottom) {
            selectedItemElement.scrollIntoView();
          } else if (liRect.top < ulRect.top) {
            this.searchResultsElement.scrollTop -=
              ulRect.top - liRect.top;
          }
        }
        return false;
      case keys.pageDown:
        if (this.searchResults === null) {
          this.textInputChanged(this.textInput, this.textInput);
        } else {
          this.selectedAutocompleteItemIndex =
            Math.min(
              this.selectedAutocompleteItemIndex + 10,
              this.searchResults.length - 1,
            );

          const selectedItemElement =
            this.autocompleteSearchItems[this.selectedAutocompleteItemIndex];

          const liRect = selectedItemElement.getBoundingClientRect();
          const ulRect = this.searchResultsElement.getBoundingClientRect();

          if (liRect.top < ulRect.top) {
            selectedItemElement.scrollIntoView();
          } else if (liRect.bottom > ulRect.bottom) {
            this.searchResultsElement.scrollTop +=
              liRect.bottom - ulRect.bottom;
          }
        }
        return false;
      case keys.enter:
        this.handleEnterPress();
        event.stopPropagation();
        event.preventDefault();
        return false;
      case keys.comma:
        this.handleCommaPress();
        return false;
      case keys.tab:
        this.handleTabPress();
        return true;
      case keys.esc:
        // what should we do for esc press?
        this.searchResults = null;
        event.stopPropagation();
        event.preventDefault();
        return false;
      default:
        return true;
    }
  }

  handleEnterPress() {
    if (!this.shouldShowAddOption &&
      !this.searchResults[this.selectedAutocompleteItemIndex]) {
      return;
    }
    if (this.shouldShowAddOption && this.selectedAutocompleteItemIndex === -1) {
      this.addNewTag();
      return;
    }

    this.selectItem(this.searchResults[this.selectedAutocompleteItemIndex]);
  }

  handleTabPress() {
    this.handleBlur();
    return true;
  }

  handleCommaPress() {
    if (this.shouldShowAddOption) {
      this.addNewTag();
    }
    return true;
  }

  handleFocus() {
    if (this.isFocused) {
      return true;
    }

    this.isFocused = true;
    this.textInputChanged(this.textInput, this.textInput);
    this.handleResize();
    return true;
  }

  handleBlur() {
    if (!this.isFocused) {
      return true;
    }

    this.isFocused = false;
    this.searchResults = null;
    this.handleResize();
    return true;
  }

  handleDocumentMousedown(event) {
    if (!this.isFocused) {
      return true;
    }

    if (event.target.closest('.tag-input-wrapper') === this.wrapperElement) {
      return true;
    }

    this.handleBlur();
    return true;
  }

  handleMouseWheel(event) {
    const ul = event.target.closest('ul');
    if (!ul.matches('.tag-input-search-results')) {
      return true;
    }

    if ((ul.scrollTop === 0 && event.deltaY < 0) ||
      (ul.scrollTop + ul.offsetHeight >= ul.scrollHeight && event.deltaY > 0)) {
      return true;
    }
    event.stopPropagation();
    return true;
  }

  @computedFrom('textInput', 'sourceItems', 'sourceItems.length')
  get addNewTagTextComputed() {
    if (this.addNewTagText) {
      return this.addNewTagText({ tagText: this.textInput });
    }

    return `${this.addNewTagText} ${this.textInput}`;
  }

  @computedFrom('textInput', 'sourceItems', 'sourceItems.length')
  get isTextExactMatch() {
    if (!this.textInput || this.sourceItems.length === 0) {
      return false;
    }
    return this.sourceItems.filter(item =>
      this.displayItem(item).toLowerCase() === this.textInput.toLowerCase())
      .length === 1;
  }

  @computedFrom('textInput')
  get shouldShowAddOption() {
    return this.shouldAllowAdd && !this.isTextExactMatch &&
      (this.textInput && this.textInput.trim().length >= this.addTagMinChars);
  }

  @computedFrom('isFocused', 'searchResults', 'textInput')
  get shouldShowAutocompleteSearchResults() {
    return this.isFocused && (this.searchResults || this.shouldShowAddOption);
  }

  @computedFrom('isFocused', 'disabled', 'value.length')
  get classes() {
    const cl = ['tag-input-wrapper'];

    if (this.disabled) {
      cl.push('disabled');
    }
    if (this.mini) {
      cl.push('mini');
    }
    if (this.isFocused) {
      cl.push('has-focus');
    }
    if (this.value && this.value.length > 0) {
      cl.push('has-tags');
    }
    return cl.join(' ');
  }

  get searchResultsWidth() {
    return `${this.wrapperElement.offsetWidth}px`;
  }

  get searchResultsPositionTop() {
    return `${this.wrapperElement.offsetHeight}px`;
  }

  async _createTagWrapper(tagText) {
    if (this.createTag && typeof this.createTag === 'function') {
      return this.createTag({ tagText });
    }

    if (this.displayProperty && typeof this.displayProperty === 'string') {
      return this.constructor._createSimpleTag(tagText, this.displayProperty);
    }

    return tagText;
  }

  static _createSimpleTag(tagText, property) {
    const tag = {};
    tag[property] = tagText;
    return tag;
  }
}

// TODO:  Support:
// aurelia-plugin
// default configuration in setup/init
// there is a bug when hitting [ENTER] when the tag matches one that's already
//   been added.
