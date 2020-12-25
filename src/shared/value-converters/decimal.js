
export class DecimalValueConverter {
  toView(value, decimalPlaces = 2) {
    const number = +parseFloat(value).toFixed(decimalPlaces);

    return number.isNaN ? '-' : number;
  }
}
