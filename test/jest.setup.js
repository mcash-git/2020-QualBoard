// any global setup needs to happen here
import 'aurelia-polyfills';
import { Options } from 'aurelia-loader-nodejs';
import { globalize } from 'aurelia-pal-nodejs';

Options.relativeToDir = 'src';
globalize();
