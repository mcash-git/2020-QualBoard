import { bindable, bindingMode } from 'aurelia-framework';

export class ActivityUserCardParticipant {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) user;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) selectedUsers;

  handleClick() {
    const index = this.selectedUsers.indexOf(this.user);
    if (index === -1) {
      this.selectedUsers.push(this.user);
    } else {
      this.selectedUsers.splice(index, 1);
    }
  }
}
