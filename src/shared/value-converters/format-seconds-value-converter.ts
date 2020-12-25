import { formatSeconds } from './format-seconds';

export class FormatSecondsValueConverter {
  toView(seconds) {
    return formatSeconds(seconds);
  }
}
