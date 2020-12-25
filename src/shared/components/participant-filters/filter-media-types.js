import { bindable, bindingMode } from 'aurelia-framework';
import { AssetTypes } from '2020-media';

export class FilterMediaTypes {
  constructor() {
    const typeOrder = ['Image', 'Video', 'Audio', 'Document', 'Unkown'];
    
    this.availableAssetTypes = [].concat(AssetTypes).sort((a, b) => {
      let iA = typeOrder.indexOf(a.value);
      let iB = typeOrder.indexOf(b.value);
      if (iA === -1) { iA = 999; }
      if (iB === -1) { iB = 999; }
      return iA - iB;
    });
  }
  
  @bindable({ defaultBindingMode: bindingMode.oneWay }) assetTypes;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) title;
  
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  expandedSessionStorageKey;
}
