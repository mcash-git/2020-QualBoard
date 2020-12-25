import { bindable, bindingMode } from 'aurelia-framework';

export class ProjectUserCard {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) user;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) selectedUsers;
}
