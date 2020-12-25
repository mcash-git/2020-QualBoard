export class IntegerValueConverter {
  fromView(value) {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return parseInt(value, 10);
  }
}
