import animate from 'amator';
import { bindable, bindingMode } from 'aurelia-framework';

export class ProjectInstructions {
  @bindable({ defaultBindingMode: bindingMode.oneTime }) projectInstructions;
  isExpanded = false;

  activate(model) {
    this.projectInstructions = model.projectInstructions;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      // cancel existing animation, if any, animate open
      const fullHeight = this.bodyWrapperElement.scrollHeight;
      
      this.animateHeight(fullHeight);
    } else {
      this.animateHeight(0);
    }
  }
  
  animateHeight(value) {
    if (this.currentAnimation) {
      this.currentAnimation.cancel();
    }
    
    const from = { height: this.bodyWrapperElement.offsetHeight };
    const to = { height: value };
    this.currentAnimation = animate(from, to, {
      step: current => { this.bodyWrapperElement.style.height = `${current.height}px`; },
      done: () => {
        this.currentAnimation = null;
        if (this.isExpanded) {
          this.bodyWrapperElement.style.height = 'auto';
        }
      },
      duration: 200,
    });
  }
}
