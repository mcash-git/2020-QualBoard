export class DebugJsonValueConverter {
  toView(value) {
    return JSON.stringify(value, 4);
  }
}
